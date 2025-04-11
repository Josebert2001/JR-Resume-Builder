
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8 px-6 md:px-20 text-gray-700 dark:text-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col space-y-2">
          <img src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" alt="JR Logo" className="h-10 w-auto" />
          <p className="text-sm font-medium max-w-sm">
            Empowering your career with smart, professional AI-generated resumes.
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
        © {new Date().getFullYear()} <strong>JR Resume Builder</strong> – Powered by{" "}
        <strong>JR Digital Insights</strong>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
