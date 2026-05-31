import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()}{" "}
      <Link href="https://ecomah.com/" className="font-bold">
        Ecomah — সর্বস্বত্ব সংরক্ষিত{" "}
      </Link>
    </footer>
  );
}
