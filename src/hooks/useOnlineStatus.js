import { useState, useEffect } from 'react';

const useOnlineStatus = () => {
   const [isOnline, setIsOnline] = useState(navigator.onLine);

   useEffect(() => {
      const updateOnlineStatus = () => {
         setIsOnline(navigator.onLine);
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
         window.removeEventListener('online', updateOnlineStatus);
         window.removeEventListener('offline', updateOnlineStatus);
      };
   }, []);

   return isOnline;
};

export default useOnlineStatus;
