import React, { useMemo, useRef, useState } from "react";
import "../PolicyUpdateReport/PolicyUpdateReport.css";
import Paragraph from "../../components/Paragraph/Paragraph";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import Template from "../../components/Template/Template";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomButton from "../../components/CustomButtons/CustomButton";
import { uploadPolicyReport } from "../../redux/ApiCalls/PolicyUpdateReportApi/PolicyUpdateReportApi";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import "../PolicyUpdateReport/PolicyUpdateReport.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { exportedExcelFileData } from "../../components/ExportExcel/ExportExcelFile";
import AgGrids from "../../components/TableGrid/AgGrids";

const PolicyUpdateReport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [flag, setFlag] = React.useState(false);
  const clickTimeout = useRef(null);

  const [rows, setRows] = React.useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  // const updatedState: LookUpState = useSelector(
  //   (state: any) => state.lookupReducer
  // );

  const handleUploadFile = (file) => {
    // if(checkQuaterValue == null || checkQuaterValue == undefined){
    var allowedFiles = [".xlsx"];
    var regex = new RegExp(
      "([a-zA-Z0-9s_\\.-:()])+(" + allowedFiles.join("|") + ")$"
    );
    if (file != undefined) {
      if (!regex.test(file?.name.toLowerCase())) {
        CustomSwal(
          "error",
          "Please upload valid file(.xlsx)",
          navyColor,
          "OK",
          ""
        );

        setFlag(false);
      } else {
        setFlag(true);
      }
    }
  };

  const resetInputField = () => {
    setSelectedFile(undefined);
    setFlag(false);
    setRows([]);
    setNumberOfRows(0);
  };

  // let exportedData = [];
  // let exportedresultData = [];

  const PolicyUpdateReportColumns = [
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      headerTooltip: "Status",
    },
    {
      field: "cptCode",
      headerName: "CPT Code",
      minWidth: 100,
      headerTooltip: "Cpt Code",
    },
    {
      field: "sameOrSimCode",
      headerName: "Same/Sim Code",
      minWidth: 90,
      headerTooltip: "Same/Sim Code",
    },
    {
      field: "mod1",
      headerName: "Mod1",
      minWidth: 60,
      headerTooltip: "mod1",
    },
    {
      field: "action",
      headerName: "ACTION",
      minWidth: 80,
      headerTooltip: "action",
    },
    {
      field: "policyNumber",
      headerName: "Policy #",
      minWidth: 60,
      headerTooltip: "Policy Number",
    },
    {
      field: "medicalPolicy",
      headerName: "Medical Policy",
      minWidth: 140,
      headerTooltip: "Medical Policy",
    },
    {
      field: "subPolicy",
      headerName: "Sub-Policy",
      minWidth: 140,
      headerTooltip: "Sub-Policy",
    },
    {
      field: "exclusion",
      headerName: "Exclusion",
      minWidth: 60,
      headerTooltip: "Exclusion",
    },
  ];
  let checkError = false;

  const uploadPolicyReportFile = () => {
    let policyUpdateReport = [];
    var files = selectedFile;
    var reader = new FileReader();
    reader.onload = async function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary", cellDates: true });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      const options = { header: 1 };

      let inputData = [];
      inputData = XLSX.utils.sheet_to_json(ws, options);

      // const header = inputData.shift();
      // checkHeaderName(header);
      //@ts-ignore
      // let excelRows = XLSX.utils.sheet_to_row_object_array(ws);
      // if (checkError == false) {
      const dataParse = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });

      let ReportedData = [];
      // let UploadedData = [];
      dataParse?.forEach((d, idx) => {
        if (idx >= 1) {
          let obj = {
            number: d[0],
            cptCode: String(d[1]),
            modifier: d[2],
            keyWord: d[3],
            revenueCode: d[4],
            billType: d[5],
            policyDiagnosis: d[6],
            placeOfService: d[7],
            conditionCode: d[8],
            status: d[9],
          };
          ReportedData.push(obj);
        }
      });
      if (ReportedData?.length === 0) {
        CustomSwal("error", "Please Check the File", navyColor, "OK", "");
      } else {
        policyUpdateReport = await uploadPolicyReport(dispatch, ReportedData);
        if (policyUpdateReport?.length === 0) {
          CustomSwal("info", "No Match Found", navyColor, "OK", "");
        } else {
          exportToExcel(policyUpdateReport);
        }
      }
      // }
    };
    inputRef.current.value = "";
    reader.readAsBinaryString(files);
  };

  function unique(array) {
    const result = [];
    const seen = {};
    array.forEach((item) => {
      if (!seen[item]) {
        seen[item] = true;
        result.push(item);
      }
    });
    return result;
  }

  function policyStatus(d) {
    let status = "";
    if (d.isProd) {
      status = "Prod";
    }
    if (d.deactivated) {
      status += (status ? "," : "") + "Deactivated";
    }
    if (d.disabled) {
      status += (status ? "," : "") + "Disabled";
    }
    return status || "NA";
  }

  function exportToExcel(data) {
    const exportData = data.map((d) => {
      return {
        "Policy Category": d.policyCategory,
        "Medical Policy": d.medicalPolicy,
        "Sub Policy": d.subPolicy,
        "Custom Version": d.customVersion,
        LOB: d.lob,
        "Policy.Version": d.policyVersion,
        "Policy Description": d.medicalPolicyDesc,
        "SameSim Code": d.sameOrSimCode == null ? "" : d.sameOrSimCode,
        "CPT Code": d.cptCode,
        "Key Word": d.keyWord,
        Modifier: d.modifier,
        "Revenue Code": d.revenueCode,
        "Place of Service": d.placeOfService,
        "DOS From": d.dosFrom,
        "DOS To": d.dosTo,
        "CPT/HCPCS Action": d.cptHcpcsAction,
        "Claim Type": d.claimType,
        "Bill Type": d.billType,
        "Bill Type Action": d.policyBillTypeActionCode,
        Diagnosis: d.policyDiagnosis,
        Exclusion: d.exclusion,
        "Policy Status": policyStatus(d),
        Status: d.status,
        recordNumber: d.number,
      };
    });
    const removeNumberColumn = (record) => {
      const { recordNumber, ...rest } = record;
      return rest;
    };
    const groupedData = exportData?.reduce((acc, record) => {
      const modifiedRecord = removeNumberColumn(record);
      if (!acc[record.recordNumber]) acc[record.recordNumber] = [];
      acc[record.recordNumber].push(modifiedRecord);
      return acc;
    }, {});

    const workbook = XLSX.utils.book_new();
    Object.keys(groupedData).forEach((id) => {
      const worksheet = XLSX.utils.json_to_sheet(groupedData[id]);
      const statuses = groupedData[id].map((record) => record.Status);
      const uniqueStatuses = unique(statuses);
      const suffix = uniqueStatuses.some(
        (status) => status?.toLowerCase() === "new"
      )
        ? " NEW"
        : "";
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `Record ${id}${suffix}`
      );
    });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Policy Update Report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const sameorsimeCodeheader = [
    "Number",
    "CPT Code",
    "Modifier",
    "Key Word",
    "Revenue Code",
    "Bill Type",
    "Diagnosis",
    "Place of Service",
    "Condition Code",
    "Status",
  ];
  const samesimData = [
    ["1", "98765", "*", "Key Word", "123", "123", "123", "*", "N/A", "New"],
    ["2", "97654", "*", "Key Word", "123", "123", "123", "*", "N/A", "CHG"],
    ["3", "98653", "*", "Key Word", "123", "123", "123", "*", "N/A", "DEL"],
  ];

  function DownloadReferenceTemplate() {
    clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      // const ws = XLSX.utils.json_to_sheet(RefTemplateObj);
      const ws = XLSX.utils.aoa_to_sheet([
        sameorsimeCodeheader,
        ...samesimData,
      ]);

      const wb = {
        Sheets: { InputFile: ws },
        SheetNames: ["InputFile"],
        Headers: sameorsimeCodeheader,
      };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      let fileName = "Reference Cpt Code Template";
      FileSaver.saveAs(data, fileName + fileExtension);
    }, 250);
  }

  const env = process.env.NODE_ENV;

  const openDropbox = () => {
    clearTimeout(clickTimeout.current);

    if (window.location.href.indexOf("local") > -1) {
      let loc =
        "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%5FIPU%5FLOCAL%2FData%5FCuration%2FReference%20Templates%2FSame%20or%20Similar%20Codes%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";
      window.open(loc);
    } else if (window.location.href.indexOf("dev") > -1) {
      let Dev =
        "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%5FIPU%5FDEV%2FData%5FCuration%2FReference%20Templates%2FSame%20or%20Similar%20Codes%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";
      window.open(Dev);
    } else if (window.location.href.indexOf("qa") > -1) {
      let QA =
        "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%5FIPU%5FQA%2FData%5FCuration%2FReference%20Templates%2FSame%20or%20Similar%20Codes%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";
      window.open(QA);
    }
    let production =
      "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%20IPU%2FData%20Curation%2FReference%20Templates%2FSame%20or%20Similar%20Codes%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";

    if (env === "production") {
      window.open(production);
    }
  };

  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "70px",
      float: "right",
      right: "35px",
      display: "inline",
    }),
    []
  );

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  return (
    <Template>
      <div className="row">
        <div className="col-sm-6">
          {" "}
          <CustomHeader labelText={"Policy Update Report"} />
        </div>
        <div className="col-sm-3" />
        <div className="col-sm-2">
          <button
            type="button"
            id="actionButton"
            style={{
              border: "none",
              textDecorationLine: "underline",
              backgroundColor: "white",
              textDecorationColor: "blue",
            }}
            onClick={DownloadReferenceTemplate}
            onDoubleClick={openDropbox}
          >
            ReferenceTemplate
          </button>
        </div>
      </div>
      <div className="row" style={{ marginTop: "3%" }}>
        <div className="col-sm-3" />
        <div className="col-sm-2">
          <Paragraph labelText={"Upload Source File"} />
        </div>
        <div className="col-sm-2">
          <div className="choosefile">
            <input
              ref={inputRef}
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                setSelectedFile(file);
                handleUploadFile(e.target.files[0]);
              }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3" />
        <div className="col-sm-2" />
        <div className="col-sm-4">
          {flag == true ? (
            <CustomButton
              variant="contained"
              onClick={() => {
                uploadPolicyReportFile();
              }}
              style={{
                backgroundColor: navyColor,
                color: "white",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Run
            </CustomButton>
          ) : undefined}
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
      <div className="row">
        {rows.length > 0 ? (
          <div>
            <CustomHeader labelText={"Report Details"} />
            <div
              className="grid"
              style={{ height: rows.length > 20 ? "400px" : "200px" }}
            >
              <AgGrids
                //@ts-ignore
                rowData={rows}
                columnDefs={PolicyUpdateReportColumns}
                gridIconStyle={gridIconStyle}
                onFilterChanged={onFilterChanged}
              />
            </div>
          </div>
        ) : undefined}
        {rows.length > 0 ? (
          <small
            style={{ position: "relative", top: "30px", fontSize: "12px" }}
          >
            Number of rows : {numberOfRows}
          </small>
        ) : undefined}
      </div>
      <div className="row">
        <div className="export">
          {numberOfRows > 0 ? (
            <CustomButton
              onClick={() => {
                exportedExcelFileData(
                  rows,
                  "Policy Details Report",
                  "PolicyUpdateData"
                );
              }}
              variant={"contained"}
              style={{
                backgroundColor: navyColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
                // marginTop: -8,
                float: "right",
              }}
            >
              Export
            </CustomButton>
          ) : undefined}
        </div>
      </div>
    </Template>
  );
};
export default PolicyUpdateReport;
