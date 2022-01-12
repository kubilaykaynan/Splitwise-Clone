import { Avatar, Button } from "react-native-elements";
import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
const CustomGroupButton = (props) => {
  return (
    <View>
      <Button
        title={props.buttonName}
        buttonStyle={{
          borderColor: "rgb(151, 153, 154)",
        }}
        type="outline"
        raised
        titleStyle={{ color: "rgb(97, 100, 104)" }}
        containerStyle={props.containerStyle}
        onPress={props.onPress}
      />
    </View>
  );
};

export default CustomGroupButton;
