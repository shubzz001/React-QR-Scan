// src/navigation/AppNavigator.js
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import QRscannerScreen from '../screens/QRscannerScreen';
import InwardVoucherScreen from '../screens/InwardVoucherScreen';
import InitialScreen from '../screens/InitialScreen';

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    QRscanner: QRscannerScreen,
    InwardVoucher: InwardVoucherScreen,
  },
  {
    defaultNavigationOptions: {
      title: 'App',
    },
  }
);

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  {
    defaultNavigationOptions: {
      title: 'App',
    },
  }
);

const navigator = createSwitchNavigator(
  {
    Initial: InitialScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Initial',
  }
);

export default createAppContainer(navigator);
