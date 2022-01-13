import React from "react";
import { StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard } from "react-native";

const CustomTextInput = (props) => {
  return (
    <View>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor="#DCCBDC"
        style={style.textInput}
        value={props.value}
        onChangeText={props.onChangeText}
        keyboardApperance="dark"
        secureTextEntry={props.IsPassword}
        keyboardType={props.keyboardType}
        {...props}
      />
    </View>
  );
};

const style = StyleSheet.create({
  textInput: {
    height: 40,
    width: "70%",
    backgroundColor: "#646468",
    borderRadius: 25,
    borderColor: "white",
    justifyContent: "center",
    paddingLeft: 20,
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default CustomTextInput;
