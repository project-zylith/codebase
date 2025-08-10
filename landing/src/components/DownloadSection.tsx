import { motion } from "framer-motion";

export const DownloadSection = () => {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cosmic-main-teal/10 to-cosmic-vibrant-blue/10 blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Ready to Get Started?</span>
          </h2>

          <p className="text-xl text-cosmic-light-green mb-12 max-w-2xl mx-auto">
            Download Renaissance today and experience the future of note-taking
            and productivity. Available on iOS.
          </p>

          {/* Download button */}
          <div className="flex justify-center items-center mb-12">
            <motion.a
              href="https://apps.apple.com/app/renaissance" // Replace with your actual App Store link
              target="_blank"
              rel="noopener noreferrer"
              className="cosmic-card hover:scale-105 transition-all duration-300 p-6 rounded-2xl cosmic-glow-hover group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-cosmic-off-white rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🍎</span>
                </div>
                <div className="text-left">
                  <p className="text-sm text-cosmic-light-green">
                    Download on the
                  </p>
                  <p className="text-xl font-semibold text-cosmic-off-white">
                    App Store
                  </p>
                  <p className="text-sm text-cosmic-electric-cyan">
                    Available for iOS
                  </p>
                </div>
              </div>
            </motion.a>
          </div>

          {/* Stats/Social proof - Commented out per request */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <p className="text-3xl font-bold text-gradient mb-2">10K+</p>
              <p className="text-cosmic-light-green">Notes Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient mb-2">5K+</p>
              <p className="text-cosmic-light-green">Tasks Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient mb-2">1K+</p>
              <p className="text-cosmic-light-green">Happy Users</p>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};
