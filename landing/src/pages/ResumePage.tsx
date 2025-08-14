import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export const ResumePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        id="resume-content"
        className="max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header Section */}
        <motion.div className="text-center mb-12" variants={fadeInUp}>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Ibrahim Hudson
          </h1>
          <p className="text-xl text-cosmic-light-green mb-6">
            Full-Stack Engineer
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 text-cosmic-light-green">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5" />
              <span>Brooklyn, NY</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-5 h-5" />
              <span>919-633-6572</span>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-5 h-5" />
              <span>ibrahim.hudson.swe@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5" />
              <a
                href="https://www.linkedin.com/in/ibrahim-hudson-swe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cosmic-emerald transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-cosmic-light-green">•</span>
              <a
                href="https://github.com/Ibra-Hud"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cosmic-emerald transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </motion.div>

        {/* Technical Skills Section */}
        <motion.section className="mb-12" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-cosmic-main-teal mb-4 flex items-center">
            <StarIcon className="w-6 h-6 mr-3" />
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                Languages & Frameworks
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">JavaScript</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">TypeScript</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">
                    React/React Native
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">Python</span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
                Tools & Databases
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">Git/GitHub</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">PostgreSQL</span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">
                    Express.js/Node.js
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light-green">
                    Expo/React Native
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-cosmic-main-teal fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-6 bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
            <h3 className="text-lg font-semibold text-cosmic-off-white mb-3">
              Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cosmic-main-teal rounded-full"></div>
                <span className="text-cosmic-light-green">
                  Prompt Engineering (Cognizant)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cosmic-main-teal rounded-full"></div>
                <span className="text-cosmic-light-green">
                  Design Thinking (Cognizant)
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Engineering Experience Section */}
        <motion.section className="mb-12" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-cosmic-main-teal mb-4 flex items-center">
            <BriefcaseIcon className="w-6 h-6 mr-3" />
            Engineering Experience
          </h2>

          <div className="space-y-6">
            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    Renaissance
                  </h3>
                  <p className="text-cosmic-main-teal">
                    AI-powered note taking app, transforming ideas into goals so
                    users can turn goals into product
                  </p>
                  <p className="text-cosmic-light-green text-sm">July 2025</p>
                </div>
              </div>
              <ul className="text-cosmic-light-green space-y-2 text-sm">
                <li>
                  • Engineered full-stack mobile application using PERN stack
                  with TypeScript, implementing custom AI-powered content
                  organization system that creates semantic connections between
                  user notes and generates personalized productivity insights.
                </li>
                <li>
                  • Created proprietary AI algorithms for semantic note analysis
                  using industry leading prompt engineering techniques.
                </li>
                <li>
                  • Developed comprehensive RESTful API with 20+ endpoints using
                  Express.js, integrating Stripe payment processing, real-time
                  AI content analysis, and secure session management with
                  enterprise-grade security protocols.
                </li>
                <li>
                  • Built cross-platform mobile application using React
                  Native/Expo with TypeScript, implementing custom navigation
                  systems, rich text editing capabilities, and responsive UI
                  components for consistent user experience across iOS and
                  Android.
                </li>
              </ul>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    Green Quest
                  </h3>
                  <p className="text-cosmic-main-teal">
                    Community based and AI powered, eco-friendly habit tracker
                  </p>
                  <p className="text-cosmic-light-green text-sm">May 2025</p>
                </div>
              </div>
              <ul className="text-cosmic-light-green space-y-2 text-sm">
                <li>
                  • Managed the end-to-end development of Green Quest, an
                  AI-powered, full-stack application built to gamify and
                  incentivize eco-friendly actions within communities.
                </li>
                <li>
                  • Architected and oversaw the implementation of the
                  application using the PERN stack (PostgreSQL, Express.js,
                  React, Node.js), ensuring a robust and scalable architecture.
                </li>
                <li>
                  • Integrated the Gemini API to power intelligent features,
                  personalize user experiences, provide dynamic feedback,
                  significantly enhancing engagement and environmental impact.
                </li>
                <li>
                  • Led a cross-functional team, managing all project phases
                  from strategic planning and technical design to deployment and
                  optimization.
                </li>
              </ul>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    SAS, Project Orchestration Intern
                  </h3>
                  <p className="text-cosmic-main-teal">Cary, NC</p>
                  <p className="text-cosmic-light-green text-sm">
                    January 2024 – August 2024
                  </p>
                </div>
              </div>
              <ul className="text-cosmic-light-green space-y-2 text-sm">
                <li>
                  • Collaborated directly with senior executives to design and
                  implement an organization-wide code coverage system utilizing
                  SonarQube & Docker, aimed at improving transparency and
                  decision-making across engineering teams.
                </li>
                <li>
                  • Translated complex code data into clear, actionable insights
                  by developing stakeholder-facing dashboards, improving
                  technical visibility, and cross-team communication.
                </li>
                <li>
                  • Demonstrated leadership by owning the full project
                  lifecycle—from planning to presentation—resulting in the
                  successful launch and operational adoption of our code
                  coverage system.
                </li>
                <li>
                  • This contributed to a high-impact initiative that led to
                  year-round job offers for both my teammates and I,
                  highlighting the tangible value and success of our
                  contributions.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Work Experience Section */}
        <motion.section className="mb-12" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-cosmic-main-teal mb-4 flex items-center">
            <BriefcaseIcon className="w-6 h-6 mr-3" />
            Work Experience
          </h2>

          <div className="space-y-6">
            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    Apiary, CEO
                  </h3>
                  <p className="text-cosmic-main-teal">Raleigh, NC</p>
                  <p className="text-cosmic-light-green text-sm">
                    June 2024 – Present
                  </p>
                </div>
              </div>
              <ul className="text-cosmic-light-green space-y-2 text-sm">
                <li>
                  • Founded and spearheaded a creative agency specializing in
                  visual storytelling, managing a team of 5 photographers to
                  deliver high-quality content for clients across events,
                  branding, and digital campaigns.
                </li>
                <li>
                  • Oversaw project workflows from concept to delivery,
                  including creative direction, client communication, and
                  post-production, resulting in a 90% client satisfaction rate
                  and repeat business.
                </li>
              </ul>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    Freelance Photographer
                  </h3>
                  <p className="text-cosmic-light-green text-sm">Present</p>
                </div>
              </div>
              <ul className="text-cosmic-light-green space-y-2 text-sm">
                <li>
                  • Captured and edited high-quality images for events,
                  portraits, and branded content, aligning visuals with client
                  goals and creative briefs to deliver compelling visual
                  narratives.
                </li>
                <li>
                  • Delivered over 150 professionally edited photos per client
                  project on average, meeting tight deadlines while maintaining
                  high creative standards and consistency across all assets.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section className="mb-12" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-cosmic-main-teal mb-4 flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-3" />
            Education
          </h2>

          <div className="space-y-6">
            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    The Marcy Lab School
                  </h3>
                  <p className="text-cosmic-main-teal">Brooklyn, NY</p>
                  <p className="text-cosmic-light-green text-sm">
                    September 2025
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-cosmic-light-green text-sm mb-3">
                  Completed 2,000 hours of coursework in web development, CS
                  fundamentals, and leadership development.
                </p>
                <p className="text-cosmic-light-green text-sm mb-3">
                  Developed proficiency in HTML/CSS, JavaScript, Python, NodeJS,
                  ReactJS, SQL, and Prompt Engineering.
                </p>
                <p className="text-cosmic-light-green text-sm">
                  Contributed to the open-source community by writing blogs
                  about programming technologies such as JavaScript.
                </p>
              </div>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-off-white">
                    North Carolina Agricultural and Technical State University
                  </h3>
                  <p className="text-cosmic-main-teal">Greensboro, NC</p>
                  <p className="text-cosmic-light-green text-sm">
                    August 2023 – August 2024
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-cosmic-light-green text-sm">
                  BA/BS in Computer Science, Fidelity Scholar Full-Ride
                  Scholarship.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section className="mb-12" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-cosmic-main-teal mb-4 flex items-center">
            <StarIcon className="w-6 h-6 mr-3" />
            Notable Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <h3 className="text-lg font-semibold text-cosmic-off-white mb-2">
                Renaissance (REN|AI)
              </h3>
              <p className="text-cosmic-light-green text-sm mb-3">
                AI-powered note taking app that transforms ideas into goals,
                helping users turn goals into products. Built with PERN stack,
                TypeScript, and AI integration.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  React Native
                </span>
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  AI Integration
                </span>
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  Stripe
                </span>
              </div>
            </div>

            <div className="bg-cosmic-card-dark/50 backdrop-blur-sm rounded-xl p-6 border border-cosmic-main-teal/30">
              <h3 className="text-lg font-semibold text-cosmic-off-white mb-2">
                Green Quest
              </h3>
              <p className="text-cosmic-light-green text-sm mb-3">
                Community-based AI-powered eco-friendly habit tracker that
                gamifies and incentivizes environmental actions within
                communities.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  PERN Stack
                </span>
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  Gemini API
                </span>
                <span className="px-2 py-1 bg-cosmic-main-teal/20 text-cosmic-main-teal text-xs rounded">
                  Community Features
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
