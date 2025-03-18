import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const Navbar = () => {
  return (
    <>
      <header className="mb-2 px-4 shadow">
        <div className="relative mx-auto flex max-w-screen-lg flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
          <a className="flex items-center text-2xl text-white" to="/">
            HyperLend
          </a>

          <nav
            aria-label="Header Navigation"
            className="peer-checked:block hidden pl-2 py-6 sm:block sm:py-0"
          >
            <ul className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8">
              <li className="">
                <ConnectButton />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
