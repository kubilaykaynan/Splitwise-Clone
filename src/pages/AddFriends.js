import React, { useContext, useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements/dist/input/Input";
import FlexLayout from "../components/layouts/flexLayout";
import { myTheme } from "../lib/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import useUsers from "../hooks/useGetUsers";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import ListItem from "react-native-elements/dist/list/ListItem";
import Avatar from "react-native-elements/dist/avatar/Avatar";
import MyAvatar from "../components/avatar";
import Overlay from "react-native-elements/dist/overlay/Overlay";
import { Button } from "react-native-elements";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import { AuthContext } from "../components/Contex";
import * as Contacs from "expo-contacts";
import ContactList from "../components/ContactList";

const AddFriends = ({ navigation }) => {
  /*
  const [searchFilter, setSearchFilter] = useState("");

  const [modalConfig, setModalConfig] = useState({
    show: false,
    selectedItem: undefined,
  });

  const { data, loading, error } = useUsers();

  if (loading) {
    return <Text>Loading..</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>Hata: {error}</Text>;
  }

  const handleAddFriends = async (userId) => {
    console.log("secilen:", userId);
    const res = axios
      .post(`${ENDPOINT_URL}/addFriends`, {
        me: user._id,
        to: userId,
      })
      .then((data) => {
        Alert.alert("Başarılı", "Başarıyla eklendi!");
      })
      .catch((err) => {
        Alert.alert("Error", "Hata ile karşılaşıldı");
      });
    setModalConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };
  return (
    <FlexLayout>
      <View style={{ marginTop: 12 }}>
        <SearchBar
          showLoading={loading}
          placeholder="Arkadaş Ara"
          onChangeText={(text) => setSearchFilter(text)}
          value={searchFilter}
        />
      </View>

      <View>
        {data?.map((user) => (
          <ListItem
            key={user._id}
            onPress={() => {
              setModalConfig((prev) => ({
                ...prev,
                show: true,
                selectedItem: user,
              }));
            }}
            bottomDivider
          >
            <Avatar
              source={{
                uri: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
              }}
              rounded
            />
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
      <Overlay
        isVisible={modalConfig.show}
        onBackdropPress={() => {
          setModalConfig((prev) => ({
            ...prev,
            show: false,
          }));
        }}
      >
        <Text>{modalConfig?.selectedItem?.username}</Text>
        <Button
          title="Arkadaş Ekle"
          background={myTheme.primary}
          style={{ color: "#fff" }}
          onPress={() => {
            handleAddFriends(modalConfig?.selectedItem?._id);
          }}
        />
      </Overlay>
    </FlexLayout>
  );*/
  //get data from the device contact
  /*
  let contact;

  const getContacts = async () => {
    const { status } = await Contacs.requestPermissionsAsync();

    if (status === "granted") {
      const { data } = await Contacs.getContactsAsync({
        fields: [Contacs.Fields.Name],
      });

      if (data.length > 0) {
        data.map((user) => {
          contact = user;

          console.log(contact.firstName + contact.phoneNumbers, contact.uri);
        });
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <FlexLayout>
      <View style={{ marginTop: 12 }}>
        <SearchBar
          showLoading={loading}
          placeholder="Arkadaş Ara"
          onChangeText={(text) => setSearchFilter(text)}
          value={searchFilter}
        />
      </View>

      <View>
        {contact?.map((user) => (
          <ListItem
            key={user.id}
            onPress={() => {
              setModalConfig((prev) => ({
                ...prev,
                show: true,
                selectedItem: user,
              }));
            }}
            bottomDivider
          >
            <Avatar
              source={{
                uri: user.uri,
              }}
              rounded
            />
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
      <Overlay
        isVisible={modalConfig.show}
        onBackdropPress={() => {
          setModalConfig((prev) => ({
            ...prev,
            show: false,
          }));
        }}
      >
        <Text>{modalConfig?.selectedItem?.name} </Text>
        <Text>{modalConfig?.selectedItem?.phonenumber}</Text>
        <Button
          title="Arkadaş Ekle"
          background={myTheme.primary}
          style={{ color: "#fff" }}
          onPress={() => {
            //handleAddFriends(modalConfig?.selectedItem?._id);
          }}
        />
      </Overlay>
    </FlexLayout>
  );*/

  const [selectedContact, setSelectedContact] = useState([]);
  const { user } = useContext(AuthContext);

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/add-friends-from-contact`, {
        me: user._id,
        to: selectedContact,
      });
      if (response.status == 201) {
        navigation.navigate("home");
      } else {
        Alert.alert("hata", response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Text style={styles.headerText} onPress={() => navigation.pop()}>
              İptal
            </Text>
          </TouchableOpacity>
          <Text style={styles.addGroupText}>Arkadaş Ekle</Text>
          <TouchableOpacity onPress={handleAddFriend}>
            <Text style={styles.headerText}> Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <ContactList onChange={(data) => setSelectedContact(data)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1CC29F",
  },
  body: {
    flex: 6,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  addGroupText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddFriends;
