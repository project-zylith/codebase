import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Assistant",
      description:
        "REN|AI analyzes your notes and provides intelligent insights, task suggestions, and content organization.",
      color: "cosmic-vibrant-blue",
    },
    {
      icon: "⭐",
      title: "Galaxy Organization",
      description:
        'Automatically group related notes into themed "galaxies" for intuitive organization and discovery.',
      color: "cosmic-main-teal",
    },
    {
      icon: "📝",
      title: "Rich Text Editor",
      description:
        "Create beautiful, formatted notes with our advanced editor supporting rich text, lists, and more.",
      color: "cosmic-electric-cyan",
    },
    {
      icon: "✅",
      title: "Smart Task Management",
      description:
        "Convert notes into actionable tasks with AI assistance and track your progress seamlessly.",
      color: "cosmic-emerald",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Your data is encrypted and secure with user authentication and privacy-first design.",
      color: "cosmic-vibrant-blue",
    },
    {
      icon: "🎨",
      title: "Beautiful Interface",
      description:
        "Enjoy a stunning cosmic-themed interface with multiple color palettes and smooth animations.",
      color: "cosmic-main-teal",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-cosmic-vibrant-blue/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p className="text-xl text-cosmic-light-green max-w-3xl mx-auto">
            Discover how Iaso transforms your productivity with cutting-edge AI
            and beautiful design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 bg-${feature.color} rounded-xl flex items-center justify-center mb-4 cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300 overflow-hidden`}
              >
                {typeof feature.icon === "string" ? (
                  <span className="text-2xl">{feature.icon}</span>
                ) : (
                  <img
                    src={feature.icon}
                    alt="Feature icon"
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>

              <h3 className="text-xl font-semibold text-cosmic-off-white mb-3">
                {feature.title}
              </h3>

              <p className="text-cosmic-light-green leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional feature highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 cosmic-card rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-gradient">
              Experience the Future of Productivity
            </span>
          </h3>
          <p className="text-xl text-cosmic-light-green mb-8 max-w-4xl mx-auto leading-relaxed">
            REN|AI combines the power of artificial intelligence with beautiful
            design to create the most intuitive note-taking and task management
            experience you've ever used.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center space-x-3 text-cosmic-electric-cyan">
              <span className="text-2xl">🚀</span>
              <span className="text-lg">Boost Productivity by 3x</span>
            </div>
            <div className="flex items-center space-x-3 text-cosmic-electric-cyan">
              <span className="text-2xl">⚡</span>
              <span className="text-lg">Lightning Fast Performance</span>
            </div>
            <div className="flex items-center space-x-3 text-cosmic-electric-cyan">
              <span className="text-2xl">🎯</span>
              <span className="text-lg">Goal-Oriented Design</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
