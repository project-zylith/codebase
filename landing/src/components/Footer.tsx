import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-cosmic-main-teal/30">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cosmic-main-teal/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-cosmic-main-teal rounded-lg flex items-center justify-center cosmic-glow">
                <span className="text-xl font-bold text-cosmic-off-white">
                  I
                </span>
              </div>
              <span className="text-xl font-bold text-gradient">
                Ibrahim Hudson
              </span>
            </Link>
            <p className="text-cosmic-light-green leading-relaxed max-w-md">
              Full-stack developer passionate about creating intelligent,
              beautiful applications that solve real problems and enhance human
              creativity.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-cosmic-off-white font-semibold mb-4">
              Navigation
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                Portfolio
              </Link>
              <Link
                to="/renaissance"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                Renaissance App
              </Link>
              <Link
                to="/updates"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                Updates
              </Link>
            </div>
          </div>

          {/* Connect section */}
          <div>
            <h3 className="text-cosmic-off-white font-semibold mb-4">
              Connect
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:ibrahim.hudson.swe@gmail.com"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/ibrahim-hudson-swe"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Ibra-Hud"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-cosmic-main-teal/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cosmic-light-green text-sm mb-4 md:mb-0">
              © {currentYear} Ibrahim Hudson. All rights reserved.
            </p>

            <div className="flex items-center space-x-6">
              <span className="text-cosmic-light-green text-sm">
                Built with
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-cosmic-electric-cyan">⚛️</span>
                <span className="text-cosmic-light-green text-sm">React</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-cosmic-electric-cyan">🎨</span>
                <span className="text-cosmic-light-green text-sm">
                  Tailwind
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-cosmic-electric-cyan">✨</span>
                <span className="text-cosmic-light-green text-sm">
                  Framer Motion
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
