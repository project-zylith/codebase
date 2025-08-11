import { motion, AnimatePresence } from "framer-motion";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-cosmic-dark-blue border border-cosmic-main-teal/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto cosmic-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cosmic-off-white">
              REN|AI Privacy Policy
            </h2>
            <button
              onClick={onClose}
              className="text-cosmic-light-green hover:text-cosmic-electric-cyan transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 text-cosmic-light-green">
            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Your Privacy Matters
              </h3>
              <p className="leading-relaxed">
                At REN|AI, we believe in complete transparency about how we
                handle your personal information. This privacy policy explains
                how we collect, use, and protect your data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Information We Collect
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account information (username, email)</li>
                <li>Notes and content you create</li>
                <li>Task data and organization preferences</li>
                <li>Usage analytics to improve the app</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                How We Use Your Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain the REN|AI app</li>
                <li>Process your subscription payments securely</li>
                <li>Send important app updates and notifications</li>
                <li>Improve our AI features and user experience</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Data Protection & Security
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All data is encrypted in transit and at rest</li>
                <li>Secure cloud infrastructure with industry standards</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to your personal information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                We Will Never
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-cosmic-vibrant-pink">
                <li>Sell your personal information to third parties</li>
                <li>Share your notes or content without permission</li>
                <li>Use your data for advertising purposes</li>
                <li>
                  Access your information for any reason other than providing
                  the service
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Third-Party Services
              </h3>
              <p className="leading-relaxed">
                We use trusted third-party services for essential functions like
                payment processing (Stripe) and AI capabilities (Google AI).
                These services have their own privacy policies and are bound by
                strict data protection agreements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Your Rights
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and download your data at any time</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communications</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cosmic-electric-cyan mb-2">
                Contact Us
              </h3>
              <p className="leading-relaxed">
                If you have any questions about this privacy policy or how we
                handle your data, please contact us at privacy@renai.app
              </p>
            </div>

            <div className="text-sm text-cosmic-main-teal/70 pt-4 border-t border-cosmic-main-teal/20">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cosmic-main-teal hover:bg-cosmic-electric-cyan text-cosmic-dark-blue font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
