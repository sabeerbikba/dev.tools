import { useEffect, Suspense, cloneElement } from "react";
import PropTypes from "prop-types";

// loading spinner
export default function SuspenseWithFallback({ children, fallback = <Fallback />, text = "Loading..." }) {
   const fallbackComponent = cloneElement(fallback, { text });

   return (
      <Suspense fallback={fallbackComponent }>
         {children}
      </Suspense>
   );
}
SuspenseWithFallback.propTypes = {
   children: PropTypes.node.isRequired,
   fallback: PropTypes.node, // lazy or dynamic import not supported with this prop
   text: PropTypes.string,
};

export function Fallback({ text = '', height = '100vh' }) {
   useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
      document.head.appendChild(style);

      return () => {
         document.head.removeChild(style);
      };
   }, []);

   const styles = {
      spinnerStyle: {
         border: '4px solid rgba(0, 0, 0, 0.1)', width: '40px', height: '40px', borderRadius: '50%',
         borderLeftColor: '#09f', animation: 'spin 1s ease infinite', marginBottom: '20px',
      },
      messageStyle: { fontSize: '18px', color: '#ffffff', },
      containerStyle: {
         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
         height, backgroundColor: '#2a2a2a', fontFamily: "'Arial', sans-serif",
      }
   }
   return (
      <div style={styles.containerStyle}>
         <div style={styles.spinnerStyle}></div>
         {text && (<p style={styles.messageStyle}>{text}</p>)}
      </div>
   );
}
Fallback.propTypes = {
   text: PropTypes.string,
   height: PropTypes.string,
};