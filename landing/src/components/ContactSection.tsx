import { motion } from "framer-motion";

export const ContactSection = () => {
  const handleEmailClick = () => {
    // Copy email to clipboard
    navigator.clipboard.writeText("ibrahim.hudson.swe@gmail.com");
    // Open Gmail
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
  };

  const contactMethods = [
    {
      icon: "📧",
      label: "Email",
      value: "ibrahim.hudson.swe@gmail.com",
      onClick: handleEmailClick,
      color: "cosmic-vibrant-blue",
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "Connect with me",
      href: "https://www.linkedin.com/in/ibrahim-hudson-swe",
      color: "cosmic-main-teal",
    },
    {
      icon: "🐙",
      label: "GitHub",
      value: "View my code",
      href: "https://github.com/Ibra-Hud",
      color: "cosmic-electric-cyan",
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background effects */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-cosmic-main-teal/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Let's Connect</span>
          </h2>

          <p className="text-xl text-cosmic-light-green mb-12 max-w-2xl mx-auto">
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
                  className="cosmic-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group text-center border-none bg-transparent cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-14 h-14 bg-${method.color} rounded-xl flex items-center justify-center mb-4 mx-auto cosmic-glow group-hover:cosmic-glow-hover transition-all duration-300`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-cosmic-off-white mb-2">
                    {method.label}
                  </h3>

                  <p className="text-cosmic-light-green text-sm">
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
