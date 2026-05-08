"use client"

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7F2] font-sans selection:bg-[#4A6741] selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-[#E5E0D4] blur-3xl opacity-50" />
        <div className="absolute top-[60%] -left-[5%] w-[300px] h-[300px] rounded-full bg-[#D97757] blur-3xl opacity-20" />
      </div>

      <main className="relative flex flex-col flex-1 items-center justify-center px-6 py-20 text-center">
        <div className="mb-12 transition-transform duration-700 hover:scale-105">
          <Image
            className="drop-shadow-sm"
            src="/logo.png"
            alt="ReadCycle logo"
            width={350}
            height={80}
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#2C3A27]">
            Tus historias merecen <br />
            <span className="text-[#D97757]">un nuevo capítulo</span>
          </h1>

          <p className="max-w-lg text-lg md:text-xl leading-relaxed text-[#4A6741]/80">
            Dales una segunda vida a los libros que ya leíste y encontrá tu próxima aventura a un precio increíble.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Link 
              href="/dashboard"
              className="flex h-14 items-center justify-center px-10 rounded-full bg-[#2C3A27] text-[#F9F7F2] font-bold text-lg transition-all hover:bg-[#4A6741] hover:shadow-lg hover:-translate-y-1 active:scale-95"
            >
              Empezar a vender
            </Link>
          </div>
        </div>

        <div className="mt-24 flex items-center gap-2 text-[#2C3A27]/40 font-medium tracking-widest uppercase text-xs">
          <div className="w-8 h-[1px] bg-[#2C3A27]/20" />
          Libros usados, historias nuevas
          <div className="w-8 h-[1px] bg-[#2C3A27]/20" />
        </div>
      </main>
    </div>
  );
}
