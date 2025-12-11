"use client";
import React from "react";
import Image from "next/image";

const HeroHomeExtra: React.FC = () => {
  return (
    <div className="gradient w-full bg-slate-950">
      <section className="gradient max-w-8xl mx-auto px-4 pt-[5%] pb-[6%] md:px-8">
        <div className="grid grid-cols-1 items-center lg:mx-6 lg:grid-cols-2 lg:gap-16 xl:mx-8 xl:gap-10 2xl:mx-12 2xl:gap-16">
          {/* Left Column - Text */}
          <div className="gradient text-center lg:text-left">
            <div className="mb-3 inline-block rounded-full bg-slate-800 px-4 py-1 text-sm font-medium">
              <span className="gradient-text">Version 3.0 is here</span>
            </div>

            <h1 className="title-font gradient-text mb-4 text-[clamp(3rem,4.6vw,72px)] leading-[clamp(3.4rem,5vw,76px)] font-bold tracking-tight">
              <span className="block text-[2.2rem] text-white opacity-90">
                The Global Lab
              </span>
              for Machine Learning Research
            </h1>
            <p className="lg:ml-0lg:text-lg/8 mx-auto mb-6 max-w-2xl text-center text-slate-300 md:text-lg/7 lg:mr-auto lg:text-left">
              Machine learning research should be easily accessible, reusable,
              and reproducible. OpenML is a collaborative environment for
              sharing, organizing, and building upon datasets, algorithms, and
              experiments.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <button className="gradient-bg glow-effect text-bold transform rounded-xl px-8 py-4 text-white transition hover:scale-105 hover:opacity-90">
                Start Tracking and Sharing!
              </button>

              {/* <button className="flex items-center space-x-2 rounded rounded-xl border border-2 border-white bg-transparent px-8 py-4 text-white transition hover:scale-105 hover:border-white hover:opacity-90"> */}
              <button className="text-bold mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-slate-800 p-6 px-8 py-4 text-white shadow-lg outline -outline-offset-1 outline-white/10 transition hover:scale-105 hover:opacity-90">
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

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <div className="flex -space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/women/12.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-slate-800"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-slate-800"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-slate-800"
                />
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 font-medium text-slate-300">
                  4.9/5 (2k+ reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Image with exact aspect ratio */}
          {/* Right Column - Image */}
          <div className="relative">
            {/* Image with fixed aspect ratio */}
            <div
              className="relative w-full"
              style={{ aspectRatio: "664 / 424" }}
            >
              <div className="floating absolute inset-0 overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl" />

                <Image
                  src="/hero_light_hero-img.png"
                  alt="Light mode"
                  fill
                  priority
                  className="object-cover dark:hidden"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <Image
                  src="/hero_dark_hero-img.png"
                  alt="Dark mode"
                  fill
                  priority
                  className="hidden object-cover dark:block"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Badge now positioned from the bottom of the IMAGE container */}
              <div className="floating absolute -right-16 -bottom-[20px] translate-x-1/4 translate-y-1/2 md:right-8">
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-2xl">
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
                      <p className="text-xs font-bold text-slate-400">
                        machine learning should be set free
                      </p>
                      <p className="text-lg font-bold text-white">+9999%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroHomeExtra;
