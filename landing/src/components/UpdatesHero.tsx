import { motion } from "framer-motion";

export const UpdatesHero = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 pt-32">
      {/* Background effects */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-cosmic-electric-cyan/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">App Updates</span>
          </h1>

          <p className="text-xl md:text-2xl text-cosmic-light-green mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the latest features, improvements, and insights
            from the Renaissance development journey.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>🚀</span>
              <span>New Features</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>🔧</span>
              <span>Bug Fixes</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-electric-cyan">
              <span>💡</span>
              <span>Behind the Scenes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
