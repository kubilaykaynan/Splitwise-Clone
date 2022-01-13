import React, { useEffect, useState, useContext } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { View, TouchableWithoutFeedback } from "react-native";
import { ENDPOINT_URL } from "../lib/config";
import axios from "axios";
import { AuthContext } from "../components/Contex";
import { Button } from "react-native-elements";

const FriendsList = (props) => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  let isCanceled = false;

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getFriends = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/getFriends`, {
        username: user.username,
      });

      setFriends(response.data?.friends);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressFriendRemove = async (friend) => {
    const response = await axios.post(`${ENDPOINT_URL}/removeFriend`, {
      user_id: user._id,
      removeFriend_id: friend._id,
    });
  };

  const handleChange = async () => {
    await timeout(2000);
    if (!isCanceled) {
      getFriends();
    }
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, [friends]);

  return (
    <View>
      {friends.map((item) => (
        <ListItem.Swipeable
          onPress={() => props.onPress(item)}
          key={item._id}
          bottomDivider
          rightContent={
            <Button
              title="Delete"
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
              onPress={() => onPressFriendRemove(item)}
            />
          }
        >
          <Avatar source={{ uri: item.photoUrl }} rounded />

          <ListItem.Content>
            <ListItem.Title>{item.username}</ListItem.Title>
            <ListItem.Subtitle>{item.name}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      ))}
    </View>

    /*
    <View>
      <TouchableOpacity onPress={() => console.log("hi")}>
        <ListItem.Swipeable
          leftContent={
            <Button title="Info" icon={{ name: "info", color: "white" }} buttonStyle={{ minHeight: "100%" }} />
          }
          rightContent={
            <Button
              title="Delete"
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
              onPress={() => console.log("right content works")}
            />
          }
        >
          <ListItem.Content>
            <ListItem.Title>Hello Swiper</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      </TouchableOpacity>
    </View>*/
  );
};

export default FriendsList;
