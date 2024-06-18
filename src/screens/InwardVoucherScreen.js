import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Table, Row, Rows } from "react-native-table-component";
import axios from "axios";
import { BASE_URL } from "./config"; // Adjust the import path as necessary
import { parse, format } from "date-fns";

function InwardVoucherScreen({ navigation }) {
  const data = navigation.getParam("data", {});
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState(
    data.voucherItemDTOs.map((item) => item.item)
  );

  const handleAddItem = () => {
    if (selectedItem && quantity) {
      const selectedItemDetails = data.voucherItemDTOs.find(
        (item) => item.item.Item_id === selectedItem.Item_id
      );
      if (Number(quantity) > selectedItemDetails.RemainingQty) {
        Alert.alert(
          "Error",
          `Quantity cannot exceed the remaining quantity of ${selectedItemDetails.RemainingQty}`
        );
      } else {
        setAddedItems([
          ...addedItems,
          {
            ...selectedItem,
            quantity,
            RemainingQty: selectedItemDetails.RemainingQty,
            voucher_item_id: selectedItemDetails.voucher_item_id,
          },
        ]);
        setAvailableItems(
          availableItems.filter((item) => item.Item_id !== selectedItem.Item_id)
        );
        setQuantity("");
        setSelectedItem(null);
      }
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...addedItems];
    const removedItem = updatedItems.splice(index, 1)[0];
    setAddedItems(updatedItems);
    setAvailableItems([...availableItems, removedItem]);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...addedItems];
    if (Number(newQuantity) <= updatedItems[index].RemainingQty) {
      updatedItems[index].quantity = newQuantity;
      setAddedItems(updatedItems);
    } else {
      Alert.alert(
        "Error",
        `Quantity cannot exceed the remaining quantity of ${updatedItems[index].RemainingQty}`
      );
    }
  };

  const handleSave = async () => {
    const payload = {
      VoucherID: data.VoucherID,
      vouchertype: data.vouchertype,
      voucherItemDTOs: addedItems.map((item) => ({
        voucher_item_id: item.voucher_item_id,
        rcvd_Item_Qty: item.quantity,
      })),
    };

    try {
      const response = await axios.post(`${BASE_URL}VoucherMasters/`, payload);
      // const response = await axios.post('http://192.168.29.92:7080/api/VoucherMasters/', payload);
      Alert.alert("Success", "Data saved successfully");
      navigation.navigate('Home');
      console.log(payload);
    } catch (error) {
      Alert.alert("Error", "Failed to save data");
    }
  };

  const handleProcess = () => {
    const details = addedItems
      .map(
        (item) =>
          `Name: ${item.name}\nItem Code: ${item.item_code}\nQuantity: ${item.quantity}\nRemainingQty: ${item.RemainingQty}\nVoucher Item ID: ${item.voucher_item_id}\nItem ID: ${item.Item_id}`
      )
      .join("\n\n");
    Alert.alert(
      "Processing Details",
      `Voucher ID: ${data.VoucherID}\nVoucher Name: ${data.voucher_name}\n\nItems:\n${details}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: handleSave },
      ]
    );
  };

  const tableHead = [
    "Name",
    "Item Code",
    "Bal. Qty",
    "Added Qty",
    "Remaining Qty",
    "Actions",
  ];
  const tableData = addedItems.map((item, index) => [
    item.name,
    item.item_code,
    item.balance_Qty,
    <TextInput
      style={styles.input}
      value={item.quantity.toString()}
      onChangeText={(text) => handleQuantityChange(index, text)}
      keyboardType="numeric"
      key={index}
    />,
    item.RemainingQty,
    <TouchableOpacity key={index} onPress={() => handleRemoveItem(index)}>
      <Icon name="delete" size={24} color="red" />
    </TouchableOpacity>,
  ]);

  // Function to parse and format the date
  const formatDate = (dateTimeString) => {
    // Parsing the date string to a Date object
    const parsedDate = parse(dateTimeString, "dd-MM-yyyy HH:mm:ss", new Date());
    // Formatting the date as 'dd-MM-yyyy'
    return format(parsedDate, "dd-MM-yyyy");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.heading}>Voucher Name: {data.voucher_name}</Text>
        <Text style={styles.heading}>Voucher ID: {data.VoucherID}</Text>
        <Text style={styles.heading}>
          Estimate Delivery Time: {formatDate(data.EstimateDeliveryTime)}
        </Text>
        <Text style={styles.heading}>Priority: {data.priorities.priority}</Text>
        <Text style={styles.heading}>
          Priority Days: {data.priorities?.priorityDays}
        </Text>
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedItem}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedItem(itemValue)}
        >
          <Picker.Item label="Select Item" value={null} />
          {availableItems.map((item) => (
            <Picker.Item key={item.Item_id} label={item.name} value={item} />
          ))}
        </Picker>
        {selectedItem && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <Button title="Add" onPress={handleAddItem} />
          </>
        )}
      </View>

      {selectedItem && (
        <View style={styles.itemCard}>
          <Text style={styles.itemText}>Name: {selectedItem.name}</Text>
          <Text style={styles.itemText}>
            Item Code: {selectedItem.item_code}
          </Text>
          <Text style={styles.itemText}>HSN Code: {selectedItem.HSN_code}</Text>
          <Text style={styles.itemText}>
            Remaining Qty: {selectedItem.RemainingQty}
          </Text>
          <Text style={styles.itemText}>
            Balance Qty: {selectedItem.balance_Qty}
          </Text>
        </View>
      )}

      <View style={styles.addedItemsContainer}>
        <Text style={styles.tableHeading}>Added Items</Text>
        <ScrollView horizontal={true} style={styles.scrollView}>
          <View>
            <Table borderStyle={styles.tableBorder}>
              <Row
                data={tableHead}
                style={styles.tableHeader}
                Style={styles.tableHeaderText}
                widthArr={[130, 70, 70, 70, 70, 70]}
              />
              <Rows
                data={tableData}
                Style={styles.tableText}
                widthArr={[130, 70, 70, 70, 70, 70]}
              />
            </Table>
          </View>
        </ScrollView>
      </View>

      {addedItems.length > 0 && (
        <View style={styles.processButtonContainer}>
          <Button title="Process" onPress={handleProcess} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
    flex: 1,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  addedItemsContainer: {
    marginTop: 20,
  },
  tableHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  tableHeaderText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  tableText: {
    textAlign: "center",
    paddingVertical: 10,
  },
  scrollView: {
    marginTop: 10,
  },
  processButtonContainer: {
    marginTop: 20,
  },
});

export default InwardVoucherScreen;
