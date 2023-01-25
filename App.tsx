import { Loading } from '@components/Loading';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { SigIn } from '@screens/SigIn';
import { NativeBaseProvider } from 'native-base';
import { Text, View, StatusBar } from 'react-native';
import { THEME } from './src/theme';
import { SigUp } from '@screens/SignUp';




export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular,  Roboto_700Bold});
  return (
    <NativeBaseProvider theme={THEME}>
        <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        
        />
        {fontsLoaded ? <SigUp />: <Loading />}
    </NativeBaseProvider>
  );
}

