import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      toastOptions={{
        duration: 7_000,
      }}
    />
  );
}
