import Hamburger from '@/components/Hamburger';
import { auth } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  onAuthStateChanged(auth, setCurrentUser);
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };


// dentro do componente Home, após `const navigation = useNavigation<...>();`

  const navigateIfAuthenticated = (
    screenName: keyof RootStackParamList,
    opts?: { confirmMessage?: string; loginButtonLabel?: string; cancelButtonLabel?: string }
  ) => {
    const { confirmMessage = 'Você precisa estar logado para acessar esta funcionalidade.', loginButtonLabel = 'Entrar', cancelButtonLabel = 'Cancelar' } = opts ?? {};
    const isLoggedIn = Boolean(auth.currentUser);

    if (isLoggedIn) {
      navigation.navigate(screenName);
      return;
    }

    // não está logado -> apenas mostra alerta; navegação só se o usuário escolher Entrar
    Alert.alert(
      'Acesso restrito',
      confirmMessage,
      [
        {
          text: cancelButtonLabel,
          style: 'cancel',
        },
        {
          text: loginButtonLabel,
          onPress: () => navigation.navigate('login'),
        },
      ],
      { cancelable: true }
    );
  };


  const ActionButton = ({ label, screenName }: { label: string; screenName: keyof RootStackParamList }) => (
    <TouchableOpacity 
      style={styles.actionButton} 
      activeOpacity={0.8}
      onPress={() => navigateIfAuthenticated(screenName)}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  const DrawerLink = ({ label, screenName }: { label: string; screenName: keyof RootStackParamList }) => (
    <TouchableOpacity 
      style={styles.drawerLink} 
      onPress={() => {
        closeDrawer();
        setTimeout(() => navigateIfAuthenticated(screenName), 120);
      }}
    >
      <Text style={styles.drawerLinkText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeDrawer();
      navigation.replace('login');
    } catch (e) {
      // no-op
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <StatusBar style="dark" backgroundColor="#f7a800" />
      <View style={styles.header}>
        <Hamburger onPress={openDrawer} />
      </View>

      <View style={styles.main}>
        <Text style={styles.greeting}>Olá!!!</Text>

        <View style={styles.actions}>
          <ActionButton label="Adotar" screenName="adotar" />
          <ActionButton label="Ajudar" screenName="ajudar" />
          <ActionButton label="Cadastrar Animal" screenName="cadastrar-animal" />

          {/* Cadastrar Pessoa: acesso aberto (sem checagem) */}
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('cadastrar-pessoa')}
          >
            <Text style={styles.actionButtonText}>Cadastrar Pessoa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity 
          accessibilityRole="button" 
          accessibilityLabel="Ir para login"
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.login}>login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Image
          source={require('@/assets/images/logo-tipo.png')}
          style={styles.brand}
        />
      </View>

      {drawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX }] }] }>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={closeDrawer} accessibilityRole="button" accessibilityLabel="Fechar menu">
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.drawerContent}>
              <DrawerLink label="Adotar" screenName="adotar" />
              <DrawerLink label="Ajudar" screenName="ajudar" />
              <DrawerLink label="Cadastrar Animal" screenName="cadastrar-animal" />
              <DrawerLink label="Cadastrar Pessoa" screenName="cadastrar-pessoa" />
              {currentUser && (
                <TouchableOpacity style={styles.drawerLink} onPress={handleLogout} accessibilityRole="button" accessibilityLabel="Sair">
                  <Text style={styles.drawerLinkText}>Sair</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    gap: 56,
  },
  header: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    gap: 52,
  },
  greeting: {
    fontSize: 72,
    fontWeight: '700',
    fontFamily: 'Courgette_400Regular',
    color: '#ffd358'
  },
  actions: {
    width: '100%',
    gap: 12,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    width: 232,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: '#434343',
    backgroundColor: '#ffd358'
  },
  actionButtonText: {
    color: '#434343',
    fontSize: 12,
    fontWeight: '600',
  },
  login: {
    alignItems: 'center',
    fontSize: 16,
    color: '#88c9bf'
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  brand: {
    width: 122,
    height: 44,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeText: {
    fontSize: 16,
    color: '#007AFF',
  },
  drawerContent: {
    padding: 20,
    gap: 16,
  },
  drawerLink: {
    paddingVertical: 14,
  },
  drawerLinkText: {
    fontSize: 18,
  },
});


