import React from "react";
import { StyleSheet, View, Text, ImageBackground, FlatList, Modal, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input } from "react-native-elements";
const ModalSettleUp = (props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.modalView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={props.onPressHideModal} style={styles.headerText}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> İptal</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}> Hesaplaş</Text>
            <TouchableOpacity onPress={props.onPressSave} style={styles.headerText} disabled={props.disabled}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={{ fontSize: 18 }}>{props.person?.name} kullanıcısına borç ver</Text>
          <View style={styles.rowBody}>
            <Ionicons name="wallet-sharp" size={36} />
            <Input
              inputContainerStyle={{ borderColor: "#1CC29F" }}
              keyboardType="numeric"
              onChangeText={props.inputChange}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,

    backgroundColor: "white",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#1CC29F",
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 30,
    marginLeft: 15,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  body: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  rowBody: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
    width: "35%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default ModalSettleUp;
