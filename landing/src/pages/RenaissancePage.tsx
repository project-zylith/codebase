import { RenaissanceHero } from "../components/RenaissanceHero";
import { FeaturesSection } from "../components/FeaturesSection";
import { DownloadSection } from "../components/DownloadSection";
import { Footer } from "../components/Footer";

export const RenaissancePage = () => {
  return (
    <div className="min-h-screen">
      <RenaissanceHero />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};
