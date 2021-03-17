import React, { useReducer, useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View
} from "react-native";
import * as Icon from "@expo/vector-icons";

const INPUT_CHANGE = "INPUT_CHANGE";
const LOST_FOCUS = "LOST_FOCUS";

import Text from "./Text";
import Block from "./Block";
import Button from "./Button";
import { theme } from "../../constants/style";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };

    case LOST_FOCUS:
      return {
        ...state,
        touched: true,
      };

    default:
      return state;
  }
};

function Input(props) {
  
  const {
    label,
    errorText,
    secure,
    rightLabel,
    LeftValue,
    email,
    phone,
    number,
    style,
    onInputChanges, 
    id,
    error
  } = props;

  const [ toggleSecure, setToggleSecure] = useState(false);
  const isSecure = toggleSecure ? false : secure;

  const renderLabel = () => {
    return (
      <Block flex={false}>
        {label ? (
          <Text black={!error} accent={error} style={styles.inputTitle}>
            {label}
          </Text>
        ) : null}
      </Block>
    );
  };

  const renderToggle = () => {
    if (!secure) return null;

    return (
      <Button
        style={styles.toggle}
        onPress={() => setToggleSecure( !toggleSecure )}
      >
        {rightLabel ? (
          rightLabel
        ) : (
          <Icon.Ionicons
            color={theme.colors.gray}
            size={theme.sizes.font * 1.35}
            name={toggleSecure ? "md-eye" : "md-eye-off"}
          />
        )}
      </Button>
    );
  };

  const renderLeft = () => {
    if (!LeftValue) return null;

    return (
      <Icon.AntDesign
        style={styles.leftStyle}
        color={theme.colors.gray}
        size={theme.sizes.font * 1.35}
        name={LeftValue}
      />
    );
  };

  const inputStyles = [
    styles.input,
    style,
  ];

  const inputType = email
    ? "email-address"
    : number
    ? "numeric"
    : phone
    ? "phone-pad"
    : "default";

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });


  useEffect(() => {
    onInputChanges(id, inputState.value, inputState.isValid);
  }, [onInputChanges, inputState, id]);

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: LOST_FOCUS });
  };

  return (
    <Block flex={false} margin={[theme.sizes.base, 0]}>
      {renderLabel()}
      {renderLeft()}

      <TextInput
        style={inputStyles}
        secureTextEntry={isSecure}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={inputType}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        {...props}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}

      {renderToggle()}
    </Block>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.black,
    borderRadius: theme.sizes.radius,
    fontSize: theme.sizes.font,
    fontWeight: "500",
    color: theme.colors.black,
    height: 35,
  },
  toggle: {
    position: "absolute",
    alignItems: "flex-end",
    width: theme.sizes.base * 1.5,
    height: theme.sizes.base * 1.5,
    top: 11,
    right: 50,
  },

  inputTitle: {
    marginLeft: 50,
    lineHeight: 18,
    fontSize: 17,
  },
  leftStyle: {
    position: "absolute",
    alignItems: "flex-start",
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    top: 22,
    left: 50,
  },
  errorContainer: {
    marginTop: 5,
    marginLeft:50
  },
  errorText: {
    color: "red",
    fontSize: 11,
    opacity:0.5
    
  },
});

export default Input;
