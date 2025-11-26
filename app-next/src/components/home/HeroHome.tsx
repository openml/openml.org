"use client";
import React from "react";
import Image from "next/image";
import Integrations from "./Integrations";
import { CornerRightUp, MoveUpRight } from "lucide-react";

export const HeroHome: React.FC = () => {
  return (
    <div className="hero-container w-full bg-slate-950">
      {/* <section className="hero-container mx-auto w-fit bg-[url(/img/06.jpeg)] bg-cover bg-center px-4 pt-[5%] pb-[6%] md:px-8"> */}
      <section className="hero-container mx-auto w-fit px-4 pt-[5%] pb-[6%] md:px-8">
        <div className="grid max-w-7xl grid-cols-1 items-center gap-8 lg:mx-6 lg:grid-cols-2 lg:gap-10 2xl:mx-16">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left">
            <div className="mb-3 inline-block rounded-sm bg-slate-800 px-4 py-1 text-xs font-medium">
              <span className="gradient-text">
                Version 3.0: Built for Reproducible Science
              </span>
            </div>

            <h1 className="title-font gradient-text my-4 text-[clamp(3rem,4.6vw,72px)] leading-[clamp(3.4rem,5vw,76px)] font-bold tracking-tight">
              <span className="block text-xl tracking-normal text-white opacity-90">
                The Global Lab
              </span>
              for Machine Learning Research
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-center text-[clamp(12px,16px,14px)] leading-[1.8] text-slate-300 lg:mr-auto lg:ml-0 lg:text-left">
              Machine learning thrives on <b>transparency</b>. OpenML is the
              open, collaborative environment where scientists{" "}
              <b>share FAIR data</b>, <b>organize experiments</b>, and{" "}
              <b>build upon</b> state-of-the-art algorithms.
            </p>

            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start">
              <button className="gradient-bg glow-effect text-bold text-md inline-flex transform gap-2 rounded-lg px-4 py-2 text-white transition hover:scale-105 hover:opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Start Tracking and Sharing!</span>
              </button>
              <button className="text-bold flex items-center justify-start space-x-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-lg outline -outline-offset-1 outline-white/10 transition hover:scale-105 hover:opacity-90">
                <span>Read the Manifesto</span>
                <MoveUpRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Image with exact aspect ratio */}
          <div className="relative">
            <div
              className="relative w-full"
              style={{ aspectRatio: "600 / 330" }}
            >
              <div className="floating absolute inset-0 overflow-hidden rounded-2xl">
                <div className="" />

                <Image
                  // src="/img/313b01fb-02f1-4ffe-90f7-2d4f229e3e6b.jpeg"
                  src="/img/14.jpeg"
                  alt="Light mode"
                  fill
                  priority
                  className="object-cover dark:hidden"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <Image
                  src="/img/14.jpeg"
                  alt="Dark mode"
                  fill
                  priority
                  className="hidden object-cover dark:block"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Badge now positioned from the bottom of the IMAGE container */}
              <div className="floating absolute -bottom-[10px] translate-x-1/5 translate-y-1/2 md:right-8">
                <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="gradient-bg flex h-12 w-12 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="gradient-text text-sm font-bold tracking-wide">
                        Trusted worldwide to benchmark algorithms objectively.
                      </p>
                      <p className="text-[0.9rem] font-bold text-white">
                        +99.99%{" "}
                        <span className="text-[0.65rem] tracking-wider uppercase opacity-85">
                          Reproducibility{" "}
                        </span>
                        500k+{" "}
                        <span className="text-[0.65rem] tracking-wider uppercase opacity-85">
                          Datasets{" "}
                        </span>
                        10M+{" "}
                        <span className="text-[0.65rem] tracking-wider uppercase opacity-85">
                          Runs+
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-bold mt-2 block flex max-w-sm items-center space-x-2 rounded-lg bg-slate-800 p-2 px-4 text-sm text-white shadow-lg outline -outline-offset-1 outline-white/10 transition hover:scale-105 hover:opacity-90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Join the Community!</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-8">
        <Integrations
          translations={{
            overline: "The Ecosystem",
            heading: "Frictionless Integration",
            subtitle:
              "Seamlessly import data and export experiments from your native scientific environment.",
            button: (
              <>
                View API Documentation{" "}
                <CornerRightUp className="inline-block h-4 w-4" />
              </>
            ),
          }}
        />
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
    </div>
  );
};
