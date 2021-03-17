import AsyncStorage from "@react-native-community/async-storage";

export const ADMIN_AUTH = "ADMIN_AUTH";
export const LOGOUT = "LOGOUT";

export const adminAuth = (navigation, userName, docId) => {
  saveDataToStorage(userName, docId);
  navigation.navigate("verify");
  return { type: ADMIN_AUTH, userName, docId };
};

export const loadAuth = (userName, docId) => {
  return { type: ADMIN_AUTH, userName, docId };
};

export const logout = (navigation) => {
  AsyncStorage.removeItem("listenerData");
  console.log("Storage cleaned........!");
  navigation.navigate("verify");
  return { type: LOGOUT };
};

const saveDataToStorage = async (userName, docId) => {
  // await AsyncStorage.removeItem("userData");
  try {
    const storageData = await AsyncStorage.setItem(
      "listenerData",
      JSON.stringify({
        userName: userName,
        docId: docId,
      })
    );
  } catch (error) {
    console.log("storageData............" + error + "...............");
  }
};
