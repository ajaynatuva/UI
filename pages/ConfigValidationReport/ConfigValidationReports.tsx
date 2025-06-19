
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert2';
import {
  dangerColor,
  navyColor, successColor
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import RadioButton from "../../components/RadioButton/RadioButton";
import Template from "../../components/Template/Template";
import { getConfigValidation } from "../../redux/ApiCalls/ConfigValidationReportApis/ConfigValidApis";
import { TestingReportState } from "../../redux/reducers/TestingReportReducer/TestingReportReducer";
import "./ConfigValidation.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";

const ConfigValidationReport = () => {
  const [selectedType, setSelectedType] = useState("");
  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();


  let emailId = localStorage.getItem('emailId');

  async function onConfigData() {
      let obj={
        selectedType:selectedType,
        emailId:emailId
      }
      if (obj.selectedType.length == 0 || obj.selectedType.length == undefined ) {
        CustomSwal("info","Select atleast one value",navyColor,"Ok","")
      }
      else{
      await getConfigValidation(dispatch, obj);
      }
  }
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleClickToOpen = () => {
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
  };
  const resetInputField = () => {
    setSelectedType("");
  };
  return (
    <Template>
      <div style={{ height: 25 }} />
      <GridItem sm={6} md={12} xs={6}>
        <GridItem sm={6} md={12} xs={6}>
          <CustomHeader labelText={"Configuration Validation Report"} />
          <div style={{ height: 90, marginTop: -40 }} />
        </GridItem>
      </GridItem>
      <CustomPaper
        style={{
          height: window.innerHeight / 2,
          width: window.innerWidth / 2,
          textAlign: "center",
          marginLeft: 200,
          boxShadow: "none",
          border: "1px solid #D6D8DA",
        }}
      >
        <GridContainer>
          <GridItem sm={6} md={12} xs={6}>
            <GridItem sm={6} md={12} xs={6}>
              <div style={{ height: 30 }} />
              <RadioButton
                style={{ marginLeft: -25 }}
                checked={selectedType == "ALL"}
                label={"All"}
                onChange={() => setSelectedType("ALL")}
              />
            </GridItem>
          </GridItem>

          <GridItem sm={12} md={12} xs={12}>
            <GridItem sm={12} md={12} xs={12}>
              <div style={{ height: 30 }} />
              <RadioButton
                checked={selectedType == "PROD"}
                label={"Prod"}
                onChange={() => setSelectedType("PROD")}
              />
            </GridItem>
          </GridItem>

          <GridItem sm={12} md={12} xs={12}>
            <GridItem sm={12} md={12} xs={12}>
              <div style={{ height: 30 }} />
              <RadioButton
                checked={selectedType == "TEST"}
                label={"Test"}
                onChange={() => setSelectedType("TEST")}
              />
            </GridItem>
          </GridItem>
        </GridContainer>

        <div style={{ height: 100 }} />
        <GridContainer>
          <GridItem sm={4} md={4} xs={4} />
          <GridItem sm={2} md={2} xs={2}>
            <CustomButton
              onClick={() => onConfigData()}
              variant={"contained"}
              style={{
                backgroundColor: successColor,
                color: "white",
                alignSelf: "center",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
                marginLeft: "45px",
              }}
            >
              Run
            </CustomButton>
          </GridItem>

          <GridItem sm={1} md={1} xs={1}>
            <CustomButton
              variant={"text"}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                alignSelf: "center",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
              onClick={resetInputField}
            >
              Reset
            </CustomButton>
          </GridItem>
        </GridContainer>
      </CustomPaper>     
    </Template>
  );
};
export default ConfigValidationReport;
