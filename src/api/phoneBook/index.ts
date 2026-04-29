import { api } from "@lib/api";

export interface PhoneBook {
  number_uuid: string;
  number_name: string;
  number_number: string;
}

export type CreatePhoneBook = PhoneBook;

export type UpdatePhoneBook = PhoneBook;

export const getNumbers = () =>
  api.get<PhoneBook[]>("/numbers").then((r) => r.data);

export const createNumber = (payload: CreatePhoneBook) =>
  api.post<PhoneBook>("/numbers", payload).then((r) => r.data);

export const updateNumber = (payload: UpdatePhoneBook) =>
  api
    .put<PhoneBook>(`/numbers/${payload.number_uuid}`, payload)
    .then((r) => r.data);

export const deleteNumber = (uuid: string) => api.delete(`/numbers/${uuid}`);
