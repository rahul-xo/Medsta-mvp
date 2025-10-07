import React from "react";

export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-800">Medsta</h3>
          <nav className="mt-3 space-x-4 text-sm text-slate-600">
            <a href="#" className="hover:text-blue-700">About</a>
            <a href="#" className="ml-4 hover:text-blue-700">Careers</a>
            <a href="#" className="ml-4 hover:text-blue-700">Blog</a>
            <a href="#" className="ml-4 hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="ml-4 hover:text-blue-700">Terms</a>
          </nav>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-block bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            App Coming Soon
          </div>
        </div>

        <div className="flex-1 text-right text-sm text-slate-600">
          <div className="mb-2">
            <a href="#" className="hover:text-blue-700 ml-4">WhatsApp</a>
            <a href="#" className="hover:text-blue-700 ml-4">Instagram</a>
          </div>
          <div className="text-xs text-slate-400">© 2025 Medsta. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
