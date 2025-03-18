"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
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
          <button  onClick={() => setIsOpen(true)} className="bg-white text-black rounded-md p-2 py-3 text-sm absolute top-[19rem] left-[15rem]">
            Transfer BTC
          </button>
        </section>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black text-white p-10 border rounded-lg shadow-lg w-96  relative">
            <h2 className="text-md font-bold mb-4">Transfer BTC</h2>
            <input
              type="text"
              placeholder="Receiver Address..."
              className=" p-2 px-4 w-full mb-4 rounded-md bg-black text-white"
            />
            <input
              type="number"
              placeholder="Amount in BTC..."
              className=" p-2 px-4 w-full mb-4 rounded-md bg-black text-white"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
