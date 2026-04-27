export type SipStatus =
  | "Не подключен"
  | "Подключен"
  | "Зарегистрирован"
  | "Ошибка";

export type CallStatus =
  | "Ожидание"
  | "Входящий вызов"
  | "Набор..."
  | "Разговор"
  | "Ошибка: неверный номер";

export type SipCallbacks = {
  onStatusChange?: (status: SipStatus) => void;
  onCallStatusChange?: (status: CallStatus) => void;
  onIncomingCall?: (caller: string) => void;
  onError?: (error: string) => void;
  onCallEnd?: () => void;
};
