import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "API Error occurred"
    );
  }

  return "Unexpected error occurred";
}