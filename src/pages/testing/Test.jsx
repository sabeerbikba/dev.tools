import { useState } from 'react';

function Test() {
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [saveInput, setSaveInput] = useState('');

    const handleInputChange = (event) => {
        setCommand(event.target.value);
        setSaveInput(event.target.value); // Update saveInput whenever input changes
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
            if (historyIndex < history.length - 1) {
                setHistoryIndex(historyIndex + 1);
                setCommand(history[historyIndex + 1]);
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex > 0) {
                setHistoryIndex(historyIndex - 1);
                setCommand(history[historyIndex - 1]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand(saveInput); // Set command to saved input when history is at 0
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (command.trim() !== '') {
            setHistory([command, ...history]);
            setHistoryIndex(-1);
            setCommand('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={command}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter command..."
            />
            <button type="submit">Submit</button>
            <ol className='text-white'>
                <li>need to test localstorge how removeing value with lowest value</li>
                <li>need to use local storage for array and test it </li>
            </ol>
        </form>
    );
}

export default Test;
