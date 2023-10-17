import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../lib/data";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"], // helps with caching
  endpoints: (builder) => ({}),
});
