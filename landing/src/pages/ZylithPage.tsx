import { RENAIHero } from "../components/RENAIHero";
import { FeaturesSection } from "../components/FeaturesSection";
import { DownloadSection } from "../components/DownloadSection";
import { Footer } from "../components/Footer";

export const RENAIPage = () => {
  return (
    <div className="min-h-screen">
      <RENAIHero />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};
