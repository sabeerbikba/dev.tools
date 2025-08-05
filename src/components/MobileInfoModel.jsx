import { useState, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";

import { paths } from "@/routes";

const MobileInfoModal = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleContinue = () => {
    setIsOpen(false);
    setDismissed(true);
  };

  const checkScreenSize = () => {
    const isMobile = window.innerWidth < 970;
    if (paths.includes(location.pathname) && isMobile && !dismissed) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    checkScreenSize();

    const handleResize = () => {
      checkScreenSize();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setDismissed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.pathname, dismissed]);

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-[#374151] text-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#6366f1]/10 rounded-full p-4">
            <Monitor className="w-8 h-8 text-[#6366f1]" />
          </div>
          <h2 className="text-xl font-semibold">Best Viewed on Desktop</h2>
          <p className="text-sm text-gray-300">
            Dev.tools is best experienced on wider screens
          </p>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="flex flex-col items-center gap-1 opacity-50">
              <Smartphone className="w-6 h-6" />
              <span className="text-xs">Mobile</span>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex flex-col items-center gap-1 text-[#6366f1]">
              <Monitor className="w-6 h-6" />
              <span className="text-xs">Desktop</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="mt-4 bg-[#6366f1] text-white px-4 py-2 rounded-md hover:bg-[#6366f1]/90 w-full"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default MobileInfoModal;
