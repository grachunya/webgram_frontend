import { SearchX } from "lucide-react";

const NotFound = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
    <SearchX size={64} color="var(--text-disabled)" />
    <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)" }}>Страница не найдена</h2>
    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Запрашиваемая страница не существует</p>
  </div>
);

export default NotFound;
