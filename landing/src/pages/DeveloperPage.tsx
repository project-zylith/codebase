import { PortfolioHero } from "../components/PortfolioHero";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export const DeveloperPage = () => {
  return (
    <div className="min-h-screen">
      <PortfolioHero />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};
