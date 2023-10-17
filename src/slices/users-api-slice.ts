import { apiSlice } from "./api-slice";
// all the endpoints

const USERS_URL = "/api/auth";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signin`,
        responseHandler: (response) => response.text(),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = usersApiSlice;
