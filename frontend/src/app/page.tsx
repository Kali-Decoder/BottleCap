"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCoreOpen, setIsCoreOpen] = useState(false);
  const [selectedOptions1, setSelectedOptions1] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);

  const handleSendOnCore = async ()=>{
    console.log(selectedOptions1,selectedOptions2);
  }
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
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#FE910F] text-black rounded-md p-2 py-3 text-sm absolute top-[19rem] left-[15rem]"
          >
            Transfer BTC
          </button>

          <button
            onClick={() => setIsCoreOpen(true)}
            className="bg-[#FE910F] text-black rounded-md p-2 py-3 text-sm absolute top-[12.8rem] right-[12rem]"
          >
            Payout on Core
          </button>

          <button
            onClick={() => setIsCoreOpen(true)}
            className="bg-[#FE910F] text-black rounded-md p-2 py-3 text-sm absolute top-[26.8rem] right-[30rem]"
          >
            Run Resolver
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

      {isCoreOpen && (
        <div className="fixed inset-0 text-xs flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg w-[30%]">
            <h2 className="text-lg font-semibold mb-4">
              Select Payout Options
            </h2>

            {/* Input for Array 1 */}
            <label className="block mb-2 mt-8">Enter Addresses</label>
            <input
              type="text"
              onChange={(e) =>
                setSelectedOptions1(
                  e.target.value.split(",").map((val) => val.trim())
                )
              }
              className="w-full p-2 border rounded-md mb-4 bg-black text-white"
              placeholder="e.g. 0x1, 0x2, 0x3"
            />

            {/* Input for Array 2 */}
            <label className="block mb-2">Enter Amounts</label>
            <input
              type="text"
              onChange={(e) =>
                setSelectedOptions2(
                  e.target.value.split(",").map((val) => val.trim())
                )
              }
              className="w-full p-2 border rounded-md mb-4 bg-black text-white"
              placeholder="e.g. 1, 2, 3"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsCoreOpen(false)}
              >
                Cancel
              </button>
              <button onClick={handleSendOnCore} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
