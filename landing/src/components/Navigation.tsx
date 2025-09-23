import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Code, Mail } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Portfolio" },
    // { path: "/resume", label: "Resume" },
    { path: "/renai", label: "REN|AI" },
    // { path: "/updates", label: "Updates" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative z-50 bg-dark-bg-primary border-b border-dark-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-dark-accent-blue rounded-md flex items-center justify-center group-hover:bg-dark-accent-purple transition-colors duration-200">
              <User className="w-4 h-4 text-dark-text-primary" />
            </div>
            <span className="text-lg font-medium text-dark-text-primary minimal-heading">
              Ibrahim Hudson
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-dark-bg-secondary text-dark-text-primary"
                    : "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Contact Button */}
            <motion.a
              href="#contact"
              className="dark-button px-4 py-2 text-sm flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-hover transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-dark-border-light"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-dark-bg-secondary text-dark-text-primary"
                    : "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 dark-button px-4 py-3 text-sm text-center flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
