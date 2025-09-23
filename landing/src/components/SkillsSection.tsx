import { motion } from "framer-motion";
import { Code, Brain, Smartphone, Wrench } from "lucide-react";

export const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Full Stack Development",
      icon: Code,
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
      icon: Brain,
      skills: [
        "Google AI",
        "Natural Language Processing",
        "AI Integration",
        "Prompt Engineering",
      ],
    },
    {
      title: "App Developer",
      icon: Smartphone,
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
      icon: Wrench,
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
    <section className="dark-section-alt py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-dark-text-primary minimal-heading">
            Technical Skills
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto minimal-text">
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
              className="dark-card p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-dark-accent-blue rounded-lg flex items-center justify-center mr-4">
                  <category.icon className="w-6 h-6 text-dark-text-primary" />
                </div>
                <h3 className="text-xl font-medium text-dark-text-primary minimal-heading">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-dark-bg-tertiary rounded-md text-dark-text-secondary text-sm font-medium border border-dark-border-light"
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
