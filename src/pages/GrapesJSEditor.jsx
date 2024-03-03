import { useRef, useEffect } from 'react';
import gjsblockbasic from 'grapesjs-blocks-basic'
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
import gjsForms from 'grapesjs-plugin-forms';
import gjsLorySlider from 'grapesjs-lory-slider'
import gjsTabs from 'grapesjs-tabs'
import customCodePlugin from 'grapesjs-custom-code';
import plugin2 from 'grapesjs-tui-image-editor';
import plugin3 from 'grapesjs-style-gradient';
import gjsStyleFilter from 'grapesjs-style-filter';
import gjsStyleBg from 'grapesjs-style-bg';
import gjsPluginExport from 'grapesjs-plugin-export';
import 'grapesjs/dist/css/grapes.min.css';

export default function GrapesJSEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: editorRef.current,
      components: '',
      storageManager: true, // Disable storage manager for simplicity
      plugins: [
        plugin3,
        gjsblockbasic,
        gjsPresetWebpage,
        gjsForms,
        gjsPresetNewsletter,
        gjsLorySlider,
        gjsTabs,
        customCodePlugin,
        plugin2,
        gjsStyleFilter,
        gjsStyleBg,
        gjsPluginExport,
      ]
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return <div ref={editorRef} />;
}



// // Import React dependencies
// import React, { useRef, useEffect } from 'react';

// // Import GrapesJS and styles
// import grapesjs from 'grapesjs';
// import 'grapesjs/dist/css/grapes.min.css';

// // Import CodeMirror styles and mode
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css'; // Optional theme
// import 'codemirror/mode/htmlmixed/htmlmixed.js';

// // Import and configure GrapesJS plugins
// import gjsblockbasic from 'grapesjs-blocks-basic';
// import gjsPresetWebpage from 'grapesjs-preset-webpage';
// import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
// import gjsForms from 'grapesjs-plugin-forms';
// import gjsLorySlider from 'grapesjs-lory-slider';
// import gjsTabs from 'grapesjs-tabs';
// import customCodePlugin from 'grapesjs-custom-code';
// import plugin2 from 'grapesjs-tui-image-editor';
// import plugin3 from 'grapesjs-style-gradient';
// import gjsStyleFilter from 'grapesjs-style-filter';
// import gjsStyleBg from 'grapesjs-style-bg';
// import gjsPluginExport from 'grapesjs-plugin-export';
// import grapesjsCodeMirrorButtons from 'grapesjs-plugin-codemirror-with-buttons';

// // Define component for your editor
// export default function GrapesJSEditor() {
//   // Create ref for the editor container
//   const editorRef = useRef(null);

//   // Initialize the editor on mount/update
//   useEffect(() => {
//     const editor = grapesjs.init({
//       // Set the editor container and initial components
//       container: editorRef.current,
//       components: '',
//       storageManager: true, // Disable for simplicity if needed
//       // Define the plugins to be used
//       plugins: [
//         plugin3,
//         gjsblockbasic,
//         gjsPresetWebpage,
//         gjsForms,
//         gjsPresetNewsletter,
//         gjsLorySlider,
//         gjsTabs,
//         customCodePlugin,
//         plugin2,
//         gjsStyleFilter,
//         gjsStyleBg,
//         gjsPluginExport,
//         grapesjsCodeMirrorButtons, // Include CodeMirror plugin with buttons
//       ],
//       // Configure CodeMirror behavior
//       codemirror: {
//         mode: 'htmlmixed', // Set code highlighting mode (e.g., HTML)
//         theme: 'material', // Optional theme for CodeMirror
//         lineNumbers: true, // Show line numbers in the editor
//         tabSize: 4, // Define tab indentation size
//         indentWithTabs: true, // Use tabs for indentation
//         extraKeys: {
//           'Ctrl-Space': 'autocomplete', // Enable autocomplete with Ctrl+Space
//         },
//       },
//       // Define the toolbar layout and elements
//       toolbar: [
//         ['undo', 'redo'], // Standard undo/redo buttons
//         ['styles', 'format'], // Style and formatting options
//         ['select', 'insert'], // Element selection and insertion tools
//         ['layers', 'history'], // Layer management and history tools
//         ['codemirror'], // Add the CodeMirror button (provided by the plugin)
//       ],
//     });

//     // Cleanup editor instance on unmount
//     return () => {
//       editor.destroy();
//     };
//   }, []);

//   // Return the editor container element
//   return <div ref={editorRef} />;
// }
