import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { myTheme } from "../lib/colors";

const MyAvatar = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={classes.root}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
        }}
        style={{
          width: 35,
          height: 35,
        }}
      />
      <View style={classes.rightSection}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name + " " + user.surname}</Text>
        <Text style={{ fontSize: 14, fontWeight: "normal", color: "lightgrey" }}>{user.email}</Text>
      </View>
    </TouchableOpacity>
  );
};

const classes = StyleSheet.create({
  root: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    backgroundColor: myTheme.secondary,
    padding: 16,
    margin: "10px 0px",
  },
  rightSection: {
    marginLeft: 12,
  },
});

export default MyAvatar;
