import { useState } from "react";

export function UseProgressValue() {
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const showProgressValues = () => {
    setShowProgress(true);
    setProgress(0);

    let showDummyProgress = 0;
    const progressInterval = setInterval(() => {
      showDummyProgress += 8;
      setProgress(showDummyProgress);
      if (showDummyProgress >= 95) clearInterval(progressInterval); // Stop at 90%
    }, 500);

    return progressInterval; // Return interval to clear it later
  };

  const hideProgress = (progressInterval) => {
    clearInterval(progressInterval);
    setProgress(100); // Immediately jump to 100%
    setTimeout(() => {
      setShowProgress(false);
      setProgress(0);
    }, 500);
  };

  return { showProgress, progress, showProgressValues, hideProgress };
}
