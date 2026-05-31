import React from "react";

export default function Footer() {
  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Ecomah — সর্বস্বত্ব সংরক্ষিত
    </footer>
  );
}
