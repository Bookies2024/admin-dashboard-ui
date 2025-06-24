/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV, POST_REQ_TYPES } from "../../util/constants"
import { apiSlice } from "../services/api-slice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ city, password }) => ({
        url: `?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.AUTH}`,
        method: "POST",
        body: JSON.stringify({ city, password }),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useLoginMutation } = authApiSlice
