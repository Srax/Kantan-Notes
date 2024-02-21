export interface INavigation {
  push: (key: any, params?: Record<string, any>) => void;
}

export interface RefLinkModal {
  setModalVisible: (visible: boolean) => void;
}
