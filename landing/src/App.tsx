import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { DeveloperPage } from "./pages/DeveloperPage";
import { ResumePage } from "./pages/ResumePage";
import { RENAIPage } from "./pages/RENAIPage";
import { UpdatesPage } from "./pages/UpdatesPage";

function App() {
  return (
    <div className="min-h-screen bg-nebula-gradient relative overflow-hidden">
      {/* Animated star field background */}
      <div className="star-field absolute inset-0 z-0" />

      {/* Main content */}
      <div className="relative z-10">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DeveloperPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/renai" element={<RENAIPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
