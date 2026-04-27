import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login/Login";
import Home from "@pages/Home/Home";
import Users from "@pages/Users/Users";
import AccessDenied from "@pages/AccessDenied/AccessDenied";
import NotFound from "@pages/NotFound/NotFound";
import Layout from "@components/layout/Layout/Layout";
import { useCurrentUser } from "@hooks/useCurrentUser";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useCurrentUser();

  if (isLoading) return null;
  if (isError || !data) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleGuard = ({ role, children }: { role: string; children: React.ReactNode }) => {
  const { data: user } = useCurrentUser();

  if (user?.role?.role_name !== role) return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <AuthGate>
            <Layout />
          </AuthGate>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route
          path="/users"
          element={
            <RoleGuard role="superadmin">
              <Users />
            </RoleGuard>
          }
        />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
