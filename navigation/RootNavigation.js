import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import { StyleSheet, View, Image, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminProfile from "../screens/afterAuth/AdminProfile";
import AdminLogin from "../screens/beforeAuth/AdminLogin";
import VerifyScreen from "../screens/Verify";
import UserDrawerCom from "../components/navigation/UserDrawerCom";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions/AuthActions";
import ChatScreen from "../screens/afterAuth/ChatScreen";

const RootNavigation = (props) => {
  const dispatch = useDispatch();
  const AdminStack = createStackNavigator();
  const AuthStack = createStackNavigator();
  const DrawerNav = createDrawerNavigator();

  const navigationRef = useRef();

  const [adminUserName, setadminUserName] = useState("");
  const [adminDocId, setadminDocId] = useState("");
  const [adminData, setadminData] = useState(false);

  const getUpdatedStateAdmin = () => {
    console.log("State updated");
    if (adminDocId) {
      setadminUserName(null);
      setadminDocId(null);
    }
  };

  const getAdminAuthData = async () => {
    setadminData(false);
    AsyncStorage.getItem("listenerData")
      .then(function (adminDataStorage) {
        console.log("listenerData ....." + adminDataStorage);
        const transformedData = JSON.parse(adminDataStorage);
        if (transformedData && transformedData.userName) {
          setadminUserName(transformedData.userName);
          setadminDocId(transformedData.docId);
          setadminData(true);
        }
      })
      .catch(function (error) {
        console.log("Error " + error);
        setadminData(false);
      });
  };

  useEffect(() => {
    console.log("UseEffect called");
    const a = getAdminAuthData();
  }, [adminUserName, adminDocId]);

  const AuthNav = () => {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name={"adminLogin"} component={AdminLogin} />
        <AuthStack.Screen name="verify" component={VerifyScreen} />
      </AuthStack.Navigator>
    );
  };

  const AdminNav = () => {
    return (
      <AdminStack.Navigator>
        <AdminStack.Screen
          options={{
            headerTitle: headerLogo,
            // headerStyle: {
            //   backgroundColor: "#044b59",
            // },
            headerBackground: () => (
              <LinearGradient
                colors={["#297a8a", "#10356c"]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
              />
            ),
          }}
          name={"adminProfile"}
          component={AdminProfile}
          initialParams={{ userName: adminUserName, docId: adminDocId }}
        />

        <AdminStack.Screen name="chatScreen" component={ChatScreen} />
      </AdminStack.Navigator>
    );
  };

  const headerLogo = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
          style={styles.logoImage}
          source={require("../assets/images/appLogo.png")}
        />
        <Text style={styles.logoTitle}>Friends</Text>
      </View>
    );
  };

  const AdminMain = () => {
    return (
      <DrawerNav.Navigator
        drawerContent={(props) => (
          <UserDrawerCom {...props} name={adminUserName} picture={null} />
        )}
      >
        <DrawerNav.Screen name="AdminHome" component={AdminNav} />
        <DrawerNav.Screen name="verify" component={VerifyScreen} />
      </DrawerNav.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (currentRouteName === "verify") {
          getUpdatedStateAdmin();
          getAdminAuthData();
        }
      }}
    >
      {adminData ? <AdminMain /> : <AuthNav />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    resizeMode: "contain",
    height: 55,
    width: 40,
    marginLeft: 35,
    marginRight: 10,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "Caveat",
    color: "white",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default RootNavigation;
