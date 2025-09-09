import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Home() {
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

  const ActionButton = ({ label, href }: { label: string; href: string }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
        <Text style={styles.actionButtonText}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );

  const DrawerLink = ({ label, href }: { label: string; href: string }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.drawerLink} onPress={closeDrawer}>
        <Text style={styles.drawerLinkText}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <StatusBar style="dark" backgroundColor="#f7a800" />
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburger} accessibilityRole="button" accessibilityLabel="Abrir menu">
          <View style={styles.bar} />
          <View style={[styles.bar]} />
          <View style={styles.bar} />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.greeting}>Olá!</Text>

        <View style={styles.actions}>
          <ActionButton label="Adotar" href="/adotar" />
          <ActionButton label="Ajudar" href="/ajudar" />
          <ActionButton label="Cadastrar Animal" href="/cadastrar-animal" />
        </View>
      </View>

      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.login}>login</Text>
      </View>

      <View style={styles.footer}>
        <Image
          source={require('@/assets/images/logo-tipo.png')}
          style={styles.brand}
        />
      </View>

      {drawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX }] }] }>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={closeDrawer} accessibilityRole="button" accessibilityLabel="Fechar menu">
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.drawerContent}>
              <DrawerLink label="Adotar" href="/adotar" />
              <DrawerLink label="Ajudar" href="/ajudar" />
              <DrawerLink label="Cadastrar Animal" href="/cadastrar-animal" />
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    gap: 56,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hamburger: {
    width: 24,
    height: 24,
    justifyContent: 'space-around',
  },
  bar: {
    height: 3,
    backgroundColor: '#88c9bf',
    borderRadius: 2,
  },
  barMiddle: {
    width: '85%',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    gap: 52,
  },
  greeting: {
    fontSize: 72,
    fontWeight: '700',
    fontFamily: 'Courgette_400Regular',
    color: '#ffd358'
  },
  actions: {
    width: '100%',
    gap: 12,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    width: 232,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: '#434343',
    backgroundColor: '#ffd358'
  },
  actionButtonText: {
    color: '#434343',
    fontSize: 12,
    fontWeight: '600',
  },
  login: {
    alignItems: 'center',
    fontSize: 16,
    color: '#88c9bf'
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  brand: {
    width: 122,
    height: 44,
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


