import { useCallback } from 'react';

/**
 * Custom hook for opening a link in a new tab
 * @returns {Function} Function to open link in new tab
 * @param {string} url - The URL to open in new tab
 * @param {boolean} newTab - Whether to open link in new tab
 */

export default function useOpenLink(url, newTab = true) {

   const openLink = () => {

      if (url) {
         // Open link in new tab if specified
         if (newTab) {
            window.open(url, '_blank');
         } else {
            // Open link in current tab
            window.location.href = url;
         }
      } else {
         console.error('URL is required to open');
      }
   }

   return openLink;
};