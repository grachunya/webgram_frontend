import { useCurrentUser } from "@hooks/useCurrentUser";
import OperatorPanelProvider from "@services/operatorPanel/OperatorPanelProvider";
import SipProvider from "@services/sip/SipProvider";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { IncomingCallOverlay } from "../IncomingCallOverlay/IncomingCallOverlay";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.scss";

const LayoutContent = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <OperatorPanelProvider>
      <IncomingCallOverlay />
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
    </OperatorPanelProvider>
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
