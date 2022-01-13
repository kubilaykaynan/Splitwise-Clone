import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlightOpacity,
  DevSettings,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { AuthContext } from "../components/Contex";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input, Avatar, ListItem, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
const Profil = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [updatedUserData, setUpdatedUserData] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [mail, setMail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [image, setImage] = useState();

  const onPressExit = async () => {
    try {
      //Delete useContex and storage data
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  const onPressSave = async () => {
    const response = await axios.post(`${ENDPOINT_URL}/update-user`, {
      username: username ? username : user.username,
      name: name ? name : user.name,
      surname: surname ? surname : user.surname,
      mail: mail ? mail : user.mail,
      phoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
      image,
    });
    if (response.status == 201) {
      Alert.alert("Başarılı", "Kullanıcı bilgileri başarıyla güncellendi");
    } else {
      Alert.alert("Hata", "Bir hata meydana geldi");
    }
  };

  const onPressPhoto = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      const base64img = `data:image/jpg;base64,${result.base64}`;

      const apiUrl = "https://api.cloudinary.com/v1_1/dsqdqmqfk/image/upload";

      const data = {
        file: base64img,
        upload_preset: "splitWiseApp",
      };

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          const data = await r.json();
          result.uri = data.secure_url;
          console.log("data secure url:", result.uri);
          setImage(result.uri);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}> Profil</Text>
        </View>
      </View>
      <View style={styles.body}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={styles.avatarArea}>
            <TouchableOpacity onPress={onPressPhoto}>
              <Avatar size={64} rounded source={{ uri: image ? image : user.photoUrl }} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputArea}>
            <View style={styles.rowInput}>
              <Ionicons name="people-circle" size={32} style={{ marginRight: 10 }} />
              <Input defaultValue={user.name} value={name} onChangeText={(value) => setName(value)} />
            </View>
            <View style={styles.rowInput}>
              <Ionicons name="people-circle" size={32} style={{ marginRight: 10 }} />
              <Input defaultValue={user.surname} value={surname} onChangeText={(value) => setSurname(value)} />
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
        </KeyboardAvoidingView>
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
    flex: 2,
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
    flex: 14,
  },
  avatarArea: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  inputArea: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonArea: {
    flex: 3,
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
