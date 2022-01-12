import React from "react";
import CustomGroupButton from "../components/CustomGroupButton";
import { Avatar, Button } from "react-native-elements";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const NoMemberGroupDetail = (props) => {
  const handleAddMember = () => {
    props.navigation.navigate("contact", {
      group: props.group,
    });
  };
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.headerSide} source={require("../assets/header_background_friend_profile.jpg")}>
        <Ionicons
          name="arrow-back-outline"
          style={styles.backArrow}
          size={32}
          onPress={() => {
            props.navigation.pop();
          }}
        />
        <View style={styles.avatar}>
          <Avatar
            rounded
            source={{
              uri: props.group.photoUrl,
            }}
            size="large"
          />
        </View>
      </ImageBackground>

      <View style={styles.bodySide}>
        <Text style={styles.username}>{props.group.name}</Text>
        <View style={styles.nameAndSurnameContainer}>
          <Text style={styles.nameAndSurname}>{props.group.description}</Text>
        </View>

        <View style={styles.rowButtons}>
          <CustomGroupButton buttonName="Hesaplaş" />
          <CustomGroupButton buttonName="Dengele" />
          <CustomGroupButton buttonName="Toplam" />
          <CustomGroupButton buttonName="Çizelge" />
        </View>

        <View style={styles.columnButtons}>
          <Text style={styles.nameAndSurname}> Burada teksiniz!</Text>
          <Button
            title="Kullanıcı Ekle"
            icon={{
              name: "user",
              type: "font-awesome",
              size: 15,
              color: "white",
            }}
            iconContainerStyle={{ marginRight: 10 }}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "rgb(28, 194, 159)",
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{
              width: 250,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            onPress={handleAddMember}
          />
          <Text style={styles.nameAndSurname}>Ya da</Text>
          <Button
            title="Link Paylaş"
            icon={{
              name: "link",
              type: "font-awesome",
              size: 15,
              color: "white",
            }}
            iconContainerStyle={{ marginRight: 10 }}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "rgb(28, 194, 159)",
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{
              width: 250,
              marginHorizontal: 50,
              marginVertical: 10,
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
  },

  headerSide: {
    flex: 1,
  },

  bodySide: {
    flex: 5,
  },

  backArrow: {
    marginTop: 40,
    marginLeft: 20,
  },

  avatar: {
    marginLeft: 90,
    marginTop: 15,
  },
  username: {
    marginTop: 50,
    marginLeft: 100,
    fontSize: 32,
  },
  nameAndSurnameContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 100,
    maxWidth: 135,
    alignItems: "flex-start",
  },
  nameAndSurname: {
    fontSize: 20,
  },
  rowButtons: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-around",
  },
  columnButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NoMemberGroupDetail;
