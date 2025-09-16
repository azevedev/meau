import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Splash() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash-art.jpg')}
        style={styles.art}
        resizeMode="contain"
      />
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
    width: '70%',
    height: '30%',
  },
});


