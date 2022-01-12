import React from "react";
import CustomGroupButton from "../components/CustomGroupButton";
import { Avatar, Button, ListItem } from "react-native-elements";
import { StyleSheet, View, Text, ImageBackground, FlatList, Modal, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import ModalSettleUpList from "./ModalSettleUpList";
import ModalSettleUp from "./ModalSettleUp";
import ModalCost from "./ModalCost";
import ModalGroupSettings from "./ModalGroupSettings";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import { AuthContext } from "./Contex";
const MemberGroupDetail = (props) => {
  const [settleUpListModalVisible, setSettleUpListModalVisible] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState();
  const [settleUpModalVisible, setSettleUpModalVisible] = useState(false);
  const [money, setMoney] = useState();
  const [groupLogs, setGroupLogs] = useState([]);
  const [costModalVisible, setCostModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getGroupMembers();
    getGroupLogs();
  }, []);

  const getGroupLogs = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/get-logs`, {
        groupId: props.group._id,
      });
      const debtLogs = response.data.Logs;
      const responseCost = await axios.post(`${ENDPOINT_URL}/get-cost-logs`, {
        groupId: props.group._id,
      });

      const costLogs = responseCost.data.logs;

      const logs = debtLogs.concat(costLogs);

      logs.sort((firsItem, secondItem) => secondItem.date - firsItem.date);

      setGroupLogs(logs);
    } catch (error) {
      console.log(error);
    }
  };

  const getGroupMembers = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/get-group-members`, {
        groupId: props.group._id,
        user: user,
      });
      const newData = response.data.members.map((item) => ({ ...item, debt: 0 }));

      const responseDebts = await axios.post(`${ENDPOINT_URL}/get-debts`, {
        user: user,
      });
      const debt = responseDebts.data.toUserDebt;

      //Finding two array's common username values and then changing the debt value
      const updatedGroup = newData.map(function (x) {
        var result = debt.filter((a1) => a1.toUser.toString() == x.username.toString());
        if (result.length > 0) {
          x.debt = result[0].debt;
        }
        return x;
      });

      setGroupMembers(updatedGroup);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettleUp = () => {
    getGroupMembers();
    getGroupLogs();
    setSettleUpListModalVisible(true);
  };

  const onPressLogs = async (log) => {
    const groupId = props.group._id;
    //User goes to log's comment page
    props.navigation.navigate("logs-comment", {
      log,
      groupId,
    });
  };

  const addMemberToGroup = () => {
    setSettingsModalVisible(!settingsModalVisible);
    const group = props.group;
    props.navigation.navigate("contact", {
      group,
    });
  };

  const renderLogs = ({ item }) => {
    if (item.debt != undefined) {
      return (
        <TouchableOpacity onPress={() => onPressLogs(item)}>
          <View style={styles.list}>
            <View style={styles.rowDate}>
              <Text style={styles.textListDate}>{item.month}</Text>
              <Text style={styles.textListDate}>{item.date}</Text>
            </View>

            <View style={styles.moneyLogo}>
              <Ionicons name="cash-outline" size={24} />
            </View>
            <View style={styles.listBody}>
              <Text style={{ width: "95%" }}>
                {item.sender} kullanıcısı {item.receiver} kullanıcısına {item.debt} tl borç verdi
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => onPressLogs(item)}>
          <View style={styles.list}>
            <View style={styles.rowDate}>
              <Text style={styles.textListDate}>{item.month}</Text>
              <Text style={styles.textListDate}>{item.date}</Text>
            </View>

            <View style={styles.moneyLogo}>
              <Ionicons name="cash-outline" size={24} />
            </View>
            <View style={styles.listBody}>
              <Text style={{ width: "95%" }}>
                {item.username} kullanıcısı {item.cost} tl değerinde {item.costType} harcaması yaptı
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderCostLogs = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onPressLogs(item)}>
        <View style={styles.list}>
          <View style={styles.rowDate}>
            <Text style={styles.textListDate}>{item.month}</Text>
            <Text style={styles.textListDate}>{item.date}</Text>
          </View>

          <View style={styles.moneyLogo}>
            <Ionicons name="cash-outline" size={24} />
          </View>
          <View style={styles.listBody}>
            <Text>
              {item.username} kullanıcısı {item.cost} tl değerinde {item.costType} masrafı yaptı.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const flatListRender = ({ item }) => {
    if (item.debt > 0) {
      return (
        <ListItem bottomDivider onPress={() => clickDetail(item)}>
          <Avatar source={{ uri: item?.photoUrl }} rounded />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "green" }}>Borcu var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "green" }}>{item.debt} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    } else if (item.debt < 0) {
      return (
        <ListItem bottomDivider onPress={() => clickDetail(item)}>
          <Avatar source={{ uri: item?.photoUrl }} rounded />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title style={{ color: "red" }}>Borcun var</ListItem.Title>
            <ListItem.Subtitle style={{ color: "red" }}>{-item.debt} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    } else {
      return (
        <ListItem bottomDivider onPress={() => clickDetail(item)}>
          <Avatar source={{ uri: item?.photoUrl }} rounded />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>
              <Text style={{ fontWeight: "300" }}>{item.phoneNumber}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: "flex-end", marginRight: 20 }}>
            <ListItem.Title>Borcu var</ListItem.Title>
            <ListItem.Subtitle>{item.debt} tl</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    }
  };

  const clickDetail = (person) => {
    setSelectedMember(person);
    setSettleUpListModalVisible(!settleUpListModalVisible);
    setSettleUpModalVisible(!settleUpModalVisible);
  };

  const onPressSave = async () => {
    if (money) {
      setIsButtonActive(true);
      try {
        const response = await axios.post(`${ENDPOINT_URL}/add-debt`, {
          loggedInUser: user,
          toUser: selectedMember,
          money,
          group: props.group,
        });
        //setGroupMembers ile bu usestate içeresine borç bilgileri eklenmelidir buradan gelecek bilgiye göre
        getGroupLogs();
        setSettleUpModalVisible(!settleUpModalVisible);
        setIsButtonActive(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Hata", "Lutfen gerekli alanlari doldurunuz");
    }
  };

  const handleCost = async () => {
    setCostModalVisible(!costModalVisible);
  };

  const onPressSettings = () => {
    setSettingsModalVisible(!settingsModalVisible);
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.headerSide} source={require("../assets/header_background_friend_profile.jpg")}>
        <ModalSettleUpList
          visible={settleUpListModalVisible}
          onRequestClose={() => setSettleUpListModalVisible(!settleUpListModalVisible)}
          onPressHideModal={() => setSettleUpListModalVisible(!settleUpListModalVisible)}
          FlatListRenderItem={flatListRender}
          FlatListData={groupMembers}
          FlatListKeyExt={(item, index) => index.toString()}
        />

        <ModalSettleUp
          visible={settleUpModalVisible}
          onRequestClose={() => setSettleUpModalVisible(!settleUpModalVisible)}
          onPressHideModal={() => setSettleUpModalVisible(!settleUpModalVisible)}
          onPressSave={onPressSave}
          person={selectedMember}
          inputChange={setMoney}
          disabled={isButtonActive}
        />

        <ModalCost
          visible={costModalVisible}
          onRequestClose={() => setCostModalVisible(!costModalVisible)}
          onPressHideModal={() => {
            setCostModalVisible(!costModalVisible);
            getGroupLogs();
          }}
          group={props.group}
        />

        <ModalGroupSettings
          onPressHideModal={() => setSettingsModalVisible(!settingsModalVisible)}
          visible={settingsModalVisible}
          onRequestClose={() => setSettingsModalVisible(!settingsModalVisible)}
          group={props.group}
          members={groupMembers}
          navigation={props.navigation}
          addMemberToGroup={addMemberToGroup}
          finishGroup={() => props.navigation.navigate("group")}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            marginLeft: 20,
            marginRight: 30,
            justifyContent: "space-between",
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={32}
            onPress={() => {
              props.navigation.pop();
            }}
          />

          <Ionicons name="settings-sharp" size={32} onPress={onPressSettings} />
        </View>
        <View style={styles.avatar}>
          <Avatar
            rounded
            source={{
              uri: props.group.photoUrl,
            }}
            size="large"
          />
        </View>
      </ImageBackground>

      <View style={styles.bodySide}>
        <Text style={styles.username}>{props.group.name}</Text>
        <View style={styles.nameAndSurnameContainer}>
          <Text style={styles.nameAndSurname}>{props.group.description}</Text>
        </View>

        <View style={styles.rowButtons}>
          <CustomGroupButton buttonName="Hesaplaş" onPress={handleSettleUp} />
          <CustomGroupButton buttonName="Masraf Gir" onPress={handleCost} />
          <CustomGroupButton buttonName="Toplam" />
          <CustomGroupButton buttonName="Çizelge" />
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.textDate}> Ocak 2022 </Text>

          <FlatList renderItem={renderLogs} data={groupLogs} keyExtractor={(item, index) => index.toString()} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerSide: {
    flex: 1,
  },

  bodySide: {
    flex: 5,
  },

  avatar: {
    marginLeft: 90,
    marginTop: 15,
  },
  username: {
    marginTop: 50,
    marginLeft: 100,
    fontSize: 32,
  },
  nameAndSurnameContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 100,
    maxWidth: 135,
    alignItems: "flex-start",
  },
  nameAndSurname: {
    fontSize: 20,
  },
  rowButtons: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-around",
  },
  bodyContainer: {
    flex: 1,
    marginLeft: 15,
  },
  textDate: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 5,
    flexDirection: "row",
  },
  rowDate: {
    flexDirection: "column",
    flex: 1,
  },
  textListDate: {
    fontWeight: "300",
  },
  moneyLogo: {
    flex: 1,
  },
  listBody: {
    flexDirection: "row",
    flex: 6,
    justifyContent: "flex-start",
    marginLeft: 20,
    alignItems: "center",
  },
});

export default MemberGroupDetail;
