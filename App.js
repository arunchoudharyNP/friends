import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AdminLogin from "./screens/beforeAuth/AdminLogin";
import AppLoading from "expo-app-loading";
import { enableScreens } from "react-native-screens";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { createStore, combineReducers, applyMiddleware } from "redux";
import RootNavigation from "./navigation/RootNavigation";
import AuthReducers from "./store/reducers/AuthReducers";
import ReduxThunk from "redux-thunk";
import ChatReducers from "./store/reducers/ChatReducers";
import { Provider as StoreProvider } from "react-redux";

enableScreens();
export default function App() {
  const [loadState, setloadState] = useState(false);


   const reducer = combineReducers({
    AuthReducer: AuthReducers,
    ChatReducers: ChatReducers,
  });

  const store = createStore(reducer, applyMiddleware(ReduxThunk));

  function cacheImages(images) {
    return images.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  function cacheFonts(fonts) {
    return fonts.map((font) => Font.loadAsync(font));
  }

  const handleResourcesAsync = async () => {
    const imageAssets = cacheImages([]);

    const fontAssets = cacheFonts([
      { "open-sans": require("./assets/fonts/OpenSans-Regular.ttf") },
      { "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf") },
      { Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf") },
    ]);

    return Promise.all([...imageAssets, ...fontAssets]);
  };

  if (!loadState) {
    return (
      <AppLoading
        startAsync={handleResourcesAsync}
        onError={(error) => console.warn(error)}
        onFinish={() => setloadState(true)}
      />
    );
  }

  return (
    <StoreProvider store={store}>
      <RootNavigation />
      <StatusBar style="auto" />
      </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
