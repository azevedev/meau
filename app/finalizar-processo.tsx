// app/finalizar-processo.tsx
import { Colors } from '@/constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const METRICS = {
  headerHeight: 56,
  headerPaddingH: 16,
  backIconSize: 24,
  sideSpacing: 52,
  bottomSpacing: 24,
  buttonWidth: 232,
  buttonHeight: 40,
};

export default function FinalizarProcesso() {
  const router = useRouter();

  async function onShare() {
    try {
      await Share.share({
        title: "Compartilhar História",
        message:
          "O Bacon acabou de ser adotado! Venha ver a história e celebrar com a gente 🐶🎉",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir a caixa de compartilhamento.");
      console.warn("share error:", error);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.VERDE_CLARO} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={METRICS.backIconSize} color={Colors.PRETO_FONTE} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors.PRETO_FONTE }]}>Finalizar processo</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={{ height: METRICS.sideSpacing }} />

        <Text style={[styles.celebrate, { color: Colors.VERDE_ESCURO }]}>Oba!</Text>

        <View style={{ height: METRICS.sideSpacing }} />

        <View style={styles.paragraphWrap}>
          <Text style={[styles.paragraph, { color: Colors.PRETO_FONTE }]}>
            Ficamos muito felizes com o sucesso{"\n"}
            do seu processo! Esperamos que o{"\n"}
            bichinho esteja curtindo muito essa{"\n"}
            nova experiência!
          </Text>

          <Text style={[styles.paragraph, { marginTop: 12, color: Colors.PRETO_FONTE }]}>
            Agora, que tal compartilhar a história{"\n"}
            do Bacon com todos os outros{"\n"}
            membros do Meau?
          </Text>
        </View>
      </View>

      {/* Footer / botão */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.shareButton,
            {
              backgroundColor: Colors.VERDE_ESCURO,
              borderColor: Colors.VERDE_ESCURO,
            },
          ]}
          activeOpacity={0.85}
          onPress={onShare}
          accessibilityLabel="Compartilhar história"
        >
          <Text style={[styles.shareButtonText, { color: Colors.PRETO_FONTE }]}>
            COMPARTILHAR HISTÓRIA
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.BRANCO_FUNDO,
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

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: METRICS.sideSpacing / 2,
  },

  celebrate: {
    fontSize: 53,
    fontFamily: "Courgette_400Regular", // assume layout já carregou as fontes
    textAlign: "center",
  },

  paragraphWrap: {
    marginTop: 0,
    paddingHorizontal: 8,
    alignItems: "center",
    maxWidth: width - METRICS.sideSpacing * 2,
  },

  paragraph: {
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },

  footer: {
    paddingHorizontal: METRICS.headerPaddingH,
    paddingBottom: Platform.OS === "ios" ? 34 : METRICS.bottomSpacing,
    alignItems: "center",
  },

  shareButton: {
    width: METRICS.buttonWidth,
    height: METRICS.buttonHeight,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    // sombra leve
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  shareButtonText: {
    fontWeight: "600",
    letterSpacing: 1,
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
  },
});
