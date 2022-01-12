import React, { useState } from "react";
import CustomGroupButton from "../components/CustomGroupButton";
import { SearchBar } from "react-native-elements";
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ContactList from "../components/ContactList";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";

const Contact = ({ route, navigation }) => {
  const [selectedContact, setSelectedContact] = useState([]);
  const { group } = route.params;

  const handleAddMemberToGroup = async () => {
    try {
      const response = await axios.post(`${ENDPOINT_URL}/add-member-to-group`, {
        users: selectedContact.map((person) => person),
        groupId: group._id,
      });
      console.log("response:", response.data.updatedGroup);
      navigation.navigate("group");
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
          <Text style={styles.addGroupText}>Gruba Kişi Ekle</Text>
          <TouchableOpacity onPress={handleAddMemberToGroup}>
            <Text style={styles.headerText}> Bitti</Text>
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

export default Contact;
