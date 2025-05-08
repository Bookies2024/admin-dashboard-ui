import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://google.com',
        prepareHeaders: (headers) => {
            return headers
        }
    }),
    endpoints: () => ({}),
}) 