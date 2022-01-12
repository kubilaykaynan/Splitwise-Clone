import React, { useState, useEffect, useContext } from "react";
import CustomGroupButton from "../components/CustomGroupButton";
import { Avatar, Button, ListItem, CheckBox, Icon, SearchBar } from "react-native-elements";
import { StyleSheet, View, Text, ImageBackground, FlatList, SectionList, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "./Contex";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import * as Contacts from "expo-contacts";
const ContactList = (props) => {
  const [contact, setContact] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  let isCanceled = false;

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const newData = data.map((item) => ({ ...item, checked: false }));
        setContact(newData);
        setFilteredDataSource(newData);
      }
    }
  };

  const handleChange = async () => {
    getContact();
    //settingCheck();
    await timeout(1000);
    if (!isCanceled) {
    }
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, []);

  const clickedSelect = (friend) => {
    let selectedList = [];
    setContact((prevState) =>
      prevState.map((item) => (item.id === friend.id ? { ...item, checked: !item.checked } : item))
    );

    setFilteredDataSource((prevState) =>
      prevState.map((item) => (item.id === friend.id ? { ...item, checked: !item.checked } : item))
    );

    if (!friend.checked) {
      setSelectedContacts((prevState) => [...prevState, friend]);
      selectedList = [...selectedContacts, friend];
    } else {
      let filteredData = selectedContacts.filter((person) => person.id !== friend.id);
      selectedList = filteredData;
      setSelectedContacts(filteredData);
    }

    props.onChange(selectedList);
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = contact.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      setFilteredDataSource(contact);
      setSearch(text);
    }
  };

  const itemView = ({ item }) => {
    return (
      <ListItem bottomDivider onPress={() => clickedSelect(item)}>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
        <ListItem.CheckBox
          checkedIcon={
            <Icon name="radio-button-checked" type="material" color="green" size={25} iconStyle={{ marginRight: 10 }} />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          checked={item.checked}
          onPress={() => clickedSelect(item)}
        />
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        containerStyle={{ backgroundColor: "#1CC29F", color: "white" }}
        inputContainerStyle={{ backgroundColor: "white" }}
        lightTheme
        onClear={(text) => searchFilterFunction("")}
      />
      <View style={styles.grayLine}>
        <Text style={{ marginLeft: 20 }}> Telefonundaki Kişiler</Text>
      </View>

      <View style={styles.list}>
        <FlatList data={filteredDataSource} keyExtractor={(item, index) => index.toString()} renderItem={itemView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grayLine: {
    backgroundColor: "lightgray",
    height: 30,
    width: "100%",
    justifyContent: "center",
  },
  list: {
    flex: 1,
  },
});

export default ContactList;
