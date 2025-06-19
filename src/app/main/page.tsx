import Image from "next/image";
import Link from "next/link";

export default function MainPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-cyan-900 overflow-hidden">
      {/* Animated SVG Waves for Water Theme */}
      <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-40">
          <path
            fill="#38bdf8"
            fillOpacity="0.18"
            d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="z-10 flex flex-col items-center w-full px-4">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image
            src="/taxnavo-logo.png"
            alt="TaxNavo Logo"
            width={110}
            height={110}
            className="drop-shadow-2xl animate-bounce bg-white/70 rounded-full p-2 border-4 border-blue-200 dark:border-cyan-900"
          />
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-blue-700 dark:text-cyan-200 drop-shadow-2xl text-center mb-2 font-poppins">
            Welcome to{" "}
            <span className="text-cyan-500 dark:text-cyan-300">TaxNavo</span>
          </h1>
          <p className="mb-4 text-xl md:text-2xl text-blue-800/80 dark:text-cyan-100/80 text-center max-w-2xl drop-shadow font-poppins">
            Navigate your taxes with ease. Select a tax year to get started.
            <br />
            <span className="italic text-cyan-700 dark:text-cyan-300">
              Your journey to a smooth tax season begins here.
            </span>
          </p>
        </div>
        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
          <Link
            href="/main/2022"
            className="group bg-white/90 dark:bg-blue-950/90 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-cyan-900 p-10 flex flex-col items-center hover:scale-105 hover:shadow-3xl transition-all duration-200 hover:z-10 relative overflow-hidden"
          >
            <span className="text-3xl font-bold text-blue-600 dark:text-cyan-300 mb-2 font-poppins">
              2022 Tax Year
            </span>
            <span className="text-blue-500 dark:text-cyan-200 text-lg">
              Start or review your 2022 return
            </span>
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:opacity-40 transition">
              <Image src="/globe.svg" alt="globe" width={80} height={80} />
            </div>
          </Link>
          <Link
            href="/main/2023"
            className="group bg-white/90 dark:bg-blue-950/90 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-cyan-900 p-10 flex flex-col items-center hover:scale-105 hover:shadow-3xl transition-all duration-200 hover:z-10 relative overflow-hidden"
          >
            <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-200 mb-2 font-poppins">
              2023 Tax Year
            </span>
            <span className="text-blue-500 dark:text-cyan-200 text-lg">
              Get started on your 2023 taxes
            </span>
            <div className="absolute -left-8 -top-8 opacity-20 group-hover:opacity-40 transition">
              <Image src="/window.svg" alt="window" width={80} height={80} />
            </div>
          </Link>
          <Link
            href="/main/2024"
            className="group bg-white/90 dark:bg-blue-950/90 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-cyan-900 p-10 flex flex-col items-center hover:scale-105 hover:shadow-3xl transition-all duration-200 hover:z-10 relative overflow-hidden"
          >
            <span className="text-3xl font-bold text-blue-500 dark:text-cyan-300 mb-2 font-poppins">
              2024 Tax Year
            </span>
            <span className="text-blue-500 dark:text-cyan-200 text-lg">
              Prepare for your 2024 return
            </span>
            <div className="absolute -right-8 -top-8 opacity-20 group-hover:opacity-40 transition">
              <Image src="/file.svg" alt="file" width={80} height={80} />
            </div>
          </Link>
          <Link
            href="/main/2025"
            className="group bg-white/90 dark:bg-blue-950/90 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-cyan-900 p-10 flex flex-col items-center hover:scale-105 hover:shadow-3xl transition-all duration-200 hover:z-10 relative overflow-hidden"
          >
            <span className="text-3xl font-bold text-cyan-700 dark:text-cyan-100 mb-2 font-poppins">
              2025 Tax Year
            </span>
            <span className="text-blue-500 dark:text-cyan-200 text-lg">
              Plan ahead for next year
            </span>
            <div className="absolute -left-8 -bottom-8 opacity-20 group-hover:opacity-40 transition">
              <Image src="/vercel.svg" alt="vercel" width={80} height={80} />
            </div>
          </Link>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 text-blue-700/70 dark:text-cyan-200/70 text-base w-full">
          <span className="animate-pulse font-poppins">
            💧 Dive in and make tax season a breeze!
          </span>
          <span className="text-xs text-blue-400 dark:text-cyan-400 font-mono">
            Powered by Next.js & Tailwind CSS
          </span>
        </div>
      </div>
    </section>
  );
}
