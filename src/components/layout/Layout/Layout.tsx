import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useCurrentUser } from "@hooks/useCurrentUser";
import SipProvider from "@services/sip/SipProvider";
import styles from "./Layout.module.scss";

const LayoutContent = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Layout = () => {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  if (user.agent) {
    return (
      <SipProvider user={user}>
        <LayoutContent />
      </SipProvider>
    );
  }

  return <LayoutContent />;
};

export default Layout;
