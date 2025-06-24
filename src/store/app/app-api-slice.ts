import { CONFIG_TYPES, ENV, GET_REQ_TYPES, POST_REQ_TYPES } from "../../util/constants";
import { apiSlice } from "../services/api-slice";

export const appApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: ({ city }) => ({
        url: `?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.STATS}&city=${city}`
      })
    }),
    getAllMembers: builder.query({
      query: ({ city, date, searchKey, page, pageSize, columnFilters = [], sortField, sortOrder }) => {
        const filtersEncoded = encodeURIComponent(JSON.stringify(columnFilters));
        return {
          url: `?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.MEMBERS}&city=${city}&date=${date}&search=${searchKey}&page=${page}&limit=${pageSize}&columnFilters=${filtersEncoded}&sortField=${sortField}&sortOrder=${sortOrder}`
        };
      }
    }),
    getAllSessions: builder.query({
      query: ({ city }) => ({
        url: `?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.SESSIONS}&city=${city}`
      })
    }),
    getCities: builder.query({
      query: () => ({
        url: `?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.CONFIG_KEYS}&type=${CONFIG_TYPES.CITY}`
      })
    }),
    updateConfig: builder.mutation({
      query: (body) => ({
        url: `?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.CONFIG}`,
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      }),
    }),
  })
})

export const {
  useGetStatsQuery,
  useGetAllMembersQuery,
  useGetAllSessionsQuery,
  useGetCitiesQuery,
  useUpdateConfigMutation
} = appApiSlice