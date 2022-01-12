import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Input, Avatar, ListItem, Button } from "react-native-elements";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import { AuthContext } from "../components/Contex";

const FinishGroup = (props) => {
  const [costs, setCosts] = useState([]);

  const { user } = useContext(AuthContext);

  const getGroupCosts = async () => {
    const responseMembers = await axios.post(`${ENDPOINT_URL}/get-all-group-members`, {
      groupId: props.group._id,
    });
    const members = responseMembers.data.members.map((item) => {
      return { username: item.username };
    });

    const responseCost = await axios.post(`${ENDPOINT_URL}/get-cost-logs`, {
      groupId: props.group._id,
    });
    const cost = responseCost.data.logs.map((item) => {
      return { username: item.username, cost: item.cost };
    });

    const notDuplicatedCost = toFindDuplicates(cost);

    const result = members.filter((f) => !notDuplicatedCost.some((d) => d.username == f.username));
    const notCommons = result.map((item) => {
      return { username: item.username, cost: 0 };
    });
    //console.log("not commons", notCommons);

    const newCostArray = notDuplicatedCost.concat(notCommons);

    const totalCosts = newCostArray.reduce((total, item) => {
      return total + item.cost;
    }, 0);

    const totalCostsShouldBe = totalCosts / newCostArray.length;

    setCosts(
      newCostArray.map((item) => {
        return { username: item.username, cost: Math.round(item.cost - totalCostsShouldBe) };
      })
    );
  };

  const toFindDuplicates = (arr) => {
    var duplicateIndex = {};
    var outputArr = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var collisionIndex = duplicateIndex[item.username];
      if (collisionIndex > -1) {
        outputArr[collisionIndex].cost += item.cost;
      } else {
        outputArr.push(item);
        duplicateIndex[item.username] = outputArr.length - 1;
      }
    }
    return outputArr;
  };

  useEffect(() => {
    getGroupCosts();
  }, []);

  const costsRender = ({ item }) => {
    if (item.cost >= 0) {
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{item.username}</Text>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "green" }}>Alacağı var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "green" }}>{item.cost} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    } else {
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.username}</ListItem.Title>
            <ListItem.Subtitle>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "red" }}>Vereceği var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "red" }}>{-item.cost} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    }
  };

  const finishGroup = async () => {
    const response = await axios.post(`${ENDPOINT_URL}/delete-group`, {
      groupId: props.group._id,
    });
    if (response.data) {
      props.navigation.pop();
    }
  };

  return (
    <View style={styles.fullView}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}> {props.group.name}</Text>
      </View>
      <View style={styles.body}>
        <Text style={{ fontWeight: "bold", fontSize: 20, alignSelf: "center", margin: 20 }}>
          Alınacaklar Ve Verilecekler
        </Text>
        <FlatList data={costs} renderItem={costsRender} keyExtractor={(item, index) => index.toString()} />
        <Button
          title="Grubu Sil"
          buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
          containerStyle={{
            height: 40,
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: "center",
            marginBottom: 20,
          }}
          titleStyle={{ color: "white", marginHorizontal: 20 }}
          onPress={finishGroup}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullView: {
    flex: 1,

    backgroundColor: "white",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#1CC29F",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  body: {
    flex: 7,
  },
});

export default FinishGroup;
