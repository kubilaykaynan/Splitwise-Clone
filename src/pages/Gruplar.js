import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import Avatar from "react-native-elements/dist/avatar/Avatar";
import GroupList from "../components/GroupList";

const Gruplar = ({ accessoryProps, navigation }) => {
  const [groupDetail, setGroupDetail] = useState();

  const onPressAddGroup = () => {
    navigation.navigate("Group-add");
  };

  const clickDetail = (data) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          style={styles.searchButton}
          name="search"
          size={32}
          onPress={() => console.log("clicked search button")}
        />
        <TouchableOpacity onPress={() => onPressAddGroup()}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginRight: 30 }}>Grup Başlat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.topic}> Gruplar</Text>
        <ImageBackground
          style={styles.accountImage}
          imageStyle={{ borderRadius: 25 }}
          source={require("../assets/arkaplan4.jpg")}
        >
          <View style={styles.accountContainer}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Avatar
                source={{
                  uri: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
                }}
                size="large"
                rounded
              >
                <Avatar.Accessory {...accessoryProps} />
              </Avatar>
            </View>

            <View
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "700" }}>Toplam Bakiye</Text>
              <Text style={{ color: "green" }}>Borcun 0 TL</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Ionicons name="funnel" size={32} onPress={() => console.log("clicked funnel button")} />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.list}>
          <GroupList></GroupList>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  body: {
    flex: 6,
  },

  searchButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topic: {
    fontSize: 32,
    fontWeight: "600",
    marginLeft: 15,
  },

  accountImage: {
    width: "95%",
    alignSelf: "center",
    marginLeft: 10,
    flex: 1,
    marginTop: 20,
  },

  accountContainer: {
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  list: {
    flex: 5,
    marginTop: 20,
  },
});

export default Gruplar;
