import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";
import { AuthContext } from "../components/Contex";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  BackgroundImage,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ModalPhoto from "../components/ModalPhoto";
const LogsComment = ({ route, navigation }) => {
  const { log, groupId } = route.params;
  const [comment, setComment] = useState();
  const [allComments, setAllComments] = useState([]);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const { user } = useContext(AuthContext);
  let isCanceled = false;
  const getAllComments = async () => {
    const response = await axios.post(`${ENDPOINT_URL}/get-comments`, {
      groupId,
      logId: log.id,
    });
    setAllComments(response.data.comments);
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleChange = async () => {
    await timeout(2000);
    if (!isCanceled) {
      getAllComments();
    }
  };

  const modalImage = () => {
    console.log(modalImageVisible);
    if (modalImageVisible) {
      return (
        <Modal
          visible={modalImageVisible}
          onRequestClose={() => setModalImageVisible(!modalImageVisible)}
          animationType="slide"
          transparent={true}
        >
          <BackgroundImage source={{ uri: log.costPhotoUri }} style={{ flex: 1 }} />
        </Modal>
      );
    } else {
      return <View></View>;
    }
  };

  const renderCommentList = ({ item }) => {
    const hour = item.date.slice(11, 16);
    if (item.username.toString() === user.username.toString()) {
      return (
        <View style={styles.userCommentList}>
          <View style={styles.rowCommentList}>
            <Text style={styles.userCommentText}>{item.comment}</Text>
            <Text style={styles.userCommentDateText}>{hour} </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.otherUserCommentList}>
          <View style={styles.rowCommentList}>
            <Text style={{ marginRight: 15, alignSelf: "flex-start" }}>{item.username}</Text>
            <Text style={styles.userCommentText}>{item.comment}</Text>
            <Text style={styles.userCommentDateText}>{hour} </Text>
          </View>
        </View>
      );
    }
  };

  const ImageRender = () => {
    if (log.costPhotoUri) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            setModalImageVisible(!modalImageVisible);
            console.log(modalImageVisible);
          }}
        >
          <Image
            source={{ uri: log.costPhotoUri }}
            style={{ height: 100, width: "50%", alignSelf: "center", borderRadius: 10 }}
          />
        </TouchableWithoutFeedback>
      );
    }
  };

  const addComment = async () => {
    if (comment) {
      const response = await axios.post(`${ENDPOINT_URL}/add-comment`, {
        username: user.username,
        comment,
        groupId,
        logId: log.id,
      });

      console.log(response.data.comments);
      setComment(null);
    } else {
      Alert.alert("Hata", "Lutfen gecerli bir yorum giriniz");
    }
  };

  useEffect(() => {
    handleChange();

    return () => {
      isCanceled = true;
    };
  }, [allComments]);
  if (log.debt != undefined) {
    return (
      <View style={styles.mainContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <View style={styles.backButton}>
                <Ionicons name="chevron-back-sharp" size={30} />
                <Text style={styles.textBack}> Geri </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.commentHeader}>
              <Ionicons name="cash-outline" size={56} style={{ color: "green" }} />
              <Text style={styles.textCommentHeader}>Sen {log.receiver} kullanıcısına ödedin</Text>
              <Text style={styles.textDebt}>{log.debt}TL</Text>
              <Text style={styles.textDate}>
                {log.date} {log.month} {log.year} tarihinde eklendi
              </Text>
            </View>
            <View style={styles.commentBody}>
              <View style={styles.commentList}>
                <FlatList
                  data={allComments}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderCommentList}
                />
              </View>
              <View style={styles.commentArea}>
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setComment}
                    value={comment}
                    placeholder="Yorum Ekleyin..."
                  />
                </View>
                <TouchableOpacity onPress={addComment}>
                  <Ionicons name="send-sharp" size={24} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <ModalPhoto
          visible={modalImageVisible}
          onRequestClose={() => setModalImageVisible(!modalImageVisible)}
          onPressHideModal={() => setModalImageVisible(!modalImageVisible)}
          costPhotoUri={log.costPhotoUri}
        />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <View style={styles.backButton}>
                <Ionicons name="chevron-back-sharp" size={30} />
                <Text style={styles.textBack}> Geri </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.commentHeader}>
              <Ionicons name="cash-outline" size={56} style={{ color: "green" }} />
              <Text style={styles.textCommentHeader}>
                {log.username} kullanıcısı {log.description} harcaması yaptı
              </Text>
              <Text style={styles.textDebt}>{log.cost}TL</Text>
              <Text style={styles.textDate}>
                {log.date} {log.month} {log.year} tarihinde eklendi
              </Text>
            </View>
            <View style={styles.commentBody}>
              {ImageRender()}
              <View style={styles.commentList}>
                <FlatList
                  data={allComments}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderCommentList}
                />
              </View>
              <View style={styles.commentArea}>
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setComment}
                    value={comment}
                    placeholder="Yorum Ekleyin..."
                  />
                </View>
                <TouchableOpacity onPress={addComment}>
                  <Ionicons name="send-sharp" size={24} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  body: {
    flex: 6,
    backgroundColor: "white",
  },
  backButton: {
    height: 40,
    width: 65,
    marginLeft: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textBack: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  commentHeader: {
    flex: 1,
    alignItems: "center",
  },
  commentBody: {
    flex: 3,
    marginTop: 20,
  },
  textCommentHeader: {
    fontSize: 18,
    marginTop: 10,
  },
  textDebt: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  textDate: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "300",
  },
  commentList: {
    flex: 8,
  },
  inputArea: {
    flex: 1,
  },
  commentArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    margin: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    height: 40,
    width: "90%",
  },
  userCommentList: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
    marginTop: 25,
  },
  otherUserCommentList: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 25,
  },
  userCommentText: {
    fontSize: 14,
    color: "white",
  },
  rowCommentList: {
    backgroundColor: "#007A62",
    padding: 12,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userCommentDateText: {
    marginTop: 10,
    fontWeight: "200",
    fontSize: 10,
    marginLeft: 6,
    color: "white",
  },
});

export default LogsComment;
