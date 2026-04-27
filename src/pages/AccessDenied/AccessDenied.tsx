import { Lock } from "lucide-react";

const AccessDenied = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
    <Lock size={64} color="var(--text-disabled)" />
    <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)" }}>Доступ запрещён</h2>
    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>У вас нет прав для просмотра этой страницы</p>
  </div>
);

export default AccessDenied;
