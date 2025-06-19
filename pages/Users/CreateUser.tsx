import { FormControl, FormGroup } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import Dialogbox from "../../components/Dialog/DialogBox";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Template from "../../components/Template/Template";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import {
  editPassword,
  editUser,
  getRoles,
  getRolesById,
  getUserList,
  saveUser,
} from "../../redux/ApiCalls/UserApis/UserApis";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "../Login/Login.css";
import "../Users/CreateUsers.css";
import "./User.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";

const _ = require("lodash");
const fullWidth = true;
const maxWidth = "md";
const CreateUser = (props) => {
  const { state } = useLocation();
  //@ts-ignore
  let user: any = state?.user;
  const intialUserState = {
    userName: props.edit ? user?.userName : "",
    emailId: props.edit ? user?.emailId : "",
    password: props.edit ? user?.password : "",
    confirmPassword: "",
    roleId: user?.undefined,
    userId: undefined,
    deletedb: 0,
  };
  const intialResetPaswordState = {
    password: undefined,
    confirmPassword: undefined,
    userId: undefined,
  };
  const [passwordInputType, ToggleIcon] = usePasswordToggle();
  const [passwordInputType2, ToggleIcon2] = usePasswordToggle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roleId, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [userId, setUserId] = useState([]);
  const [userState, setUserState] = useState(intialUserState);
  const [resetPasswordState, setResetPasswordState] = useState(
    intialResetPaswordState
  );
  const [popup, setPopUp] = useState(false);
  const [flag, setFlag] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [pwdErrorMsg, setPwdErrorMsg] = useState("");
  const [confirmPwdErrorMsg, setConfirmPwdErrorMsg] = useState("");
  const [userNameErrorMsg, setUserNameErrorMsg] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [resetPwdError, setResetPwdError] = useState("");
  const [resetConfirmPwdError, setResetConfirmPwdError] = useState("");
  const [isCheckboxValid, setIsCheckboxValid] = useState(false);
  let [selRoles, setSelRoles] = useState([]);
  const UserId = props.edit ? user?.userId : "";
  const oldPassword = props.edit ? user?.password : "";
  useEffect(() => {
    if (updatedState.getRoles.length == 0) {
      getRoles(dispatch);
    }
    if (updatedState.users.length == 0) {
      getUserList(dispatch);
    }
  }, []);

  useEffect(() => {
    if (props.edit) {
      setUserId(UserId);
      userState.userId = userId;
      setUserState(userState);
      resetPasswordState.userId = userId;
      setResetPasswordState(resetPasswordState);
    }
  });
  const resetInputField = () => {
    setUserState(intialUserState);
    setSelectedRoles([]);
    setUserNameErrorMsg("");
    setEmailErrorMsg("");
    setPwdErrorMsg("");
    setConfirmPwdErrorMsg("");
    setCheckboxError("");
  };

  // const resetInputField = () => {
  //   dispatch({ type: RESET_STATE });
  // };

  useEffect(() => {
    userState.userId = UserId;
    setUserState(userState);
    if (props.edit) {
      getRolesById(dispatch, userState);
    }
  }, []);

  const [NewPassword, newIcon] = usePasswordToggle();
  const [confirmPassword, confirmIcon] = usePasswordToggle();

  const updatedState: UserState = useSelector(
    (state: any) => state.userReducer
  );
  const errorState: UserState = useSelector((state: any) => state.userReducer);

  const message =
    "Password should contain min 8 characters and must contain 1 lowercase and 1 uppercase character, 1 numeric character and at least one special character";

  useEffect(() => {
    if (props.edit && updatedState.getRolesById) {
      setSelectedRoles(updatedState.getRolesById);
    }
  }, [updatedState]);
  useEffect(() => {
    setRoles(updatedState.getRoles);
  }, [updatedState]);

  useEffect(() => {
    setUserState(intialUserState);
    setSelectedRoles([]);
    return () => {
      setUserState(intialUserState);
      setRoles(updatedState.getRoles);
    };
  }, [state]);

  function roleHandler(e, data) {
    setIsCheckboxValid(true);
    selRoles = _.cloneDeep(selectedRoles);
    if (e.target.checked) {
      selRoles.push(data);
      setCheckboxError("");
    } else if (!e.target.checked) {
      selRoles.forEach((element, index) => {
        if (element == data) {
          selRoles.splice(index, 1);
        }
      });
    }
    if (selRoles.length > 0) {
      setCheckboxError("");
    } else {
      setCheckboxError("Atleast one role should be assigned");
    }

    userState.roleId = selRoles;
    setSelectedRoles(selRoles);
    setUserState(userState);
  }

  function roleMsg() {
    let isValid = false;
    if (selectedRoles.length == 0) {
      setCheckboxError("Atleast one role should be assigned");
      isValid = false;
    } else {
      setCheckboxError("");
      isValid = true;
    }
    return isValid;
  }

  function checkIsSelected(data) {
    let isSelected = false;
    if (selectedRoles) {
      selectedRoles?.forEach((id) => {
        if (id == data) {
          isSelected = true;
        }
      });
    }

    return isSelected;
  }

  function emailValidation() {
    let isValid = false;
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!(!userState.emailId || emailRegex.test(userState.emailId) === false)) {
      isValid = true;
      setEmailErrorMsg("");
    } else {
      isValid = false;
      setEmailErrorMsg("Please enter a valid email");
    }

    return isValid;
  }
  function passwordValidation() {
    let isValid = false;
    const passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (
      !(!userState.password || passwordRegex.test(userState.password) === false)
    ) {
      isValid = true;
      setPwdErrorMsg("");
    } else {
      isValid = false;
      setPwdErrorMsg(message);
    }
    if (
      !(
        !userState.confirmPassword ||
        passwordRegex.test(userState.confirmPassword) === false
      )
    ) {
      isValid = true;
      setConfirmPwdErrorMsg("");
    } else {
      isValid = false;
      setConfirmPwdErrorMsg(message);
    }

    return isValid;
  }

  function resetPasswordValidation() {
    const passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

    let isValid = false;
    if (
      !(
        !resetPasswordState.password ||
        passwordRegex.test(resetPasswordState.password) === false
      )
    ) {
      isValid = true;
      setResetPwdError("");
    } else {
      isValid = false;
      setResetPwdError(message);
    }
    if (
      !(
        !resetPasswordState.confirmPassword ||
        passwordRegex.test(resetPasswordState.confirmPassword) === false
      )
    ) {
      isValid = true;
      setResetConfirmPwdError("");
    } else {
      isValid = false;

      setResetConfirmPwdError(message);
    }
    return isValid;
  }

  function userNameValidation() {
    let isValid = false;
    if (userState.userName == "" || userState.userName == null) {
      isValid = false;
      setUserNameErrorMsg("User name is required");
    } else {
      isValid = true;
      setUserNameErrorMsg("");
    }
    return isValid;
  }

  function roleValidation() {
    let isValid = false;
    if (selectedRoles.length == 0) {
      isValid = false;
      setCheckboxError("Atleast one role should be assigned");
    } else {
      isValid = true;
      setCheckboxError("");
    }
    return isValid;
  }

  function editUserPassword() {
    let passwordError = resetPasswordValidation();
    if (passwordError) {
      if (resetPasswordState.password == resetPasswordState.confirmPassword) {
        let obj = {};
        Object.entries(resetPasswordState).forEach(
          ([key, val]) => (obj[key] = val)
        );
        editPassword(dispatch, obj);
        setPopUp(false);
        setResetPasswordState(intialResetPaswordState);
        setFlag(true);
      } else {
        setPopUp(false);
        
        CustomSwal("error","Password and confirm password are not matching",navyColor,"OK","");

        setResetPasswordState(intialResetPaswordState);
      }
    }
  }
  function checkisUnique() {
    let isError = false;
    let name = userState.userName;
    let email = userState.emailId;
    updatedState?.users?.forEach((u) => {
      if (!props.edit) {
        if (name === u.userName) {
          CustomSwal("error","Username already exists",navyColor,"OK","");
          isError = true;
        }
        if (email === u.emailId) {
          CustomSwal("error","An Account with Email " + email + "  already exists. ",navyColor,"OK","");
          isError = true;
        }
      }
      if (props.edit) {
        if (userState.userName != intialUserState.userName) {
          if (name == u.userName) {

            CustomSwal("error","Username already exists",navyColor,"OK","");

            isError = true;
          }
        }
        if (userState.emailId != intialUserState.emailId) {
          if (email === u.emailId) {

            CustomSwal("error","An Account with Email " + email + "  already exists.",navyColor,"OK","");

            isError = true;
          }
        }
      }
    });
    return isError;
  }
  const createUser = (e) => {
    let emailError = emailValidation();
    let userNameError = userNameValidation();
    let passwordError = passwordValidation();
    let roleError = roleValidation();
    let error = checkisUnique();
    let obj = {};
    if (props.edit) {
      if (emailError && userNameError && roleError) {
        if (!error) {
          if (flag == true) {
            userState.password = resetPasswordState.password;
            setUserState(userState);
          }
          if (!isCheckboxValid) {
            userState.roleId = selectedRoles;
          }
          Object.entries(userState).forEach(([key, val]) => (obj[key] = val));
          editUser(dispatch, obj);
          navigate("/userList");
        }
      }
    }

    if (emailError && userNameError && passwordError && roleError) {
      if (!error) {
        if (userState.password == userState.confirmPassword) {
          Object.entries(userState).forEach(([key, val]) => (obj[key] = val));
          saveUser(dispatch, obj);
          navigate("/userList");
        } else {

          CustomSwal("error","Password and Confirm password are not matching",navyColor,"OK","");

        }
      }
    }
  };

  function popUpCloseHandler() {
    setPopUp(false);
    setResetPasswordState(intialResetPaswordState);
    setResetConfirmPwdError("");
    setResetPwdError("");
  }

  function logout() {
    sessionStorage.removeItem("user-info");
    props.onLogout();
  }

  const fullWidth = true;
  const maxWidth = "sm";
  return (
    <Template>
      <div>
        <Dialogbox
          disableBackdropClick={true}
          onClose={() => setPopUp(false)}
          open={popup}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          title={"Reset Password"}
          message={
            <>
              <GridItem sm={12} md={12} xs={12}>
                <CustomInput
                  fullWidth={true}
                  onBlur={resetPasswordValidation}
                  labelText={"Password"}
                  type={passwordInputType}
                  endAdornment={ToggleIcon}
                  variant={"outlined"}
                  value={resetPasswordState.password}
                  onChange={(event) => {
                    let obj = _.cloneDeep(resetPasswordState);
                    obj.password = event.target.value;
                    setResetPasswordState(obj);
                  }}
                />
                <small
                  style={{ color: "red" }}
                  className={`message ${
                    resetPasswordValidation ? "success" : "error"
                  }`}
                >
                  {resetPwdError}
                </small>
              </GridItem>

              <GridItem sm={12} md={12} xs={12}>
                <CustomInput
                  fullWidth={true}
                  labelText={"Confirm Password"}
                  type={passwordInputType2}
                  endAdornment={ToggleIcon2}
                  variant={"outlined"}
                  value={resetPasswordState.confirmPassword}
                  onBlur={resetPasswordValidation}
                  onChange={(event) => {
                    let obj = _.cloneDeep(resetPasswordState);
                    obj.confirmPassword = event.target.value;
                    setResetPasswordState(obj);
                  }}
                />
                <small
                  style={{ color: "red" }}
                  className={`message ${
                    resetPasswordValidation ? "success" : "error"
                  }`}
                >
                  {resetConfirmPwdError}
                </small>
              </GridItem>
            </>
          }
          actions={
            <CustomButton
              style={{
                backgroundColor: navyColor,
                color: "white",
                textTransform: "capitalize",
                fontSize: 12,
                padding: 4,
              }}
              onClick={() => editUserPassword()}
            >
              Save
            </CustomButton>
          }
        />

        <div style={{ height: 20 }} className="positon:absolute left:10"></div>
        <div>
          {!props.edit ? (
            <CustomHeader labelText={"Create User"} />
          ) : (
            <CustomHeader labelText={"Edit User"} />
          )}
          <div className="userGridAlignment">
            <GridContainer>
              {/* <GridItem sm={4} md={4} xs={4}/> */}
              <GridItem sm={4} md={5} xs={4}>
                <CustomInput
                  error={errorState.errors.userName}
                  fullWidth={true}
                  labelText={"User Name"}
                  variant={"outlined"}
                  value={userState.userName}
                  onBlur={() => userNameValidation()}
                  onChange={(event) => {
                    let obj = _.cloneDeep(userState);
                    obj.userName = event.target.value;
                    setUserState(obj);
                  }}
                />
                <small
                  style={{ color: "red" }}
                  className={`message ${
                    userNameValidation ? "success" : "error"
                  }`}
                >
                  {userNameErrorMsg}
                </small>
              </GridItem>
              <GridItem sm={4} md={5} xs={4} />
              <GridItem sm={4} md={5} xs={4}>
                <CustomInput
                  fullWidth={true}
                  error={errorState.errors.emailId}
                  labelText={"Email Id"}
                  variant={"outlined"}
                  value={userState.emailId}
                  onBlur={() => emailValidation()}
                  onChange={(event) => {
                    let obj = _.cloneDeep(userState);
                    obj.emailId = event.target.value;

                    setUserState(obj);
                  }}
                />
                <div
                  style={{ color: "red" }}
                  className={`message ${emailValidation ? "success" : "error"}`}
                >
                  {emailErrorMsg}
                </div>
              </GridItem>

              <GridItem sm={4} md={5} xs={4} />
              <GridItem sm={4} md={5} xs={4}>
                {!props.edit ? (
                  <CustomInput
                    fullWidth={true}
                    error={errorState.errors.password}
                    labelText={"Password"}
                    type={passwordInputType}
                    endAdornment={ToggleIcon}
                    variant={"outlined"}
                    autoComplete="new-password"
                    value={userState.password}
                    onBlur={() => passwordValidation()}
                    onChange={(event) => {
                      let obj = _.cloneDeep(userState);
                      obj.password = event.target.value;
                      setUserState(obj);
                    }}
                  />
                ) : undefined}
                {!props.edit ? (
                  <div
                    style={{ color: "red" }}
                    className={`message ${
                      passwordValidation ? "success" : "error"
                    }`}
                  >
                    {pwdErrorMsg}
                  </div>
                ) : undefined}
              </GridItem>
              <GridItem sm={4} md={5} xs={4} />
              <GridItem sm={4} md={5} xs={4}>
                {!props.edit ? (
                  <CustomInput
                    fullWidth={true}
                    type={passwordInputType2}
                    error={errorState.errors.confirmPassword}
                    labelText={"Confirm Password"}
                    endAdornment={ToggleIcon2}
                    variant={"outlined"}
                    autoComplete="off"
                    value={userState.confirmPassword}
                    onChange={(event) => {
                      let obj = _.cloneDeep(userState);
                      obj.confirmPassword = event.target.value;
                      setUserState(obj);
                    }}
                  />
                ) : undefined}
                {!props.edit ? (
                  <div
                    style={{ color: "red" }}
                    className={`message ${
                      passwordValidation ? "success" : "error"
                    }`}
                  >
                    {confirmPwdErrorMsg}
                  </div>
                ) : undefined}
              </GridItem>

              <GridItem sm={4} md={5} xs={4} />
              <GridItem sm={4} md={6} xs={4}>
                <FormControl component="fieldset" variant="standard">
                  <label style={{ marginTop: 15 }}>Roles:</label>
                  <FormGroup row style={{ marginLeft: 55, marginTop: -6 }}>
                    {roleId?.map((r) => (
                      <CustomCheckBox
                        checked={checkIsSelected(r.roleId)}
                        value={r.roleId}
                        label={
                          <span
                            style={{
                              fontSize: "12px",
                              position: "relative",
                              top: "-1px",
                              right: 5,
                            }}
                          >
                            {r.roleName}
                          </span>
                        }
                        onChange={(e) => roleHandler(e, r.roleId)}
                      />
                    ))}
                  </FormGroup>
                  <div
                    style={{ color: "red" }}
                    className={`message ${
                      isCheckboxValid ? "success" : "error"
                    }`}
                  >
                    {checkboxError}
                  </div>
                </FormControl>
              </GridItem>
              <GridItem sm={4} md={5} xs={4} />
              <GridItem sm={4} md={5} xs={4}>
                <div style={{ marginLeft: 100, marginTop: 20 }}>
                  <CustomButton
                    variant="contained"
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      padding: 4,
                    }}
                    onClick={createUser}
                  >
                    Submit
                  </CustomButton>
                  {!props.edit ? (
                    <CustomButton
                      variant="contained"
                      style={{
                        backgroundColor: dangerColor,
                        color: "white",
                        marginLeft: 10,
                        textTransform: "capitalize",
                        fontSize: 12,
                        padding: 4,
                      }}
                      onClick={() => resetInputField()}
                    >
                      Reset
                    </CustomButton>
                  ) : undefined}
                  {props.edit ? (
                    <CustomButton
                      variant="contained"
                      onClick={() => setPopUp(true)}
                      style={{
                        backgroundColor: dangerColor,
                        color: "white",
                        marginLeft: 10,
                        textTransform: "capitalize",
                        fontSize: 12,
                        padding: 4,
                      }}
                    >
                      Reset Password
                    </CustomButton>
                  ) : undefined}
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </Template>
  );
};

export default CreateUser;
