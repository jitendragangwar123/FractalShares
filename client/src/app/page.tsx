"use client";
import Image from "next/image";
import Header from "~/Header";
import Footer from "~/Footer";
import Link from "next/link";
import GithubIcon from "./svg/GithubIcon";
import UpRightArrowIcon from "./svg/UpRightArrowIcon";
import Features from "~/Features/Features";

export default function Home() {
  return (
    <main className="">
      <Header />
      <div className="flex min-h-screen flex-col font-serif items-center justify-center py-14 mt-14 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-16 mb-5 text-center lg:text-left">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
              Welcome to
            </h1>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 dark:text-blue-400 animate-bounce transition duration-700 ease-in-out transform hover:scale-105">
              Fractal Shares
            </h2>
            <p className="text-lg md:text-2xl lg:text-2xl text-gray-600 dark:text-gray-400 animate-fadeInDelay transition duration-700 ease-in-out transform hover:scale-105">
              A simple way for Tokenization of the Real World Assets
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/jitendragangwar123/FractalShares"
                legacyBehavior
              >
                <a className="flex justify-center items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md font-medium border-2 border-blue-600 shadow-md hover:bg-blue-600 hover:shadow-lg active:bg-blue-800 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-700 ease-in-out">
                  <span>Welcome to FTS </span>
                  <span>
                    <GithubIcon />
                  </span>
                </a>
              </Link>
              <Link href="/marketplace" legacyBehavior>
                <a className="flex justify-center items-center gap-2 px-4 py-2 text-sm bg-white text-black rounded-md font-medium border-2 border-blue-600 shadow-md hover:bg-blue-600 hover:shadow-lg active:bg-white active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-700 ease-in-out">
                  <span>Start Exploring</span>
                  <span>
                    <UpRightArrowIcon />
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex w-full lg:w-1/3 justify-center lg:justify-end">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition duration-700 ease-in-out transform hover:scale-105"
              src="/diamanteHomeImage.png"
              alt="Home Image"
              width={600}
              height={150}
              priority
            />
          </div>
        </div>

        <div className="mb-25 grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center lg:text-left lg:max-w-5xl">
          <a
            href="/marketplace"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">
              Marketplace <UpRightArrowIcon />
            </h2>
            <p className="text-sm-2 opacity-75">
              By leveraging the power of blockchain technology, our platform
              enables the fractional ownership of properties, making real estate
              investment more accessible and liquid than ever before.{" "}
            </p>
          </a>
          <a
            href="/portfolio"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">
              Portfolio <UpRightArrowIcon />
            </h2>
            <p className="text-sm-2 opacity-75">
              Investors can effortlessly manage and track their real estate
              investments. Simply tap the portfolio icon on the top bar to
              quickly access the current value of your holdings.{" "}
            </p>
          </a>
          <a
            href="/purchase-assets"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">
              Investor <UpRightArrowIcon />
            </h2>
            <p className="text-sm-2 opacity-75">
              Investors can easily buy, sell, and trade property tokens,
              enjoying unparalleled transparency, robust security, and enhanced
              efficiency throughout the entire process.{" "}
            </p>
          </a>

          <a
            href="/portfolio"
            className="group rounded-lg border border-transparent px-3 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className=" flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">
              Yield Farming <UpRightArrowIcon />
            </h2>
            <p className="text-sm-2 opacity-75">
              Our real-estate tokenization platform introduces an innovative
              yield farming strategy designed to maximize earnings for
              investors, offering a lucrative opportunity for them to grow their
              wealth.{" "}
            </p>
          </a>
        </div>
      </div>
      <Features />
      <Footer />
    </main>
  );
}
