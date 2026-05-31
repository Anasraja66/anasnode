import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV is standard for GCM

// Get key from environment, padded/sliced to exactly 32 bytes for AES-256
const getEncryptionKey = (): Buffer => {
  const rawKey = process.env.ENCRYPTION_KEY || "anaos_secret_encryption_key_32_bytes";
  const formattedKey = rawKey.slice(0, 32).padEnd(32, "a");
  return Buffer.from(formattedKey, "utf8");
};

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");
    
    return JSON.stringify({
      iv: iv.toString("hex"),
      authTag: authTag,
      encrypted: encrypted,
    });
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt credentials");
  }
}

export function decrypt(encryptedJson: string): string {
  try {
    const { iv, authTag, encrypted } = JSON.parse(encryptedJson);
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, "hex")
    );
    
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt credentials");
  }
}
