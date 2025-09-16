import { useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

interface AnimatedTextInputProps {
  value: string;
  onValueChange: (text: string) => void;
  label: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  returnKeyType?: 'done' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function AnimatedTextInput({
  value,
  onValueChange,
  label,
  placeholder,
  onFocus,
  onBlur,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  multiline = false,
  numberOfLines = 1,
}: AnimatedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = useState(new Animated.Value(0))[0];

  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnimation, {
      toValue,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    if (value === '') {
      setIsFocused(true);
      animateLabel(1);
    }
    onFocus?.();
  };

  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
      animateLabel(0);
    }
    onBlur?.();
  };

  return (
    <View style={styles.fieldGroup}>
      <TextInput
        style={[
          styles.animatedInput,
          multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      <Animated.Text style={[
        styles.inputLabel,
        isFocused ? styles.labelActive : null,
        {
          top: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, -20],
          }),
          left: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 0],
          }),
          color: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['#bdbdbd', '#202020'],
          }),
        }
      ]}>
        {label}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
    position: 'relative',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#bdbdbd',
    fontFamily: 'Roboto_400Regular',
    position: 'absolute',
    padding: 8,
  },
  labelActive: {
    color: '#202020',
    top: 2,
    left: 0,
  },
  animatedInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    borderRadius: 0,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#222',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  multilineInput: {
    height: 'auto',
    minHeight: 44,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
});
