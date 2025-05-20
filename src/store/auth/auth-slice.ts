import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type config = {
    Type: string,
    Value: string,
    Key: string,
    ["Footer Image"]?: string
}

interface AuthStateType {
    isLoggedIn: boolean;
    config: config[] | null,
    city: string | null
}

const initialState: AuthStateType = {
    isLoggedIn: false,
    config: null,
    city: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setConfig: (state, { payload }) => {
            const { config, city } = payload
            state.config = config
            state.city = city;
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.config = null;
            state.city = null;
            state.isLoggedIn = false;
        }
    }
})

export const { setConfig, logout } = authSlice.actions
export default authSlice.reducer

export const selectCurrentConfig = (state: RootState) => state.auth.config
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn