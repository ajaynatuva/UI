import {
  CREATE_USER,
  EDIT_PASSWORD,
  EDIT_USER,
  LOGIN_USER,
  GET_ROLES,
  GET_ROLES_BY_ID,
  GET_USER_LIST,
  UPDATE_USER,
  GET_USER_ROLE_BY_ID,
  CREATE_USER_VALIDATION,
  ROLE_NAME,
  TAB_PATHS,
  USER_LOGIN_DETAILS_CACHE,
} from '../../ApiCalls/UserApis/UserApiActionType';

export interface UserState {
  users: any[];
  roleName: any;
  tabPaths: any[];
  editUsers: any[];
  updateUsers: any[];
  createUsers: any[];
  getRoles: any[];
  getRolesById: any[];
  checkedRadio: any[];
  userId: any[];
  editPassword: any[];
  loginUser: any[];
  getUserRoleById: any;
  userLoginDetailsCache:any;
  // userDetails: any
  errors: {
    userName: boolean;
    emailId: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
}

const initialState: UserState = {
  loginUser: [],
  users: [],
  editUsers: [],
  updateUsers: [],
  createUsers: [],
  getRoles: [],
  getRolesById: [],
  checkedRadio: [],
  userId: [],
  editPassword: [],
  getUserRoleById: '',
  roleName: '',
  tabPaths: [],
  userLoginDetailsCache:[],
  // userDetails:[],
  errors: {
    userName: false,
    emailId: false,
    password: false,
    confirmPassword: false,
  },
};

export default function UserReducers(
  state = initialState,
  action: { type: string; payload: any }
): UserState {
  switch (action.type) {
    case GET_USER_LIST:
      return { ...state, users: action.payload };
    case CREATE_USER:
      return { ...state, createUsers: action.payload };
    case EDIT_USER:
      return { ...state, editUsers: action.payload };
    case UPDATE_USER:
      return { ...state, updateUsers: action.payload };
    case LOGIN_USER:
      return { ...state, loginUser: action.payload };
    case GET_ROLES:
      return { ...state, getRoles: action.payload };
    case GET_ROLES_BY_ID:
      return { ...state, getRolesById: action.payload };
    case EDIT_PASSWORD:
      return { ...state, editPassword: action.payload };
    case GET_USER_ROLE_BY_ID:
      return { ...state, getUserRoleById: action.payload };
    case ROLE_NAME:
      return { ...state, roleName: action.payload };
    case TAB_PATHS:
      return { ...state, tabPaths: action.payload };
      case USER_LOGIN_DETAILS_CACHE:
        return { ...state, userLoginDetailsCache: action.payload };
    // case USER_DETAILS:
    // return { ...state, userDetails: action.payload };
    case CREATE_USER_VALIDATION:
      return { ...state, errors: action.payload };

    default:
      return state;
  }
}
