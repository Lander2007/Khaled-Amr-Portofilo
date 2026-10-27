"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <>
      {/* Wipe Curtain */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-50 pointer-events-none bg-[#381932] transition-transform duration-400 ease-in-out ${
          isTransitioning
            ? "translate-y-0 opacity-95"
            : "-translate-y-full opacity-0"
        }`}
      />
      {children}
    </>
  );
}
