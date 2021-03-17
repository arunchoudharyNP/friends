import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button } from "../helpingComponents";

const CardCom = (props) => {
  const { containerStyle, data, chatHandler, ...restProps } = props;

  const renderData = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.container}
        onPress={() =>chatHandler(item)}
      >
        <View style={{ flex: 2 }}>
          <Image source={{ uri: item.Picture }} style={styles.image} />
        </View>
        <View style={{ flex: 4 }}>
          <Text style={styles.textStyle}>{item}</Text>
          <Text>Any Details </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Ionicons
            style={styles.chatStyle}
            name={"chatbox"}
            color="black"
            size={32}
          />
          <Text style={{ color: "black" }}>Chat</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderData(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 2,
    height: 100,
    width: "100%",
    backgroundColor: "#1AE1C5",
    elevation: 5,
    borderRadius: 10,
    borderColor: "black",
    borderBottomWidth: 3,
    borderTopWidth: 3,
  },
  image: {
    resizeMode: "contain",
    height: 70,
    width: 70,
    padding: 10,
    borderRadius: 500,
  },
  textStyle: {
    color: "black",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 10,
  },
  chatStyle: {
    alignItems: "flex-end",
    marginTop: 25,
  },
});

export default CardCom;
