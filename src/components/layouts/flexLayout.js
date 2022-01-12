import React from "react";
import { StyleSheet, View } from "react-native";
import { myTheme } from "../../lib/colors";

const FlexLayout = ({ children }) => {
  return <View style={classes.root}>{children}</View>;
};

const classes = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: myTheme.primary,
    color: myTheme.textColor,
  },
});

export default FlexLayout;
