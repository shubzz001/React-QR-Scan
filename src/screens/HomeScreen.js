
import { Text, StyleSheet,View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 20}}>Welcome to the Home Screen</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QRscanner')}>
        <Text style={styles.buttonText}>QR SCAN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#E0E5EC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#E0E5EC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    width:300,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
});

export default HomeScreen;
