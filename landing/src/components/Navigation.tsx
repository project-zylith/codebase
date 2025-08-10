import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Portfolio" },
    { path: "/renaissance", label: "Renaissance" },
    { path: "/updates", label: "Updates" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative z-50 bg-cosmic-deep-black/80 backdrop-blur-lg border-b border-cosmic-main-teal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-cosmic-main-teal rounded-lg flex items-center justify-center cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300">
              <span className="text-xl font-bold text-cosmic-off-white">I</span>
            </div>
            <span className="text-xl font-bold text-gradient">
              Ibrahim Hudson
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-cosmic-main-teal text-cosmic-off-white cosmic-glow"
                    : "text-cosmic-light-green hover:text-cosmic-off-white hover:bg-cosmic-card-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Contact Button */}
            <motion.a
              href="#contact"
              className="bg-cosmic-vibrant-blue hover:bg-cosmic-emerald px-6 py-2 rounded-lg font-semibold text-cosmic-off-white transition-all duration-300 cosmic-glow-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-cosmic-light-green hover:text-cosmic-off-white hover:bg-cosmic-card-dark transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-cosmic-main-teal/30"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-cosmic-main-teal text-cosmic-off-white"
                    : "text-cosmic-light-green hover:text-cosmic-off-white hover:bg-cosmic-card-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 bg-cosmic-vibrant-blue hover:bg-cosmic-emerald px-4 py-3 rounded-lg font-semibold text-cosmic-off-white text-center transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
