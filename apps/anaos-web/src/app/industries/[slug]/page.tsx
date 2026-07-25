import { getPageData } from "@/lib/page-data";
import { DynamicPageTemplate } from "@/components/landing/DynamicPageTemplate";
import { notFound } from "next/navigation";

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = getPageData(resolvedParams.slug);

  if (!data || data.type !== "industry") {
    notFound();
  }

  return <DynamicPageTemplate data={data} />;
}
