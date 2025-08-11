import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import renaissanceLogo from "../assets/icon.png";

export const ProjectsSection = () => {
  const projects = [
    {
      title: "REN|AI",
      description:
        "AI-powered note-taking and task management app with cosmic-themed UI and intelligent organization features.",
      tech: [
        "React Native",
        "TypeScript",
        "Node.js",
        "Google AI",
        "PostgreSQL",
      ],
      status: "Live on iOS App Store",
      icon: "🌌",
      color: "cosmic-vibrant-blue",
      link: "/renai",
    },
    {
      title: "Buldak Anime Discovery",
      description:
        "A web application for discovering and exploring anime. Features search functionality, detailed anime info, personalized recommendations, and genre filtering.",
      tech: ["HTML", "CSS", "JavaScript", "Web APIs", "Responsive Design"],
      status: "Live Website",
      icon: "🎌",
      color: "cosmic-electric-cyan",
      link: "https://bul-dak.github.io/anime-web/",
      external: true,
    },
    {
      title: "Galaxy Organization System",
      description:
        "Intelligent AI system that automatically groups related notes into themed collections using advanced NLP.",
      tech: ["Google Generative AI", "Node.js", "TypeScript", "Express"],
      status: "Featured in REN|AI",
      icon: "🌟",
      color: "cosmic-main-teal",
    },
    {
      title: "Rich Text Editor Integration",
      description:
        "Custom implementation of advanced text editing with formatting, real-time collaboration features.",
      tech: ["React Native", "Quill.js", "WebView", "JavaScript"],
      status: "Production Ready",
      icon: "📝",
      color: "cosmic-electric-cyan",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-cosmic-vibrant-pink/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-xl text-cosmic-light-green max-w-3xl mx-auto">
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
                    className={`cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group block relative cursor-pointer`}
                  >
                    {project.link && (
                      <div className="absolute top-4 right-4 text-cosmic-electric-cyan opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">View Project →</span>
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-xl flex items-center justify-center mb-4 cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">{project.icon}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-cosmic-off-white">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-cosmic-main-purple/30 rounded-full text-cosmic-electric-cyan text-xs">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-cosmic-light-green mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-cosmic-main-teal/20 border border-cosmic-main-teal/40 rounded-lg text-cosmic-electric-cyan text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </a>
                ) : project.link ? (
                  <Link
                    to={project.link}
                    className={`cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group block relative cursor-pointer`}
                  >
                    {project.link && (
                      <div className="absolute top-4 right-4 text-cosmic-electric-cyan opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">View Project →</span>
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-xl flex items-center justify-center mb-4 cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">{project.icon}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-cosmic-off-white">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-cosmic-main-purple/30 rounded-full text-cosmic-electric-cyan text-xs">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-cosmic-light-green mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-cosmic-main-teal/20 border border-cosmic-main-teal/40 rounded-lg text-cosmic-electric-cyan text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group block relative`}
                  >
                    <div
                      className={`w-14 h-14 bg-${project.color} rounded-xl flex items-center justify-center mb-4 cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300 overflow-hidden`}
                    >
                      {project.title === "REN|AI" ? (
                        <img
                          src={renaissanceLogo}
                          alt="REN|AI Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">{project.icon}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-cosmic-off-white">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-cosmic-main-purple/30 rounded-full text-cosmic-electric-cyan text-xs">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-cosmic-light-green mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-cosmic-main-teal/20 border border-cosmic-main-teal/40 rounded-lg text-cosmic-electric-cyan text-sm"
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
          className="mt-20 cosmic-card rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-gradient">Development Philosophy</span>
          </h3>
          <p className="text-xl text-cosmic-light-green max-w-4xl mx-auto leading-relaxed">
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
