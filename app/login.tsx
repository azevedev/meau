import { Colors } from '@/constants/Colors';
import { auth } from '@/firebaseConfig';
import type { RootStackParamList } from '@/types/navigation';
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const METRICS = {
  headerHeight: 56,
  headerPaddingH: 16,
  backIconSize: 24,
  buttonHeight: 44,
  fieldGap: 16,
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailLabel, setEmailLabel] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Animated values for label transitions
  const emailLabelAnimation = useRef(new Animated.Value(0)).current;
  const passwordLabelAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation helper functions
  const animateLabel = (animation: Animated.Value, toValue: number) => {
    Animated.timing(animation, {
      toValue,
      duration: 150,
      useNativeDriver: false, // We need to animate layout properties
    }).start();
  };
  
  const handleEmailFocus = () => {
    if (username === '') {
      setEmailLabel(true);
      animateLabel(emailLabelAnimation, 1);
    }
  };
  
  const handleEmailBlur = () => {
    if (username === '') {
      setEmailLabel(false);
      animateLabel(emailLabelAnimation, 0);
    }
  };
  
  const handlePasswordFocus = () => {
    if (password === '') {
      setPasswordLabel(true);
      animateLabel(passwordLabelAnimation, 1);
    }
  };
  
  const handlePasswordBlur = () => {
    if (password === '') {
      setPasswordLabel(false);
      animateLabel(passwordLabelAnimation, 0);
    }
  };
  
  // Redirect away if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('home');
      }
    });
    return unsubscribe;
  }, [navigation]);
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha nome de usuário e senha.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signInWithEmailAndPassword(auth, username.trim(), password);
      console.log('response!!');
      console.log(response);
      navigation.navigate('home');
    } catch (error: any) {
      console.log('error!!');
      console.log(error);
      let message = 'Não foi possível entrar. Tente novamente.';
      const code = error?.code as string | undefined;
      if (code) {
        switch (code) {
          case 'auth/invalid-email':
            message = 'E-mail inválido.';
            break;
          case 'auth/user-disabled':
            message = 'Usuário desativado.';
            break;
          case 'auth/user-not-found':
            message = 'Usuário não encontrado.';
            break;
          case 'auth/wrong-password':
            message = 'Senha incorreta.';
            break;
          case 'auth/too-many-requests':
            message = 'Muitas tentativas. Tente novamente mais tarde.';
            break;
          default:
            message = 'Não foi possível entrar. Tente novamente.';
            break;
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={"#ff00ff"} />

      <View style={[styles.appHeader, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => {}} accessibilityLabel="Menu">
          <Ionicons name="menu" size={METRICS.backIconSize} color={Colors.PRETO_FONTE} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.PRETO_FONTE }]}>Entrar</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.content}>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <TextInput
              style={
                [styles.input, { outline: 'transparent', backgroundColor: '#fafafa', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0}]}
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="default"
              value={username}
              onChangeText={(text) => { setUsername(text); setError(''); }}
              returnKeyType="next"
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
            <Animated.Text style={[
              styles.inputLabel, 
              emailLabel ? styles.labelActive : null,
              {
                top: emailLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, -20], // 22 is approximately 50% of 44px input height
                }),
                left: emailLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 0],
                }),
                color: emailLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#bdbdbd', '#202020'],
                }),
              }
            ]}>
              E-mail
            </Animated.Text>
          </View>

          <View style={styles.fieldGroup}>
            <TextInput
               style={
                [styles.input, { outline: 'transparent', backgroundColor: '#fafafa', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0}]}
              autoCapitalize="none"
              secureTextEntry
              value={password}
              onChangeText={(text) => { setPassword(text); setError(''); }}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <Animated.Text style={[
              styles.inputLabel, 
              passwordLabel ? styles.labelActive : null,
              {
                top: passwordLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, -20], // 22 is approximately 50% of 44px input height
                }),
                left: passwordLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 0],
                }),
                color: passwordLabelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#bdbdbd', '#202020'],
                }),
              }
            ]}>
              Senha
            </Animated.Text>
          </View>
          {Boolean(error) && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
          <TouchableOpacity style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} onPress={handleLogin} activeOpacity={0.8} disabled={isSubmitting}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          <View style={styles.socialWrap}>
            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} activeOpacity={0.85} onPress={() => Alert.alert('Facebook', 'Login com Facebook em breve.') }>
              <FontAwesome name="facebook" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Entrar com Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.googleButton]} activeOpacity={0.85} onPress={() => Alert.alert('Google', 'Login com Google em breve.') }>
              <AntDesign name="google" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Entrar com Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    gap: 24,
  },
  appHeader: {
    height: METRICS.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: METRICS.headerPaddingH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 32,

  },
  screenIntro: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#434343',
  },
  subtitle: {
    fontSize: 14,
    color: '#6f6f6f',
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
    position: 'relative',
  },
  inputLabel: {
      fontSize: 14,
      color: '#bdbdbd',
      fontFamily: 'Robotto500_Regular',
      position: 'absolute',
      padding: 8,
  },
  labelActive: {
    color: '#202020',
    top: 2,
    left: 0,
  },
  label: {
    fontSize: 14,
    color: '#434343',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#222',
  },
  primaryButton: {
    height: METRICS.buttonHeight,
    backgroundColor: Colors.VERDE_ESCURO,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 52,
    marginBottom: 72,
    boxShadow: '0 4px 2px 0 rgba(0, 0, 0, 0.25)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#434343',
    fontFamily: 'Roboto_500Medium',
    textTransform: 'uppercase',
  },
  socialWrap: {
    marginTop: 12,
    gap: 12,
  },
  socialButton: {
    height: METRICS.buttonHeight,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  facebookButton: {
    backgroundColor: '#194f7c',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#f15f5c',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  errorContainer: {
    marginTop: 0,
  },
  error: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: '600',
  },
});


