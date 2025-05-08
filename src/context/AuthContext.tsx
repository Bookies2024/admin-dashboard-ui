import { createContext, ReactNode, useState } from "react";

export type ConfigType = {
    Type: string,
    Key: string,
    Value: string
}

export interface AuthContextType {
    config: ConfigType[],
    setConfig: (value: object) => void,
    isAuthenticated: boolean,
    setIsAuthenticated: (value: boolean) => void,
    currentCity: string,
    setCurrentCity: (value: string) => void,
}

export type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [config, setConfig] = useState<ConfigType[] | null>(null)
    const [currentCity, setCurrentCity] = useState<string | null>(null)

    const contextValue: AuthContextType = {
        config,
        isAuthenticated,
        setIsAuthenticated,
        currentCity, 
        setCurrentCity,
        setConfig
    }
    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
}