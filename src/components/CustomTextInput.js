import React from "react"
import { StyleSheet, TextInput, View } from "react-native"

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
        {...props}
      />
    </View>
  )
}

const style = StyleSheet.create({
  textInput: {
    height: 50,
    width: "80%",
    backgroundColor: "#646468",
    borderRadius: 25,
    borderColor: "white",
    justifyContent: "center",
    paddingLeft: 20,
    marginVertical: 10,
    alignSelf: "center",
  },
})

export default CustomTextInput
