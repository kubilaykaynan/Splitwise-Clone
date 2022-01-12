import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../components/Contex";
import Avatar from "react-native-elements/dist/avatar/Avatar";
import { ENDPOINT_URL } from "../lib/config";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddGroup = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [imageFile, setImageFile] = useState();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      groupName: "",
      groupDescription: "",
      photoUrl: undefined,
    },
  });

  const handleUploadImage = (img, groupData) => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "splitWiseApp");
    data.append("cloud_name", "dsqdqmqfk");
    data.append("public_id", `${user.username}/${groupData.groupName}`);
    fetch("https://api.cloudinary.com/v1_1/dsqdqmqfk/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data:", data);
        setImageFile(data);
      });
  };

  const onSubmit = handleSubmit((data) => {
    axios
      .post(`${ENDPOINT_URL}/add-group`, {
        ...data,
        user: user._id,
        photoUrl: image?.uri,
      })
      .catch((error) => {
        console.log(error.message);
      });

    navigation.navigate("group");
  });

  const pickImage = async () => {
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
          setImage(result);
          setIsImage(true);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Text style={styles.headerText} onPress={() => navigation.pop()}>
              İptal
            </Text>
          </TouchableOpacity>
          <Text style={styles.addGroupText}> Grup Ekle</Text>
          <TouchableOpacity onPress={onSubmit} disabled={!isValid}>
            <Text style={styles.headerText}> Bitti</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.columnInput}>
          <View style={styles.rowInput}>
            <Avatar
              size={50}
              rounded
              icon={{ name: "camera", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#6733b9" }}
              onPress={pickImage}
            />
            <Avatar source={{ uri: image?.uri }} size={45} rounded />
          </View>

          <Controller
            control={control}
            name="groupName"
            rules={{
              required: {
                message: "Bu alan gereklidir",
                value: true,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <Input
                  placeholder="Grup Adı"
                  label="Grup Adı"
                  leftIcon={{ type: "fontawesome", name: "chevron-right" }}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors?.groupName?.message}
                  containerStyle={{
                    marginLeft: 10,
                  }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="groupDescription"
            rules={{
              required: {
                message: "Bu alan gereklidir",
                value: true,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <Input
                  placeholder="Grup Açıklaması"
                  leftIcon={{ type: "fontawesome", name: "chevron-right" }}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  label="Grup Açıklaması"
                  errorMessage={errors?.groupDescription?.message}
                  containerStyle={{
                    marginLeft: 10,
                  }}
                />
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1CC29F",
  },
  body: {
    flex: 7,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  addGroupText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  rowInput: {
    flexDirection: "row",
    width: "60%",
    alignSelf: "center",
    paddingBottom: 20,
    justifyContent: "space-around",
    marginTop: 20,
  },
  columnInput: {
    flexDirection: "column",
    flex: 1,
  },
});

export default AddGroup;
