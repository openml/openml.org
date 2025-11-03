import React from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Bar } from "react-chartjs-2";

import AuthGuard from "../../components/guards/AuthGuard";
import DashboardLayout from "../../layouts/Dashboard";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  faBriefcase,
  faDollarSign,
  faExternalLink,
  faHome,
  faMapPin,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faXTwitter,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Link = ({ href, children, className }) => (
  <NextLink
    href={href}
    className={`text-blue-600 hover:text-blue-800 no-underline ${className}`}
  >
    {children}
  </NextLink>
);

function Details() {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Details
        </h3>

        <div className="text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage
              src="/static/img/avatars/avatar-1.jpg"
              alt="Sky Blue"
            />
            <AvatarFallback>SB</AvatarFallback>
          </Avatar>

          <div className="mb-4">
            <div className="font-medium text-gray-900">Sky Blue</div>
            <div className="text-gray-600">Lead Scientist</div>
          </div>

          <div className="space-x-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Follow
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Skills() {
  return (
    <Card className="mb-6">
      <CardContent className="py-6 px-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-3">
          Skills
        </h3>

        <div className="text-center">
          <div className="flex flex-wrap gap-[0.4rem] justify-center">
            <Badge
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              HTML
            </Badge>
            <Badge variant="outline">JavaScript</Badge>
            <Badge variant="outline">Sass</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">Redux</Badge>
            <Badge variant="outline">Next.js</Badge>
            <Badge variant="outline">Material UI</Badge>
            <Badge variant="outline">UI</Badge>
            <Badge variant="outline">UX</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function About() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faHome} className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm text-gray-600">
            Lives in{" "}
            <a
              href="https://www.openml.org/"
              className="text-blue-600 hover:text-blue-800"
            >
              San Fransisco, SA
            </a>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faBriefcase} className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm text-gray-600">
            Works at{" "}
            <a
              href="https://www.openml.org/"
              className="text-blue-600 hover:text-blue-800"
            >
              Material UI
            </a>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faMapPin} className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm text-gray-600">
            Lives in{" "}
            <a
              href="https://www.openml.org/"
              className="text-blue-600 hover:text-blue-800"
            >
              Boston
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Elsewhere() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Elsewhere</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faExternalLink} className="w-3.5 h-3.5" />
          </div>
          <a
            href="https://www.openml.org/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            skyblue.io
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faTwitter} className="w-3.5 h-3.5" />
          </div>
          <a
            href="https://www.openml.org/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Twitter
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faFacebook} className="w-3.5 h-3.5" />
          </div>
          <a
            href="https://www.openml.org/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Facebook
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5 text-gray-500">
            <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
          </div>
          <a
            href="https://www.openml.org/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow p-6 mb-6 pt-4">
        <div className="relative">
          <h2 className="text-3xl font-normal text-gray-900 mb-1">$ 2.405</h2>
          <p className="text-sm text-gray-600 mt-3 mb-0">Total Earnings</p>

          <div className="absolute right-4 top-8">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="w-8 h-8 text-blue-600"
            />
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow p-6 mb-6 pt-4">
        <div className="relative">
          <h2 className="text-3xl font-normal text-gray-900 mb-1">30</h2>
          <p className="text-sm text-gray-600 mt-3 mb-0">Orders Today</p>

          <div className="absolute right-4 top-8">
            <FontAwesomeIcon
              icon={faShoppingBag}
              className="w-8 h-8 text-blue-600"
            />
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: "30%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Revenue() {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow p-6 mb-6 pt-4">
        <div className="relative">
          <h2 className="text-3xl font-normal text-gray-900 mb-1">$ 1.224</h2>
          <p className="text-sm text-gray-600 mt-3 mb-0">Total Revenue</p>

          <div className="absolute right-4 top-8">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="w-8 h-8 text-blue-600"
            />
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tech
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                AppStack
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  HTML
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Single License
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                76
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Mira
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  React
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Single License
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                38
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Milo
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  HTML
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Single License
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                43
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Robust UI Kit
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Angular
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Single License
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                27
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Spark
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  React
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Single License
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                12
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesRevenue() {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
        hoverBackgroundColor: "#3B82F6",
        hoverBorderColor: "#3B82F6",
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
      {
        label: "Revenue",
        backgroundColor: "#E5E7EB",
        borderColor: "#E5E7EB",
        hoverBackgroundColor: "#E5E7EB",
        hoverBorderColor: "#E5E7EB",
        data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: false,
      },

      x: {
        stacked: false,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Sales / Revenue
      </h3>

      <div className="h-70 relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

function Profile() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Head>
        <title>{t("profile")} - OpenML</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("profile")}
        </h1>

        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            {t("dashboard")}
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-gray-700">
            {t("pages")}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{t("profile")}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-6">
          <div className="lg:col-span-1 xl:col-span-3 space-y-6">
            <Details />
            <Skills />
            <About />
            <Elsewhere />
          </div>

          <div className="lg:col-span-3 xl:col-span-9 space-y-6">
            <SalesRevenue />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Earnings />
              <Orders />
              <Revenue />
            </div>

            <Products />
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  );
};

export default Profile;
