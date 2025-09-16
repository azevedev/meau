import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const ModeSelectionButtons = ({
  currentMode,
  onModeSelection,
}: ModeSelectionButtonsProps) => {
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
};

export default function CadastrarAnimal() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<ModoCadastroAnimal>("adocao");
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
});
