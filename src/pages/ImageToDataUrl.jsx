import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import ToolBoxLayout from "@/common/ToolBoxLayout";
import ToolBox from "@/common/ToolBox";
import Btn from "@/common/BasicBtn";
import CopyBtn from "@/common/CopyBtn";
import cn from "@/utils/cn";
import useLocalStorageState from "@/hooks/useLocalStorageState";

const ImageToDataUrl = () => {
   const [state, setPersistedState] = useLocalStorageState("ImageToDataUrl:state", {
      fileInfo: null,
      dataUrl: "",
      svgUrlEncoded: "",
      outputType: "base64",
   });

   const [isDragOver, setIsDragOver] = useState(false);
   const fileInputRef = useRef(null);

   const { fileInfo, dataUrl, svgUrlEncoded, outputType } = state;

   const RECOMMENDED_SIZE_BYTES = 200 * 1024; // 200KB
   const SUPPORTED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
   ];

   const updateState = (updates) => {
      try {
         setPersistedState({ ...state, ...updates });
      } catch (error) {
         console.error("Failed to save state to local storage:", error);
         toast.error("Storage full? Failed to save state.");
      }
   };

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
         processFile(selectedFile);
      }
   };

   const readDataURL = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });

   const readText = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
   });

   const processFile = async (selectedFile) => {
      if (!SUPPORTED_TYPES.includes(selectedFile.type)) {
         toast.error(
            "Unsupported file type. Please select PNG, JPG, GIF, WEBP, or SVG."
         );
         return;
      }

      const newFileInfo = {
         name: selectedFile.name,
         size: selectedFile.size,
         type: selectedFile.type,
      };

      try {
         const [base64, text] = await Promise.all([
            readDataURL(selectedFile),
            selectedFile.type === "image/svg+xml" ? readText(selectedFile) : Promise.resolve(null)
         ]);

         let encoded = "";
         if (text) {
            encoded = "data:image/svg+xml," +
               encodeURIComponent(text)
                  .replace(/'/g, "%27")
                  .replace(/"/g, "%22");
         }

         setPersistedState({
            fileInfo: newFileInfo,
            dataUrl: base64,
            svgUrlEncoded: encoded,
            outputType: "base64",
         });

      } catch (e) {
         console.error(e);
         toast.error("Error reading file.");
      }
   };

   const handleClear = () => {
      setPersistedState({
         fileInfo: null,
         dataUrl: "",
         svgUrlEncoded: "",
         outputType: "base64",
      });
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

   // Drag and Drop Handlers
   const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragOver(false);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
         processFile(files[0]);
      }
   };

   const isLargeFile = fileInfo && fileInfo.size > RECOMMENDED_SIZE_BYTES;
   const isSvg = fileInfo && fileInfo.type === "image/svg+xml";

   const currentOutput =
      outputType === "url-encoded" && isSvg ? svgUrlEncoded : dataUrl;

   const isValidDataUrl = (url) => {
      if (!url) return false;
      const pattern = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;
      return pattern.test(url);
   };

   const isValidPreview = isValidDataUrl(dataUrl);

   return (
      <ToolBoxLayout height="97vh">
         <ToolBox title="Input Image" mainClass="h-[98%]" >
            <div
               className="flex flex-col gap-4 h-full"
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
            >
               {/* Input Area */}
               {!fileInfo ? (
                  <div
                     className={cn(
                        "flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer",
                        isDragOver ? "border-indigo-500 bg-indigo-500/10" : "border-gray-600 hover:border-gray-400"
                     )}
                     onClick={() => fileInputRef.current?.click()}
                  >
                     <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                     />
                     <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-300 text-lg">
                           Drag & Drop or Click to Select Image
                        </p>
                        <p className="text-gray-400 text-sm">
                           Supported: PNG, JPG, GIF, WEBP, SVG
                        </p>
                        <p className="text-gray-500 text-xs">
                           Recommended size: &lt; 200KB
                        </p>
                        <Btn
                           btnText="Select Image"
                           onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                           }}
                           classNames="!w-48 mt-2"
                        />
                     </div>
                  </div>
               ) : (
                  <>
                     <div
                        className={cn(
                           "p-4 border-2 h-[300px] flex items-center justify-center border-dashed border-gray-600 rounded-lg text-center hover:border-gray-400 transition-colors relative",
                           isDragOver && "border-indigo-500 bg-indigo-500/10"
                        )}
                        onDrop={handleDrop}
                     >
                        <input
                           type="file"
                           accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                           onChange={handleFileChange}
                           ref={fileInputRef}
                           className="hidden"
                        />
                        <div>
                           <div className="text-gray-300 text-sm mb-2">
                              Drag & drop to replace or
                           </div>
                           <Btn
                              btnText="Replace Image"
                              onClick={() => fileInputRef.current?.click()}
                              classNames="!w-48"
                           />
                        </div>
                     </div>

                     <div className="flex-row gap-6 flex-grow border border-white/80 max-h-[350px] rounded-xl p-10">
                        <div className="w-full w-2/3 space-y-3">
                           <h3 className="text-xl font-semibold text-white">Image Info</h3>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-gray-400">Name:</div>
                              <div className="text-white truncate" title={fileInfo.name}>{fileInfo.name}</div>

                              <div className="text-gray-400">Size:</div>
                              <div className={cn("text-white", isLargeFile ? "text-yellow-400 font-bold" : "")}>
                                 {formatFileSize(fileInfo.size)}
                              </div>

                              <div className="text-gray-400">Type:</div>
                              <div className="text-white">{fileInfo.type}</div>
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

                     <div className="flex items-center justify-center border border-white rounded-lg !p-4 !max-h-[500px]">
                        {isValidPreview && (
                           <img
                              src={dataUrl}
                              alt="Preview"
                              className="object-contain !max-h-[500px]"
                           />
                        )}
                     </div>
                  </>
               )}
            </div>
         </ToolBox>

         <ToolBox title="Data URL Output" mainClass="h-[98%]" controlsPositionEnd  controls={
            <CopyBtn
               copyText={currentOutput}
               btnText="Copy Data URL"
            />
         }>
            <div className="flex flex-col h-full">
               {fileInfo ? (
                  <>
                     {isSvg && (
                        <div className="flex gap-4 mb-4 border-b border-gray-700 pb-2">
                           <button
                              onClick={() => updateState({ outputType: "base64" })}
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
                              onClick={() => updateState({ outputType: "url-encoded" })}
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

                     <div className="relative flex-grow min-h-[200px] border border-gray-700 overflow-hidden">
                        <Editor
                           height="100%"
                           defaultLanguage="text"
                           value={currentOutput}
                           theme="vs-dark"
                           options={{
                              readOnly: true,
                              wordWrap: "on",
                              minimap: { enabled: false },
                              padding: { top: 16, bottom: 16 },
                           }}
                        />
                     </div>
                  </>
               ) : (
                  <div className="relative flex-grow h-full border border-gray-700 overflow-hidden">
                     <Editor
                        height="100%"
                        defaultLanguage="text"
                        value="// Select image to get the text"
                        theme="vs-dark"
                        options={{
                           readOnly: true,
                           wordWrap: "on",
                           minimap: { enabled: false },
                           padding: { top: 16, bottom: 16 },
                        }}
                     />
                  </div>
               )}
            </div>
         </ToolBox>
      </ToolBoxLayout>
   );
};

export default ImageToDataUrl;
