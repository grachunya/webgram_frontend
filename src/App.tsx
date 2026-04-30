import Layout from "@components/layout/Layout/Layout";
import { useCurrentUser } from "@hooks/useCurrentUser";
import AccessDenied from "@pages/AccessDenied/AccessDenied";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import NotFound from "@pages/NotFound/NotFound";
import Operators from "@pages/Operators/Operators";
import Users from "@pages/Users/Users";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import HistoryCall from "./pages/HistoryCall/HistoryCall";
import PhoneBookPage from "./pages/PhoneBook/PhoneBook";
import { useAppDispatch } from "./store/hooks";
import { fetchCurrentUser } from "./store/slices/userSlice";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, isInitialized } = useCurrentUser();

  useEffect(() => {
    if (!isInitialized && !data) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized, data]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Загрузка...</div>
      </div>
    );
  }
  if (isError || !data) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleGuard = ({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) => {
  const { data: user } = useCurrentUser();

  if (user?.role?.role_name !== role)
    return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter basename={"/app"}>
    <Routes>
      <Route path="/" element={<Navigate to="login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <AuthGate>
            <Layout />
          </AuthGate>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/phone-book" element={<PhoneBookPage />} />
        <Route path="/history-call" element={<HistoryCall />} />
        <Route
          path="/users"
          element={
            <RoleGuard role="superadmin">
              <Users />
            </RoleGuard>
          }
        />
        <Route
          path="/operators"
          element={
            <RoleGuard role="superadmin">
              <Operators />
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
