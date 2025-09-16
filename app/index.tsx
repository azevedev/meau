import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';
import { RootStackParamList } from '../types/navigation';

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'index'>;

export default function Index() {
  const navigation = useNavigation<IndexScreenNavigationProp>();

  useEffect(() => {
    navigation.replace('splash');
  }, [navigation]);

  return null;
}


