export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_MESSAGES = "SET_MESSAGES";

import * as FileSystem from "expo-file-system";

import { insertMessage, fetchMessages } from "../../components/Helper/db";

export const addMessage = (message, dbName) => {
  return async (dispatch) => {
    console.log("Dispatched");
    const result = await insertMessage(
      message._id.toString(),
      message.createdAt.toString(),
      message.text,
      message.user._id.toString(),
      message.user.name,
      dbName
    )
      .then((data) => {
        console.log(data);
        dispatch({ type: ADD_MESSAGE, message });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const loadMessages = (name) => {
  return async (dispatch) => {
    const dbResult = await fetchMessages(name);
    console.log("DB result.............");
    // console.log(dbResult.rows._array);
    const messages = dbResult.rows._array
      .map((data) => {
        return {
          _id: data.id,
          createdAt: new Date(data.createdAt),
          text: data.text,
          user: {
            _id: parseInt(data.userId),
            name: data.userName,
          },
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // console.log(messages);

    dispatch({ type: SET_MESSAGES, messages });
  };
};
