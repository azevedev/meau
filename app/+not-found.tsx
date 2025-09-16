import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const navigation = useNavigation();
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Parece que esta tela não existe...</ThemedText>
      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.navigate('home' as never)}
      >
        <ThemedText type="link">Ir para a tela inicial!</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
