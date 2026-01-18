"use client";

import {
    createContext,
    useState,
    ReactNode,
    useContext
} from "react";
import Cookies from "js-cookie";

interface DataUser {
    userId: number | null;
}

interface AuthContextType {
    userData: DataUser | null;
    login: (payload: DataUser) => void;
    logout: (redirectTo?: string) => void;
    isLoading: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserDataFromCookies = (): DataUser | null => {
    const userId = Cookies.get("ID");

    if (!userId) return null;

    return {
        userId: Number(userId)
    };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userData, setUserData] = useState<DataUser | null>(() => getUserDataFromCookies());
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const cookieOptions = {
        sameSite: "lax" as const,
        secure: false,
        expires: 7
    };

    const login = (payload: DataUser) => {
        setIsLoading(true);
        setUserData(payload);

  
        Cookies.set("ID", String(payload.userId), cookieOptions);

        setIsLoading(false);
    };

    const logout = (redirectTo?: string) => {
        setIsLoading(true);
        setUserData(null);

        // 🔥 نمسح بس userId
        Cookies.remove("ID");

        setIsLoading(false);

        window.location.href = redirectTo ?? "/";
    };

    return (
        <AuthContext.Provider value={{ userData, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
