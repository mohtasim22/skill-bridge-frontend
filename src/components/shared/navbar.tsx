"use client";

import Link from "next/link";
import { Menu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { getUser, UserLogOut } from "@/services/auth";
import ThemeToggle from "./ThemeToggle";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Course Slots", href: "/course-slots" },
    { name: "Tutors", href: "/tutors" },
    { name: "About Us", href: "/about-us" },
  ];

  useEffect(() => {
    const getCurrentUser = async () => {
      const userdata = await getUser();
      setUser(userdata);
    };
    getCurrentUser();
  }, []);

  const handleLogOut = async () => {
    await UserLogOut();
    setUser(null);
    router.push("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="h-5 w-5" />
          SkillBridge
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" onClick={handleLogOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">

                {/* Mobile Logo */}
                <div className="flex items-center gap-2 font-bold text-lg pb-6 border-b">
                  <BookOpen className="h-5 w-5" />
                  SkillBridge
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                        pathname === link.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button className="w-full" onClick={handleLogOut}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full">Register</Button>
                      </Link>
                    </>
                  )}
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}