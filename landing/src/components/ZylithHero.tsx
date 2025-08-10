import { motion } from "framer-motion";
import renaissanceLogo from "../assets/icon.png";

export const ZylithHero = () => {
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
            <span className="text-cosmic-vibrant-pink font-semibold">Iaso</span>
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
                alt="Renaissance"
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
        </motion.div>

        {/* Floating app preview mockup */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="relative mx-auto w-80 h-96 cosmic-card rounded-3xl p-6 cosmic-glow animate-float">
            <div className="w-full h-full bg-gradient-to-b from-cosmic-dark-purple to-cosmic-card-dark rounded-2xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-cosmic-main-purple rounded-2xl mb-4 cosmic-glow flex items-center justify-center">
                <span className="text-2xl font-bold text-cosmic-off-white">
                  I
                </span>
              </div>
              <h3 className="text-cosmic-off-white font-semibold text-lg mb-2">
                Iaso
              </h3>
              <p className="text-cosmic-light-purple text-sm text-center">
                Your AI-powered productivity companion
              </p>

              {/* Mock interface elements */}
              <div className="mt-6 space-y-3 w-full">
                <div className="h-3 bg-cosmic-main-purple/50 rounded-full w-3/4 mx-auto" />
                <div className="h-3 bg-cosmic-vibrant-pink/50 rounded-full w-1/2 mx-auto" />
                <div className="h-3 bg-cosmic-electric-cyan/50 rounded-full w-5/6 mx-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
