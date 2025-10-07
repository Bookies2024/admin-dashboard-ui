import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ENV } from "../../util/constants"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_ENDPOINT,
        prepareHeaders: (headers) => headers
    }),
    endpoints: () => ({}),
})