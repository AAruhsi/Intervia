import HomePage from "./pages/HomePage";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VisitorPage from "./pages/VisitorPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CallPage from "./pages/Callpage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const App = () => {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VisitorPage />}>
              <Route index element={<HomePage />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="callpage" element={<CallPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClerkProvider>
    </>
  );
};

export default App;
