import { ButtonGroup } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import Dialogbox from "../../components/Dialog/DialogBox";
import { DIALOG } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { validateLookUps } from "../../redux/ApiCallAction/Validations/viewConfigLkpValidation";

const DailogBoxForAddandEdit = (props) => {
  const selectedLkp = props.lkpInput.selectedLookup;
  const isCodeExists = props.lkpInput.isCodeError;

  const dispatch = useDispatch();
  const fullWidth = true;
  const maxWidth = "sm";
  const handleToClose = () => {
    props.lkpInput.fromLkpChilds(false);
    props.lkpInput.resetFields(true);
    props.lkpInput.fromLkpEditchilds(false);
  };
  const saveLkpData = () => {
    let error = validateLookUps(selectedLkp, props.lkpInput.saveLkpValues);
    if(isCodeExists){
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: "Code Already Exists"}
      });
    }
    else if (error) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: "Please fill in required fields"}
      });
    } else {
      props.lkpInput.saveLkpFields();
      props.lkpInput.fromLkpChilds(false);
      props.lkpInput.fromLkpEditchilds(false);
    }
  };


  return (
    <div>
      <>
        <Dialogbox
          disableBackdropClick={true}
          open={
            props.lkpInput.isEdit ? props.lkpInput.isEdit : props.lkpInput.popUp
          }
          onClose={handleToClose}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          title={selectedLkp}
          message={props.lkpInput.showLKPFields()}
          actions={
            <ButtonGroup>
              <CustomButton
                onClick={saveLkpData}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  margin: 10,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                save
              </CustomButton>
              <CustomButton
                onClick={handleToClose}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  margin: 10,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                cancel
              </CustomButton>
            </ButtonGroup>
          }
        />
      </>
    </div>
  );
};

export default DailogBoxForAddandEdit;
