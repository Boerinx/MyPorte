import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="bg-teal-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow mb-4">
        MyPorte
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Track Your Financial Goals
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-8">
        Save smarter. Spend wiser. Reach your goals
      </p>

      <SignedOut>
        <Link
          href="/sign-up"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
        >
          Get Started Now
        </Link>
      </SignedOut>
    </section>
  );
}
