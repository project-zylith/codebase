import { motion } from "framer-motion";
import { useState } from "react";
import renaissanceLogo from "../assets/icon.png";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";

export const RENAIHero = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-main-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-vibrant-pink/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Transform Notes</span>
            <br />
            <span className="text-cosmic-off-white">Into Reality</span>
          </h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-cosmic-light-purple mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Meet{" "}
            <span className="text-cosmic-vibrant-pink font-semibold">
              REN|AI
            </span>
            , your personal AI assistant that helps you turn notes into goals
            and goals into products through intelligent organization and
            insights.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>✨</span>
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <img
                src={renaissanceLogo}
                alt="REN|AI"
                className="w-5 h-5 object-contain"
              />
              <span>Galaxy Organization</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>📝</span>
              <span>Rich Text Editor</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>✅</span>
              <span>Smart Task Management</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="#download"
              className="bg-cosmic-vibrant-pink hover:bg-cosmic-neon-purple px-8 py-4 rounded-xl font-semibold text-lg text-cosmic-off-white transition-all duration-300 cosmic-glow-hover flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📱</span>
              <span>Download Now</span>
            </motion.a>

            <motion.a
              href="#features"
              className="border-2 border-cosmic-main-purple hover:bg-cosmic-main-purple px-8 py-4 rounded-xl font-semibold text-lg text-cosmic-light-purple hover:text-cosmic-off-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Privacy Policy Link */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="inline-flex items-center space-x-2 text-cosmic-light-green hover:text-cosmic-main-teal transition-colors duration-300 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="underline decoration-cosmic-main-teal/50 hover:decoration-cosmic-main-teal">
                View Privacy Policy
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Floating app preview mockup */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        ></motion.div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </section>
  );
};
