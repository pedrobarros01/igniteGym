import { AppError } from "@utils/AppError";
import axios, {AxiosInstance} from "axios";
import {storageAuthTokenGet} from "@storage/storageAuthToken";
type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
    registerInterceptManager: (signOut: SignOut) => () => void
};

const api = axios.create({
    baseURL: 'http://localhost:3333'
}) as APIInstanceProps ;

api.registerInterceptManager = signOut => {
    const interceptManager = api.interceptors.response.use(response => response, async requestError => {

        if(requestError?.response?.status === 401){
            if(requestError.response.data?.message === "token.expired" || requestError.response.data?.message === "token.invalid"){
                const oldToken = await storageAuthTokenGet();
                if(!oldToken){
                    signOut();
                    return Promise.reject(requestError);
                }

            }

            signOut();

        }

        if(requestError.response && requestError.response.data){
            return Promise.reject(new AppError(requestError.response.data.message));
        }else{
            return Promise.reject(requestError);
        }
    });
    return () => {
        api.interceptors.response.eject(interceptManager);
    };
}




export {api}