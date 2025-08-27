import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
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
                    Terms of Service (EULA)
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
                        Acceptance of Terms
                      </h3>
                      <p className="text-sm leading-relaxed">
                        By downloading, installing, or using the REN|AI
                        application, you agree to be bound by these Terms of
                        Service. If you do not agree to these terms, please do
                        not use the application.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Scope of License
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We grant you a nontransferable license to use the REN|AI
                        application on any Apple-branded products that you own
                        or control. You may not distribute or make the app
                        available over a network where it could be used by
                        multiple devices simultaneously. You may not transfer,
                        redistribute, or sublicense the application.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Description of Service
                      </h3>
                      <p className="text-sm leading-relaxed">
                        REN|AI is a productivity application that provides
                        note-taking, task management, and AI-powered insights.
                        The service includes various subscription tiers with
                        different feature sets and usage limits.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Subscription Terms
                      </h3>
                      <p className="text-sm leading-relaxed">
                        • Subscriptions automatically renew unless cancelled at
                        least 24 hours before the end of the current period
                        <br />• You can manage and cancel subscriptions in your
                        device's App Store settings
                        <br />• Subscription prices may change with 30 days
                        notice
                        <br />• Refunds are subject to App Store policies
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        User Responsibilities
                      </h3>
                      <p className="text-sm leading-relaxed">
                        • You are responsible for maintaining the security of
                        your account
                        <br />• You must not use the service for any illegal or
                        unauthorized purpose
                        <br />• You must not attempt to gain unauthorized access
                        to the service
                        <br />• You are responsible for all content you create
                        or upload
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Intellectual Property
                      </h3>
                      <p className="text-sm leading-relaxed">
                        The REN|AI application and its content are protected by
                        copyright, trademark, and other intellectual property
                        laws. You retain ownership of your content, but grant us
                        a license to use it to provide the service.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Limitation of Liability
                      </h3>
                      <p className="text-sm leading-relaxed">
                        REN|AI is provided "as is" and "as available" with all
                        faults and without warranty of any kind. We hereby
                        disclaim all warranties and conditions with respect to
                        the application and any services, either express,
                        implied, or statutory. We are not liable for any damages
                        arising from your use of the service, including but not
                        limited to data loss, business interruption, or service
                        interruptions.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Changes to Terms
                      </h3>
                      <p className="text-sm leading-relaxed">
                        We may update these terms from time to time. We will
                        notify you of any material changes via email or through
                        the application. Continued use of the service after
                        changes constitutes acceptance of the new terms.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Consent to Use of Data
                      </h3>
                      <p className="text-sm leading-relaxed">
                        You agree that we may collect and use technical data and
                        related information—including but not limited to
                        technical information about your device, system and
                        application software, and peripherals—that is gathered
                        periodically to facilitate the provision of software
                        updates, product support, and other services to you
                        related to the REN|AI application.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        External Services
                      </h3>
                      <p className="text-sm leading-relaxed">
                        The REN|AI application may enable access to our and/or
                        third-party services and websites. You agree to use
                        these services at your sole risk. We are not responsible
                        for examining or evaluating the content or accuracy of
                        any third-party services, and shall not be liable for
                        any such third-party services.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                        Contact Information
                      </h3>
                      <p className="text-sm leading-relaxed">
                        If you have questions about these Terms of Service,
                        please contact us at{" "}
                        <span className="text-cosmic-main-teal">
                          ibrahim.hudson.swe@gmail.com
                        </span>
                      </p>
                    </section>

                    <section>
                      <p className="text-sm text-cosmic-light-green font-style-italic">
                        Last updated: August 2025
                      </p>
                    </section>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center p-6 border-t border-cosmic-main-teal/30">
                  <button
                    onClick={onClose}
                    className="bg-cosmic-main-teal hover:bg-cosmic-main-teal/80 text-cosmic-off-white px-8 py-3 rounded-xl font-semibold transition-colors"
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
