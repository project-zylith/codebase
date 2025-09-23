import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Linkedin,
  Github,
  React,
  Palette,
  Zap,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-dark-border-light bg-dark-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-dark-accent-blue rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-dark-text-primary" />
                </div>
                <span className="text-lg font-medium text-dark-text-primary minimal-heading">
                  Ibrahim Hudson
                </span>
              </Link>
              <p className="text-dark-text-secondary leading-relaxed max-w-md minimal-text">
                Full-stack developer passionate about creating intelligent,
                beautiful applications that solve real problems and enhance
                human creativity.
              </p>
            </div>

            {/* Navigation links */}
            <div>
              <h3 className="text-dark-text-primary font-medium mb-4 minimal-heading">
                Navigation
              </h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  Portfolio
                </Link>
                <Link
                  to="/resume"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  Resume
                </Link>
                <Link
                  to="/renai"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  REN|AI App
                </Link>
                <Link
                  to="/updates"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  Updates
                </Link>
              </div>
            </div>

            {/* Connect section */}
            <div>
              <h3 className="text-dark-text-primary font-medium mb-4 minimal-heading">
                Connect
              </h3>
              <div className="space-y-2">
                <a
                  href="mailto:ibrahim.hudson.swe@gmail.com"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/ibrahim-hudson-swe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Ibra-Hud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-dark-text-secondary hover:text-dark-text-primary transition-colors minimal-text"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-dark-border-light pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-dark-text-secondary text-sm mb-4 md:mb-0 minimal-text">
                © {currentYear} Ibrahim Hudson. All rights reserved.
              </p>

              <div className="flex items-center space-x-6">
                <Link
                  to="/legal"
                  className="text-dark-text-secondary hover:text-dark-text-primary transition-colors text-sm underline decoration-dark-border-medium hover:decoration-dark-border-dark minimal-text"
                >
                  Legal
                </Link>
                <span className="text-dark-text-secondary text-sm minimal-text">
                  Built with
                </span>
                <div className="flex items-center space-x-2">
                  <React className="w-4 h-4 text-dark-accent-blue" />
                  <span className="text-dark-text-secondary text-sm minimal-text">
                    React
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-dark-accent-blue" />
                  <span className="text-dark-text-secondary text-sm minimal-text">
                    Tailwind
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-dark-accent-blue" />
                  <span className="text-dark-text-secondary text-sm minimal-text">
                    Framer Motion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
