import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Camera } from "expo-camera";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import { AuthContext } from "./Contex";

const ModalCost = (props) => {
  const [costType, setCostType] = useState("seyahat");
  const [image, setImage] = useState();
  const [description, setDescription] = useState();
  const [cost, setCost] = useState();

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const { user } = useContext(AuthContext);
  //camera ref
  const cameraRef = useRef(null);

  const onPressSave = async () => {
    const groupId = props.group._id;
    const costs = { description, cost, image, costType, groupId };

    if (description && cost && costType) {
      const response = await axios.post(`${ENDPOINT_URL}/add-costs`, {
        costs,
        username: user.username,
      });

      setImage(null);
      setDescription(null);
      setCost(null);
      props.onPressHideModal();
    } else {
      Alert.alert("Hata", "Lutfen gerekli alanlari doldurunuz");
    }
  };

  const getImageFromCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    //Kamerayı terse çevirir
    //setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  };

  const handleTakePhoto = async () => {
    if (cameraRef) {
      console.log("in take picture");
      try {
        let photo = await cameraRef.current.takePictureAsync({
          allowEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });
        //Upload cloudinary
        const base64img = `data:image/jpg;base64,${photo.base64}`;

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
            photo.uri = data.secure_url;
            console.log("data secure url:", photo.uri);
            setImage(photo.uri);
          })
          .catch((err) => console.log(err));

        //console.log(photo.uri);
        //setImage(photo.uri);
        setHasPermission(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderPhoto = () => {
    if (image) {
      return (
        <View>
          <TouchableOpacity onPress={() => getImageFromCamera()} style={styles.photoBody}>
            <Image source={{ uri: image }} style={{ height: 200, width: "100%" }}></Image>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => getImageFromCamera()} style={styles.photoBody}>
            <Ionicons name="camera-outline" size={36} />
            <Text style={{ fontWeight: "200", fontSize: 20 }}> Fotoğraf Çek</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (hasPermission) {
    return (
      <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
        <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.headerCameraContainer}>
              <View style={styles.headerRowCamera}>
                <TouchableOpacity>
                  <Ionicons
                    name="arrow-back"
                    size={48}
                    style={{ color: "white" }}
                    onPress={() => {
                      setHasPermission(false);
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setType(
                      type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                    )
                  }
                >
                  <Ionicons name="camera-reverse-outline" size={48} style={{ color: "white" }} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bodyCamera}>
              <TouchableOpacity onPress={async () => await handleTakePhoto()}>
                <Ionicons name="ellipse" size={64} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </Modal>
    );
  } else {
    return (
      <Modal animationType="slide" transparent={true} visible={props.visible} onRequestClose={props.onRequestClose}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={props.onPressHideModal} style={styles.headerText}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> İptal</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}> Masraf Giriş</Text>
              <TouchableOpacity onPress={onPressSave} style={styles.headerText}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}> Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.upperBody}>
              <Text style={{ alignSelf: "center", fontSize: 20, marginTop: 20 }}>Masraf Tipi Seçiniz</Text>
              <Picker
                selectedValue={costType}
                onValueChange={(itemValue, itemIndex) => setCostType(itemValue)}
                style={{ width: 100, alignSelf: "center" }}
              >
                <Picker.Item label="Seyahat" value="seyahat" />
                <Picker.Item label="Alışveriş" value="alisveris" />
                <Picker.Item label="Akaryakıt" value="akaryakit" />
                <Picker.Item label="Diğer" value="diger" />
              </Picker>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.lowerBody}>
                <View style={styles.rowBodyDescription}>
                  <Ionicons name="return-down-forward-outline" size={36} />

                  <Input
                    inputContainerStyle={{ borderColor: "#1CC29F" }}
                    onChangeText={setDescription}
                    style={{ alignSelf: "center" }}
                    placeholder="Açıklama..."
                  />
                </View>

                <View style={styles.rowBodyCost}>
                  <Ionicons name="cash-outline" size={36} />

                  <Input
                    inputContainerStyle={{ borderColor: "#1CC29F" }}
                    keyboardType="numeric"
                    onChangeText={setCost}
                    style={{ alignSelf: "center" }}
                    placeholder="Masraf Miktarı..."
                  />
                </View>
                {renderPhoto()}
                <View style={styles.rowLine}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    );
  }
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
    flex: 8,
  },
  upperBody: {
    flex: 1,
  },
  lowerBody: {
    flex: 2,
    marginTop: 20,
  },
  rowBodyCost: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
    width: "40%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rowBodyDescription: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
    width: "70%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  photoBody: {
    height: 200,
    width: "100%",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLine: {
    width: "90%",
    height: 1,
    backgroundColor: "gray",
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  container: {
    flex: 1,
  },
  headerCameraContainer: {
    flex: 2,
  },
  bodyCamera: {
    flex: 7,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 80,
  },
  headerRowCamera: {
    flex: 1,
    flexDirection: "row",
    width: "58%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ModalCost;
