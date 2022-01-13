import { StyleSheet, View, Text, KeyboardAvoidingView, ImageBackground, Alert } from "react-native";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/Contex";
import { ENDPOINT_URL } from "../lib/config";
import axios from "axios";
import storage from "../lib/storage";

const GirisSayfasi = () => {
  const navigation = useNavigation();
  const [kullaniciAdi, setKullaniciAdi] = useState();

  // burayi degistirdim

  // deneme 12
  const [sifre, setSifre] = useState();
  const { login } = useContext(AuthContext);

  const onPressGiris = async () => {
    try {
      console.log("giris basildi");
      const kullanicilar = { kullaniciAdi, sifre };
      login(kullaniciAdi, sifre).then((data) => {
        console.log("data is login");
      });
    } catch (err) {
      console.log(err);
      Alert.alert("HATA", "Kullanıcı adı ve şifre alanları boş bırakılamaz");
    }
  };

  const onPressKayitaGit = () => {
    navigation.navigate("KayitOl");
  };

  return (
    <ImageBackground style={style.arkaplanResim} source={require("../assets/arkaplan4.jpg")}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={style.container}>
          <CustomTextInput
            placeholder="Kullanici Adiniz..."
            value={kullaniciAdi}
            onChangeText={setKullaniciAdi}
            IsPassword={false}
          />
          <CustomTextInput placeholder="Sifreniz..." value={sifre} onChangeText={setSifre} IsPassword={true} />
          <CustomButton onPress={onPressGiris} buttonName="Giris Yap" />
          <CustomButton onPress={onPressKayitaGit} buttonName="Kayit Sayfasina Git" />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const style = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  arkaplanResim: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  geriIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default GirisSayfasi;
