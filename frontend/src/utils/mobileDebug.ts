// Mobile debugging utilities

// Extend Window interface for TypeScript
declare global {
  interface Window {
    mobileErrors?: any[];
  }
}

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
  if ((window as any).mobileErrors) {
    (window as any).mobileErrors.push(errorInfo);
  } else {
    window.mobileErrors = [errorInfo];
  }
  
  return errorInfo;
};

export const getMobileErrors = () => {
  return window.mobileErrors || [];
};

// Initialize error collection
if (typeof window !== 'undefined') {
  window.mobileErrors = [];
}
