import React, { useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";

function Apis() {
    const editorRef = useRef(null);

    useEffect(() => {
        const editorElement = editorRef.current;

        // Check if the editor reference is available
        if (editorElement) {
            // Add event listener for keydown event
            editorElement.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            if (editorElement) {
                editorElement.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    function handleKeyDown(event) {
        // Check if Ctrl + ; is pressed
        if (event.ctrlKey && event.key === ';') {
            // Prevent the default behavior of Ctrl + ; (e.g., inserting a semicolon)
            // event.preventDefault();

            // Call your specific function here
            handleCtrlSemicolon();
        }
    }

    function handleCtrlSemicolon() {
        // Your function logic here
        console.log('Ctrl + ; pressed inside Monaco Editor');
    }

    return (
        <>
            <div>
                <Editor
                    height="400px"
                    defaultLanguage="javascript"
                    defaultValue="// Start editing your code here!"
                    onMount={(editor) => {
                        editorRef.current = editor._domElement;
                    }}
                />
            </div>
            <div>sabeer bikba</div>
        </>
    );
}

export default Apis;
