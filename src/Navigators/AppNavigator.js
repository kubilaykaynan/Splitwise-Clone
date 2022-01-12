import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GirisSayfasi from "../pages/GirisSayfasi";
import KayitOl from "../pages/KayitOl";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={GirisSayfasi}>
        <Stack.Screen
          name="Giris"
          component={GirisSayfasi}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="KayitOl"
          component={KayitOl}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
