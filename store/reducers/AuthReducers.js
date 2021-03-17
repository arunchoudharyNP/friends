import { ADMIN_AUTH,LOGOUT } from "../actions/AuthActions";

const initialState = {
  userName: null,
  docId: null,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_AUTH:
      return {
         userName:action.userName,
         docId:action.docId
      }
    case LOGOUT:
          return initialState;    
      default:
          return state;
  }
};
