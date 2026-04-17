import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login/Login";
import Home from "@pages/Home/Home";
import Users from "@pages/Users/Users";
import Layout from "@components/layout/Layout/Layout";
import { token } from "@lib/token";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!token.getAccess()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
