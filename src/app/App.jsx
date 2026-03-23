import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes.jsx";
import { AppProvider } from "./context/AppContext.jsx";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
