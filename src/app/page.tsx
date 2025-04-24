"use client";
import Image from "next/image";
import { useState } from "react";
import { initializeLucid, lockUtxo, redeemUtxo, unlockUtxo } from "../../examples/always_succeeds.ts";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [txHash, setTxHash] = useState("");

  const connectWallet = async () => {
    try {
      await initializeLucid(); // Gọi hàm initializeLucid để kết nối ví và khởi tạo Lucid
      setWalletConnected(true);
      alert("Wallet connected and Lucid initialized successfully!");
    } catch (error) {
      console.error("Failed to connect wallet and initialize Lucid:", error);
      alert("Failed to connect wallet and initialize Lucid.");
    }
  };

  const handleLock = async () => {
    try {
      const hash = await lockUtxo(BigInt(10000000)); // Lock 1 ADA
      setTxHash(hash);
      alert(`UTxO locked successfully! TxHash: ${hash}`);
    } catch (error) {
      console.error("Failed to lock UTxO:", error);
      alert("Failed to lock UTxO.");
    }
  };

  const handleUnlock = async () => {
    try {
      console.log("Unlock button clicked"); // Log khi nhấn nút
      const hash = await unlockUtxo(10000000n);
      setTxHash(hash);
      alert(`UTxO unlocked successfully! TxHash: ${hash}`);
    } catch (error) {
      console.error("Failed to unlock UTxO:", error);
      alert("Failed to unlock UTxO.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex flex-col gap-4 items-center">
          <button
            className="rounded-full border border-solid border-transparent transition-colors bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
            onClick={connectWallet}
          >
            Kết nối ví
          </button>
          <button
            className="rounded-full border border-solid border-transparent transition-colors bg-green-500 text-white px-4 py-2 hover:bg-green-600"
            onClick={handleLock}
            disabled={!walletConnected}
          >
            Lock
          </button>
          <button
            className="rounded-full border border-solid border-transparent transition-colors bg-red-500 text-white px-4 py-2 hover:bg-red-600"
            onClick={handleUnlock}
            disabled={!walletConnected}
          >
            Unlock
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}