import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";

export type PlatformMetaConfig = {
  appId: string;
  appSecret: string;
  configId: string;
  source: "database" | "env" | "none";
};

export async function getPlatformMetaConfig(): Promise<PlatformMetaConfig> {
  try {
    const row = await prisma.platformMetaSettings.findUnique({
      where: { id: "default" },
    });

    if (row?.metaAppId && row.metaAppSecretEnc && row.metaFbLoginConfigId) {
      return {
        appId: row.metaAppId,
        appSecret: decrypt(row.metaAppSecretEnc),
        configId: row.metaFbLoginConfigId,
        source: "database",
      };
    }
  } catch (e) {
    console.warn("platform meta settings read:", e);
  }

  const appId =
    process.env.NEXT_PUBLIC_META_APP_ID || process.env.META_APP_ID || "";
  const appSecret = process.env.META_APP_SECRET || "";
  const configId =
    process.env.NEXT_PUBLIC_META_FB_LOGIN_CONFIG_ID ||
    process.env.META_FB_LOGIN_CONFIG_ID ||
    "";

  if (appId && appSecret && configId) {
    return { appId, appSecret, configId, source: "env" };
  }

  return { appId: "", appSecret: "", configId: "", source: "none" };
}

export async function savePlatformMetaConfig(input: {
  appId: string;
  appSecret: string;
  configId: string;
}) {
  const encrypted = encrypt(input.appSecret);

  await prisma.platformMetaSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      metaAppId: input.appId.trim(),
      metaAppSecretEnc: encrypted,
      metaFbLoginConfigId: input.configId.trim(),
    },
    update: {
      metaAppId: input.appId.trim(),
      metaAppSecretEnc: encrypted,
      metaFbLoginConfigId: input.configId.trim(),
    },
  });
}
