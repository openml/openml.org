"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface Integration {
  name: string;
  icon: string;
  height: string;
  margin?: string;
}

interface IntegrationsProps {
  content: {
    overline: string;
    heading: string;
    subtitle: string;
    button: React.ReactNode;
  };
}

export default function Integrations({ content }: IntegrationsProps) {
  const integrations: Integration[] = [
    {
      name: "Python API",
      icon: "/svg/python.svg",
      height: "34px",
      margin: "3px 0",
    },
    { name: "Julia API", icon: "/svg/julia.svg", height: "40px" },
    { name: "R API", icon: "/svg/r-lang.svg", height: "40px" },
    {
      name: "Java API",
      icon: "/svg/java.svg",
      height: "36px",
      margin: "2px 0",
    },
    { name: "C# API", icon: "/svg/c-sharp.svg", height: "40px" },
    { name: "Scikit-Learn", icon: "/svg/sklearn.svg", height: "40px" },
    { name: "PyTorch", icon: "/svg/pytorch.svg", height: "40px" },
    { name: "TensorFlow", icon: "/svg/tensorflow.svg", height: "40px" },
    { name: "Jupyter", icon: "/svg/jupyter.svg", height: "40px" },
    { name: "Pandas", icon: "/svg/pandas.svg", height: "40px" },
  ];

  return (
    <TooltipProvider>
      <section className="py-3 text-center">
        <div className="mx-auto inline-block text-xl font-medium text-slate-800 opacity-90 dark:text-slate-200">
          {content.overline}
        </div>
        <h1 className="title-font gradient-text mb-2 text-[clamp(3rem,4.6vw,72px)] leading-[1.2] font-bold tracking-tight">
          {content.heading}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg leading-[1.8] text-slate-700 dark:text-slate-300">
          {content.subtitle}
        </p>

        <div className="my-6 flex flex-wrap justify-center gap-4 pt-3">
          {integrations.map((integration) => (
            <Tooltip key={integration.name}>
              <TooltipTrigger asChild>
                <div className="light:border-slate-800 mx-3.5 inline-block rounded-lg border bg-slate-100 p-3 shadow-sm transition-shadow hover:shadow-md">
                  <Image
                    alt={integration.name}
                    src={integration.icon}
                    width={40}
                    height={40}
                    className="h-auto align-middle"
                    style={{
                      height: integration.height,
                      margin: integration.margin,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={-3}
                className="border-2 border-slate-300 bg-slate-100 px-2 py-0.5 text-base font-medium text-slate-700 dark:border-0 dark:bg-linear-to-br dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:text-white"
                arrowClassName="fill-slate-400 dark:border-0 dark:fill-white border-0"
              >
                <p>{integration.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div>
          <Button
            asChild
            variant="openml"
            size="lg"
            className="mb-10 border-2 bg-slate-100 from-indigo-500 via-purple-500 to-pink-500 px-12 text-slate-700 transition hover:scale-105 hover:opacity-90 dark:bg-linear-to-br dark:text-white"
          >
            <Link
              href="/documentation/welcome"
              target="_blank"
              className="light:border-slate-300"
            >
              {content.button}
            </Link>
          </Button>
        </div>
      </section>
    </TooltipProvider>
  );
}
