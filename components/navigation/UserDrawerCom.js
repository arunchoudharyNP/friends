import React from "react";
import { Text, View, Image } from "react-native";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import * as actions from "../../store/actions/AuthActions";
import { colors } from "../../constants/style/theme";
import { useDispatch } from "react-redux";
import { Drawer } from "react-native-paper";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const UserDrawerCom = (props) => {
  const version = "Ver : 0.01 ";
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    dispatch(actions.logout(props.navigation));
  };
  //   const { state, navigation,...rest } = props;
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#C9FBFE", "#097B7C"]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        style={{
          height: "20%",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onStartShouldSetResponder={() =>
          props.navigation.navigate("adminProfile")
        }
      >
        <View style={{ justifyContent: "space-around" }}>
          <View
            style={{
              backgroundColor: "lightgray",
              width: 50,
              height: 50,
              borderRadius: 30,
              marginTop: 30,
              marginLeft: 20,
              overflow: "hidden",
            }}
          >
            <Image
              resizeMode="contain"
              source={{
                uri: props.picture
                  ? props.picture
                  : "https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png",
              }}
              style={{ height: "100%", width: "100%" }}
            />
          </View>

          <Text
            style={{
              fontSize: 30,
              color: "white",
              marginLeft: 20,
              fontSize: 22,
            }}
          >
            {props.name ? props.name : "Hello"}
          </Text>
        </View>
        <View
          style={{ alignSelf: "flex-end", marginBottom: 20, marginRight: 25 }}
        >
          {/* <Image
            source={require("../../assets/images/appLogo.png")}
            style={{ resizeMode: "contain", height: 90, width: 60 }}
          /> */}
        </View>
      </LinearGradient>

      <DrawerContentScrollView {...props}>
        <Drawer.Section>
          <DrawerItem
            label={"Home"}
            icon={() => (
              <MaterialCommunityIcons name="home" size={24} color={"#414241"} />
            )}
            onPress={({}) => props.navigation.navigate("adminProfile")}
          />
          <DrawerItem
            label={"Account"}
            icon={() => (
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={"#414241"}
              />
            )}
            // onPress={({})=> props.navigation.navigate("Home")}
          />
        </Drawer.Section>

        <Drawer.Section title="Settings">
          <DrawerItem
            label={"LogOut"}
            icon={() => (
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color={"#414241"}
              />
            )}
            onPress={logoutHandler}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <View style={{ marginBottom: 30, alignContent: "center" }}>
        <Text style={{ fontSize: 12, color: "#10356c", textAlign: "center" }}>
          {version}
          <MaterialCommunityIcons name="copyright" size={12} color="black" />
          Friends
        </Text>
      </View>
    </View>
  );
};

export default UserDrawerCom;
