import React, { useEffect, useState, useContext } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { View, TouchableWithoutFeedback, Text, ScrollView } from "react-native";
import { ENDPOINT_URL } from "../lib/config";
import axios from "axios";
import { AuthContext } from "../components/Contex";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const GroupList = (props) => {
  const navigation = useNavigation();
  let isCanceled = false;
  const [groups, setGroups] = useState([]);
  const { user } = useContext(AuthContext);

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getGroups = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/getGroups`, {
        id: user._id,
      });
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async () => {
    await timeout(2000);
    if (!isCanceled) {
      getGroups();
    }
  };

  const clickDetail = (group) => {
    navigation.navigate("Group-detail", {
      group: group,
    });
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, [groups]);

  return (
    <ScrollView>
      {groups?.map((l, i) => (
        <ListItem key={i} bottomDivider onPress={() => clickDetail(l)}>
          <Avatar source={{ uri: l?.photoUrl }} rounded />
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
};

export default GroupList;
