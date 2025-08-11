import { motion } from "framer-motion";
import renaissanceLogo from "../assets/icon.png";

export const UpdatesList = () => {
  // You can easily add new updates here
  const updates = [
    {
      id: 1,
      title: "REN|AI v1.2.0 - Galaxy Organization System",
      date: "December 2024",
      type: "Major Update",
      description:
        'Introducing the revolutionary Galaxy Organization System! REN|AI now uses AI to automatically group your related notes into themed "galaxies" for better organization and discovery.',
      features: [
        "AI-powered note grouping",
        "Visual galaxy interface",
        "Smart content analysis",
        "One-click organization",
      ],
      icon: renaissanceLogo,
      color: "cosmic-vibrant-blue",
    },
    {
      id: 2,
      title: "Enhanced AI Insights",
      date: "November 2024",
      type: "Feature Update",
      description:
        "Improved AI capabilities for generating better task suggestions and note insights. REN|AI now provides more contextual and actionable recommendations.",
      features: [
        "Smarter task generation",
        "Better context understanding",
        "Improved suggestion quality",
        "Faster AI processing",
      ],
      icon: "🤖",
      color: "cosmic-main-teal",
    },
    {
      id: 3,
      title: "Rich Text Editor Improvements",
      date: "October 2024",
      type: "Enhancement",
      description:
        "Major improvements to the text editor with better formatting options, improved performance, and enhanced mobile experience.",
      features: [
        "New formatting tools",
        "Better mobile editing",
        "Performance optimizations",
        "Enhanced toolbar",
      ],
      icon: "📝",
      color: "cosmic-electric-cyan",
    },
    {
      id: 4,
      title: "REN|AI v1.0.0 Launch",
      date: "September 2024",
      type: "Launch",
      description:
        "The official launch of REN|AI! After months of development, our AI-powered note-taking and task management app is now available on the App Store.",
      features: [
        "Full note-taking system",
        "AI task generation",
        "User authentication",
        "Cross-platform support",
      ],
      icon: "🚀",
      color: "cosmic-emerald",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Major Update":
        return "bg-cosmic-vibrant-pink/20 text-cosmic-vibrant-pink border-cosmic-vibrant-pink/40";
      case "Feature Update":
        return "bg-cosmic-main-purple/20 text-cosmic-main-purple border-cosmic-main-purple/40";
      case "Enhancement":
        return "bg-cosmic-electric-cyan/20 text-cosmic-electric-cyan border-cosmic-electric-cyan/40";
      case "Launch":
        return "bg-cosmic-neon-purple/20 text-cosmic-neon-purple border-cosmic-neon-purple/40";
      default:
        return "bg-cosmic-main-purple/20 text-cosmic-main-purple border-cosmic-main-purple/40";
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-12">
          {updates.map((update, index) => (
            <motion.article
              key={update.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="cosmic-card rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div
                    className={`w-14 h-14 bg-${update.color} rounded-xl flex items-center justify-center cosmic-glow overflow-hidden`}
                  >
                    {typeof update.icon === "string" &&
                    update.icon.startsWith("/") ? (
                      <img
                        src={update.icon}
                        alt="Update icon"
                        className="w-8 h-8 object-contain"
                      />
                    ) : typeof update.icon === "string" ? (
                      <span className="text-2xl">{update.icon}</span>
                    ) : (
                      <img
                        src={update.icon}
                        alt="Update icon"
                        className="w-8 h-8 object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-cosmic-off-white mb-1">
                      {update.title}
                    </h2>
                    <p className="text-cosmic-light-green">{update.date}</p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTypeColor(
                    update.type
                  )}`}
                >
                  {update.type}
                </span>
              </div>

              {/* Description */}
              <p className="text-lg text-cosmic-light-green mb-6 leading-relaxed">
                {update.description}
              </p>

              {/* Features list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {update.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-cosmic-electric-cyan rounded-full flex-shrink-0" />
                    <span className="text-cosmic-light-green">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 cosmic-card rounded-3xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            <span className="text-gradient">Stay Updated</span>
          </h3>
          <p className="text-cosmic-light-green mb-6">
            Want to be notified about new updates? Follow the development
            journey and get early access to new features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#contact"
              className="bg-cosmic-vibrant-blue hover:bg-cosmic-emerald px-6 py-3 rounded-xl font-semibold text-cosmic-off-white transition-all duration-300 cosmic-glow-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="/renai#download"
              className="border-2 border-cosmic-main-teal hover:bg-cosmic-main-teal px-6 py-3 rounded-xl font-semibold text-cosmic-light-green hover:text-cosmic-off-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download REN|AI
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
