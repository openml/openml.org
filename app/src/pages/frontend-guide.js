import React from "react";
import Head from "next/head";
import {
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  Code as CodeIcon,
  PlayArrow,
  Build,
  DataObject,
} from "@mui/icons-material";
import DashboardLayout from "../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

function FrontendGuidePage() {
  return (
    <>
      <Head>
        <title>Frontend Development Guide - OpenML</title>
        <meta
          name="description"
          content="Modern frontend development guide for OpenML platform using TypeScript, TailwindCSS, and shadcn/ui"
        />
      </Head>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Frontend Development Guide
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            This page is a placeholder for updated frontend development
            documentation. It will be replaced with comprehensive information
            about the modern development stack including TypeScript,
            TailwindCSS, and shadcn/ui components.
          </Typography>
        </Alert>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <CodeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Modern Tech Stack
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                label="TypeScript 5.9.3"
                color="primary"
                variant="outlined"
              />
              <Chip label="Next.js 16.0.1" color="primary" variant="outlined" />
              <Chip label="React 19.2" color="primary" variant="outlined" />
              <Chip
                label="TailwindCSS 3.4.18"
                color="secondary"
                variant="outlined"
              />
              <Chip label="shadcn/ui" color="secondary" variant="outlined" />
              <Chip
                label="Material-UI 7.0.2"
                color="default"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              The OpenML frontend is being modernized with TypeScript and
              TailwindCSS while maintaining compatibility with existing
              Material-UI components.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <PlayArrow sx={{ mr: 1, verticalAlign: "middle" }} />
              Quick Start
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Information about setting up the development environment, running
              the frontend, and contributing to the modern stack will be added
              here.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Build sx={{ mr: 1, verticalAlign: "middle" }} />
              Development Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Best practices, coding standards, and component migration
              strategies will be documented here.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <DataObject sx={{ mr: 1, verticalAlign: "middle" }} />
              Component Examples
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Examples of converting Material-UI components to TypeScript with
              TailwindCSS styling and shadcn/ui alternatives will be provided
              here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

FrontendGuidePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FrontendGuidePage;
