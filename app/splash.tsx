import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'splash'>;

export default function Splash() {
  const [showSplashArt, setShowSplashArt] = useState(false);
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const checkSplashShown = async () => {
      try {
        const splashShown = await AsyncStorage.getItem('splash_shown');
        if (!splashShown) {
          setShowSplashArt(true);
          await AsyncStorage.setItem('splash_shown', 'true');
        }
      } catch (error) {
        // If there's an error, show splash art as fallback
        setShowSplashArt(true);
      }
    };

    checkSplashShown();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const target = user ? 'home' : 'login';
      const delay = showSplashArt ? 1500 : 0; // No delay if splash art already shown
      setTimeout(() => navigation.replace(target), delay);
    });
    return unsubscribe;
  }, [showSplashArt, navigation]);

  return (
    <View style={styles.container}>
      {showSplashArt && (
        <Image
          source={require('@/assets/images/splash-art.jpg')}
          style={styles.art}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  art: {
    ...StyleSheet.absoluteFillObject,
  },
});


