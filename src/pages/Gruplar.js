import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import Avatar from "react-native-elements/dist/avatar/Avatar";
import GroupList from "../components/GroupList";
import { AuthContext } from "../components/Contex";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
const Gruplar = ({ accessoryProps, navigation }) => {
  const { user } = useContext(AuthContext);
  const [totalDebt, setTotalDebt] = useState();
  let isCanceled = false;
  const onPressAddGroup = () => {
    navigation.navigate("Group-add");
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleChange = async () => {
    await timeout(2000);
    if (!isCanceled) {
      getTotalDebt();
    }
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, []);

  const getTotalDebt = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/get-total-debts`, {
        user_id: user._id,
      });
      setTotalDebt(response.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const debt = () => {
    if (totalDebt >= 0) {
      return <Text style={{ color: "green" }}>Alacağın borç {totalDebt}TL</Text>;
    } else {
      return <Text style={{ color: "red" }}>Vereceğin borç {totalDebt}TL</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          style={styles.searchButton}
          name="search"
          size={32}
          onPress={() => console.log("clicked search button")}
        />
        <TouchableOpacity onPress={() => onPressAddGroup()}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginRight: 30 }}>Grup Başlat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.topic}> Gruplar</Text>
        <ImageBackground
          style={styles.accountImage}
          imageStyle={{ borderRadius: 25 }}
          source={require("../assets/arkaplan4.jpg")}
        >
          <View style={styles.accountContainer}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Avatar
                source={{
                  uri: user.photoUrl,
                }}
                size="large"
                rounded
              >
                <Avatar.Accessory {...accessoryProps} />
              </Avatar>
            </View>

            <View
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "700" }}>Toplam Bakiye</Text>
              {debt()}
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Ionicons name="funnel" size={32} onPress={() => console.log("clicked funnel button")} />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.list}>
          <GroupList></GroupList>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  body: {
    flex: 6,
  },

  searchButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topic: {
    fontSize: 32,
    fontWeight: "600",
    marginLeft: 15,
  },

  accountImage: {
    width: "95%",
    alignSelf: "center",
    marginLeft: 10,
    flex: 1,
    marginTop: 20,
  },

  accountContainer: {
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  list: {
    flex: 5,
    marginTop: 20,
  },
});

export default Gruplar;
