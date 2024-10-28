import { useEffect, useState } from "react";

declare global {
  interface Window {
    MSStream?: unknown; // Use 'unknown' type for better type safety
  }
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Check if the device is iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    // Check if the app is in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  useEffect(() => {
    // Only show alert if the app is not in standalone mode and the user hasn't been prompted before
    const hasPrompted = localStorage.getItem("installPrompted");

    if (!isStandalone && !hasPrompted) {
      const alertMessage = isIOS
        ? 'To install this app on your iOS device, tap the share button ⎋ and then "Add to Home Screen" ➕.'
        : 'To install this app, you can use the "Add to Home Screen" option in your browser.';

      alert(alertMessage);

      // Set the item in local storage to avoid prompting again
      localStorage.setItem("installPrompted", "true");
    }
  }, [isStandalone, isIOS]);

  return null; // No need to render anything in the component
}
