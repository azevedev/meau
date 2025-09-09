import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const METRICS = {
  headerHeight: 56,
  headerPaddingH: 16,
  backIconSize: 24,
  sideSpacing: 52,
  bottomSpacing: 24,
  buttonWidth: 232,
  buttonHeight: 40,
};

export default function CadastrarAnimal() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right", "top"]}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.VERDE_CLARO }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={METRICS.backIconSize} color={Colors.PRETO_FONTE} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors.PRETO_FONTE }]}>Cadastrar Animal</Text>

        <View style={{ width: 40 }} />
      </View>
      <View style={styles.center}> 
        <Text style={styles.title}>Cadastrar Animal</Text>
        <Text style={styles.subtitle}>Em breve</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
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
});


