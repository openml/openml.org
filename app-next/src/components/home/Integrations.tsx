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
  translations: {
    overline: string;
    heading: string;
    subtitle: string;
    button: React.ReactNode;
  };
}

export default function Integrations({ translations }: IntegrationsProps) {
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
          {translations.overline}
        </div>

        <h1 className="title-font gradient-text my-2 text-[clamp(2.6rem,4.2vw,68px)] leading-[clamp(3rem,4.6vw,72px)] font-bold tracking-tight">
          {translations.heading}
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-center text-[clamp(12px,16px,14px)] leading-[1.8] text-slate-300">
          {translations.subtitle}
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
              {/* <TooltipContent
                className={cn(
                  "gradient-bg text-md -mt-2 border-none px-4 py-0.5 text-white",
                )}
                arrowClassName="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
              > */}
              <TooltipContent
                className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
                arrowClassName="fill-slate-100 bg-slate-100"
              >
                <p>{integration.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div>
          <Button
            asChild
            variant="default"
            size="lg"
            className="mb-6 px-12 transition hover:scale-105 hover:opacity-90"
          >
            <Link href="/documentation/welcome" target="_blank">
              {translations.button}
              {/* <ArrowRightIcon className="ml-2 h-5 w-5 bg-slate-100 text-red-600" /> */}
            </Link>
          </Button>
        </div>
      </section>
      {/* Global styles */}
      <style jsx>{`
        .hero-container {
          --hero-primary: #6366f1;
          --hero-secondary: #8b5cf6;
          --hero-accent: #ec4899;
          font-family: "Inter", sans-serif;
        }
        .title-font {
          font-family: "Space Grotesk", sans-serif;
        }
        .gradient-text {
          background: linear-gradient(
            90deg,
            var(--hero-primary),
            var(--hero-secondary),
            var(--hero-accent)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .gradient-bg {
          background: linear-gradient(
            135deg,
            var(--hero-primary),
            var(--hero-secondary),
            var(--hero-accent)
          );
        }
        .card-gradient {
          background: linear-gradient(145deg, #1e293b, #0f172a);
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2);
        }
        .glow-effect {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
        .hero-image {
          mask-image: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            black 60%,
            transparent 100%
          );
        }
        .animated-underline {
          position: relative;
        }
        .animated-underline::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.3s ease;
        }
        .animated-underline:hover::after {
          width: 100%;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </TooltipProvider>
  );
}
