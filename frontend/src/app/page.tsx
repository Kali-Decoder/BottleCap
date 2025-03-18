"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <div className="bg-black h-[100vh] w-[100vw] flex flex-col">
        <Navbar />
        <section className="container relative mx-auto flex justify-center flex-col items-center h-full">
          <Image
            src="/images/architecture.png"
            alt="archi"
            width={1200}
            height={1200}
          />
          <button className="bg-white text-black rounded-md p-2 py-3 absolute top-[19rem] left-[15rem]">
            Deposit BTC
          </button>
        </section>
      </div>
    </>
  );
}
