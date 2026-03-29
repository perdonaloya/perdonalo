import Link from "next/link";
import { ReactNode } from "react";

interface NavbarProps {
  maxWidth?: "max-w-2xl" | "max-w-3xl" | "max-w-5xl";
  children?: ReactNode;
}

export function Navbar({ maxWidth = "max-w-5xl", children }: NavbarProps) {
  return (
    <nav className="border-b border-border px-6 py-4">
      <div className={`mx-auto flex ${maxWidth} items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="perdónalo.cl" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">perdónalo.cl</span>
        </Link>
        {children && <div className="flex gap-3">{children}</div>}
      </div>
    </nav>
  );
}
