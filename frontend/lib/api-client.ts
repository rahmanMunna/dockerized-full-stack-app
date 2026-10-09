import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `Request failed with status ${error.response.status}`;
    }
    if (error.request) {
      return "Unable to reach the server. Please try again later.";
    }
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}
