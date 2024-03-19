import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './output.css';

// document.body.innerHTML = '<div id="root"></div>'; //remove all other body elements inside html body
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);