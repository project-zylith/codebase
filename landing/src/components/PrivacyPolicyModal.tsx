import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-deep-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-4xl bg-cosmic-card-dark rounded-2xl border border-cosmic-main-teal/30 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cosmic-main-teal/30">
                  <h2 className="text-2xl font-bold text-cosmic-off-white">
                    Privacy Policy
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-cosmic-light-green hover:text-cosmic-off-white hover:bg-cosmic-card-dark transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-6 text-cosmic-light-green">
                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Information We Collect
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We collect information you provide directly to us, such
                        as when you create an account, make a purchase, or
                        contact us for support. This may include your name,
                        email address, and payment information.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        How We Use Your Information
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We use the information we collect to provide, maintain,
                        and improve our services, process transactions, send you
                        technical notices and support messages, and respond to
                        your comments and questions.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Information Sharing
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We do not sell, trade, or otherwise transfer your
                        personal information to third parties without your
                        consent, except as described in this policy or as
                        required by law.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Data Security
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We implement appropriate security measures to protect
                        your personal information against unauthorized access,
                        alteration, disclosure, or destruction.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Your Rights
                      </h3>
                      <p className="text-sm leading-relaxed">
                        You have the right to access, update, or delete your
                        personal information. You may also opt out of certain
                        communications from us.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Contact Us
                      </h3>
                      <p className="text-sm leading-relaxed">
                        If you have any questions about this Privacy Policy,
                        please contact us at{" "}
                        <a
                          href="mailto:ibrahim.hudson.swe@gmail.com"
                          className="text-cosmic-main-teal hover:text-cosmic-electric-cyan underline"
                        >
                          ibrahim.hudson.swe@gmail.com
                        </a>
                      </p>
                    </section>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-cosmic-main-teal/30">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-cosmic-main-teal hover:bg-cosmic-emerald text-cosmic-off-white rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
