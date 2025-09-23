import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";

export const ContactSection = () => {
  const handleEmailClick = () => {
    // Copy email to clipboard
    navigator.clipboard.writeText("ibrahim.hudson.swe@gmail.com");
    // Open Gmail
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "ibrahim.hudson.swe@gmail.com",
      onClick: handleEmailClick,
      color: "dark-accent-blue",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect with me",
      href: "https://www.linkedin.com/in/ibrahim-hudson-swe",
      color: "dark-accent-cyan",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "View my code",
      href: "https://github.com/Ibra-Hud",
      color: "dark-accent-purple",
    },
  ];

  return (
    <section
      id="contact"
      className="dark-section-alt py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-dark-text-primary minimal-heading">
            Let's Connect
          </h2>

          <p className="text-xl text-dark-text-secondary mb-16 max-w-2xl mx-auto minimal-text">
            I'm always interested in discussing new opportunities,
            collaborations, or just chatting about technology and innovation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Component = method.onClick ? motion.button : motion.a;
              const props = method.onClick
                ? { onClick: method.onClick }
                : {
                    href: method.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  };

              return (
                <Component
                  key={method.label}
                  {...props}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="dark-card p-6 hover:shadow-lg transition-all duration-300 group text-center cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-14 h-14 bg-${method.color} rounded-lg flex items-center justify-center mb-4 mx-auto transition-all duration-300`}
                  >
                    <method.icon className="w-6 h-6 text-dark-text-primary" />
                  </div>

                  <h3 className="text-lg font-medium text-dark-text-primary mb-2 minimal-heading">
                    {method.label}
                  </h3>

                  <p className="text-dark-text-secondary text-sm minimal-text">
                    {method.value}
                  </p>
                </Component>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
