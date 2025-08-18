import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface BetaAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetaAccessModal = ({ isOpen, onClose }: BetaAccessModalProps) => {
  const handleEmailClick = () => {
    window.location.href =
      "mailto:ibrahim.hudson.swe@gmail.com?subject=REN|AI Beta Access Request&body=Hi Ibrahim,%0D%0A%0D%0AI'm interested in getting access to the REN|AI beta. Please add me to the beta testing program.%0D%0A%0D%0AThanks!";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="cosmic-card max-w-md w-full p-8 rounded-2xl relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-cosmic-light-green hover:text-cosmic-off-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-cosmic-main-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🚀</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-cosmic-off-white mb-4">
                  Get Access to Beta
                </h3>

                {/* Description */}
                <p className="text-cosmic-light-green mb-8 leading-relaxed">
                  REN|AI is currently in beta testing. Email me to be added to
                  the beta program and get early access to the future of
                  AI-powered note-taking.
                </p>

                {/* Email section */}
                <div className="bg-cosmic-card-dark/50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <EnvelopeIcon className="w-6 h-6 text-cosmic-main-teal" />
                    <span className="text-cosmic-light-green font-medium">
                      Email me here to be added to the beta:
                    </span>
                  </div>

                  <motion.button
                    onClick={handleEmailClick}
                    className="text-cosmic-electric-cyan hover:text-cosmic-emerald font-semibold text-lg transition-colors underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ibrahim.hudson.swe@gmail.com
                  </motion.button>
                </div>

                {/* Additional info */}
                <p className="text-sm text-cosmic-light-green/70">
                  Beta testers get exclusive early access and can provide
                  feedback to help shape the future of REN|AI.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
