import React, { useState, useEffect, useRef } from "react";
import { Text, View, ActivityIndicator, Image, StyleSheet } from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import { firestore } from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ChatActions from "../../store/actions/ChatActions";
import CryptoJS, { AES } from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";

import init from "../../components/Helper/db";

const ChatScreen = (props) => {
  const { id, docId, userName } = props.route.params;

 const notified = useRef(true);
 const sendFlag  = useRef(true);

  let messageFireStore = [];
  let storeMesseges = [];

  const dispatch = useDispatch();

  useEffect(() => {
    init(id + userName)
      .then(() => {
        console.log("DB Initialized");
        dispatch(ChatActions.loadMessages(id + userName));
      })
      .catch((err) => {
        console.log("DB initialization failed " + err);
      });
  }, []);

  const [messages, setmessages] = useState([]);

  storeMesseges = useSelector((state) =>
    state.ChatReducers.messages
      ? state.ChatReducers.messages
      : [
          {
            _id: "Dummy_Bot_Welcome_message",
            createdAt: new Date(),
            text: "Hello, Welcome to the Sane App. Send hello to your friend.",
            user: {
              _id: 3,
              name: "Bot",
            },
          },
        ]
  );

  const currentMessageId = useRef(
    storeMesseges.length > 0
      ? storeMesseges.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[storeMesseges.length - 1]._id
      : "Dummy"
  );

  console.log("storeMessages");
  console.log(storeMesseges);

  const db = firestore();
  const chatRef = db.collection("ServiceAccount").doc(docId).collection(id);

  const headerLogo = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={styles.logoTitle}>{id}</Text>
      </View>
    );
  };

  const checkMessages = (messageFireStore) => {
    let flag = true;
    messageFireStore.forEach((data) => {
      const exist = storeMesseges.findIndex((msg) => msg._id == data._id);

      if (exist < 0) {
        flag = false;
        return flag;
      }

      return flag;
    });
    return flag;
  };

  async function sendPushNotification(number) {
    const message = {
      to: "ExponentPushToken[Eu1-VVEHcw9W3DRiaPangI]",
      sound: "default",
      title: "New Messages",
      body: `You have ${number} new messages from ${userName}`,
      data: { someData: "goes here" },
      badge: 1
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    const unsubscribe = chatRef.onSnapshot((querySnapShot) => {
      messageFireStore = querySnapShot
        .docChanges()
        .filter(({ type }) => type == "added")
        .map(({ doc }) => {
          let message = doc.data();
          const text = AES.decrypt(message.text, message._id).toString(
            CryptoJS.enc.Utf8
          );
          message.text = text;
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      if (messageFireStore.length) {
        if (storeMesseges && !checkMessages(messageFireStore)) {
          console.log("Called");
          messageFireStore.forEach((data) => {
            dispatch(ChatActions.addMessage(data, id + userName));
          });

          if (messageFireStore[messageFireStore.length - 1].user._id == 1) {
            chatRef.get().then((data) => {
              data.forEach((doc) => {
                doc.ref.delete();
              });
            });
          } else {

            if(notified.current && sendFlag.current ){
              sendPushNotification(1);
              notified.current = false;
            }
            
          }

          // console.log(currentMessageId);
        }
      }

      appendMessages(messageFireStore);
    });

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: "black",
        borderBottomWidth: 0.2,
        borderColor: "grey",
      },
      headerTintColor: "white",
      headerTitle: headerLogo(),
    });

    return () => unsubscribe();
  }, []);

  const appendMessages = (msg) => {
    setmessages((prevState) => GiftedChat.append(prevState, msg));
  };

  const onSend = async (msg) => {
    sendFlag.current = true;
    const writes = msg.map((m) => {
      currentMessageId.current = m._id;
      const encryptText = AES.encrypt(m.text, m._id).toString();
      m.text = encryptText;
      // console.log(m);

      chatRef.add(m);
    });
    await Promise.all(writes);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <GiftedChat
        messages={
          storeMesseges &&
          storeMesseges.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        }
        onSend={onSend}
        user={{
          _id: 2,
          name: userName,
        }}
        renderLoading={() => {
          <ActivityIndicator size="large" color="white" />;
        }}
        textInputStyle={{
          color: "white",
          backgroundColor: "#3C3E3E",
          borderRadius: 20,
          paddingLeft: 15,
        }}
        textInputProps={{
          multiline: true,
        }}
        alwaysShowSend
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: "black",
                borderTopColor: "black",
                marginBottom: 3,
              }}
            />
          );
        }}
        renderSend={(props) => {
          return (
            <Send {...props}>
              <MaterialCommunityIcons
                name="send-circle"
                size={38}
                color="#CF406E"
                style={{ paddingHorizontal: 10, alignItems: "center" }}
              />
            </Send>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#ae1297",
                },

                left: {
                  backgroundColor: "#3C3E3E",
                },
              }}
              textStyle={{
                left: {
                  color: "white",
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 500,
    overflow: "hidden",
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "white",
    lineHeight: 50,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default ChatScreen;
