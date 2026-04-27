import type { CallState } from "./CallManager";
import type { SipConnectionStatus } from "./SipConnection";

export const mapConnStatus = (
  s: SipConnectionStatus,
): "Не подключен" | "Подключен" | "Зарегистрирован" | "Ошибка" => {
  switch (s) {
    case "disconnected":
      return "Не подключен";
    case "connected":
      return "Подключен";
    case "registered":
      return "Зарегистрирован";
    case "error":
      return "Ошибка";
    default:
      return "Ошибка";
  }
};

export const mapCallState = (s: CallState) => {
  switch (s) {
    case "idle":
      return "Ожидание";
    case "incoming":
      return "Входящий вызов";
    case "outgoing":
      return "Набор...";
    case "active":
      return "Разговор";
    case "error":
      return "Ошибка: неверный номер";
    default:
      return s;
  }
};
