import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";

const ModalPhoto = (props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.modalView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={props.onPressHideModal} style={styles.headerText}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> Geri</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <Image
            source={{ uri: props?.costPhotoUri }}
            style={{ height: "100%", width: "100%", alignSelf: "center", borderRadius: 10 }}
            resizeMethod="resize"
          />
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
});
export default ModalPhoto;
