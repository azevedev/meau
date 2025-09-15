import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha e-mail e senha.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signInWithEmailAndPassword(auth, email.trim(), password);
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
        }
      }
      Alert.alert('Erro ao entrar', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.content}>
        <View style={styles.header}> 
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#9e9e9e"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
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

          <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleLogin} activeOpacity={0.8} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>
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
  header: {
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
  button: {
    height: 44,
    backgroundColor: '#ffd358',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#434343',
  },
});


