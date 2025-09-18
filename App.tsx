import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { RootStackParamList } from './types/navigation';


// Import screens
import NotFoundScreen from './app/+not-found';
import AdotarScreen from './app/adotar';
import AjudarScreen from './app/ajudar';
import CadastrarAnimalScreen from './app/cadastrar-animal';
import CadastrarPessoaScreen from './app/cadastrar-pessoa';
import FinalizarProcessoScreen from './app/finalizar-processo';
import HomeScreen from './app/home';
import IndexScreen from './app/index';
import LoginScreen from './app/login';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
    Roboto_400Regular: require('./assets/fonts/Roboto-Regular.ttf'),
    Roboto_500Medium: require('./assets/fonts/Roboto-Medium.ttf'),
    Courgette_400Regular: require('./assets/fonts/Courgette-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator 
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" component={IndexScreen} />
        <Stack.Screen 
          name="home" 
          component={HomeScreen}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#ff00ff',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="adotar" component={AdotarScreen} />
        <Stack.Screen name="ajudar" component={AjudarScreen} />
        <Stack.Screen name="cadastrar-animal" component={CadastrarAnimalScreen} />
        <Stack.Screen name="cadastrar-pessoa" component={CadastrarPessoaScreen} />
        <Stack.Screen name="finalizar-processo" component={FinalizarProcessoScreen} />
        <Stack.Screen name="+not-found" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
