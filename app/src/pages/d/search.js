/**
 * DEPRECATED: This route is kept for backward compatibility
 * Please use /datasets instead
 *
 * This file redirects /d/search to /datasets
 */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../layouts/Dashboard";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  renderCell,
  valueGetter,
  copyCell,
  renderDescription,
  renderDate,
  renderTags,
  renderChips,
} from "../../components/search/ResultTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import dataConfig from "../../search_configs/dataConfig";
import {
  faCreativeCommonsBy,
  faCreativeCommonsPd,
  faCreativeCommonsZero,
} from "@fortawesome/free-brands-svg-icons";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * getStaticProps - Required for i18n but redirects immediately
 */
export async function getStaticProps(context) {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/**
 * DataSearchRedirect - Redirects users to the new /datasets route
 *
 * Why redirect instead of just updating the route?
 * - Old links and bookmarks still work
 * - Search engines get told about the new URL
 * - Users see a brief message explaining the redirect
 *
 * How it works:
 * 1. Component mounts
 * 2. useEffect runs and initiates redirect
 * 3. Query parameters are preserved (e.g., ?status=active)
 */
function DataSearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Preserve query parameters when redirecting
    // Example: /d/search?status=active → /datasets?status=active
    const query = router.query;

    // Use replace instead of push to not add to browser history
    // This means users can't go "back" to the old URL
    router.replace({
      pathname: "/datasets",
      query: query, // Keep all query parameters
    });
  }, [router]);

  // Show a loading message while redirecting
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Redirecting to /datasets...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        This URL has been moved for better SEO
      </Typography>
    </Box>
  );
}

/**
 * getLayout - Still use DashboardLayout for consistent navigation
 */
DataSearchRedirect.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

DataSearchRedirect.displayName = "DataSearchRedirect";

export default DataSearchRedirect;
