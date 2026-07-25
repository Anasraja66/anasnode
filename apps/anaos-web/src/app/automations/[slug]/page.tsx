import { getPageData } from "@/lib/page-data";
import { DynamicPageTemplate } from "@/components/landing/DynamicPageTemplate";
import { notFound } from "next/navigation";

export default function AutomationPage({ params }: { params: { slug: string } }) {
  const data = getPageData(params.slug);

  if (!data || data.type !== "automation") {
    notFound();
  }

  return <DynamicPageTemplate data={data} />;
}
