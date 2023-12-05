// customToast.ts
import hotToast, { ToastOptions } from 'react-hot-toast';
import DeviceSafeArea from '../classes/DeviceSafeArea'; // Adjust the import path based on your file structure

// Function to adjust options for safe area
const adjustOptionsForSafeArea = (options?: ToastOptions): ToastOptions => {
    const insets = DeviceSafeArea.safeAreaInsets; // Assuming this is a static getter
    if (insets.top > 0) {
        return { ...(options || {}), style: { ...(options?.style || {}), marginTop: `${insets.top}px` } };
    }
    return options || {};
};

// Creating a wrapper for each toast method
const customToast = {
    ...hotToast, // Spread all existing methods
    success: (message: string, options?: ToastOptions) => hotToast.success(message, adjustOptionsForSafeArea(options)),
    error: (message: string, options?: ToastOptions) => hotToast.error(message, adjustOptionsForSafeArea(options)),
    loading: (message: string, options?: ToastOptions) => hotToast.loading(message, adjustOptionsForSafeArea(options)),
    custom: (message: string, options?: ToastOptions) => hotToast.custom(message, adjustOptionsForSafeArea(options)),
    // You can continue to add other methods as needed
};

export default customToast;

