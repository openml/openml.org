import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Dataset Search Page - SEO Optimized
 * 
 * Route: /datasets
 * 
 * This page displays searchable datasets from OpenML using Elasticsearch.
 * Based on /app/src/pages/datasets.js but adapted for App Router.
 */

export const metadata: Metadata = {
  title: 'OpenML Datasets - Search Machine Learning Datasets',
  description: 'Search and explore thousands of machine learning datasets on OpenML. Filter by size, features, format, and more. Free and open source datasets for your ML projects.',
  keywords: ['machine learning', 'datasets', 'ML', 'data science', 'open source', 'openml'],
  openGraph: {
    title: 'OpenML Datasets',
    description: 'Search machine learning datasets on OpenML',
    type: 'website',
  },
};

/**
 * Datasets Search Page - Server Component
 * 
 * TODO: Implement full search functionality
 * - Add SearchContainer client component
 * - Connect to Elasticsearch via OpenMLSearchConnector
 * - Add filters, sorting, pagination
 */
export default function DatasetsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Datasets</h1>
        <p className="text-lg text-muted-foreground">
          Browse and search thousands of machine learning datasets
        </p>
      </div>

      {/* TODO: Implement SearchContainer */}
      <Card className="mb-8 border-yellow-500/50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-yellow-500/10">
              🔨 In Progress
            </Badge>
          </div>
          <CardTitle>Search Functionality Being Built</CardTitle>
          <CardDescription className="text-base space-y-2">
            <p className="mt-4">
              This page will include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>✅ Direct Elasticsearch integration (OpenMLSearchConnector)</li>
              <li>✅ SEO-friendly URLs with query parameters</li>
              <li>⏳ Full-text search across all datasets</li>
              <li>⏳ Filter by tags, status, license, instances, features</li>
              <li>⏳ Sort by relevance, runs, likes, downloads, date</li>
              <li>⏳ Multiple view modes (list, grid, table)</li>
              <li>⏳ Pagination with URL state</li>
            </ul>
            <p className="mt-4">
              For now, you can view individual datasets by ID:
            </p>
            <Link
              href="/datasets/1"
              className="text-primary hover:underline font-medium"
            >
              Example: View Dataset #1 →
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/datasets/1">
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all h-full">
            <CardHeader>
              <CardTitle>Example Dataset #1</CardTitle>
              <CardDescription>
                Click to view full dataset details with metadata, statistics, and download options.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/datasets/2">
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all h-full">
            <CardHeader>
              <CardTitle>Example Dataset #2</CardTitle>
              <CardDescription>
                Each dataset page will show description, features, instances, quality metrics, and more.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/datasets/3">
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all h-full">
            <CardHeader>
              <CardTitle>Example Dataset #3</CardTitle>
              <CardDescription>
                Links to related tasks, runs, and visualizations will be included.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
