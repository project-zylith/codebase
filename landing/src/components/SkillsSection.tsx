import { motion } from "framer-motion";

export const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Full Stack Development",
      icon: "💻",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Tailwind CSS",
        "Framer Motion",
        "Knex.js",
        "REST APIs",
        "Authentication",
      ],
    },
    {
      title: "AI & Machine Learning",
      icon: "🤖",
      skills: [
        "Google AI",
        "Natural Language Processing",
        "AI Integration",
        "Prompt Engineering",
      ],
    },
    {
      title: "App Developer",
      icon: "📱",
      skills: [
        "React Native",
        "Expo",
        "iOS Development",
        "Mobile UI/UX",
        "App Store Deployment",
        "Cross-Platform Development",
      ],
    },
    {
      title: "Tools & Technologies",
      icon: "🛠️",
      skills: [
        "Git",
        "Vite",
        "ESLint",
        "Stripe Integration",
        "Mobile Development",
        "Web Development",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Technical Skills</span>
          </h2>
          <p className="text-xl text-cosmic-light-green max-w-3xl mx-auto">
            A comprehensive toolkit for building modern, intelligent
            applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-cosmic-main-teal rounded-xl flex items-center justify-center mr-4 cosmic-glow">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-cosmic-off-white">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-cosmic-main-teal/20 border border-cosmic-main-teal/40 rounded-lg text-cosmic-electric-cyan text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
