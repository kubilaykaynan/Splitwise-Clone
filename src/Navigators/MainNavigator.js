import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Anasayfa from "../pages/Anasayfa";
import Gruplar from "../pages/Gruplar";
import Profil from "../pages/Profil";
import GrupEkle from "../pages/GrupEkle";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddFriends from "../pages/AddFriends";
import FriendProfile from "../pages/FriendProfile";
import AddGroup from "../components/AddGroup";
import GroupDetail from "../pages/GroupDetail";
import Contact from "../pages/Contact";
import LogsComment from "../pages/LogsComment";
import FinishGroup from "../pages/FinishGroup";
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const GroupStack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Gruplar"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Arkadaslar") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Gruplar") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person-circle-outline" : "person-circle";
          } else if (route.name === "Grup Ekle") {
            iconName = focused ? "add" : "add-circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Arkadaslar" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Gruplar" component={GroupStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Grup Ekle" component={GrupEkle} options={{ headerShown: false }} />
      <Tab.Screen name="Profil" component={Profil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Anasayfa",
          headerRight: ({}) => {
            return (
              <Ionicons
                name="add"
                style={{ marginRight: 12 }}
                size={25}
                onPress={() => navigation.navigate("add-friends")}
              />
            );
          },
        }}
        component={Anasayfa}
      />
      <HomeStack.Screen
        name="add-friends"
        options={{
          headerShown: false,
        }}
        component={AddFriends}
      />
      <HomeStack.Screen
        name="friend-profile"
        options={{
          headerShown: false,
        }}
        component={FriendProfile}
      />
    </HomeStack.Navigator>
  );
};

const GroupStackScreen = ({ navigation }) => {
  return (
    <GroupStack.Navigator>
      <GroupStack.Screen
        name="group"
        options={{
          headerShown: false,
        }}
        component={Gruplar}
      />
      <GroupStack.Screen
        name="Group-add"
        options={{
          headerShown: false,
        }}
        component={AddGroup}
      />
      <GroupStack.Screen
        name="Group-detail"
        options={{
          headerShown: false,
        }}
        component={GroupDetail}
      />
      <GroupStack.Screen
        name="contact"
        options={{
          headerShown: false,
        }}
        component={Contact}
      />

      <GroupStack.Screen
        name="logs-comment"
        options={{
          headerShown: false,
        }}
        component={LogsComment}
      />

      <GroupStack.Screen
        name="finish-group"
        options={{
          headerShown: false,
        }}
        component={FinishGroup}
      />
    </GroupStack.Navigator>
  );
};

export default MainNavigator;
