import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

function Apis() {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        // Store the editor instance in the ref
        editorRef.current = editor;
    }

    function focusEditor() {
        if (editorRef.current) {
            editorRef.current.focus();
            editorRef.current.revealLineInCenter(1); // Focus on line number  1
        }
    }

    return (
        <div>
            <MonacoEditor
                onMount={handleEditorDidMount}
                height={'400px'}
            // Other props for MonacoEditor component
            />
            <button onClick={focusEditor}>Focus Editor</button>
        </div>
    );
}

export default Apis;
