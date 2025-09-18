// app/cadastro-pessoal.tsx
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/scripts/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const HEADER_HEIGHT = 56;

export function renderCheck(valid: boolean) {
  return valid ? (
    <Ionicons name="checkmark" size={18} color={Colors.VERDE_ESCURO} />
  ) : null;
}

// pick image (new API)
export async function pickImage() {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets && result.assets[0];
    if (asset && asset.uri) {
      return asset.uri;
    } else {
      console.warn("ImagePicker retornou sem assets/uri:", result);
      Alert.alert("Erro", "Não foi possível obter a imagem selecionada.");
    }
  } catch (err) {
    console.error("Erro ao abrir galeria:", err);
    Alert.alert("Erro", "Não foi possível abrir a galeria.");
  }
}

export default function CadastroPessoal() {
  const navigation = useNavigation();

  // form state
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Precisamos de permissão para acessar a galeria."
          );
        }
      }
    })();
  }, []);

  // === Ajuste: usar navigation do React Navigation ===
  function openLeftAction() {
    // 1) se existe histórico, faz goBack
    if (typeof navigation.canGoBack === "function" && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    // 2) se navigation expõe openDrawer (algumas stacks/drawers), use-o
    const navAny = navigation as any;
    if (typeof navAny.openDrawer === "function") {
      navAny.openDrawer();
      return;
    }

    // 3) tenta dispatch DrawerActions.openDrawer()
    try {
      navigation.dispatch(DrawerActions.openDrawer());
      return;
    } catch (err) {
      // 4) fallback: volta para root da stack
      navigation.dispatch(StackActions.popToTop());
    }
  }

  // validators
  const isRequired = (v: string) => v.trim().length > 0;
  const isAgeValid = (v: string) => {
    const n = Number(v);
    return !Number.isNaN(n) && n > 0 && n < 120;
  };
  const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
  const isPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
  const isPasswordValid = (v: string) => v.length >= 6;

  const validFullName = isRequired(fullName);
  const validAge = isAgeValid(age);
  const validEmail = isEmail(email);
  const validEstado = isRequired(estado);
  const validCidade = isRequired(cidade);
  const validEndereco = isRequired(endereco);
  const validTelefone = isPhone(telefone);
  const validUsername = isRequired(username);
  const validPassword = isPasswordValid(password);
  const validConfirm =
    password === confirmPassword && confirmPassword.length > 0;

  const formValid =
    validFullName &&
    validAge &&
    validEmail &&
    validEstado &&
    validCidade &&
    validEndereco &&
    validTelefone &&
    validUsername &&
    validPassword &&
    validConfirm;

// async function uploadImageAsync(uri: string, pathPrefix = "profile_photos") {
//   // converte URI local em blob e faz upload
//   const response = await fetch(uri);
//   const blob = await response.blob();

//   const filename = `${Date.now()}`; // ou `${uid}.jpg`
//   const ref = storageRef(storage, `${pathPrefix}/${filename}`);
//   await uploadBytes(ref, blob);
//   const url = await getDownloadURL(ref);
//   return url;
// }


async function handleRegister() {
  // mantém sua checagem de validação anterior
  // if (!formValid) {
  //   Alert.alert("Formulário incompleto", "Preencha corretamente todos os campos marcados.");
  //   return;
  // }

  try {
    // opcional: show loading UI
    // cria usuário no Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;

    // um jeito de fazer upload da foto, mudar para conversão em base 64 para dar menos trabalho
    let photoURL = null;
    // if (photoUri) {
    //   try {
    //     // photoURL = await uploadImageAsync(photoUri, "profile_photos");
    //   } catch (err) {
    //     console.warn("Upload da foto falhou, prosseguindo sem foto:", err);
    //     photoURL = null;
    //   }
    // }

    // atualiza displayName/photoURL no Auth
    // await updateProfile(user, {
    //   displayName: fullName,
    //   photoURL: photoURL ?? undefined,
    // });

    // grava dados adicionais no Firestore em users/{uid}
    // const userDoc = {
    //   uid: user.uid,
    //   fullName,
    //   age,
    //   email: email.trim(),
    //   estado,
    //   cidade,
    //   endereco,
    //   telefone,
    //   username,
    //   photoURL: photoURL ?? null,
    //   createdAt: serverTimestamp(),
    // };
    //TODO
    // Ajustar para salvar os outros dados dos usuário
    // await setDoc(doc(firestore, "users", user.uid), userDoc);

    Alert.alert("Cadastro realizado", "Usuário criado com sucesso!");
    
  } catch (error: any) {
    console.error("Erro registro:", error);
    const code = error?.code ?? "";
    if (code.includes("auth/email-already-in-use")) {
      Alert.alert("Erro", "O e-mail já está em uso.");
    } else if (code.includes("auth/invalid-email")) {
      Alert.alert("Erro", "E-mail inválido.");
    } else if (code.includes("auth/weak-password")) {
      Alert.alert("Erro", "Senha muito fraca. Use ao menos 6 caracteres.");
    } else {
      Alert.alert("Erro", "Não foi possível criar o usuário. Tente novamente.");
    }
  } finally {
    // esconder loading se tiver
  }
}


  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="dark" backgroundColor={Colors.VERDE_CLARO} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity onPress={openLeftAction} style={styles.headerIcon}>
          {typeof navigation.canGoBack === "function" &&
          navigation.canGoBack() ? (
            <Ionicons name="arrow-back" size={24} color={Colors.PRETO_FONTE} />
          ) : (
            <Ionicons name="menu" size={26} color={Colors.PRETO_FONTE} />
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: Colors.PRETO_FONTE, fontFamily: "Roboto_500Medium" },
          ]}
        >
          Cadastro Pessoal
        </Text>

        <View style={styles.headerIcon} />
      </View>

      {/* FORM */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.infoBox}>
            <Text
              style={[styles.infoText, { fontFamily: "Roboto_400Regular" }]}
            >
              As informações preenchidas serão divulgadas apenas para a pessoa
              com a qual você realizar o processo de adoção e/ou apadrinhamento,
              após a formalização do processo.
            </Text>
          </View>

          <Text
            style={[styles.sectionTitle, { fontFamily: "Roboto_500Medium" }]}
          >
            INFORMAÇÕES PESSOAIS
          </Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Nome completo"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <View style={styles.iconWrap}>{renderCheck(validFullName)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Idade"
              value={age}
              onChangeText={(v) => setAge(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
            />
            <View style={styles.iconWrap}>{renderCheck(validAge)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.iconWrap}>{renderCheck(validEmail)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Estado"
              value={estado}
              onChangeText={setEstado}
            />
            <View style={styles.iconWrap}>{renderCheck(validEstado)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
            />
            <View style={styles.iconWrap}>{renderCheck(validCidade)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Endereço"
              value={endereco}
              onChangeText={setEndereco}
            />
            <View style={styles.iconWrap}>{renderCheck(validEndereco)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Telefone"
              value={telefone}
              onChangeText={(v) => setTelefone(v.replace(/[^\d()+\s-]/g, ""))}
              keyboardType="phone-pad"
            />
            <View style={styles.iconWrap}>{renderCheck(validTelefone)}</View>
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { marginTop: 18, fontFamily: "Roboto_500Medium" },
            ]}
          >
            INFORMAÇÕES DE PERFIL
          </Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={styles.iconWrap}>{renderCheck(validUsername)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Senha (mín. 6)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <View style={styles.iconWrap}>{renderCheck(validPassword)}</View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
              placeholder="Confirmação de senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <View style={styles.iconWrap}>{renderCheck(validConfirm)}</View>
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { marginTop: 18, fontFamily: "Roboto_500Medium" },
            ]}
          >
            FOTO DE PERFIL
          </Text>

          <TouchableOpacity
            style={styles.photoBox}
            onPress={() => {
              pickImage().then((img) => img && setPhotoUri(img));
            }}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons
                  name="add-circle-outline"
                  size={40}
                  color={Colors.VERDE_ESCURO}
                />
                <Text
                  style={[
                    styles.photoText,
                    { fontFamily: "Roboto_400Regular" },
                  ]}
                >
                  adicionar foto
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            // style={[styles.submitBtn, !formValid && styles.submitBtnDisabled]}
            style={[styles.submitBtn]}
            onPress={handleRegister}
            // disabled={!formValid}
          >
            <Text
              style={[styles.submitText, { fontFamily: "Roboto_500Medium" }]}
            >
              FAZER CADASTRO
            </Text>
          </TouchableOpacity>

          <View style={{ height: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BRANCO_FUNDO },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  headerIcon: { width: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 20, textAlign: "center" },

  container: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.BRANCO_FUNDO,
  },
  infoBox: {
    backgroundColor: "#E6F3F0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 18,
    borderWidth: 0.8,
    borderColor: "#cfe9e5",
  },
  infoText: {
    color: "#2b6360",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },

  sectionTitle: {
    color: Colors.VERDE_ESCURO,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    paddingVertical: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    color: Colors.PRETO_FONTE,
  },

  iconWrap: { width: 32, alignItems: "center", justifyContent: "center" },

  photoBox: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 18,
    width: 128,
    height: 128,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  photoPlaceholder: { justifyContent: "center", alignItems: "center" },
  photoText: {
    marginTop: 6,
    color: Colors.VERDE_ESCURO,
    textTransform: "lowercase",
    fontSize: 13,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    resizeMode: "cover",
  },

  submitBtn: {
    backgroundColor: Colors.VERDE_ESCURO,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
    elevation: 2,
  },
  submitBtnDisabled: { opacity: 0.5, backgroundColor: "#C9E0DA" },
  submitText: {
    color: Colors.PRETO_FONTE,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
