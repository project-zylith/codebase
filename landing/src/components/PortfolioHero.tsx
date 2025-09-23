import { motion } from "framer-motion";
import { Code, Smartphone, Brain, Wrench } from "lucide-react";

export const PortfolioHero = () => {
  return (
    <section className="dark-section py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-light mb-8 text-dark-text-primary minimal-heading">
              Hi, I'm <span className="text-dark-accent-blue">Ibrahim</span>
            </h1>

            <p className="text-xl md:text-2xl text-dark-text-secondary mb-8 font-light minimal-text">
              Full-Stack Developer & AI Enthusiast
            </p>

            <p className="text-lg text-dark-text-tertiary mb-16 leading-relaxed max-w-3xl mx-auto minimal-text">
              Creating projects that inspire. REN|AI represents my vision of
              combining AI with exceptional user experience to transform how we
              capture and organize our thoughts.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="flex items-center space-x-2 px-4 py-2 bg-dark-bg-secondary rounded-lg border border-dark-border-light">
                <Code className="w-4 h-4 text-dark-accent-blue" />
                <span className="text-dark-text-primary text-sm font-medium">
                  React Native
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-dark-bg-secondary rounded-lg border border-dark-border-light">
                <Smartphone className="w-4 h-4 text-dark-accent-purple" />
                <span className="text-dark-text-primary text-sm font-medium">
                  TypeScript
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-dark-bg-secondary rounded-lg border border-dark-border-light">
                <Wrench className="w-4 h-4 text-dark-accent-green" />
                <span className="text-dark-text-primary text-sm font-medium">
                  Node.js
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-dark-bg-secondary rounded-lg border border-dark-border-light">
                <Brain className="w-4 h-4 text-dark-accent-cyan" />
                <span className="text-dark-text-primary text-sm font-medium">
                  AI Integration
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="#contact"
                className="dark-button px-8 py-4 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.a>

              <motion.a
                href="#projects"
                className="dark-button-secondary px-8 py-4 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
