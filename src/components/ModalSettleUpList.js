import React from "react";
import { StyleSheet, View, Text, ImageBackground, FlatList, Modal, TouchableOpacity } from "react-native";

const ModalSettleUpList = (props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.modalView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={props.onPressHideModal} style={styles.headerText}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> İptal</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}> Hesaplaş</Text>
            <View></View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.bodyQuestionSide}>
            <Text style={styles.textBodyQuestion}>Gerçekten de bu bakiye ile hesaplaşmak istiyor musun?</Text>
          </View>
          <View style={styles.list}>
            <FlatList
              renderItem={props.FlatListRenderItem}
              data={props.FlatListData}
              keyExtractor={props.FlatListKeyExt}
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
  },
  textBodyQuestion: {
    fontWeight: "bold",
    fontSize: 20,
  },
  bodyQuestionSide: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 15,
    width: "60%",
    marginTop: 20,
  },
});

export default ModalSettleUpList;
