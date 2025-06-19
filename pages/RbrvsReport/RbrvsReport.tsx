import { useDispatch } from "react-redux";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Template from "../../components/Template/Template";
import { genearteRbrvsReport1, genearteRbrvsReport2,generateVaccinationCodes } from "../../redux/ApiCalls/RbRvsReportApis/RbRvsReportApis";
import { useRef, useState } from "react";
import Dialogbox from "../../components/Dialog/DialogBox";
import { ButtonGroup } from "@material-ui/core";



const RbrvsReport = () => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const openPopup = () => {
        setPopupOpen(true);
      }
    const closePopup = () => {
        setPopupOpen(false);
      }

    const onFileUpload=()=>{
      const formData: FormData = new FormData();
            formData.append("uploadfile", selectedFile);
            generateVaccinationCodes(dispatch,formData);
    }

    const dispatch = useDispatch();

    const generateReport1 = () => {
        genearteRbrvsReport1(dispatch);
    }
    const generateReport2 = () => {
        genearteRbrvsReport2(dispatch);      
    }    

    return (
        <Template>
            <div style={{ alignSelf: "center" }}>
                <div style={{ height: 25 }} />
                <GridItem sm={6} md={12} xs={6}>
                    <GridItem sm={6} md={12} xs={6}>
                        <CustomHeader
                            labelText={'Rbrvs Report Generation'}
                        />
                        <div style={{ height: 30 }} />
                    </GridItem>
                </GridItem>

                <CustomPaper style={{
                    height: window.innerHeight / 2,
                    width: window.innerWidth / 2,
                    textAlign: "center",
                    marginLeft: 250,
                    boxShadow: 'none',
                    border: '1px solid #D6D8DA'
                }}>

                    <GridContainer style={{ marginTop:"10%"}}>
                        <GridItem sm={4} md={4} xs={4}>
                            <CustomButton
                                variant={"contained"}
                                onClick={generateReport1}
                                style={{
                                    backgroundColor: navyColor,
                                    float: "right",
                                    color: "white",
                                    padding: 5,
                                    fontSize: 12,
                                    textTransform: 'capitalize',
                                }}
                            >
                                Report for missing ACQ_COST
                            </CustomButton>
                        </GridItem>

                        <GridItem sm={4} md={4} xs={4}>
                            <CustomButton
                                onClick={generateReport2}
                                variant={"text"}
                                style={{ backgroundColor: navyColor, color: "white", alignSelf: "center", textTransform: 'capitalize', fontSize: 12 }}
                            >
                                Report for ‘0’ pricing values which has ‘0’ acq_cost
                            </CustomButton>

                        </GridItem>

                        <GridItem sm={4} md={4} xs={4}>
                            <CustomButton
                                onClick={openPopup}
                                variant={"text"}
                                style={{ backgroundColor: navyColor, color: "white", alignSelf: "center", textTransform: 'capitalize', fontSize: 12 }}
                            >
                                Report for vaccination codes
                            </CustomButton>
                        </GridItem>
                    </GridContainer>
                    <Dialogbox
        onClose={closePopup}
        disableBackdropClick={true}
        open={popupOpen}
        title={"Load for VaccinationCodes"}
        message={<input 
            ref={inputRef}
          type="file"
          onChange={(event)=>{
           setSelectedFile(event.target.files[0]);
          }}
          />}
        actions={
          <ButtonGroup>
            <CustomButton
              style={{
                color: "white",
                backgroundColor: navyColor,
                marginRight: 10,
                fontsize: 12,
                padding: 1,
                textTransform: "capitalize",
              }}
              onClick={()=>{
                onFileUpload()
                closePopup()
              }
               }
            >
              Load
            </CustomButton>
            <CustomButton
              style={{
                color: "white",
                backgroundColor: dangerColor,
                fontsize: 12,
                padding: 1,
                textTransform: "capitalize",
              }}
              onClick={closePopup}
            >
              Cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
                </CustomPaper>
            </div>
        </Template>
    );
};

export default RbrvsReport;

