import { motion } from "framer-motion";
import { UpdatesHero } from "../components/UpdatesHero";
import { UpdatesList } from "../components/UpdatesList";
import { Footer } from "../components/Footer";

export const UpdatesPage = () => {
  return (
    <div className="min-h-screen">
      <UpdatesHero />
      <UpdatesList />
      <Footer />
    </div>
  );
};
