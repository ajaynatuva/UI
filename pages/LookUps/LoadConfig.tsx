  //not used currently


  
// import { ButtonGroup, Typography } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { dangerColor, disabledColor, navyColor } from "../../assets/jss/material-kit-react";
// import CustomSelect from "../../components/CustomSelect/CustomSelect";
// import GridContainer from "../../components/Grid/GridContainer";
// import GridItem from "../../components/Grid/GridItem";
// import './LookUp.css';

// import {
//   getConCodes,
//   uploadLoadConfig
// } from "../../redux/actions/LoadConfigurationAction";

// import CustomButton from "../../components/CustomButtons/CustomButton";
// import CustomHeader from "../../components/CustomHeaders/CustomHeader";
// import Dialogbox from "../../components/Dialog/DialogBox";
// import '../../components/FontFamily/fontFamily.css';
// import Paragraph from "../../components/Paragraph/Paragraph";
// import Template from "../../components/Template/Template";
// import { LoadConfigState } from "../../redux/reducers/LoadLkpReducer/LoadConfigReducer";

// const LoadConfig = (props) => {
//   const style = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     bgcolor: "background.paper",
//     border: "2px solid #000",
//     boxShadow: 24,
//     p: 4,
//   };
//   const currentYear = new Date().getFullYear();

//   const inputRef = useRef<HTMLInputElement>(null);
//   const [conCodes, setConCodes] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(undefined);
//   const [selectedConfigTale, setSelectedConfigTable] = useState("");
//   const updatedState: LoadConfigState = useSelector(
//     (state: any) => state.loadConfigLoader
//   );
//   useEffect(() => {
//     setConCodes(updatedState.conCode);
//   }, [updatedState]);

//   const dispatch = useDispatch();
//   useEffect(() => {
//     getConCodes(dispatch);
//   }, []);
//   const loadConfigLoaderCM = conCodes?.map((ml) => {
//     return { label: ml.name, value: ml.value };
//   });
//   const resetInputField = () => {
//     setSelectedConfigTable("");
//     setSelectedFile(undefined);
//   };

//   const onUploadData = () => {
//     const formData: FormData = new FormData();
//     formData.append("uploadfile", selectedFile);
//     formData.append("className", selectedConfigTale);
//     uploadLoadConfig(dispatch, formData);
//   };

//   const [open, setOpen] = React.useState(false);
//   const handleClickToOpen = () => {
//     setOpen(true);
//   };

//   const handleToClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Template>
//     <div>
//       <div style={{ height: 20 }}></div>
//       {/* <h5 >Load Configuration</h5> */}
//       <CustomHeader
//               labelText={'Load Configuration'}
//               />
//       <div style={{ height: 50 }} />
//       <GridContainer style={{ fontSize: 12, marginLeft: 100 }}>
//         {/* <GridItem sm={5} md={5} xs={5}> */}
//         <GridItem sm={4} md={4} xs={4}>
//           <Typography style={{ marginTop: 15 }}>
//             <Paragraph
//             labelText={'Config Table'} />
//           </Typography>
//         </GridItem>
//         {/* </GridItem> */}
//         {/* <GridItem sm={6} md={6} xs={6}> */}
//         <GridItem sm={6} md={4} xs={6}>
//           <CustomSelect

//             options={loadConfigLoaderCM}
//             placeholder={"Choose Table"}

//             onSelect={(e) => {
//               if (e == null) {
//                 setSelectedConfigTable(undefined);
//               } else {
//                 setSelectedConfigTable(e.value);
//               }
//             }}
//             value={loadConfigLoaderCM.filter(function (option) {
//               return option.value == selectedConfigTale;
//             })}
//           />
//           {/* </GridItem> */}
//         </GridItem>
//         {/* <GridItem sm={5} md={5} xs={5}> */}
//         <GridItem sm={5} md={5} xs={5}>
//           <Typography>
//             <div style={{ height: 5 }} />
//             <Paragraph
//             labelText={'Upload Source File'}/>
//           </Typography>
//           {/* </GridItem> */}
//         </GridItem>
//         <GridItem sm={1} md={1} xs={1}/>
//         <GridItem sm={1} md={1} xs={1}>
//           <div style={{ height: 10}} />
//           <div>
//             <input
//             style={{marginLeft:-200}}
//               type="file"
//               ref={inputRef}
//               accept=".xlsx"
//               onChange={(event) => {
//                 setSelectedFile(event.target.files[0]);
//               }}
//             />
//             {/* <Button variant="contained" component="label" style={{marginLeft:-132,height:25}}>
//              Upload File
//             <input type="file" hidden
//             accept=".xlsx"
//            ref={inputRef}
//            onChange={(event) => {
//           setSelectedFile(event.target.files[0]);
//           }} />

// </Button> */}
//           </div>
//           {/* </GridItem> */}
//         </GridItem>
//         <GridItem sm={4} md={8} xs={8} />
//         <GridItem sm={8} md={8} xs={8}>
//           <div style={{ height: 30 }} />
//           <CustomButton
//             variant={"text"}
//             //@ts-ignore
//             onClick={() => {
//               inputRef.current.value = "";
//               resetInputField();
//             }}
//             style={{
//               // marginRight: 90,
//               backgroundColor: dangerColor,
//               float: "right",
//               color: "white",
//               fontSize: 12,
//               padding:4,
//               textTransform: "capitalize",
//             }}
//             // id="btn-example-file-reset"
//           >
//             Reset
//           </CustomButton>
//           <CustomButton
//             variant={"contained"}
//             disabled={ selectedFile==undefined}
//             onClick={handleClickToOpen}
//             style={{
//               cursor: selectedFile==undefined ? "not-allowed" : "default",
//               backgroundColor:
//                selectedFile==undefined ? disabledColor : navyColor,
//               marginRight: 20,
//               padding:4,
//               float: "right",
//               color: "white",
//               fontSize: 12,
//               textTransform: "capitalize",
//             }}
//           >
//             Load
//           </CustomButton>
//         </GridItem>
//       </GridContainer>

//       <Dialogbox open={open}
//          onClose={handleToClose}
//          disableBackdropClick = {true}
//          title={"Confirm"}
//          message={"Would you Like to Intiate the Config Load"}
//         actions={
//       <ButtonGroup>
//          <CustomButton

//             onClick={() => {
//               onUploadData();
//               handleToClose();
//             }}
//             style={{
//               backgroundColor: navyColor,
//               color: "white",
//               // margin: 10,
//               marginRight:10,
//               padding:4,
//               fontSize:12,
//               textTransform: "capitalize",
//             }}
//           >
//             Yes
//           </CustomButton>
//           <CustomButton
//             onClick={handleToClose}
//             style={{
//               backgroundColor: dangerColor,
//               color: "white",
//               padding:4,
//               fontSize:12,
//               // marginRight:120,
//               textTransform: "capitalize",
//             }}
//           >
//             No
//           </CustomButton>
//       </ButtonGroup>
//       }

//       />

//     </div>
//     </Template>
//   );
// };
// export default LoadConfig;
