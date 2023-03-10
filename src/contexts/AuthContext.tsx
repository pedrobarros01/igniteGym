import { UserDTO } from "@dtos/UserDto";
import { api } from "@services/api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";
export type AuthContextDataProps = {
    user: UserDTO;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>;
    refreshedToken: string;
}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [refreshedToken, setRefresehedToken] = useState("");
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string){
        try{

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(userData);
        }catch(error){
            throw error;
        }

    }
    async function storageUserAndTokenSave(userData: UserDTO, token: string){
        try{
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData);
            await storageAuthTokenSave(token);
        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
        
    }

    async function signIn(email: string, password: string){
        try{
            const {data} = await api.post("/sessions", {email, password});
            if(data.user && data.token){
                await storageUserAndTokenSave(data.user, data.token);
                userAndTokenUpdate(data.user, data.token);
            }

        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut(){
        try{
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();
        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(userUpdated: UserDTO){
        try{
            setUser(userUpdated);
            await storageUserSave(userUpdated);

        }catch(error){
            throw error;
        }
    }

    async function loadUserData(){
        try{
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();
            if(userLogged && token){
                userAndTokenUpdate(userLogged, token);
            }

        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }
    function refreshTokenUpdated(newToken: string){
        setRefresehedToken(newToken);
    }

    useEffect(() => {
        loadUserData();
    }, []);
    useEffect(() => {
        const subscribe = api.registerInterceptManager({signOut, refreshTokenUpdated});
        return () => {
            subscribe();
        }
    }, [signOut])

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            isLoadingUserStorageData,
            signOut,
            updateUserProfile,
            refreshedToken
          }}>
            {children}
          </AuthContext.Provider>
    );
}