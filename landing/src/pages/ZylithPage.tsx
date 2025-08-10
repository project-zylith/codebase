import { motion } from "framer-motion";
import { IasoHero } from "../components/IasoHero";
import { FeaturesSection } from "../components/FeaturesSection";
import { DownloadSection } from "../components/DownloadSection";
import { Footer } from "../components/Footer";

export const IasoPage = () => {
  return (
    <div className="min-h-screen">
      <IasoHero />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};
