import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const METRICS = {
  headerHeight: 56,
  headerPaddingH: 16,
  backIconSize: 24,
  sideSpacing: 52,
  bottomSpacing: 24,
  buttonWidth: 232,
  buttonHeight: 40,
};

// Mock animal data
const mockAnimals = [
  {
    id: 1,
    name: 'Luna',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    qualities: ['Carinhosa', 'Brincalhona', 'Vacinada', 'Castrada']
  },
  {
    id: 2,
    name: 'Max',
    image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop',
    qualities: ['Protetor', 'Inteligente', 'Vacinado', 'Adestrado']
  },
  {
    id: 3,
    name: 'Mia',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
    qualities: ['Calma', 'Sociável', 'Vacinada', 'Microchipada']
  }
];


export default function Adotar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleCardPress = (animalId: number) => {
    router.push('/finalizar-processo');
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right", "top"]}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.AMARELO_MEDIO }]}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={openDrawer}
          accessibilityLabel="Abrir menu"
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>


        <TouchableOpacity style={styles.searchButton} accessibilityLabel="Buscar">
          <Ionicons name="search" size={METRICS.backIconSize} color={Colors.PRETO_FONTE} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {mockAnimals.map((animal) => (
            <TouchableOpacity 
              key={animal.id} 
              style={styles.card} 
              onPress={() => handleCardPress(animal.id)}
              activeOpacity={0.8}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.animalName}>{animal.name}</Text>
                <TouchableOpacity style={styles.heartButton}>
                  <Ionicons name="heart-outline" size={24} color={Colors.PRETO_FONTE} />
                </TouchableOpacity>
              </View>

              {/* Card Image */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: animal.image }} style={styles.animalImage} />
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.qualitiesContainer}>
                  {animal.qualities.map((quality, index) => (
                    <View key={index} style={styles.qualityTag}>
                      <Text style={styles.qualityText}>{quality}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Drawer */}
      {drawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX }] }] }>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={closeDrawer} accessibilityLabel="Fechar menu">
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.drawerContent}>
              <TouchableOpacity style={styles.drawerLink} onPress={() => { closeDrawer(); router.push('/'); }}>
                <Text style={styles.drawerLinkText}>Início</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerLink} onPress={() => { closeDrawer(); router.push('/adotar'); }}>
                <Text style={styles.drawerLinkText}>Adotar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerLink} onPress={() => { closeDrawer(); router.push('/ajudar'); }}>
                <Text style={styles.drawerLinkText}>Ajudar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerLink} onPress={() => { closeDrawer(); router.push('/cadastrar-animal'); }}>
                <Text style={styles.drawerLinkText}>Cadastrar Animal</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    height: METRICS.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: METRICS.headerPaddingH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    justifyContent: "space-between",
  },
  hamburger: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
  },
  bar: {
    height: 3,
    backgroundColor: '#111',
    borderRadius: 2,
  },
  barMiddle: {
    width: '85%',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto_500Medium",
    textAlign: "center",
  },
  searchButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    padding: 8,
    gap: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#fee29b',
  },
  animalName: {
    fontSize: 16,
    color: '#434343',
    fontFamily: 'Roboto_500Medium',
  },
  heartButton: {
    padding: 4,
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
  },
  animalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardFooter: {
    padding: 8,
  },
  qualitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  qualityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  qualityText: {
    fontSize: 12,
    color: '#434343',
    fontFamily: 'Roboto_400Regular',
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


