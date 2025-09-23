import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { DeveloperPage } from "./pages/DeveloperPage";
import { ResumePage } from "./pages/ResumePage";
import { RENAIPage } from "./pages/RENAIPage";
import { UpdatesPage } from "./pages/UpdatesPage";
import { LegalPage } from "./pages/LegalPage";

function App() {
  return (
    <div className="min-h-screen bg-dark-bg-primary font-notion">
      {/* Main content */}
      <div className="relative">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DeveloperPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/renai" element={<RENAIPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/legal" element={<LegalPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
