import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="text-6xl font-display font-bold text-primary/20 mb-4">404</p>
        <h1 className="text-3xl font-display font-semibold text-ink mb-2">Page not found</h1>
        <p className="text-charcoal mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/"><Button>Back to home</Button></Link>
      </div>
    </div>
  );
}
