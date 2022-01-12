import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const CustomButton = (props) => {
  return (
    <View>
      <TouchableOpacity style={style.button} onPress={props.onPress}>
        <Text>{props.buttonName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    height: 50,
    width: "80%",
    backgroundColor: "#4B829E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 15,
    alignSelf: "center",
  },
});

export default CustomButton;
