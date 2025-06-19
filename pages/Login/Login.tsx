import ampslogo from "../../assets/img/amps/ampslogo.jpg";

import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  dangerColor,
  disabledColor,
  navyColor,
  skyblueColor,
} from "../../assets/jss/material-kit-react";
import AlertBox from "../../components/AlertBox/AlertBox";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomHeader4 from "../../components/CustomHeader4/CustomHeader4";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import CustomParagraph from "../../components/LoginFooter/CustomParagraph";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import {
  loginUser,
  ResendOTP,
  updatePassword,
  validateOTP,
  validateUserEmailId,
} from "../../redux/ApiCalls/UserApis/UserApis";
import "../Login/Login.css";
import ShowSpinnerInDialogBox from "../../components/Spinner/ShowSpinnerInDialogBox";

const Login = (props) => {
  const dispatch = useDispatch();

  const [passwordInputType, ToggleIcon] = usePasswordToggle();

  const [emailId, setEmailId] = useState("");
  const [emailIdWithDomain, setEmailIdWithDomain] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState<number>(0);
  const [clickedOnLogin, setClickedOnLogin] = useState(false);
  const [time, setTime] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [forgotPassScreen, setForgotPassScreen] = useState<
    "email" | "otp" | "passwords"
  >("email");
  const [forgotPassState, setForgotPassState] = useState({
    password: "",
    confirmPassword: "",
  });

  const [frgtPasswordType, toggleFrgtPass] = usePasswordToggle();
  const [frgtConfirmPasswordType, toggleFrgtConfirmPass] = usePasswordToggle();

  const [frgtEmailError, setFrgtEmailError] = useState(false);
  const [frgtPassMatchError, setFrgtPassMatchError] = useState(false);
  const [frgtPassStrengthError, setFrgtPassStrengthError] = useState(false);

  const frgtPassMatchErrorMessage =
    "Use 8 characters or more with at least one upper case, number and a special character";

  // used to implicitly disable submit button regardless the rest of the criteria
  const [disable, setDisable] = useState(false);

  const isDisabled =
    disable ||
    (!forgotPasswordView && (emailId.length === 0 || password.length === 0)) ||
    (forgotPasswordView && emailId.length === 0);
  const [frgtUser, setFrgtUser] = useState(null);

  // Function to set a cookie with a specific expiration date
  function setCookie(name: string, value: string, days: number): void {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration date
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  // Function to get a cookie value by name
  function getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  useEffect(()=>{
    if(!emailId.includes("@amps.com")){
      setEmailIdWithDomain(emailId + "@amps.com");
    }else{
      setEmailIdWithDomain(emailId);
    }
  },[emailId])
  // Function to generate a unique identifier
  function generateUniqueId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Function to get or generate a unique identifier and store it in a cookie
  function getUniqueId(): string {
    let uniqueId = getCookie("uniqueId");
    if (!uniqueId) {
      uniqueId = generateUniqueId();
      setCookie("uniqueId", uniqueId, 90); // Set cookie with 90 days validity
    }
    return uniqueId;
  }

  const uniqueIdGenerated = getUniqueId();

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };
  const [submitButton, setSubmitButton] = useState(false);
  const [validOtp, setValidOtp] = useState(false);
  const handleSubmit = async () => {
    // normal login
    if (!forgotPasswordView) {
      if (submitButton && clickedOnLogin) {
        submit();
      } else {
        login();
      }
      return;
    }
    // FORGOT PASSWORD LOGIC BEGINS HERE...
    // forgot password email validation
    if (forgotPassScreen === "email") {
      setLoading(true);
      const isValidEmail = await validateEmailId(emailIdWithDomain);
      if (!isValidEmail) {
        setFrgtEmailError(true);
      } else {
        setDisable(true);
        const otpResponse = await ResendCode();
        if (!otpResponse) {
          setFrgtEmailError(true);
          return;
        }
        setDisable(false);
        setForgotPassScreen("otp");
      }
      setLoading(false);
      return;
    }
    // forgot password - otp validation
    if (forgotPassScreen === "otp") {
      const user = await submit(true);

      if (user) {
        setFrgtUser(user);
        setForgotPassScreen("passwords");
      } else {
        setFrgtEmailError(true);
      }
      return;
    }
    // forgot password - password strength validation
    if (!validatePasswordStrength(forgotPassState.password)) return;
    // forgot password - passwords matching validation
    if (
      !validateForgotPasswordFields(
        forgotPassState.password,
        forgotPassState.confirmPassword
      )
    )
      return;
    // submit changed password to backend
    updatePassword(dispatch, {
      userId: frgtUser.userId,
      password: forgotPassState.password,
    }).then(() => {      
      frgtSwalPopup(true);
    }).catch(()=>{
      frgtSwalPopup(false)
    });
  };
  const frgtSwalPopup = (isSuccess: boolean) => {
    Swal.fire({
      title: isSuccess ? "Success" : "Failed",
      text: isSuccess
        ? "Password updated successfully"
        : "Password is not saved. Please try again",
      icon: isSuccess ? "success" : "error",
      showDenyButton: !isSuccess,
      confirmButtonColor: navyColor,
      confirmButtonText: isSuccess
        ? "BACK TO LOGIN"
        : `&nbsp;&nbsp;&nbsp;${"Ok"}&nbsp;&nbsp;&nbsp;`,
      denyButtonColor: dangerColor,
      buttonsStyling: false,
      denyButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      const { isConfirmed, isDenied } = result;
      // if (isConfirmed) {
      // } else
      if (isDenied) {
        setForgotPasswordView(false);
      }
      setOtpValue(0);
      // if ok, go to login page else show forgot password email input screen
      setForgotPasswordView(isConfirmed ? !isSuccess : !isDenied);
      setForgotPassScreen("email");
      setForgotPassState({
        password: "",
        confirmPassword: "",
      });
    });
  };

  async function submit(isForgotPasswordOtp = false) {
    let validateDetails = {
      emailId:emailIdWithDomain,
      password,
      otpValue,
      trustThisComputer,
      isForgotPasswordOtp,
    };
    const validated = await validateOTP(dispatch, validateDetails);
    if (validated) {
      if (!isForgotPasswordOtp) {
        getRole(validated);
      }
    } else {
      setValidOtp(true);
    }
    return validated;
  }

  async function getRole(userResults) {
    if (forgotPasswordView) return;
    if (userResults) {
      props.onUserLoginSuccess(true);
    }
  }

  async function login() {
    setSubmitButton(true);
    let browserDetails = JSON.stringify(getBrowserDetails());
    let item = {
      emailId :emailIdWithDomain,
      password,
      otpValue,
      trustThisComputer,
      browserDetails,
      uniqueIdGenerated,
    };
    setLoading(true);
    let userResults = await loginUser(dispatch, item);
    setLoading(false);
    if (userResults?.userId === null) {
      setClickedOnLogin(true);
      timer();
    } else {
      getRole(userResults);
    }
  }

  function getBrowserDetails() {
    return {
      userAgent: navigator.userAgent,
      webdriver:
        typeof navigator.webdriver !== "undefined"
          ? navigator.webdriver
          : false,
      language: navigator.language,
      // eslint-disable-next-line no-restricted-globals
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      hardwareConcurrency: navigator.hardwareConcurrency || "not available",
      // eslint-disable-next-line no-restricted-globals
      screenResolution: [screen.width, screen.height],
      // "availableScreenResolution": [window.innerWidth, window.innerHeight],
      timezoneOffset: new Date().getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
      touchSupport: [
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
        false, // Detailed touch support checking would require more logic
        false, // Detailed touch support checking would require more logic
      ],
    };
  }

  const [trustThisComputer, setTrustThisComputer] = useState(false);

  const [initFrgtLoad, setInitFrgtLoad] = useState(true);

  const ResendCode = async () => {
    let browserDetails = JSON.stringify(getBrowserDetails());
    let item = {
      emailId:emailIdWithDomain,
      browserDetails,
      uniqueIdGenerated,
      isForgotPassword: forgotPasswordView,
    };
    setTime(30);
    timer();
    let result = await ResendOTP(item, initFrgtLoad,forgotPasswordView);
    if (initFrgtLoad) {
      setInitFrgtLoad(false);
    }
    return result;
  };

  const validateEmailId = async (email: string) => {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isValidEmail = emailRegex.test(email);
    const emailDoesExist = await validateUserEmailId(email, dispatch);
    const isValid = isValidEmail && emailDoesExist;
    setFrgtEmailError(!isValid);
    return isValid;
  };

  const validateForgotPasswordFields = (
    password: string,
    confirmPassword: string
  ) => {
    const isError = password !== confirmPassword;
    setFrgtPassMatchError(isError);
    return !isError;
  };

  const validatePasswordStrength = (password: string) => {
    const isError =
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
        password
      );
    setFrgtPassStrengthError(isError);
    return !isError;
  };

  const timer = () => {
    let timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const paperStyle = {
    height: "400px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    width: "500px",
    position: "relative",
    left: "40px",
  };
  const loginBtnStyle = {
    variant: "outLined",
    backgroundColor: isDisabled ? disabledColor : skyblueColor,
    color: "white",
    marginBottom: "10px",
  };
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    // position:"relative",
    // top:"150px",
  };

  const textBtnStyles = {
    color: skyblueColor,
    fontSize: 10,
    fontWeight: "bold",
    "&:hover": {
      textDecoration: "underline",
      textUnderlineOffset: "2px",
    },
  };

  function ShowForgotPasswordView() {
    if (forgotPassScreen === "otp") return showOtpFields();
    return (
      <>
        {forgotPassScreen === "email" && (
          <GridContainer>
            <GridItem md={1} />
            <GridItem md={9}>
              <CustomInput
                type="email"
                value={emailId}
                isSkyblue
                labelText="Email Id"
                onChange={(e) => {
                  setEmailId(e.target.value);
                  if (frgtEmailError) setFrgtEmailError(false);
                }}
                placeholder="Enter your EmailId (e.g. johnsmith)"
                helperText={
                  <>
                    {frgtEmailError && (
                      <div style={{ color: "red", fontSize: 12 }}>
                        Please enter a valid email
                      </div>
                    )}
                    <div style={{ fontSize: 11 }}>
                      We are enhancing the security on your account and will
                      email a secure code to reset your password
                    </div>
                  </>
                }
                fullWidth
              />
            </GridItem>
          </GridContainer>
        )}
        {forgotPassScreen === "passwords" && (
          <GridContainer>
            <GridItem md={1} />
            <GridItem md={9}>
              <CustomInput
                fullWidth
                isSkyblue
                labelText={"Password"}
                showTitle={true}
                type={frgtPasswordType}
                value={forgotPassState.password}
                placeholder="Enter New Password"
                endAdornment={toggleFrgtPass}
                onChange={(e) => {
                  setForgotPassState((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  if (frgtPassMatchError || frgtPassStrengthError) {
                    setFrgtPassMatchError(false);
                    setFrgtPassStrengthError(false);
                  }
                }}
              />
              <CustomInput
                fullWidth
                isSkyblue
                labelText={"Confirm Password"}
                type={frgtConfirmPasswordType}
                showTitle={true}
                value={forgotPassState.confirmPassword}
                placeholder="Confirm Password"
                endAdornment={toggleFrgtConfirmPass}
                helperText={
                  <div
                    style={{ color: "red", fontSize: 11, paddingTop: "1em",minHeight: "50px" }}
                  >
                    {frgtPassStrengthError && (
                      <div>{frgtPassMatchErrorMessage}</div>
                    )}
                    {frgtPassMatchError && "The Passwords entered do not match"}
                  </div>
                }
                onChange={(e) => {
                  setForgotPassState((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                  if (frgtPassMatchError || frgtPassStrengthError) {
                    setFrgtPassMatchError(false);
                    setFrgtPassStrengthError(false);
                  }
                }}
              />
            </GridItem>
          </GridContainer>
        )}
      </>
    );
  }

  function showOtpFields() {
    return (
      <>
        <GridContainer>
          <GridItem sm={1} md={1} xs={1} />
          <GridItem sm={9} md={7} xs={9}>
            <CustomInput
              isOTP={true}
              otpLength={6}
              value={otpValue}
              onChange={(e) => {
                setValidOtp(false);
                setOtpValue(e);
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem sm={1} md={1} xs={1} />
          <GridItem sm={9} md={9} xs={9}>
            <div style={{ fontSize: "12px", minHeight:'10px'}}>
              We are enhancing the security on your account and have emailed a
              secure code to you,please enter it here.
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem sm={1} md={1} xs={1} />
          <GridItem sm={9} md={9} xs={9}>
            <AlertBox 
              showIcon={false}
              open={validOtp}
              severity="error"
              message="Please Enter Valid OTP"
            />
          </GridItem>
        </GridContainer>
        {!forgotPasswordView && (
          <GridContainer>
            <GridItem sm={1} md={1} xs={1} />
            <GridItem sm={10} md={7} xs={10}>
              <CustomCheckBox
                label={
                  <span style={{ fontSize: "12px" }}>Trust this computer</span>
                }
                onChange={(event) => {
                  setTrustThisComputer(event.target.checked);
                }}
              />
            </GridItem>
          </GridContainer>
        )}
      </>
    );
  }
  const handleCopy = (e) => {
    e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleCut = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey && (e.key === 'v' || e.key === 'V')) || (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || (e.ctrlKey && (e.key === 'x' || e.key === 'X'))) {
      e.preventDefault();
    }
  };
  const handleChangeEmail = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= emailId.length + 1) {
      setEmailId(newValue);
    }
  };
  const handleChangePassword = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= password.length + 1) {
      setPassword(newValue);
    }
  };
  function showLoginFields() {
    return (
      <>
        <form autoComplete="off">
          <GridContainer>
            <GridItem sm={1} md={1} xs={1} />
            <GridItem sm={9} md={9} xs={9}>
              <CustomInput
                fullWidth={true}
                isSkyblue
                labelText={"Email Id"}
                onCopy={handleCopy}
                onPaste={handlePaste}
                onCut={handleCut}
                onKeyDown={handleKeyDown}
                type="text"
                value={emailId}
                placeholder="Enter your EmailId (e.g. johnsmith)"
                onChange={handleChangeEmail}
                onKeyPress={handleKeypress}
                autoComplete="off"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem sm={1} md={1} xs={1} />
            <GridItem sm={9} md={9} xs={9}>
              <CustomInput
                fullWidth={true}
                labelText={"Password"}
                onCopy={handleCopy}
                onPaste={handlePaste}
                onCut={handleCut}
                onKeyDown={handleKeyDown}
                isSkyblue
                value={password}
                type={passwordInputType}
                endAdornment={ToggleIcon}
                placeholder="Type your Password"
                onChange={handleChangePassword}
                onKeyPress={handleKeypress}
                autoComplete="new-password"
              />
            </GridItem>
          </GridContainer>
        </form>
      </>
    );
  }

  return (
    <>
      <CustomParagraph>
        <GridContainer style={containerStyle}>
          {/* <GridItem  sm={2} md={4} xs={6} /> */}
          <GridItem sm={4} md={4} xs={4}>
            <CustomPaper style={paperStyle}>
              <GridContainer>
                <GridItem sm={1} md={1} xs={1} />
                <GridItem sm={4} md={4} xs={4} className="mt-5">
                  <img height={50} width={100} src={ampslogo} alt="" />
                </GridItem>
                <GridItem sm={1} md={1} xs={1}>
                  <div className="vl " />
                </GridItem>
                <GridItem sm={4} md={4} xs={4} className="mt-5">
                  <CustomHeader4
                    labelText={
                      clickedOnLogin ? (
                        "Enter Secure Code"
                      ) : forgotPasswordView ? (
                        forgotPassScreen === "otp" ? (
                          "Enter Secure Code"
                        ) : (
                          "Forgot Your Password?"
                        )
                      ) : (
                        <>
                          AMPS IPU <br />
                          Sign In
                        </>
                      )
                    }
                    style={{ fontFamily: "sans-serif" }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem sm={1} md={1} xs={1} />
                <GridItem sm={9} md={9} xs={9}>
                  <hr />
                </GridItem>
              </GridContainer>
              {clickedOnLogin
                ? showOtpFields()
                : forgotPasswordView
                  ? ShowForgotPasswordView()
                  : showLoginFields()}
              <GridContainer
                style={{
                  position: !clickedOnLogin ? "relative" : "",
                  top: !clickedOnLogin ? "5px" : "",
                }}
              >
                <GridItem sm={1} md={1} xs={1} />
                <GridItem sm={5} md={5} xs={5}>
                  {clickedOnLogin || forgotPassScreen === "otp" ? (
                    <CustomButton
                      fullWidth
                      onClick={() => {
                        ResendCode();
                      }}
                      disabled={time === 0 ? false : true}
                      type="submit"
                      size="small"
                      style={{
                        variant: "outLined",
                        color: time === 0 ? skyblueColor : disabledColor,
                        justifyContent: "left",
                        backgroundColor: time === 0 ? "white" : "",
                      }}
                    >
                      RESEND CODE
                      {time !== 0 ? (
                        <>
                          :{`${Math.floor(time / 60)}`.padStart(2, "0")}:
                          {`${time % 60}`.padStart(2, "0")}
                        </>
                      ) : (
                        ""
                      )}
                    </CustomButton>
                  ) : undefined}
                  {!clickedOnLogin && !forgotPasswordView && (
                    <Button
                      // disableRipple
                      onClick={() => setForgotPasswordView(true)}
                      size="small"
                      sx={textBtnStyles}
                    >
                      forgot your password?
                    </Button>
                  )}
                </GridItem>
                <GridItem md={2} />
                <GridItem md={3}>
                  <CustomButton
                    onClick={handleSubmit}
                    variant="contained"
                    type="submit"
                    size="small"
                    disabled={isDisabled}
                    style={loginBtnStyle}
                  >
                    {!clickedOnLogin && !forgotPasswordView
                      ? "LOGIN"
                      : "SUBMIT"}
                  </CustomButton>
                </GridItem>
              </GridContainer>
            </CustomPaper>
          </GridItem>
        </GridContainer>
      </CustomParagraph>
      {ShowSpinnerInDialogBox(loading)}
    </>
  );
};
export default Login;
