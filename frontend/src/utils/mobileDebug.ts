// Mobile debugging utilities
export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const logMobileError = (context: string, error: any) => {
  const errorInfo = {
    context,
    message: error.message,
    code: error.code,
    stack: error.stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    isMobile: isMobile(),
    localStorage: (() => {
      try {
        return Object.keys(localStorage).length;
      } catch {
        return 'blocked';
      }
    })(),
    cookies: document.cookie ? 'enabled' : 'disabled'
  };
  
  console.error('Mobile Debug Error:', errorInfo);
  
  // Send to a simple error collection (you can check browser dev tools)
  if (window.mobileErrors) {
    window.mobileErrors.push(errorInfo);
  } else {
    (window as any).mobileErrors = [errorInfo];
  }
  
  return errorInfo;
};

export const getMobileErrors = () => {
  return (window as any).mobileErrors || [];
};

// Initialize error collection
if (typeof window !== 'undefined') {
  (window as any).mobileErrors = [];
}
