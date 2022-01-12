import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Avatar, Button } from "react-native-elements";
const FriendProfile = ({ route, navigation }) => {
  const { user } = route.params;

  const onPressSettleUp = () => {
    console.log("settled up");
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.headerSide} source={require("../assets/header_background_friend_profile.jpg")}>
        <Ionicons
          name="arrow-back-outline"
          style={styles.backArrow}
          size={32}
          onPress={() => {
            navigation.pop();
          }}
        />
        <View style={styles.avatar}>
          <Avatar
            rounded
            source={{
              uri: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
            }}
            size="large"
          />
        </View>
      </ImageBackground>

      <View style={styles.bodySide}>
        <Text style={styles.username}>{user.username}</Text>
        <View style={styles.nameAndSurnameContainer}>
          <Text style={styles.nameAndSurname}>{user.name}</Text>
          <Text style={styles.nameAndSurname}>{user.surname}</Text>
        </View>

        <View style={styles.buttons}>
          <Button title="Hesaplaş" onPress={onPressSettleUp} />
          <Button buttonStyle={{ backgroundColor: "red" }} title="Hatırlat..." onPress={() => onPressSettleUp} />
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
    maxWidth: 100,
    justifyContent: "space-around",
  },
  nameAndSurname: {
    fontSize: 20,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 30,
    width: "60%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
});

export default FriendProfile;
