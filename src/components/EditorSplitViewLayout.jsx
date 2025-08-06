import { useState } from "react";
import PropTypes from "prop-types";

import cn from "@/utils/cn";
import useMediaQuery from "@/hooks/useMediaQuery";

const EditorSplitViewLayout = ({ editorBtns, editor, preview }) => {
  const [enabledEditor, setEnabledEditor] = useState(true);
    const isMobile = useMediaQuery("max-width: 640px");

  const btnsBaseClass =
    "flex justify-around h-[5%] [&>button]:w-[30%] [&>button]:h-[92%] [&>button]:rounded-sm [&>button]:cursor-pointer";

  return (
    <div className="sm:flex size-full">
      <div
        className={cn(
          "sm:w-1/2 max-sm:w-full sm:h-full max-sm:h-[80%] flex flex-col bg-[#808080cc]",
          enabledEditor || isMobile && "hidden h-0"
        )}
      >
        <div className={cn(btnsBaseClass, "max-sm:hidden")}>{editorBtns}</div>
        <div className="max-sm:h-full sm:h-[95%] max-sm:border-b max-sm:border-white">
          {editor}
        </div>
      </div>
      <div
        className={cn(
          "sm:w-1/2 max-sm:w-full sm:h-full max-sm:h-[80%] text-white max-sm:border-b max-sm:border-white",
          !enabledEditor || isMobile && "hidden"
        )}
      >
        {preview}
      </div>
      <div className={cn(btnsBaseClass, "sm:hidden mt-1")}>{editorBtns}</div>
      <div className="flex justify-end items-center h-10 pt-2 mr-8 sm:hidden">
        <span>Editor</span>
        <div
          onClick={() => setEnabledEditor((prev) => !prev)}
          className={`mx-2 w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            !enabledEditor ? "bg-indigo-500" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              !enabledEditor ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
        <span>Preview</span>
      </div>
    </div>
  );
};
EditorSplitViewLayout.PropTypes = {
  editorBtns: PropTypes.element.isRequired,
  editor: PropTypes.element.isRequired,
  preview: PropTypes.element.isRequired,
};

export default EditorSplitViewLayout;
