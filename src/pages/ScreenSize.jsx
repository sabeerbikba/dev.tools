import { useState, useEffect } from "react";

const ScreenSize = () => {
  const getViewport = () => {
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        dpr: window.devicePixelRatio,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio,
    };
  };

  const [size, setSize] = useState(getViewport());

  useEffect(() => {
    const handleResize = () => setSize(getViewport());

    window.addEventListener("resize", handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const getReducedRatio = (w, h) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(Math.round(w), Math.round(h));
    return `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <table className="table-auto border-collapse border border-gray-400 shadow-lg rounded-lg">
        <thead className="bg-white/10">
          <tr>
            <th className="border border-gray-400 px-4 py-2">Property</th>
            <th className="border border-gray-400 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries({
            Width: `${size.width.toFixed(2)}px`,
            Height: `${size.height.toFixed(2)}px`,
            "Aspect Ratio": `${getReducedRatio(size.width, size.height)} (${(
              size.width / size.height
            ).toFixed(2)})`,
            "Device Pixel Ratio": size.dpr.toFixed(2),
          }).map(([key, value]) => (
            <tr key={key}>
              <td className="border border-gray-400 px-4 py-2 capitalize text-center">
                {key}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScreenSize;
