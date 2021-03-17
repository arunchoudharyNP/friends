import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { firestore } from "firebase";

const ChatScreen = (props) => {
  const { id,docId,userName } = props.route.params;

  console.log(id);

  const db = firestore();
    const chatRef = db.collection("ServiceAccount").doc(docId).collection(id);

    useEffect(() => {
      const unsubscribe = chatRef.onSnapshot((querySnapShot) => {
        const messageFireStore = querySnapShot
          .docChanges()
          .filter(({ type }) => (type = "added"))
          .map(({ doc }) => {
            const message = doc.data();
            return { ...message, createdAt: message.createdAt.toDate() };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        appendMessages(messageFireStore);
      });

      return () => unsubscribe();
    }, []);

  const appendMessages = (msg) => {
    setmessages((prevState) => GiftedChat.append(prevState, msg));
  };

  const [messages, setmessages] = useState([]);

  const onSend = async (msg) => {
    const writes = msg.map((m) => chatRef.add(m));
    await Promise.all(writes);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 2,
          name: userName,
        }}
      />
    </View>
  );
};

export default ChatScreen;
