#!/usr/bin/env node

/**
 * Migration script to replace react-helmet-async with Next.js Head
 * Run this from the app/ directory: node migrate-helmet.js
 */

const fs = require("fs");
const path = require("path");

// Files to migrate (found from grep search)
const filesToMigrate = [
  "src/pages/d/[dataId].js",
  "src/pages/collections/runs.js",
  "src/pages/apis.js",
  "src/pages/collections/tasks.js",
  "src/pages/measures/data.js",
  "src/pages/contribute.js",
  "src/pages/benchmarks/runs.js",
  "src/pages/benchmarks/tasks.js",
  "src/pages/measures/procedures.js",
  "src/pages/measures/evaluation.js",
  "src/pages/f/[flowId].js",
  "src/pages/f/index.js",
  "src/pages/t/[taskId].js",
  "src/pages/t/index.js",
  "src/pages/r/[runId].js",
  "src/pages/meet.js",
  "src/pages/auth/sign-in.js",
  "src/pages/auth/reset-password.js",
  "src/pages/r/index.js",
  "src/pages/auth/500.js",
  "src/pages/terms.js",
  "src/pages/about.js",
  "src/pages/d/index.js",
  "src/components/data/CroissantMetaData.js",
];

function migrateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Replace the import
  if (content.includes('import { Helmet } from "react-helmet-async";')) {
    content = content.replace(
      'import { Helmet } from "react-helmet-async";',
      'import Head from "next/head";',
    );
    modified = true;
  }

  // Replace Helmet usage patterns
  const helmetPatterns = [
    // Simple title
    /<Helmet title={([^}]+)} \/>/g,
    // With children
    /<Helmet title={([^}]+)}>\s*<\/Helmet>/g,
    // Just opening tag
    /<Helmet([^>]*)>/g,
    // Closing tag
    /<\/Helmet>/g,
  ];

  // Replace <Helmet title="..." /> with <Head><title>...</title></Head>
  content = content.replace(/<Helmet title={([^}]+)} \/>/g, (match, title) => {
    modified = true;
    return `<Head>\n        <title>{${title}} - OpenML</title>\n      </Head>`;
  });

  // Replace <Helmet title="...">content</Helmet> patterns
  content = content.replace(
    /<Helmet title={([^}]+)}>([\s\S]*?)<\/Helmet>/g,
    (match, title, children) => {
      modified = true;
      return `<Head>\n        <title>{${title}} - OpenML</title>${children}</Head>`;
    },
  );

  // Replace standalone <Helmet> tags
  content = content.replace(/<Helmet([^>]*)>/g, "<Head>");
  content = content.replace(/<\/Helmet>/g, "</Head>");

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️ No changes needed: ${filePath}`);
    return false;
  }
}

function main() {
  console.log("🚀 Starting react-helmet-async to Next.js Head migration...\n");

  let totalMigrated = 0;

  for (const file of filesToMigrate) {
    if (migrateFile(file)) {
      totalMigrated++;
    }
  }

  console.log(`\n✨ Migration complete! ${totalMigrated} files migrated.`);

  if (totalMigrated > 0) {
    console.log("\n📝 Next steps:");
    console.log("1. Test your application to ensure everything works");
    console.log(
      "2. Remove react-helmet-async from package.json if not used elsewhere",
    );
    console.log("3. Remove HelmetProvider from _app.js if present");
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile };
