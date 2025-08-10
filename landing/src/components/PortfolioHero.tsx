import { motion } from "framer-motion";

export const PortfolioHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cosmic-electric-cyan/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cosmic-neon-purple/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-cosmic-off-white">Hi, I'm</span>
            <br />
            <span className="text-gradient">Ibrahim</span>
          </h1>

          <p className="text-xl md:text-2xl text-cosmic-light-green mb-6">
            Full-Stack Developer & AI Enthusiast
          </p>

          <p className="text-lg text-cosmic-light-green mb-8 leading-relaxed">
            I'm passionate about creating beautiful, intelligent applications
            that solve real problems. Renaissance represents my vision of
            combining AI with exceptional user experience to transform how we
            capture and organize our thoughts.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 bg-cosmic-main-teal/30 rounded-full text-cosmic-electric-cyan">
              React Native
            </span>
            <span className="px-4 py-2 bg-cosmic-main-teal/30 rounded-full text-cosmic-electric-cyan">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-cosmic-main-teal/30 rounded-full text-cosmic-electric-cyan">
              Node.js
            </span>
            <span className="px-4 py-2 bg-cosmic-main-teal/30 rounded-full text-cosmic-electric-cyan">
              AI Integration
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              className="bg-cosmic-vibrant-blue hover:bg-cosmic-emerald px-6 py-3 rounded-xl font-semibold text-cosmic-off-white transition-all duration-300 cosmic-glow-hover text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>

            <motion.a
              href="#projects"
              className="border-2 border-cosmic-main-teal hover:bg-cosmic-main-teal px-6 py-3 rounded-xl font-semibold text-cosmic-light-green hover:text-cosmic-off-white transition-all duration-300 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.a>
          </div>
        </motion.div>

        {/* Right side - Profile visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto w-80 h-80 cosmic-card rounded-full p-8 cosmic-glow animate-float">
            <div className="w-full h-full bg-gradient-to-br from-cosmic-main-purple to-cosmic-vibrant-pink rounded-full flex items-center justify-center">
              {/* Replace this with your actual photo or keep the avatar */}
              <div className="w-64 h-64 bg-cosmic-deep-black rounded-full flex items-center justify-center border-4 border-cosmic-off-white/20">
                <span className="text-6xl">👨‍💻</span>
              </div>
            </div>
          </div>

          {/* Floating tech icons */}
          <motion.div
            className="absolute top-10 right-10 w-16 h-16 bg-cosmic-electric-cyan/20 rounded-xl flex items-center justify-center cosmic-glow"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-2xl">⚛️</span>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-10 w-16 h-16 bg-cosmic-neon-purple/20 rounded-xl flex items-center justify-center cosmic-glow"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          >
            <span className="text-2xl">🤖</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
