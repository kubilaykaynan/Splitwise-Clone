import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Keyboard,
} from "react-native";
import React, { useContext } from "react";
import { useState } from "react";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/Contex";
import { Input, Avatar, ListItem, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

const KayitOl = () => {
  const navigation = useNavigation();
  const [adi, setAdi] = useState();
  const [soyadi, setSoyadi] = useState();
  const [email, setEmail] = useState();
  const [kullaniciAdi, setKullaniciAdi] = useState();
  const [sifre, setSifre] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [image, setImage] = useState();

  const { register } = useContext(AuthContext);
  const onPressKayitOl = () => {
    console.log("kayit ol fonksiyonn içine girildi");

    if (!adi || !soyadi || !email || !kullaniciAdi || !sifre || !phoneNumber) {
      Alert.alert("Eksik giriş", "Girdiğiniz bilgiler eksiktir");
      return;
    }

    const postData = {
      name: adi,
      surname: soyadi,
      email,
      username: kullaniciAdi,
      password: sifre,
      image: image,
      phoneNumber: phoneNumber,
    };

    register({
      ...postData,
    }).then(() => {
      Alert.alert("Kayit ", "Kayit olma başarılı");
      navigation.navigate("Giris");
    });
  };

  const onPressGirisSayfasinaGit = () => {
    navigation.navigate("Giris");
  };

  const renderPhoto = () => {
    if (!image) {
      return (
        <Avatar
          size={64}
          rounded
          icon={{ name: "camera", type: "font-awesome" }}
          containerStyle={{ backgroundColor: "#494746" }}
          onPress={pickImage}
        />
      );
    } else {
      return <Avatar size={64} rounded source={{ uri: image }} />;
    }
  };

  const pickImage = async () => {
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
    <ImageBackground style={style.arkaplanResim} source={require("../assets/arkaplan4.jpg")}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 8 }}>
        <View style={style.GeriIconContainer}>
          <TouchableWithoutFeedback onPress={onPressGirisSayfasinaGit}>
            <Ionicons name="md-arrow-back" size={32} onPress={() => navigation.pop()} />
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={style.container}>
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>{renderPhoto()}</View>
            <CustomTextInput placeholder="Adınız..." value={adi} onChangeText={setAdi} IsPassword={false} />
            <CustomTextInput placeholder="Soyadınız..." value={soyadi} onChangeText={setSoyadi} IsPassword={false} />
            <CustomTextInput placeholder="Emailiniz..." value={email} onChangeText={setEmail} IsPassword={false} />
            <CustomTextInput
              placeholder="Telefon Numaranız..."
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              IsPassword={false}
              keyboardType="phone-pad"
            />
            <CustomTextInput
              placeholder="Kullanıcı Adınız..."
              value={kullaniciAdi}
              onChangeText={setKullaniciAdi}
              IsPassword={false}
            />
            <CustomTextInput placeholder="Şifreniz..." value={sifre} onChangeText={setSifre} IsPassword={true} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={style.buttonArea}>
        <CustomButton onPress={onPressKayitOl} buttonName="Kayıt Ol" />
      </View>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  arkaplanResim: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 8,
    marginBottom: 50,
  },
  buttonArea: {
    flex: 2,
    justifyContent: "flex-start",
  },
  GeriIconContainer: {
    flex: 0.8,
    justifyContent: "flex-end",
    marginLeft: 25,
    marginTop: 20,
  },
});

export default KayitOl;
