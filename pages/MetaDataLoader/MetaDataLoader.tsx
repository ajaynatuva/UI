import { ButtonGroup, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import "../../components/FontFamily/fontFamily.css";
import Paragraph from "../../components/Paragraph/Paragraph";
import Template from "../../components/Template/Template";
import { DIALOG } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  fetchLookupData,
  getMaxUnitsLkpData,
  getModIntractionLkpData,
  getBwTypeData
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import {
  getMfsQuaterLoader,
  uploadMetaLoader,
} from "../../redux/ApiCalls/MetaLoaderApis/MetaLoaderApi";
import { META_DATA_LOAD_SPINNER } from "../../redux/ApiCalls/MetaLoaderApis/MetaLoaderApiTypes";
import { getLastQuater } from "../../redux/ApiCalls/TaskApis/TaskApis";
import { SELECTED_METADATA_SOURCE } from "../../redux/ApiCalls/TaskApis/TaskApiType";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { MetaDataLoaderState } from "../../redux/reducers/MetaLoaderReducer/MetaDataLoaderReducer";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { CCI_LKP } from "../LookUps/LookUpConsts";
import * as Metadata from "../MetaDataLoader/Metadata";
import "../MetaDataLoader/MetaData.css";
import { MetaLoaderConstants } from "./MetaLoaderConst";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { sharePointUrls } from "../../configs/apiUrls";
import { DownloadReferenceTemplate } from "../MetaDataLoader/Metadata";

const MetaDataLoader = (props) => {
  const [metaDataLoader, setMetaDataLoader] = useState([]);
  const [latestQuater, setLatestQuater] = useState(undefined);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedBwKey, setSelectedBwKey] = useState(null);
  const [selectedModInteractionType, setModInteractionType] = useState(null);
  const [selectedmodInteractionDesc, setSelectedmodInteractionDesc] =
    useState("");
  const [selectedBwDesc, setSelectedBwDesc] = useState("");

  const [adhocQuarter, setAdhocQuarter] = useState("");
  const [selectedMetaDataLoader, setSelectedMetaDataLoader] = useState(null);
  const [selectedMaxLkpValue, setSelectedMaxLkpValue] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    getMaxUnitsLkpData(dispatch);
    let lkpName = CCI_LKP;
    fetchLookupData(dispatch, lkpName);
  }, []);
  let email = localStorage.getItem("emailId");
  const inputRef = useRef<HTMLInputElement>(null);

  const clickTimeout = useRef(null);
  const env = process.env.NODE_ENV;

  const openDropbox = () => {
    clearTimeout(clickTimeout.current);

    if (window.location.href.indexOf("local") > -1) {
      let loc = sharePointUrls.baseUrl + sharePointUrls.referencePath("LOCAL");
      window.open(loc);
    } else if (window.location.href.indexOf("dev") > -1) {
      let Dev = sharePointUrls.baseUrl + sharePointUrls.referencePath("DEV");
      window.open(Dev);
    } else if (window.location.href.indexOf("qa") > -1) {
      let QA = sharePointUrls.baseUrl + sharePointUrls.referencePath("QA");
      window.open(QA);
    }
    let production = sharePointUrls.baseUrl + sharePointUrls.prodPath;

    if (env === "production") {
      window.open(production);
    }
  };

  const updatedState: MetaDataLoaderState = useSelector(
    (state: any) => state.metaDataLoader
  );

  let JSZip = require("jszip");

  const handleAdhocFiles = (file) => {
    let zip = new JSZip();

    for (let adhocFile of file) {
      zip.file(adhocFile.name, adhocFile);
    }
    zip.generateAsync({ type: "blob" }).then((blobdata) => {
      var file = new File([blobdata], "adhocZipFile.zip");
      setSelectedFile(file);
    });
  };

  const handleCCIDeviationsFiles = (file) => {
    let zip = new JSZip();

    for (let adhocFile of file) {
      zip.file(adhocFile.name, adhocFile);
    }
    zip.generateAsync({ type: "blob" }).then((blobdata) => {
      var file = new File([blobdata], "CCIDeviations.zip");
      setSelectedFile(file);
    });
  };

  const updatedState1: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const lookupState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const updatedState2: MetaDataLoaderState = useSelector(
    (state: any) => state.metaDataLoader
  );

  const bwType = lookupState.getBwTypeData?.map((k) => {
    return { label: k.description, value: k.bwTypeKey };
  });

  const ModInteractionType = updatedState2.ModInteractionLkpData?.map((k) => {
    return { label: k.mitDesc, value: k.mitKey };
  });

  const MaxUnitsLkpData = updatedState.maxUnitsLkpData.map((d) => {
    return {
      value: d.maxUnitsLkpKey,
      label: d.description,
    };
  });

  const CciLkpData = lookupState.cci.map((d) => {
    return {
      value: d.cciKey,
      label: d.cciDesc,
    };
  });

  useEffect(() => {
    getBwTypeData(dispatch);
    getModIntractionLkpData(dispatch);
  }, []);
  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("uploadfile", selectedFile);
    formData.append("source", selectedMetaDataLoader);

    switch (selectedMetaDataLoader) {
      case MetaLoaderConstants.ADHOC_CPT_HCPCS:
        formData.append("quarter", adhocQuarter);
        formData.append("desc", null);
        formData.append("selectedMaxLkpValue", null);
        break;

      case MetaLoaderConstants.CCI_DEVIATIONS:
        formData.append("quarter", adhocQuarter);
        formData.append("desc", null);
        formData.append("selectedMaxLkpValue", null);
        break;

      case MetaLoaderConstants.BW_Pairs:
        formData.append("quarter", selectedBwKey);
        formData.append("desc", selectedBwDesc);
        formData.append("selectedMaxLkpValue", null);
        break;

      case MetaLoaderConstants.Modifier_Interaction:
        formData.append("quarter", selectedModInteractionType);
        formData.append("desc", selectedmodInteractionDesc);
        formData.append("selectedMaxLkpValue", null);
        break;

      case MetaLoaderConstants.SAME_OR_SIMILAR:
        formData.append("quarter", null);
        formData.append("desc", null);
        formData.append("selectedMaxLkpValue", null);
        break;

      default:
        const validation = Metadata.handleUploadFile(selectedFile);
        if (validation) {
          const GAP_LOAD = "GAP-LOAD";
          formData.append(
            "quarter",
            selectedMetaDataLoader === MetaLoaderConstants.RBRVS
              ? GAP_LOAD
              : selectedQuarter
          );
          formData.append("desc", null);
          formData.append("selectedMaxLkpValue", selectedMaxLkpValue?.label);
        }
        break;
    }
    formData.append("email", email);
    dispatch({ type: META_DATA_LOAD_SPINNER, payload: true });
    uploadMetaLoader(dispatch, formData, selectedMetaDataLoader, navigate);
    resetInputField();
  };

  const [open, setOpen] = React.useState(false);
  const handleClickToOpen = () => {
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   setMetaDataLoader(updatedState.metadataLoader.sort(Metadata.alphaOrder));
  //   // setMfsQuarter(updatedState.mfsQuarter);
  // }, [updatedState.metadataLoader]);
  useEffect(() => {
    const sortedMetadata = [...updatedState.metadataLoader].sort(
      Metadata.alphaOrder
    );
    setMetaDataLoader(sortedMetadata);
  }, [updatedState.metadataLoader]);

  const resetInputField = () => {
    setSelectedQuarter("");
    setSelectedMetaDataLoader(null);
    setSelectedFile(undefined);
    setSelectedBwKey("");
    setModInteractionType("");
    setSelectedMaxLkpValue(null);
  };

  useEffect(() => {
    if (updatedState.mfsQuarter.length == 0) {
      getMfsQuaterLoader(dispatch);
    }
  }, []);

  useEffect(() => {
    if (!selectedMetaDataLoader || !Metadata.VALID_LOADERS.has(selectedMetaDataLoader)) {
      setLatestQuater(" ");
      return;
    }
    const latest = updatedState.latestQuarter;
    if (!latest) {
      setLatestQuater(" ");
      return;
    }
    const formattedDate = moment(latest.updatedDate).format("MM-DD-YYYY hh:mm:ss");
    const assignee = latest.assignee;
    const message = assignee
      ? `Last Load For ${latest.quarterName} On ${formattedDate} By ${assignee}`
      : `Last Load For ${latest.quarterName} On ${formattedDate}`;
  
    setLatestQuater(message);
  }, [selectedMetaDataLoader, updatedState.latestQuarter]);

  const metaDataLoaderCM = metaDataLoader?.map((ml) => {
    return { label: ml.Name, value: ml.value };
  });
  const mfsQuarterCM = Metadata.newQuarter?.map((mfs) => {
    return { label: mfs.Name, value: mfs.value };
  });
  const yearsIcd = Metadata.Years?.map((icd) => {
    return { label: icd.Name, value: icd.value };
  });

  const checkQuarterValue = () => {
    let quarterValue;

    switch (selectedMetaDataLoader) {
      case MetaLoaderConstants.BW_Pairs:
        quarterValue =
          bwType.find((km) => km?.value === selectedBwKey)?.label || "";
        break;

      case MetaLoaderConstants.Modifier_Interaction:
        quarterValue =
          ModInteractionType.find(
            (p) => p?.value === selectedModInteractionType
          )?.label || "";
        break;

      case MetaLoaderConstants.ICD_10_CM_DRGN:
      case MetaLoaderConstants.ICD_10_PCS:
      case MetaLoaderConstants.ZIP_5:
      case MetaLoaderConstants.ZIP_9:
        quarterValue =
          yearsIcd.find((km) => km.value === selectedQuarter)?.value || "";
        break;

      default:
        quarterValue =
          mfsQuarterCM.find((km) => km.value === selectedQuarter)?.value || "";
        break;
    }

    return { label: quarterValue, value: quarterValue };
  };

  return (
    <Template>
      <div className="row">
        <div className="col-sm-9">
          <CustomHeader labelText={"Metadata Loader"} />
        </div>
        <div className="col-sm-1">
          {selectedMetaDataLoader === MetaLoaderConstants.CCI_DEVIATIONS && (
            <button
              type="button"
              id="actionButton"
              style={{
                border: "none",
                textDecorationLine: "underline",
                backgroundColor: "white",
                textDecorationColor: "blue",
              }}
              onClick={() => {
                DownloadReferenceTemplate(clickTimeout);
              }}
              onDoubleClick={openDropbox}
            >
              ReferenceTemplate
            </button>
          )}
        </div>
      </div>
      <div className="row" style={{ marginTop: "6%" }}>
        <div className="col-sm-3" />
        <div className="col-sm-2" style={{ position: "relative", top: "10px" }}>
          <Typography>
            <Paragraph labelText={"Metadata Loader"} />
          </Typography>
        </div>
        <div className="col-sm-2">
          <CustomSelect
            options={metaDataLoaderCM}
            placeholder={"Select Option"}
            onSelect={(e) => {
              if (e == null) {
                setSelectedMetaDataLoader(undefined);
              } else {
                setSelectedMetaDataLoader(e.value);
                dispatch({ type: SELECTED_METADATA_SOURCE, payload: e });
                setSelectedQuarter("");
                setSelectedMaxLkpValue("");
                setSelectedBwKey("");
                setModInteractionType("");
                getLastQuater(dispatch, e.value);
              }
            }}
            value={metaDataLoaderCM.filter(function (option) {
              return option.value == selectedMetaDataLoader;
            })}
          />
          {selectedMetaDataLoader ? (
            <p
              style={{
                color: "blue",
                marginBottom: "-4px",
                fontSize: "12px",
              }}
            >
              {latestQuater}
            </p>
          ) : undefined}
        </div>
      </div>
      {selectedMetaDataLoader == MetaLoaderConstants.MAX_UNITS ||
      selectedMetaDataLoader == MetaLoaderConstants.CCI ? (
        <div className="row">
          <div className="col-sm-3" />
          <div
            className="col-sm-2"
            style={{ position: "relative", top: "10px" }}
          >
            <Typography>
              <Paragraph
                labelText={
                  selectedMetaDataLoader == MetaLoaderConstants.CCI
                    ? "CCI Lookup"
                    : "MUV Lookup"
                }
              />
            </Typography>
          </div>
          <div className="col-sm-2">
            <CustomSelect
              options={
                selectedMetaDataLoader == MetaLoaderConstants.CCI
                  ? CciLkpData
                  : MaxUnitsLkpData
              }
              placeholder={"Select Option"}
              onSelect={(e) => {
                if (e == null) {
                  setSelectedMaxLkpValue(undefined);
                  setSelectedQuarter("");
                } else {
                  setSelectedMaxLkpValue(e);
                  setSelectedQuarter("");
                  setSelectedBwKey("");
                  setModInteractionType("");
                }
              }}
              value={(selectedMetaDataLoader == MetaLoaderConstants.CCI
                ? CciLkpData
                : MaxUnitsLkpData
              ).filter(function (option) {
                return option?.value == selectedMaxLkpValue?.value;
              })}
            />
          </div>
        </div>
      ) : undefined}
      <div className="row">
        <div className="col-sm-3" />
        <div className="col-sm-2" style={{ position: "relative", top: "10px" }}>
          <Typography>
            <Paragraph
              labelText={
                selectedMetaDataLoader
                  ? Metadata.checkQauterOrYear(
                      selectedMetaDataLoader,
                      selectedMaxLkpValue
                    )
                  : ""
              }
            />
          </Typography>
        </div>
        {selectedMetaDataLoader &&
        Metadata.checkRbrsvsOrSameOrSimOrAdhocCpt(selectedMetaDataLoader) ? (
          <div className="col-sm-2">
            <CustomSelect
              options={
                selectedMetaDataLoader == MetaLoaderConstants.BW_Pairs
                  ? bwType
                  : selectedMetaDataLoader ==
                    MetaLoaderConstants.Modifier_Interaction
                  ? ModInteractionType
                  : selectedMetaDataLoader ==
                      MetaLoaderConstants.ICD_10_CM_DRGN ||
                    selectedMetaDataLoader == MetaLoaderConstants.ICD_10_PCS ||
                    selectedMetaDataLoader == MetaLoaderConstants.ZIP_5 ||
                    selectedMetaDataLoader == MetaLoaderConstants.ZIP_9 
                  ? yearsIcd
                  : mfsQuarterCM
              }
              placeholder={"Select Quarter"}
              onSelect={(e) => {
                if (e == null) {
                  setSelectedQuarter(undefined);
                  setSelectedBwKey(undefined);
                  setModInteractionType(undefined);
                } else {
                  if (selectedMetaDataLoader == MetaLoaderConstants.BW_Pairs) {
                    let value = e.value;
                    setSelectedBwKey(value);
                    setSelectedBwDesc(e.label);
                  } else {
                    setSelectedQuarter(e.value);
                    setSelectedBwDesc("");
                    setSelectedBwKey("");
                  }

                  if (
                    selectedMetaDataLoader ==
                    MetaLoaderConstants.Modifier_Interaction
                  ) {
                    let value = e.value;
                    setModInteractionType(value);
                    setSelectedmodInteractionDesc(e.label);
                  } else {
                    setSelectedQuarter(e.value);
                    setModInteractionType("");
                    setSelectedmodInteractionDesc("");
                  }
                }
              }}
              // value={checkQuarterValue()}
              value={
                selectedQuarter || selectedBwKey || selectedModInteractionType
                  ? checkQuarterValue()
                  : null
              }
            />
          </div>
        ) : undefined}
      </div>
      {selectedMetaDataLoader ? (
        <div className="row">
          <div className="col-sm-3" />
          <div
            className="col-sm-2"
            style={{ position: "relative", top: "10px" }}
          >
            <Typography>
              <Paragraph labelText={"Upload Source File"} />
            </Typography>
          </div>
          <div className="col-sm-2">
            <div className="choosefile">
              <input
                ref={inputRef}
                type="file"
                multiple={
                  selectedMetaDataLoader ==
                    MetaLoaderConstants.ADHOC_CPT_HCPCS ||
                  selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS
                }
                onChange={(event) => {
                  setAdhocQuarter("");
                  if (
                    selectedMetaDataLoader ==
                    MetaLoaderConstants.ADHOC_CPT_HCPCS
                  ) {
                    for (let i = 0; i < event.target.files.length; i++) {
                      if (event.target.files[i].type.includes("xml")) {
                        setAdhocQuarter(
                          event.target.files[i].name
                            .split("HCPCS")[1]
                            .substring(1, 11)
                            .trim()
                        );
                      }
                    }
                  }
                  if (
                    selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS
                  ) {
                    setAdhocQuarter("");
                  }
                  if (
                    selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS
                  ) {
                    handleCCIDeviationsFiles(event.target.files);
                  } else {
                    const file = event.target.files[0];
                    const flag = Metadata.handleUploadFile(file);
                    const finalFile = flag ? file : undefined;
                    setSelectedFile(finalFile);
                  }
                  if (
                    selectedMetaDataLoader ==
                    MetaLoaderConstants.ADHOC_CPT_HCPCS
                  ) {
                    handleAdhocFiles(event.target.files);
                  } else {
                    const file = event.target.files[0];
                    const flag = Metadata.handleUploadFile(file);
                    const finalFile = flag ? file : undefined;
                    setSelectedFile(finalFile);
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : undefined}
      {selectedMetaDataLoader ? (
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-2" />
          <div className="col-sm-2">
            <CustomButton
              variant="contained"
              onClick={handleClickToOpen}
              disabled={Metadata.checkFileDisable(
                selectedBwKey,
                selectedMetaDataLoader,
                selectedQuarter,
                selectedFile,
                selectedMaxLkpValue
              )}
              style={{
                color: "white",
                fontSize: 12,
                textTransform: "capitalize",
                cursor: selectedFile == undefined ? "not-allowed" : "default",
                backgroundColor: Metadata.checkDisable(
                  selectedMetaDataLoader,
                  selectedFile,
                  selectedQuarter,
                  selectedBwKey,
                  selectedMaxLkpValue
                ),
              }}
            >
              Load
            </CustomButton>
            <CustomButton
              variant="contained"
              style={{
                backgroundColor: dangerColor,
                color: "white",
                marginLeft: 10,
                fontSize: 12,
                textTransform: "capitalize",
              }}
              onClick={() => {
                inputRef.current.value = "";
                resetInputField();
              }}
            >
              Reset
            </CustomButton>
          </div>
        </div>
      ) : undefined}

      <Dialogbox
        onClose={handleToClose}
        disableBackdropClick={true}
        open={open}
        title={"Confirm"}
        message={"Would you like to initiate the stage load data?"}
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
              onClick={() => {
                onFileUpload();
                handleToClose();
                dispatch({ type: DIALOG, payload: {isDialog:false} });
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              style={{
                color: "white",
                backgroundColor: dangerColor,
                fontsize: 12,
                padding: 1,
                textTransform: "capitalize",
              }}
              onClick={() => {
                handleToClose();
                dispatch({ type: DIALOG, payload: {isDialog:false} });
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    </Template>
  );
};
export default MetaDataLoader;
