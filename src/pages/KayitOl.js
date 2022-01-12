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
} from "react-native";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import storage from "../lib/storage";
import { AuthContext } from "../components/Contex";

const KayitOl = () => {
  const navigation = useNavigation();
  const [adi, setAdi] = useState();
  const [soyadi, setSoyadi] = useState();
  const [email, setEmail] = useState();
  const [kullaniciAdi, setKullaniciAdi] = useState();
  const [sifre, setSifre] = useState();
  const [sifreTekrar, setSifreTekrar] = useState();

  const { register } = useContext(AuthContext);
  const onPressKayitOl = () => {
    console.log("kayit ol fonksiyonn içine girildi");

    if (!adi || !soyadi || !email || !kullaniciAdi || !sifre || !sifreTekrar) {
      Alert.alert("Eksik giriş", "Girdiğiniz bilgiler eksiktir");
      return;
    }

    if (sifre != sifreTekrar) {
      Alert.alert("Şifreler uyuşmuyor", "Girdiğiniz şifre ile tekrarı uyuşmuyor");
      return;
    }

    const postData = { name: adi, surname: soyadi, email, username: kullaniciAdi, password: sifre };

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

  return (
    <ImageBackground style={style.arkaplanResim} source={require("../assets/arkaplan4.jpg")}>
      <View style={style.GeriIconContainer}>
        <TouchableWithoutFeedback onPress={onPressGirisSayfasinaGit}>
          <Ionicons name="md-arrow-back" size={32} onPress={() => navigation.pop()} />
        </TouchableWithoutFeedback>
      </View>
      <View style={style.container}>
        <CustomTextInput placeholder="Adınız..." value={adi} onChangeText={setAdi} IsPassword={false} />
        <CustomTextInput placeholder="Soyadınız..." value={soyadi} onChangeText={setSoyadi} IsPassword={false} />
        <CustomTextInput placeholder="Emailiniz..." value={email} onChangeText={setEmail} IsPassword={false} />
        <CustomTextInput
          placeholder="Kullanıcı Adınız..."
          value={kullaniciAdi}
          onChangeText={setKullaniciAdi}
          IsPassword={false}
        />
        <CustomTextInput placeholder="Şifreniz..." value={sifre} onChangeText={setSifre} IsPassword={true} />
        <CustomTextInput
          placeholder="Tekrar Şifreniz..."
          value={sifreTekrar}
          onChangeText={setSifreTekrar}
          IsPassword={true}
        />
        <CustomButton onPress={onPressKayitOl} buttonName="Kayıt Ol" />
        <CustomButton onPress={onPressGirisSayfasinaGit} buttonName="Giriş Sayfasına Git" />
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
    flexDirection: "column",
    justifyContent: "center",
    flex: 10,
    marginBottom: 50,
  },
  GeriIconContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginLeft: 25,
    marginTop: 20,
  },
});

export default KayitOl;
