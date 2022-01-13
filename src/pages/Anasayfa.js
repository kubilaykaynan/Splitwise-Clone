import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../components/Contex";
import FriendsList from "../components/FriendsList";
import Ionicons from "react-native-vector-icons/Ionicons";

const Anasayfa = ({ navigation }) => {
  const { theme } = useTheme();
  const [error, setError] = useState(false);
  const [avatarURI, setAvatarURI] = useState(null);
  const [avatarTitle, setAvatarTitle] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setAvatarURI(user.photoUrl);
    setAvatarTitle(user.name.charAt(0).toUpperCase() + user.surname.charAt(0).toUpperCase());
  }, []);

  if (error) {
    return (
      <Text
        style={{
          color: "gray",
        }}
      >
        Error!!!
      </Text>
    );
  }

  const avatar = () => {
    if (avatarURI != null) {
      return (
        <View style={styles.avatar}>
          <Avatar
            rounded
            source={{ uri: avatarURI }}
            overlayContainerStyle={{ backgroundColor: "gray", position: "relative" }}
            size={50}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.avatar}>
          <Avatar rounded title={avatarTitle} overlayContainerStyle={{ backgroundColor: "gray" }} size={50} />
        </View>
      );
    }
  };

  const onPressFriendProfile = (user) => {
    console.log("you clicked the user :", user.username);

    navigation.navigate("friend-profile", {
      user: user,
    });
  };

  return (
    <ScrollView style={styles.mainArea}>
      <View style={styles.headerContainer}>
        {avatar()}
        <Ionicons name="add" style={{ marginRight: 16 }} size={32} onPress={() => navigation.navigate("add-friends")} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.topic}> Arkadaşlar</Text>
        <FriendsList onPress={onPressFriendProfile} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 35,
    marginTop: 20,
  },
  bodyContainer: {
    flex: 1,
  },
  avatar: {
    flex: 1,
    marginLeft: 5,
  },
  mainArea: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  topic: {
    fontSize: 32,
    fontWeight: "600",
    marginLeft: 25,
    marginBottom: 20,
  },
});

export default Anasayfa;
