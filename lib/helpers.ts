import { isAxiosError } from "axios";

export const filterError = (err: unknown): string => {
  const def = "Something went wrong";

  return isAxiosError(err)
    ? (err.response?.data?.error ?? err.response?.data ?? def)
    : def;
};
