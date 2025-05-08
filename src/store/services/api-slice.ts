import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://google.com',
        prepareHeaders: (headers) => headers
    }),
    endpoints: () => ({}),
}) 