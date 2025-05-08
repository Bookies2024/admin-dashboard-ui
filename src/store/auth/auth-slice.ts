import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type config = {
    type: string,
    value: string,
    key: string,
}

interface AuthStateType {
    isLoggedIn: boolean;
    config: config[] | null
}

const initialState: AuthStateType = {
    isLoggedIn: false,
    config: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setConfig: (state, { payload }) => {
            const { config } = payload
            state.config = config
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.config = null;
            state.isLoggedIn = false
        }
    }
})

export const { setConfig, logout } = authSlice.actions
export default authSlice.reducer

export const selectCurrentConfig = (state: RootState) => state.auth.config
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn