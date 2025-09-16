import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ReactNode, useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickImage, renderCheck } from "./cadastrar-pessoa";

type ModoCadastroAnimal = "ajuda" | "apadrinhar" | "adocao";

const METRICS = {
  headerHeight: 56,
  headerPaddingH: 16,
  backIconSize: 24,
  sideSpacing: 52,
  bottomSpacing: 24,
  buttonWidth: 232,
  buttonHeight: 40,
};

type ModeSelectionButtonsProps = {
  currentMode: ModoCadastroAnimal;
  onModeSelection: (mode: ModoCadastroAnimal) => void;
};

function FormInputLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        { marginTop: 18, fontFamily: "Roboto_500Medium" },
      ]}
    >
      {children}
    </Text>
  );
}

function ModeSelectionButtons({
  currentMode,
  onModeSelection,
}: ModeSelectionButtonsProps) {
  const ModeButton = ({
    mode,
    label,
  }: {
    mode: ModoCadastroAnimal;
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.modeButton,
        currentMode === mode && styles.modeButtonSelected,
        styles.shadow,
      ]}
      onPress={() => onModeSelection(mode)}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modesContainer}>
      <ModeButton mode="adocao" label="ADOÇÃO" />
      <ModeButton mode="apadrinhar" label="APADRINHAR" />
      <ModeButton mode="ajuda" label="AJUDA" />
    </View>
  );
}

type FormInputTextProps = {
  value: string;
  placeholder?: string;
  onValueChange: (newValue: string) => void;
  validateFunction?: () => boolean;
  secureTextEntry?: boolean;
};

function FormInputText({
  value,
  placeholder = "",
  onValueChange,
  validateFunction,
  secureTextEntry,
}: FormInputTextProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onValueChange}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
      />
      {validateFunction && (
        <View style={styles.iconWrap}>{renderCheck(validateFunction())}</View>
      )}
    </View>
  );
}

export default function CadastrarAnimal() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<ModoCadastroAnimal>("adocao");
  const [petName, setPetName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom", "left", "right", "top"]}
    >
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={METRICS.backIconSize}
            color={Colors.PRETO_FONTE}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors.PRETO_FONTE }]}>
          Cadastrar Animal
        </Text>

        <View style={{ width: 40 }} />
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>Cadastrar Animal</Text>
        <ModeSelectionButtons currentMode={mode} onModeSelection={setMode} />
        <FormInputLabel>NOME DO ANIMAL</FormInputLabel>
        <FormInputText value={petName} onValueChange={setPetName} />
        <FormInputLabel>FOTOS DO ANIMAL</FormInputLabel>
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
                style={[styles.photoText, { fontFamily: "Roboto_400Regular" }]}
              >
                adicionar foto
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  modesContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
  buttonText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: "#434343",
  },
  modeButton: {
    width: 232,
    height: 40,
    borderRadius: 2,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: "#434343",
    backgroundColor: "#eee",
  },
  modeButtonSelected: {
    backgroundColor: "#88c9bf",
  },
  header: {
    height: METRICS.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: METRICS.headerPaddingH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto_500Medium", // assume layout já carregou as fontes
    textAlign: "center",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    color: Colors.PRETO_FONTE,
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
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    resizeMode: "cover",
  },
  photoPlaceholder: { justifyContent: "center", alignItems: "center" },
  photoText: {
    marginTop: 6,
    color: Colors.VERDE_ESCURO,
    textTransform: "lowercase",
    fontSize: 13,
  },
});
