import { properties } from "@/data";
import PropertyDetailsClient from "@/components/property/PropertyDetailsClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();
  return <PropertyDetailsClient property={property} />;
}
