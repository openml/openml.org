"use client";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Integration {
  name: string;
  icon: string;
  height: string;
  margin?: string;
}

interface IntegrationsProps {
  content: {
    label: string;
    title: string;
    description: string;
    cta: React.ReactNode;
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
        <div className="mx-auto mb-3 inline-block rounded-sm bg-slate-800 px-6 py-2 text-[.8rem] font-medium text-white uppercase">
          {content.label}
        </div>

        <h1 className="title-font gradient-text my-2 text-[clamp(1.9rem,3.2vw,51px)] leading-normal font-semibold tracking-tight">
          {content.title}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg leading-[1.8] text-slate-300">
          {content.description}
        </p>

        <div className="my-6 flex flex-wrap justify-center gap-4">
          {integrations.map((integration) => (
            <Tooltip key={integration.name}>
              <TooltipTrigger asChild>
                <div className="mx-2.5 inline-block rounded-lg bg-slate-100 p-3 shadow-sm transition-shadow hover:shadow-md">
                  <img
                    alt={integration.name}
                    src={integration.icon}
                    className="h-auto align-middle"
                    style={{
                      height: integration.height,
                      margin: integration.margin,
                    }}
                  />
                </div>
              </TooltipTrigger>

              <TooltipContent
                className="py-0.6 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 text-white"
                arrowClassName="fill-slate-100"
              >
                <p className="text-lg font-medium">{integration.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div>
          <Button
            asChild
            variant="default"
            size="lg"
            className="mb-12 px-12 transition hover:scale-105 hover:opacity-90"
          >
            <Link href="/documentation/welcome" target="_blank">
              {content.cta}
            </Link>
          </Button>
        </div>
      </section>
    </TooltipProvider>
  );
}
