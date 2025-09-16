export type RootStackParamList = {
  index: undefined;
  home: undefined;
  login: undefined;
  adotar: undefined;
  ajudar: undefined;
  'cadastrar-animal': undefined;
  'finalizar-processo': undefined;
  '+not-found': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
