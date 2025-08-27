import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { TermsOfServiceModal } from "../components/TermsOfServiceModal";
import { PrivacyPolicyModal } from "../components/PrivacyPolicyModal";

export const LegalPage = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-cosmic-deep-black">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cosmic-main-teal/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            to="/renai"
            className="inline-flex items-center text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to REN|AI
          </Link>

          {/* Page title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-cosmic-off-white mb-4">
              Legal
            </h1>
            <p className="text-xl text-cosmic-light-green max-w-2xl mx-auto">
              Review our Terms of Service and Privacy Policy to understand how
              we protect your data and govern our relationship.
            </p>
          </div>

          {/* Legal options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Terms of Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-cosmic-card-dark rounded-2xl border border-cosmic-main-teal/30 p-8 hover:border-cosmic-main-teal/50 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-cosmic-main-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-cosmic-main-teal"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-cosmic-off-white mb-4">
                  Terms of Service (EULA)
                </h3>
                <p className="text-cosmic-light-green mb-6 leading-relaxed">
                  Our End User License Agreement outlines the terms and
                  conditions for using REN|AI, including subscription terms,
                  user responsibilities, and intellectual property rights.
                </p>
                <button
                  onClick={() => setShowTerms(true)}
                  className="bg-cosmic-main-teal hover:bg-cosmic-main-teal/80 text-cosmic-off-white px-8 py-3 rounded-xl font-semibold transition-colors cosmic-glow"
                >
                  View Terms
                </button>
              </div>
            </motion.div>

            {/* Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-cosmic-card-dark rounded-2xl border border-cosmic-main-teal/30 p-8 hover:border-cosmic-main-teal/50 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-cosmic-main-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-cosmic-main-teal"
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
                </div>
                <h3 className="text-2xl font-bold text-cosmic-off-white mb-4">
                  Privacy Policy
                </h3>
                <p className="text-cosmic-light-green mb-6 leading-relaxed">
                  Learn how we collect, use, and protect your personal
                  information. We're committed to transparency and ensuring your
                  data privacy and security.
                </p>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="bg-cosmic-main-teal hover:bg-cosmic-main-teal/80 text-cosmic-off-white px-8 py-3 rounded-xl font-semibold transition-colors cosmic-glow"
                >
                  View Policy
                </button>
              </div>
            </motion.div>
          </div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-cosmic-light-green text-sm">
              Last updated: August 2025 • For questions, contact{" "}
              <a
                href="mailto:ibrahim.hudson.swe@gmail.com"
                className="text-cosmic-main-teal hover:text-cosmic-electric-cyan transition-colors"
              >
                ibrahim.hudson.swe@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
      <PrivacyPolicyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};
