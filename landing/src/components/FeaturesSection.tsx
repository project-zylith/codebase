import { motion } from "framer-motion";
import renaissanceLogo from "../assets/icon.png";

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
      icon: renaissanceLogo,
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

        {/* Privacy Policy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 cosmic-card rounded-3xl p-8 md:p-12 text-center border-2 border-cosmic-main-teal/30"
        >
          <div className="w-20 h-20 bg-cosmic-main-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-cosmic-main-teal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-cosmic-off-white">
              Your Privacy is Our Priority
            </span>
          </h3>

          <p className="text-xl text-cosmic-light-green mb-8 max-w-4xl mx-auto leading-relaxed">
            At REN|AI, we believe your personal information should remain
            exactly that - personal. We've built our AI-powered app with privacy
            at its core, ensuring your notes, tasks, and insights are protected
            with enterprise-grade security.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-cosmic-main-teal/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cosmic-main-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-cosmic-light-green font-medium">
                End-to-End Encryption
              </span>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-cosmic-main-teal/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cosmic-main-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-cosmic-light-green font-medium">
                Never Sell Your Data
              </span>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-cosmic-main-teal/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cosmic-main-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="text-cosmic-light-green font-medium">
                GDPR Compliant
              </span>
            </div>
          </div>

          <div className="bg-cosmic-main-teal/10 border border-cosmic-main-teal/30 rounded-xl p-6 max-w-3xl mx-auto">
            <p className="text-cosmic-light-green text-lg">
              <strong className="text-cosmic-off-white">
                REN|AI Privacy Promise:
              </strong>{" "}
              We will never sell your personal information. Your notes, tasks,
              and insights are yours alone. We use AI to help you organize and
              grow, not to exploit your data.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
