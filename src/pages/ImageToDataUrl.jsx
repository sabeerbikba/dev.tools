import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ToolBoxLayout from "@/common/ToolBoxLayout";
import ToolBox from "@/common/ToolBox";
import Btn from "@/common/BasicBtn";
import CopyBtn from "@/common/CopyBtn";
import cn from "@/utils/cn";

const ImageToDataUrl = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [svgUrlEncoded, setSvgUrlEncoded] = useState("");
  const [outputType, setOutputType] = useState("base64"); // 'base64' or 'url-encoded'
  // const [isProcessing, setIsProcessing] = useState(false); // Unused for now as operations are fast enough or async handled simply

  const fileInputRef = useRef(null);

  // Constants
  const RECOMMENDED_SIZE_BYTES = 200 * 1024; // 200KB
  const SUPPORTED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    if (!SUPPORTED_TYPES.includes(selectedFile.type)) {
      toast.error(
        "Unsupported file type. Please select PNG, JPG, GIF, WEBP, or SVG."
      );
      return;
    }

    // setIsProcessing(true);
    setFile(selectedFile);

    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Reset output
    setDataUrl("");
    setSvgUrlEncoded("");
    setOutputType("base64");

    // Base64 Reader
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(reader.result);
      // setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error("Error reading file.");
      // setIsProcessing(false);
    };
    reader.readAsDataURL(selectedFile);

    // SVG URL Encoded Reader
    if (selectedFile.type === "image/svg+xml") {
      const textReader = new FileReader();
      textReader.onload = () => {
        const content = textReader.result;
        // Basic URL encoding for SVG data URI
        // Using encodeURIComponent but ensuring quotes are safer
        const encoded =
          "data:image/svg+xml," +
          encodeURIComponent(content)
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");
        setSvgUrlEncoded(encoded);
      };
      textReader.readAsText(selectedFile);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setDataUrl("");
    setSvgUrlEncoded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isLargeFile = file && file.size > RECOMMENDED_SIZE_BYTES;
  const isSvg = file && file.type === "image/svg+xml";

  const currentOutput =
    outputType === "url-encoded" && isSvg ? svgUrlEncoded : dataUrl;

  const isValidPreviewUrl = previewUrl && previewUrl.startsWith("blob:");

  return (
    <ToolBoxLayout>
      <ToolBox title="Input Image">
        <div className="flex flex-col gap-4 h-full">
          <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-300">
                Supported formats: PNG, JPG, GIF, WEBP, SVG
              </p>
              <p className="text-gray-400 text-sm">
                Recommended size: &lt; 200KB
              </p>
              <Btn
                btnText="Select Image"
                onClick={() => fileInputRef.current?.click()}
                classNames="!w-40"
              />
            </div>
          </div>

          {file && (
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              <div className="w-full md:w-1/3 flex items-center justify-center bg-gray-800/50 rounded-lg p-4 min-h-[200px]">
                {isValidPreviewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                )}
              </div>

              <div className="w-full md:w-2/3 space-y-3">
                <h3 className="text-xl font-semibold text-white">Image Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">Name:</div>
                  <div className="text-white truncate" title={file.name}>{file.name}</div>

                  <div className="text-gray-400">Size:</div>
                  <div className={cn("text-white", isLargeFile ? "text-yellow-400 font-bold" : "")}>
                    {formatFileSize(file.size)}
                  </div>

                  <div className="text-gray-400">Type:</div>
                  <div className="text-white">{file.type}</div>
                </div>

                {isLargeFile && (
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded text-yellow-200 text-sm">
                    Warning: Image is larger than recommended (200KB). Data URLs can significantly increase file size and affect page load performance.
                  </div>
                )}

                <Btn
                  btnText="Clear"
                  onClick={handleClear}
                  classNames="bg-red-600 hover:bg-red-700 mt-4 !w-32"
                />
              </div>
            </div>
          )}
        </div>
      </ToolBox>

      <ToolBox title="Data URL Output">
        <div className="flex flex-col h-full">
          {file ? (
            <>
              {isSvg && (
                <div className="flex gap-4 mb-4 border-b border-gray-700 pb-2">
                  <button
                    onClick={() => setOutputType("base64")}
                    className={cn(
                      "px-4 py-2 rounded-t-lg transition-colors text-sm font-medium focus:outline-none",
                      outputType === "base64"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    )}
                  >
                    Base64
                  </button>
                  <button
                    onClick={() => setOutputType("url-encoded")}
                    className={cn(
                      "px-4 py-2 rounded-t-lg transition-colors text-sm font-medium focus:outline-none",
                      outputType === "url-encoded"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    )}
                  >
                    URL Encoded (SVG)
                  </button>
                </div>
              )}

              <div className="relative flex-grow min-h-[200px] bg-gray-900 rounded-lg border border-gray-700 p-2 overflow-hidden">
                <textarea
                  readOnly
                  value={currentOutput}
                  className="w-full h-full bg-transparent text-gray-300 font-mono text-xs resize-none focus:outline-none p-2"
                  placeholder="Data URL will appear here..."
                />
              </div>

              <div className="flex justify-end mt-4">
                <CopyBtn
                  copyText={currentOutput}
                  btnText="Copy Data URL"
                  styles={{ width: "200px" }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Upload an image to generate Data URL
            </div>
          )}
        </div>
      </ToolBox>
    </ToolBoxLayout>
  );
};

export default ImageToDataUrl;
