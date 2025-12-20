"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../../../components/ui/button";

interface NavbarHeaderProps {
  className?: string;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
}

export default function HeaderNavbar({
  className,
  scrollToView,
}: NavbarHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-default ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm shadow-card"
          : "bg-transparent"
      } ${className}`}>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          <Link
            href='/'
            className='flex items-center gap-2 group'>
            <span className='font-fredoka text-3xl font-semibold'>
              InviteKit
            </span>
          </Link>

          <div className='flex gap-6 justify-center items-center'>
            <Button
              variant='link'
              onClick={() => scrollToView("view1")}>
              Home
            </Button>

            <Button
              variant='link'
              onClick={() => scrollToView("view2")}>
              Problem
            </Button>

            <Button
              variant='link'
              onClick={() => scrollToView("view3")}>
              Solution
            </Button>

            <Button
              variant='link'
              onClick={() => scrollToView("view4")}>
              Price
            </Button>

            <Button
              variant='link'
              onClick={() => scrollToView("view5")}>
              FAQ
            </Button>
          </div>

          <div className='flex gap-2'>
            <Link
              href={"/sign-in"}
              className={buttonVariants({ size: "sm" })}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
