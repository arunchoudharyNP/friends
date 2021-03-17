import React, { useLayoutEffect, useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { firestore } from "firebase";
import CardCom from "../../components/appComponents/CardCom";

const AdminProfile = (props) => {
  const { docId, userName } = props.route.params;
  console.log(docId);
  console.log(userName);
  const db = firestore();
  const [users, setusers] = useState([]);
  const roomsRef = db.collection("ServiceAccount").doc(docId);

  let user;

  // setusers(user);

  // useEffect(() => {
  //   const unsubscribe = roomsRef.onSnapshot((querySnapShot) => {
  //     const usersFirestore = querySnapShot
  //       .docChanges()
  //       .filter(({ type }) => (type = "added"))
  //       .map(({ doc }) => {
  //         const userData = doc.id;
  //         return { id };
  //       })

  //     setusers(usersFirestore);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const startChat = (id) => {
    console.log("id" + id);

    props.navigation.navigate("chatScreen", { id,docId ,userName});
  };

  useEffect(() => {
    let user;
    const unsubscribe = roomsRef.get().then((snapDoc) => {
      if (snapDoc) {
        user = snapDoc.data().users;
        //  setusers(resData)
        console.log(user);
        setusers(user);
      } else {
        console.log("No Document found");
      }
      // setusers(user);
    });

    // setusers(user)
    return () => {
      unsubscribe;
    };
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity>
            <Ionicons
              name="md-menu"
              size={36}
              onPress={() => {
                props.navigation.openDrawer();
              }}
              color="white"
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {users && <CardCom data={users} chatHandler={(id) => startChat(id)} />}
    </View>
  );
};

export default AdminProfile;
