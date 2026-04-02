import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f7f3ed] dark:bg-[#0e0b08] border-t border-stone-200/60 dark:border-stone-800/40 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#2d6a4f] to-[#1a4a37] rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">ResumAI</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs">
            Land interviews faster with AI-powered resumes.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Contact</p>
          <a href="mailto:robertsunday333@gmail.com" className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            robertsunday333@gmail.com
          </a>
          <a href="tel:+2347083057837" className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            +234 70 830 57837
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} ResumAI · JR Digital Insights
        </p>
        <div className="flex gap-5 text-xs text-zinc-400">
          <Link to="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
