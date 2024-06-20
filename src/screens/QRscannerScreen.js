import React, { useState } from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Text, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { BASE_URL } from "./config"; // Adjust the import path as necessary

function QRscannerScreen({ navigation }) {
  const [data, setData] = useState("Scan something");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // YourComponent.js

  const handleQRCodeRead = async ({ data }) => {
    setData(data);
    setLoading(true);
    setError(null);

    // try {
    //   const response = await fetch(`${BASE_URL}VoucherMasters/${data}`);
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    //   const responseData = await response.json();
    //   setLoading(false);
    //   Alert.alert(
    //     "Details",
    //     `Voucher Name: ${responseData.voucher_name}\nVoucher Number: ${responseData.voucher_number}`,
    //     [
    //       {
    //         text: "Continue",
    //         onPress: () =>
    //           navigation.navigate("InwardVoucher", { data: responseData }),
    //       },
    //     ],
    //     { cancelable: false }
    //   );
    // } catch (err) {
    //   setLoading(false);
    //   setError("Error fetching details");
    //   var temperr= err.json();
    //   Alert.alert(json.stringify( temperr));
    //   Alert.alert("Error", "Error fetching details");

    // }

    try {
      const response = await fetch(`${BASE_URL}VoucherMasters/${data}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      setLoading(false);
      Alert.alert(
        "Details",
        `Voucher Name: ${responseData.voucher_name}\nVoucher Number: ${responseData.voucher_number}`,
        [
          {
            text: "Continue",
            onPress: () => navigation.navigate("InwardVoucher", { data: responseData }),
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      setLoading(false);
      setError("Error fetching details");
    
      // Show the error in an alert for debugging
      Alert.alert("Error", `Error fetching details: ${err.message}`);
    }
    
  };

  return (
    <QRCodeScanner
      onRead={handleQRCodeRead}
      reactivate={true}
      reactivateTimeout={2000}
      showMarker={true}
      vibrate={false}
      topContent={
        <View>
          <Text style={styles.dataText}>{data}</Text>
        </View>
      }
      bottomContent={
        <View>
          <Text style={styles.titleText}>QR Scanner</Text>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  dataText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    margin: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default QRscannerScreen;
