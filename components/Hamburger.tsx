import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface HamburgerProps {
  onPress: () => void;
  color?: string;
  accessibilityLabel?: string;
}

export default function Hamburger({ 
  onPress, 
  color = '#88c9bf', 
  accessibilityLabel = "Abrir menu" 
}: HamburgerProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.hamburger} 
      accessibilityRole="button" 
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={[styles.bar, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    minWidth: 24,
    minHeight: 24,
    maxHeight: 24,
    maxWidth: 24,
    justifyContent: 'space-around',
  },
  bar: {
    height: 3,
    borderRadius: 2,
  },
});
