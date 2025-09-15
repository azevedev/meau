import { Colors } from '@/constants/Colors';
import { auth } from '@/firebaseConfig';
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      router.replace('/');
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
      Alert.alert('Erro ao entrar', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.VERDE_CLARO} />

      <View style={[styles.appHeader, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => {}} accessibilityLabel="Menu">
          <Ionicons name="menu" size={METRICS.backIconSize} color={Colors.PRETO_FONTE} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.PRETO_FONTE }]}>Entrar</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.content}>
        <View style={styles.screenIntro}> 
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome de usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu usuário ou e-mail"
              placeholderTextColor="#9e9e9e"
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="default"
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#9e9e9e"
              autoCapitalize="none"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

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
    paddingTop: 24,
    gap: 24,
  },
  appHeader: {
    height: METRICS.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: METRICS.headerPaddingH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
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
    textAlign: 'center',
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
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
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
    backgroundColor: '#ffd358',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#434343',
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
    backgroundColor: '#1877F2',
  },
  googleButton: {
    backgroundColor: '#EA4335',
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


