import { useEffect } from "react";
import useFlashStore from "../store/useFlashStore";

function FlashMessage() {
  const { flashMessage, clearFlash } = useFlashStore();

  // Auto-hide after 3 seconds
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => clearFlash(), 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [flashMessage, clearFlash]);

  if (!flashMessage) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-medium transition-all z-50
        ${flashMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}
      onClick={clearFlash} // click to dismiss
    >
      {flashMessage.text}
    </div>
  );
}

export default FlashMessage;
