import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Ecomah
        </span>
        <span className="text-xs text-muted-foreground">
          ওয়েবসাইট অর্ডার ফর্ম
        </span>
      </div>
    </header>
  );
}
