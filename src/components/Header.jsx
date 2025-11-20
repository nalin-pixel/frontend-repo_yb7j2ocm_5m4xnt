import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">H</div>
          <div>
            <h1 className="text-white font-semibold leading-tight">Hotel POS</h1>
            <p className="text-xs text-blue-200/70">Fast, simple, offline-ready</p>
          </div>
        </div>
        <div className="text-blue-200 text-sm">
          <span className="hidden sm:inline">Multi-user • Inventory • Receipts • Stats</span>
        </div>
      </div>
    </header>
  );
}
