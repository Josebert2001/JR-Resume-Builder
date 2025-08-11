
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8 px-6 md:px-20 text-gray-700 dark:text-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold">ResumAI</span>
          </div>
          <p className="text-sm font-medium max-w-sm">
            Land interviews faster with AI-powered resumes.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-2 text-sm">
          <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">Contact Us</h4>
          <p>
            Email:{" "}
            <a
              href="mailto:robertsunday333@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              robertsunday333@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href="tel:+2347083057837"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              +234 70 830 57837
            </a>
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-2 text-gray-600 dark:text-gray-300">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} <strong>ResumAI</strong> – Powered by{" "}
        <strong>JR Digital Insights</strong>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
