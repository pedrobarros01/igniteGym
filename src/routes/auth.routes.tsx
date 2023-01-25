import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SigIn } from "@screens/SigIn";
import { SigUp } from "@screens/SignUp";

type AuthRoutes = {
    signIn: undefined;
    signUp: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();


export function AuthRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}} >
            <Screen 
            name="signIn"
            component={SigIn}
            />
            <Screen 
            name="signUp"
            component={SigUp}
            />
        </Navigator>
    );
}