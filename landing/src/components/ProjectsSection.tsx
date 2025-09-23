import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import renaissanceLogo from "../assets/icon.png";
import { Smartphone, Globe, Brain, FileText, Utensils } from "lucide-react";

export const ProjectsSection = () => {
  const projects = [
    {
      title: "REN|AI",
      description:
        "AI-powered note-taking and task management app with intelligent organization features and modern UI design.",
      tech: [
        "React Native",
        "TypeScript",
        "Node.js",
        "Google AI",
        "PostgreSQL",
      ],
      status: "Beta Testing",
      icon: Brain,
      color: "dark-accent-blue",
      link: "/renai",
    },
    {
      title: "Buldak Anime Discovery",
      description:
        "A web application for discovering and exploring anime. Features search functionality, detailed anime info, personalized recommendations, and genre filtering.",
      tech: ["HTML", "CSS", "JavaScript", "Web APIs", "Responsive Design"],
      status: "Live Website",
      icon: Globe,
      color: "dark-accent-cyan",
      link: "https://bul-dak.github.io/anime-web/",
      external: true,
    },
    {
      title: "Galaxy Organization System",
      description:
        "Intelligent AI system that automatically groups related notes into themed collections using advanced NLP.",
      tech: ["Google Generative AI", "Node.js", "TypeScript", "Express"],
      status: "Featured in REN|AI",
      icon: Brain,
      color: "dark-accent-green",
    },
    {
      title: "Rich Text Editor Integration",
      description:
        "Custom implementation of advanced text editing with formatting, real-time collaboration features.",
      tech: ["React Native", "Quill.js", "WebView", "JavaScript"],
      status: "Production Ready",
      icon: FileText,
      color: "dark-accent-purple",
    },
    {
      title: "Poke Bowls",
      description:
        "An accessible recipe page featuring popular and mouth-watering poké bowl recipes from around the world. Discover fresh, flavorful dishes to inspire your next culinary creation.",
      tech: [
        "HTML",
        "CSS",
        "JavaScript",
        "Responsive Design",
        "Recipe Management",
      ],
      status: "Live Website",
      icon: Utensils,
      color: "dark-accent-orange",
      link: "https://poke-bowls.onrender.com/",
      external: true,
    },
  ];

  return (
    <section id="projects" className="dark-section py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-dark-text-primary minimal-heading">
            Featured Projects
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto minimal-text">
            A showcase of my work in mobile development, AI integration, and
            user experience design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {project.external ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`dark-card p-6 hover:shadow-lg transition-all duration-300 group block relative cursor-pointer h-full flex flex-col`}
                  >
                    {project.link && (
                      <div className="absolute top-4 right-4 text-dark-accent-blue opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">View Project →</span>
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <project.icon className="w-6 h-6 text-dark-text-primary" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-medium text-dark-text-primary minimal-heading">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-dark-bg-tertiary rounded-full text-dark-text-secondary text-xs font-medium border border-dark-border-light">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-dark-text-secondary mb-4 leading-relaxed flex-grow minimal-text">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-dark-bg-tertiary rounded-md text-dark-text-secondary text-sm font-medium border border-dark-border-light"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </a>
                ) : project.link ? (
                  <Link
                    to={project.link}
                    className={`dark-card p-6 hover:shadow-lg transition-all duration-300 group block relative cursor-pointer h-full flex flex-col`}
                  >
                    {project.link && (
                      <div className="absolute top-4 right-4 text-dark-accent-blue opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">View Project →</span>
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <project.icon className="w-6 h-6 text-dark-text-primary" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-medium text-dark-text-primary minimal-heading">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-dark-bg-tertiary rounded-full text-dark-text-secondary text-xs font-medium border border-dark-border-light">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-dark-text-secondary mb-4 leading-relaxed flex-grow minimal-text">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-dark-bg-tertiary rounded-md text-dark-text-secondary text-sm font-medium border border-dark-border-light"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`dark-card p-6 hover:shadow-lg transition-all duration-300 group block relative h-full flex flex-col`}
                  >
                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <project.icon className="w-6 h-6 text-dark-text-primary" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-medium text-dark-text-primary minimal-heading">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-dark-bg-tertiary rounded-full text-dark-text-secondary text-xs font-medium border border-dark-border-light">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-dark-text-secondary mb-4 leading-relaxed flex-grow minimal-text">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-dark-bg-tertiary rounded-md text-dark-text-secondary text-sm font-medium border border-dark-border-light"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Personal philosophy section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 dark-card p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-light mb-6 text-dark-text-primary minimal-heading">
            Development Philosophy
          </h3>
          <p className="text-xl text-dark-text-secondary max-w-4xl mx-auto leading-relaxed minimal-text">
            I believe in creating software that doesn't just function—it
            inspires. Every line of code should contribute to an experience that
            feels magical, intuitive, and empowering. Through REN|AI, I'm
            exploring how AI can enhance human creativity rather than replace
            it.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
