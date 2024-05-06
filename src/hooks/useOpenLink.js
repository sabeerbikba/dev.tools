import { useCallback } from 'react';

/**
 * Custom hook for opening a link in a new tab
 * @returns {Function} Function to open link in new tab
 * @param {string} url - The URL to open in new tab
 * @param {boolean} newTab - Whether to open link in new tab
 */

export default function useOpenLink(url, newTab = true) {

   const openLink = useCallback(() => {
      // Check if URL is provided
      if (url) {
         // Open link in new tab if specified
         if (newTab) {
            window.open(url, '_blank');
         } else {
            // Open link in current tab
            window.location.href = url;
         }
      } else {
         // If no URL provided, log error
         console.error('URL is required to open');
      }
   }, []);

   // Return the function to be used in components
   return openLink;
};

// <button className='accordion-panel4WebBtn' onClick={useOpenLink(body.link)}>Visit</button>