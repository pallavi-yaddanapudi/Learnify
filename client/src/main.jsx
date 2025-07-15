import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/ui/LoadingSpinner";

import { MantineProvider } from "@mantine/core";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <MantineProvider>
        <Custom>
          <App />
        </Custom>
        <Toaster />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
