import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableHighlightOpacity, DevSettings, TouchableOpacity } from "react-native";
import { AuthContext } from "../components/Contex";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input, Avatar, ListItem, Button } from "react-native-elements";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
const Profil = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [updatedUserData, setUpdatedUserData] = useState();
  const [username, setUsername] = useState();
  const [nameSurname, setNameSurname] = useState();
  const [mail, setMail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();

  const name = `${user.name} ${user.surname}`;

  let isCanceled = false;

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, [updatedUserData]);

  const handleChange = async () => {
    await timeout(5000);
    if (!isCanceled) {
      getUserData();
    }
  };

  const getUserData = async () => {};

  const onPressExit = async () => {
    try {
      //Delete useContex and storage data
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  const onPressSave = async () => {};

  return (
    <View style={styles.modalView}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}> Profil</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.avatarArea}>
          <Avatar size={64} rounded source={{ uri: user.photoUrl }} />
        </View>
        <View style={styles.inputArea}>
          <View style={styles.rowInput}>
            <Ionicons name="people-circle" size={32} style={{ marginRight: 10 }} />
            <Input defaultValue={name} value={nameSurname} onChangeText={(value) => setNameSurname(value)} />
          </View>
          <View style={styles.rowInput}>
            <Ionicons name="person-sharp" size={32} style={{ marginRight: 10 }} />
            <Input defaultValue={user.username} value={username} onChangeText={(value) => setUsername(value)} />
          </View>
          <View style={styles.rowInput}>
            <Ionicons name="mail-sharp" size={32} style={{ marginRight: 10 }} />
            <Input defaultValue={user.email} value={mail} onChangeText={(value) => setMail(value)} />
          </View>
          <View style={styles.rowInput}>
            <Ionicons name="phone-portrait-sharp" size={32} style={{ marginRight: 10 }} />
            <Input
              defaultValue={user.phoneNumber}
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
            />
          </View>
          <View style={styles.rowInput}>
            <Ionicons name="eye-sharp" size={32} style={{ marginRight: 10 }} />
            <Input
              secureTextEntry={true}
              defaultValue={user.username}
              onChangeText={(value) => setPassword(value)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.buttonArea}>
          <Button
            title="Değişiklikleri Kaydet"
            buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
            containerStyle={{
              height: 40,
              width: 250,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            titleStyle={{
              color: "white",
              marginHorizontal: 20,
            }}
            onPress={onPressSave}
          />
          <Button
            title="Çıkış Yap"
            buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
            containerStyle={{
              height: 40,
              width: 250,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            titleStyle={{ color: "white", marginHorizontal: 20 }}
            onPress={onPressExit}
          />
        </View>
      </View>
    </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  body: {
    flex: 9,
  },
  avatarArea: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  inputArea: {
    flex: 5,
    alignItems: "center",
  },
  buttonArea: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  rowInput: {
    flexDirection: "row",
    width: 220,
    marginRight: 70,
  },
});

export default Profil;
