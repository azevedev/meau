import AnimatedTextInput from "@/components/AnimatedTextInput";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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

// Radio button component
function RadioButton({ 
  selected, 
  onPress, 
  label 
}: { 
  selected: boolean; 
  onPress: () => void; 
  label: string; 
}) {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioCircle, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Checkbox component
function Checkbox({ 
  checked, 
  onPress, 
  label 
}: { 
  checked: boolean; 
  onPress: () => void; 
  label: string; 
}) {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}


export default function CadastrarAnimal() {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [mode, setMode] = useState<ModoCadastroAnimal>("adocao");
  const [petName, setPetName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New form fields
  const [especie, setEspecie] = useState<string>("");
  const [sexo, setSexo] = useState<string>("");
  const [porte, setPorte] = useState<string>("");
  const [idade, setIdade] = useState<string>("");
  const [temperamento, setTemperamento] = useState<string[]>([]);
  const [saude, setSaude] = useState<string[]>([]);
  const [doenca, setDoenca] = useState<string>("");
  const [necessidades, setNecessidades] = useState<string[]>([]);
  const [medicamento, setMedicamento] = useState<string>("");
  const [sobreAnimal, setSobreAnimal] = useState<string>("");

  // Better keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom with a small delay to ensure keyboard is fully shown
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Improved scroll function that works better
  const scrollToInput = () => {
    // Use a longer delay to ensure the keyboard animation is complete
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  // Alternative approach: scroll to specific position based on input
  const scrollToBottomInputs = () => {
    // For the last few inputs, scroll to end
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Helper functions for checkbox handling
  const toggleTemperamento = (value: string) => {
    setTemperamento(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleSaude = (value: string) => {
    setSaude(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleNecessidades = (value: string) => {
    setNecessidades(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.VERDE_ESCURO }} edges={["top", "left", "right"]}>
    <KeyboardAvoidingView 
        behavior={'padding'} 
      >
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

        <ScrollView style={styles.container}>
    
      
      
      
        <Text style={styles.subtitle}>Tenho interesse em cadastrar animal para:</Text>
        <ModeSelectionButtons currentMode={mode} onModeSelection={setMode} />
        
        <FormInputLabel>NOME DO ANIMAL</FormInputLabel>
        <AnimatedTextInput
          value={petName}
          onValueChange={setPetName}
          label=""
          placeholder="Digite o nome do animal"
          onFocus={scrollToInput}
        />
        
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

        <FormInputLabel>ESPÉCIE</FormInputLabel>
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={especie === "cachorro"} 
            onPress={() => setEspecie("cachorro")} 
            label="Cachorro" 
          />
          <RadioButton 
            selected={especie === "gato"} 
            onPress={() => setEspecie("gato")} 
            label="Gato" 
          />
          <RadioButton 
            selected={especie === "outro"} 
            onPress={() => setEspecie("outro")} 
            label="Outro" 
          />
        </View>

        <FormInputLabel>SEXO</FormInputLabel>
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={sexo === "macho"} 
            onPress={() => setSexo("macho")} 
            label="Macho" 
          />
          <RadioButton 
            selected={sexo === "femea"} 
            onPress={() => setSexo("femea")} 
            label="Fêmea" 
          />
        </View>

        <FormInputLabel>PORTE</FormInputLabel>
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={porte === "pequeno"} 
            onPress={() => setPorte("pequeno")} 
            label="Pequeno" 
          />
          <RadioButton 
            selected={porte === "medio"} 
            onPress={() => setPorte("medio")} 
            label="Médio" 
          />
          <RadioButton 
            selected={porte === "grande"} 
            onPress={() => setPorte("grande")} 
            label="Grande" 
          />
        </View>

        <FormInputLabel>IDADE</FormInputLabel>
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={idade === "filhote"} 
            onPress={() => setIdade("filhote")} 
            label="Filhote" 
          />
          <RadioButton 
            selected={idade === "adulto"} 
            onPress={() => setIdade("adulto")} 
            label="Adulto" 
          />
          <RadioButton 
            selected={idade === "idoso"} 
            onPress={() => setIdade("idoso")} 
            label="Idoso" 
          />
        </View>

        <FormInputLabel>TEMPERAMENTO</FormInputLabel>
        <View style={styles.checkboxGroup}>
          <Checkbox 
            checked={temperamento.includes("brincalhao")} 
            onPress={() => toggleTemperamento("brincalhao")} 
            label="Brincalhão" 
          />
          <Checkbox 
            checked={temperamento.includes("timido")} 
            onPress={() => toggleTemperamento("timido")} 
            label="Tímido" 
          />
          <Checkbox 
            checked={temperamento.includes("calmo")} 
            onPress={() => toggleTemperamento("calmo")} 
            label="Calmo" 
          />
          <Checkbox 
            checked={temperamento.includes("guarda")} 
            onPress={() => toggleTemperamento("guarda")} 
            label="Guarda" 
          />
          <Checkbox 
            checked={temperamento.includes("amoroso")} 
            onPress={() => toggleTemperamento("amoroso")} 
            label="Amoroso" 
          />
          <Checkbox 
            checked={temperamento.includes("preguicoso")} 
            onPress={() => toggleTemperamento("preguicoso")} 
            label="Preguiçoso" 
          />
        </View>

        <FormInputLabel>SAÚDE</FormInputLabel>
        <View style={styles.checkboxGroup}>
          <Checkbox 
            checked={saude.includes("vacinado")} 
            onPress={() => toggleSaude("vacinado")} 
            label="Vacinado" 
          />
          <Checkbox 
            checked={saude.includes("vermifugado")} 
            onPress={() => toggleSaude("vermifugado")} 
            label="Vermifugado" 
          />
          <Checkbox 
            checked={saude.includes("castrado")} 
            onPress={() => toggleSaude("castrado")} 
            label="Castrado" 
          />
          <Checkbox 
            checked={saude.includes("doente")} 
            onPress={() => toggleSaude("doente")} 
            label="Doente" 
          />
        </View>

        <AnimatedTextInput
          value={doenca}
          onValueChange={setDoenca}
          label="Doença do animal"
          onFocus={scrollToBottomInputs}
        />

        <FormInputLabel>NECESSIDADES DO ANIMAL</FormInputLabel>
        <View style={styles.checkboxGroup}>
          <Checkbox 
            checked={necessidades.includes("alimento")} 
            onPress={() => toggleNecessidades("alimento")} 
            label="Alimento" 
          />
          <Checkbox 
            checked={necessidades.includes("auxilio_financeiro")} 
            onPress={() => toggleNecessidades("auxilio_financeiro")} 
            label="Auxílio financeiro" 
          />
          <Checkbox 
            checked={necessidades.includes("medicamento")} 
            onPress={() => toggleNecessidades("medicamento")} 
            label="Medicamento" 
          />
        </View>

        <AnimatedTextInput
          value={medicamento}
          onValueChange={setMedicamento}
          label="Nome do medicamento"
          onFocus={scrollToBottomInputs}
        />

        <AnimatedTextInput
          value={sobreAnimal}
          onValueChange={setSobreAnimal}
          label="Sobre o animal"
          onFocus={scrollToBottomInputs}
        />
       <TouchableOpacity style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} onPress={() => {setIsSubmitting(true);}} activeOpacity={0.8} disabled={isSubmitting}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />

        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.VERDE_ESCURO,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 12,
    color: Colors.PRETO_FONTE,
    fontFamily: "Roboto_500Medium",
    textTransform: "uppercase",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  container: { backgroundColor: "#fff" ,
    padding: 24, 
  },
  modesContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 16,
    textAlign: "center",
    color: "#434343",
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 16,
    textAlign: "center",
    color: "#434343",
  },
  buttonText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 10,
    color: "#434343",
  },
  modeButton: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto_500Medium",
    fontSize: 10,
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
  // Radio button styles
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioSelected: {
    borderColor: Colors.VERDE_ESCURO,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.VERDE_ESCURO,
  },
  radioLabel: {
    fontSize: 14,
    color: "#434343",
    fontFamily: "Roboto_400Regular",
  },
  // Checkbox styles
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: Colors.VERDE_ESCURO,
    borderColor: Colors.VERDE_ESCURO,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#434343",
    fontFamily: "Roboto_400Regular",
  },
});
