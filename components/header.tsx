import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenBox } from "lucide-react";
import { Button } from "./ui/button";

const Header = async () => {
  await checkUser();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl flex justify-between items-center px-6 py-3 bg-white/30 rounded-xl">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/Logo_MyPorte.png"
              alt="MyPorte Logo"
              width={110}
              height={60}
            />
          </Link>
        </div>
        <nav className="flex items-center gap-8 text-gray-800 font-semibold">
          <SignedOut>
            <a href="#why" className="hover:text-teal-500">
              Why MyPorte?
            </a>
            <a href="#feedback" className="hover:text-teal-500">
              Feedback
            </a>
            <a href="#contact" className="hover:text-teal-500">
              Contact
            </a>
            <Link
              href="/sign-in"
              className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full shadow-md transition-all"
            >
              Login
            </Link>
          </SignedOut>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link
                href={"/dashboard"}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link
                href={"/transaction/create"}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Button>
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
