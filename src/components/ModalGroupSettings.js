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
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input, Avatar, ListItem, Button } from "react-native-elements";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";

const ModalGroupSettings = (props) => {
  const group = props.group;
  const members = props.members;
  const [newGroupName, setNewGroupName] = useState();

  useEffect(() => {});

  const renderAvatar = () => {
    if (group.photoUrl == null) {
      return (
        <View>
          <Avatar
            size={64}
            rounded
            icon={{ name: "camera", type: "font-awesome" }}
            containerStyle={{ backgroundColor: "#00a7f7" }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Avatar size={64} rounded source={{ uri: group.photoUrl }} />
        </View>
      );
    }
  };
  const memberRender = ({ item }) => {
    if (item.debt >= 0) {
      return (
        <ListItem style={{ marginTop: 10 }}>
          <Avatar source={{ uri: item?.photoUrl }} rounded size={32} />
          <ListItem.Content>
            <ListItem.Title style={{ marginLeft: 8 }}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={{ marginLeft: 8 }}>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "green" }}>Borcu var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "green" }}>{item.debt} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    } else {
      return (
        <ListItem style={{ marginTop: 10 }}>
          <Avatar source={{ uri: item?.photoUrl }} rounded size={32} />
          <ListItem.Content>
            <ListItem.Title style={{ marginLeft: 8 }}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={{ marginLeft: 8 }}>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "red" }}>Borcun var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "red" }}>{-item.debt} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    }
  };

  const onPressSave = async () => {
    //When user press over and save button

    const response = await axios.post(`${ENDPOINT_URL}/update-group`, {
      newGroupName,
      groupId: group._id,
    });

    props.onPressHideModal();
  };

  const onPressFinishGroup = async () => {
    //When user press finish the group button

    const response = await axios.post(`${ENDPOINT_URL}/finish-group`, {
      groupId: group._id,
    });

    props.onPressHideModal();
    props.finishGroup();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.modalView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={props.onPressHideModal} style={styles.headerText}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> Geri</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}> Ayarlar</Text>
            <TouchableOpacity style={styles.headerText} onPress={onPressSave}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> Bitti</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.headerBodyRow}>
            {renderAvatar()}
            <Input
              value={newGroupName}
              defaultValue={group.name}
              onChangeText={setNewGroupName}
              style={styles.inputGroupName}
              inputContainerStyle={{ width: "80%", marginLeft: 10 }}
            />
          </View>
          <Text style={{ fontSize: 16, backgroundColor: "lightgray", padding: 8 }}>Grup Üyeleri</Text>
          <View style={styles.groupMemberList} nestedScrollEnabled={true}>
            <View style={styles.groupListRow}>
              <Ionicons name="person-add-sharp" size={32} />
              <TouchableOpacity onPress={props.addMemberToGroup}>
                <Text style={{ fontSize: 16, marginLeft: 25 }}>Gruba üye ekle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.groupListRow}>
              <Ionicons name="link-sharp" size={32} />
              <Text style={{ fontSize: 16, marginLeft: 25 }}>Link Üzerinden Ekle</Text>
            </View>

            <FlatList renderItem={memberRender} keyExtractor={(item, index) => index.toString()} data={members} />
          </View>
          <View style={{ padding: 40, justifyContent: "center", alignItems: "center" }}>
            <Button
              title="Grubu Bitir"
              loading={false}
              loadingProps={{ size: "small", color: "white" }}
              buttonStyle={{
                backgroundColor: "rgba(111, 202, 186, 1)",
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: "bold", fontSize: 23 }}
              containerStyle={{
                marginHorizontal: 50,
                height: 50,
                width: 200,
                marginVertical: 10,
              }}
              onPress={onPressFinishGroup}
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
  headerBodyRow: {
    flexDirection: "row",
    padding: 30,
    justifyContent: "space-between",
  },
  inputGroupName: {
    width: "30%",
    marginTop: 15,
  },
  groupMemberList: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 15,
    marginLeft: 12,
  },
  groupListRow: {
    flexDirection: "row",
    width: "55%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 14,
  },
});

export default ModalGroupSettings;
