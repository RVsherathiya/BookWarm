// Mock for react-native-screens to prevent "No ViewManager found for class RNSScreen" error
export const enableScreens = () => {
  console.log('Screens enabled (mock)');
};

export const screensEnabled = () => {
  return false;
};

export default {
  enableScreens,
  screensEnabled,
};
