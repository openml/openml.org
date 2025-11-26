import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";

/**
 * Downloads Section - Server Component
 * From user's diagram: downloads (website, code, share/organize)
 */
export function DownloadsSection() {
  return (
    <SectionContainer id="downloads">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">downloads</h2>
        <p className="text-muted-foreground text-lg">
          Get data in multiple formats and share your work
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {/* Website Download */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>website</CardTitle>
            <CardDescription className="mt-4">
              Download datasets directly from the web interface in various
              formats
            </CardDescription>
            <Link href="/datasets" className="mt-4 block">
              <Button variant="outline" className="w-full">
                Browse & Download
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Code Download */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>code</CardTitle>
            <CardDescription className="mt-4">
              Use our Python, R, or Java APIs to programmatically download data
            </CardDescription>
            <a
              href="https://docs.openml.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block"
            >
              <Button variant="outline" className="w-full">
                View API Docs
              </Button>
            </a>
          </CardHeader>
        </Card>

        {/* Share/Organize */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>share/organize</CardTitle>
            <CardDescription className="mt-4">
              Create collections and share your datasets with the community
            </CardDescription>
            <Link href="/collections" className="mt-4 block">
              <Button variant="outline" className="w-full">
                View Collections
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}
