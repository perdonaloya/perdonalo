"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

interface NavbarProps {
  maxWidth?: "max-w-2xl" | "max-w-3xl" | "max-w-5xl";
  children?: ReactNode;
}

export function Navbar({ maxWidth = "max-w-5xl", children }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al cambiar de página
  useEffect(() => { setOpen(false); }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-primary border-b border-primary shadow-md"
            : "bg-white border-b border-border"
        }`}
      >
        <div className={`mx-auto flex ${maxWidth} items-center justify-between`}>
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img
              src={scrolled ? "/logoinvertido.png" : "/logo.png"}
              alt="perdonaloya.cl"
              className="h-8 w-8"
            />
            <span className={`text-xl font-bold transition-colors duration-300 ${scrolled ? "text-white" : "text-primary"}`}>
              perdonaloya.cl
            </span>
          </Link>

          {children && (
            <>
              {/* Desktop */}
              <div data-scrolled={scrolled} className="hidden sm:flex gap-3 [&[data-scrolled=true]_[data-variant=ghost]]:text-white [&[data-scrolled=true]_[data-variant=ghost]]:hover:bg-white/20 [&[data-scrolled=true]_[data-variant=default]]:bg-white [&[data-scrolled=true]_[data-variant=default]]:text-primary">
                {children}
              </div>

              {/* Mobile: botón hamburguesa */}
              <button
                className="sm:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setOpen((v) => !v)}
                aria-label="Menú"
              >
                <span className={`block h-0.5 w-6 transition-all duration-300 ${scrolled ? "bg-white" : "bg-gray-700"} ${open ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-6 transition-all duration-300 ${scrolled ? "bg-white" : "bg-gray-700"} ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-6 transition-all duration-300 ${scrolled ? "bg-white" : "bg-gray-700"} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile: menú desplegable */}
      {children && open && (
        <div
          className="sm:hidden fixed top-[65px] left-0 right-0 z-40 bg-white border-b border-border shadow-lg px-6 py-4 flex flex-col gap-2"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </>
  );
}
