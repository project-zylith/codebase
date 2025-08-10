import { ZylithHero } from "../components/ZylithHero";
import { FeaturesSection } from "../components/FeaturesSection";
import { DownloadSection } from "../components/DownloadSection";
import { Footer } from "../components/Footer";

export const ZylithPage = () => {
  return (
    <div className="min-h-screen">
      <ZylithHero />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};
