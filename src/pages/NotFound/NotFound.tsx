import Button from "@/components/ui/Button/Button";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 16,
      }}
    >
      <SearchX size={64} color="var(--text-disabled)" />
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        Страница не найдена
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        Запрашиваемая страница не существует
      </p>
      <Button onClick={handleGoBack} variant="primary" style={{ marginTop: 8 }}>
        Вернуться назад
      </Button>
    </div>
  );
};

export default NotFound;
