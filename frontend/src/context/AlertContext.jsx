import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "ตกลง",
    cancelText: "ยกเลิก",
    showCancel: false,
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = useCallback((options) => {
    return new Promise((resolve) => {
      let title = "";
      let message = "";
      
      // Support string or object
      if (typeof options === "string") {
        message = options;
        title = "แจ้งเตือน";
      } else {
        title = options.title || "แจ้งเตือน";
        message = options.message || "";
      }

      setAlertConfig({
        show: true,
        title,
        message,
        confirmText: options.confirmText || "ตกลง",
        cancelText: options.cancelText || "ยกเลิก",
        showCancel: options.showCancel || false,
        onConfirm: () => {
          setAlertConfig((prev) => ({ ...prev, show: false }));
          resolve(true);
        },
        onCancel: () => {
          setAlertConfig((prev) => ({ ...prev, show: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Custom Tailwind Modal */}
      {alertConfig.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{alertConfig.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed whitespace-pre-line">
                {alertConfig.message}
              </p>
              <div className="flex w-full gap-3">
                {alertConfig.showCancel && (
                  <button
                    onClick={alertConfig.onCancel}
                    className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {alertConfig.cancelText}
                  </button>
                )}
                <button
                  onClick={alertConfig.onConfirm}
                  className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-500/30"
                >
                  {alertConfig.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
