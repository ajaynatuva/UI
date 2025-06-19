import {
  ButtonGroup,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from "@material-ui/core";
import { Add, MoreHoriz } from "@material-ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import "../NewPolicy.css";
import moment from "moment";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { LookUpState } from "../../../redux/reducers/LookUpReducer/LookUpReducer";
import { getActiveClientGroups } from "../../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { fetchLookupData } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { SUB_SPEC_LKP } from "../../LookUps/LookUpConsts";
import { exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import {
  addTaxonomyData,
  DisableTaxonomyData,
  getTaxonomyOfPolicy,
  uploadTaxonomyData,
  UploadTaxonomyToTarget,
} from "../../../redux/ApiCalls/NewPolicyTabApis/TaxonomyApis";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import {
  black,
  dangerColor,
  navyColor,
  successColor,
} from "../../../assets/jss/material-kit-react";
import {
  DIALOG,
  TAXONOMY_TARGET,
} from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { taxonomyColumnDefs, taxonomyTabColumns } from "../Columns";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { apiUrl, policyConfigUrl } from "../../../configs/apiUrls";
import {
  addChangesData,
  getChangesById,
} from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import AgGrids from "../../../components/TableGrid/AgGrids";
import Dialogbox from "../../../components/Dialog/DialogBox";
import RadioButton from "../../../components/RadioButton/RadioButton";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { ClientAssignmentState } from "../../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { JiraStringMethod } from "../../../redux/ApiCallAction/Validations/StringValidation";
import JiraComponent from "../JiraComponent";

const Taxonomy = ({ fromViewPolicy, policyId, edit }) => {
  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const lookUpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const formState: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  const clientAssignmentState: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );
  const changesTabState: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );
  const dispatch = useDispatch();
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [addPopUp, setAddPopUp] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [taxonomyPopUp, setTaxonomyPopUp] = useState(false);
  const [clientCheck, setClientCheck] = useState(0);
  const [active, setActive] = useState(0);
  const [rows, setRows] = useState([]);
  const gridApi = useRef(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const [review, setReview] = useState(false);
  let checkFileds = false;
  const [fieldError, setFieldError] = useState(false);
  const [taxonomyValues, setTaxonomyValues] = useState([]);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(undefined);
  const [jiraId, setJiraId] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [deltaLink, setDeltaLink] = useState(undefined);
  const [jiraIdExist, setJiraIdExist] = useState(false);
  const [showAllOrNot, setShowAllOrNot] = useState(false);

  const TaxonomyColumns = {
    action: undefined,
    taxonomyKey: undefined,
    policyId: undefined,
    clientGroupId: undefined,
    taxonomyCode: undefined,
    specCode: undefined,
    subspecCode: undefined,
    subspecDesc: undefined,
    function: undefined,
    clientCode: undefined,
    clientGroupCode: undefined,
    jiraId: undefined,
    jiraDescription: undefined,
    createdDate: undefined,
    updatedDate: undefined,
  };
  const [taxonomy, setTaxonomy] = useState(TaxonomyColumns);
  const [gridKey, setGridKey] = useState(0);
  useEffect(() => {
    if (clientAssignmentState.getActiveClientData.length === 0) {
      getActiveClientGroups(dispatch);
    }
  }, [dispatch, clientAssignmentState.getActiveClientData.length]);

  // useEffect(() => {
  //   if (policyId && edit) {
  //     getTaxonomyOfPolicy(dispatch, policyId);
  //   }
  // }, [dispatch, edit, newpolicyState.getTaxonomyData.length, policyId]);

  useEffect(() => {
    if (lookUpState.subSpecs?.length == 0) {
      let lkpName = SUB_SPEC_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);

  const availableTaxonomyCodes = useMemo(() => {
    const availableTaxonomyCodesMap = new Map();

    // Check if any taxonomy in getTaxonomyData has taxonomyCode === "0"
    const hasZeroTaxonomyCode = newpolicyState.getTaxonomyData?.some(
      (taxonomy) => taxonomy.taxonomyCode === "0"
    );

    newpolicyState.getTaxonomyData?.forEach((taxonomy) => {
      lookUpState.subSpecs?.forEach((data, index) => {
        if (
          taxonomy.taxonomyCode === data.taxonomyCode &&
          !availableTaxonomyCodesMap.has(data.taxonomyCode)
        ) {
          availableTaxonomyCodesMap.set(data.taxonomyCode, {
            id: index,
            taxonomyCode: data.taxonomyCode,
            specCode: data.specCode,
            subspecCode: data.subspecCode,
            subspecDesc: data.subspecDesc,
          });
        }
      });
    });

    // If taxonomyCode "0" is present, push all lookUpState.subSpecs data
    if (hasZeroTaxonomyCode) {
      lookUpState.subSpecs?.forEach((data, index) => {
        if (!availableTaxonomyCodesMap.has(data.taxonomyCode)) {
          availableTaxonomyCodesMap.set(data.taxonomyCode, {
            id: index,
            taxonomyCode: data.taxonomyCode,
            specCode: data.specCode,
            subspecCode: data.subspecCode,
            subspecDesc: data.subspecDesc,
          });
        }
      });
    }

    return Array.from(availableTaxonomyCodesMap.values());
  }, [newpolicyState.getTaxonomyData, lookUpState.subSpecs]);

  useEffect(() => {
    setRows(
      (taxonomy.function === "Exclude" || taxonomy.function === 0
        ? availableTaxonomyCodes
        : lookUpState.subSpecs
      )?.map((data, index) => ({
        id: index,
        taxonomyCode: data.taxonomyCode,
        specCode: data.specCode,
        subspecCode: data.subspecCode,
        subspecDesc: data.subspecDesc,
      })) || []
    );
  }, [lookUpState.subSpecs?.length, taxonomy.function]);

  // Update taxonomyCode only after `rows` has been updated
  useEffect(() => {
    if (taxonomy.function === 1) {
      setTaxonomy((prev) => ({
        ...prev,
        taxonomyCode: rows?.map((value) => value.taxonomyCode),
      }));
      setTaxonomyValues(rows);
    }
  }, [rows, taxonomy.function]);
  useEffect(() => {
    if (clientCheck === 0) {
      setShowAllOrNot(true);
      setTaxonomy({
        ...taxonomy,
        function: 1,
        clientGroupId: 0,
        clientCode: "ALL",
        clientGroupCode: { label: "ALL", value: "ALL" },
        taxonomyCode: rows?.map((value) => value.taxonomyCode),
      });
      setTaxonomyValues(rows);
      refreshJiraDetails();
      setFieldError(false);
    } else {
      setShowAllOrNot(false);
      setTaxonomy({
        ...taxonomy,
        function: 0,
        clientGroupId: 0,
        clientCode: "ALL",
        clientGroupCode: { label: "ALL", value: "ALL" },
        taxonomyCode: [],
      });
    }
    refreshJiraDetails();
    setFieldError(false);
  }, [clientCheck]);
  useEffect(() => {
    if (taxonomy.function === "Exclude" || taxonomy.function === 0) {
      setShowAllOrNot(false);
    }
  }, [taxonomy.function]);

  useEffect(() => {
    setDeltaLink(newpolicyState.deltaLink);
  }, [newpolicyState.deltaLink]);

  const onFilterChanged = (event) => {
    const filterModel = event.api.getFilterModel();
    const isFilterModelEmpty =
      Object.keys(filterModel).length === 0 &&
      filterModel.constructor === Object;

    if (isFilterModelEmpty) {
      setNumberOfRows(taxonomyData.length);
      event.api.refreshCells({ force: true });
      setExportData(taxonomyData);
      return;
    }

    const filters = {
      clientCode: filterModel?.clientCode?.filter || "",
      clientGroupCode: filterModel?.clientGroupCode?.filter || "",
      taxonomyCode: filterModel?.taxonomyCode?.filter || "",
      specCode: filterModel?.clientName?.filter || "",
      subspecCode: filterModel?.clientGroupName?.filter || "",
      subspecDesc: filterModel?.specData?.filter || "",
      function: filterModel?.subSpecData?.filter || "",
    };

    const areAllFiltersEmpty = Object.values(filters).every(
      (value) => value === ""
    );

    if (areAllFiltersEmpty) {
      setNumberOfRows(taxonomyData.length);
      event.api.refreshCells({ force: true });
    } else {
      const filteredData = filterData(filters);
      setExportData(filteredData);
      setNumberOfRows(filteredData.length);
      event.api.refreshCells({ force: true });
    }
  };
  const filterData = (filters) => {
    return taxonomyData.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true;

        const itemValue = item[key]?.toString().toLowerCase() || "";
        return itemValue.includes(filterValue.toLowerCase());
      });
    });
  };

  const set = new Set(
    clientAssignmentState.getClientAssignmentTableData?.map(
      (data) => data.clientGroupId
    )
  );
  const filteredClientAssignmentData =
    clientAssignmentState.getActiveClientData?.filter((data) =>
      set.has(data.clientGroupId)
    );

  useEffect(() => {
    const fetchData = async () => {
      let taxonomyData = [];
      newpolicyState.getTaxonomyData?.forEach((data) => {
        taxonomyData.push({
          taxonomyKey: data.taxonomyKey,
          clientCode:
            data.clientGroupId == 0
              ? "ALL"
              : clientAssignmentState.getActiveClientData?.find(
                  (option) => option.clientGroupId === data.clientGroupId
                )?.clientCode,
          clientGroupCode:
            data.clientGroupId == 0
              ? "ALL"
              : clientAssignmentState.getActiveClientData?.find(
                  (option) => option.clientGroupId === data.clientGroupId
                )?.clientGroupCode,
          clientGroupId: data.clientGroupId,
          taxonomyCode: data.taxonomyCode == 0 ? "ALL" : data.taxonomyCode,
          specCode: data.specCode == 0 ? "ALL" : data.specCode,
          subspecCode: data.subSpecCode == 0 ? "ALL" : data.subSpecCode,
          subspecDesc: data.subSpecDesc == 0 ? "ALL" : data.subSpecDesc,
          function: data.function === 1 ? "Applies To": data.function === 0 ? "Exclude" : "",
          createdDate: data.createdDate
            ? moment(data.createdDate).format("MM-DD-YYYY")
            : "",
          updatedDate: data.updatedDate
            ? moment(data.updatedDate).format("MM-DD-YYYY")
            : "",
          action: data.deletedB === 0 ? "Active" : "Deactivated",
        });
      });
      setExportData(taxonomyData);
      setNumberOfRows(taxonomyData.length);
      setTaxonomyData(taxonomyData);
    };
    fetchData();
  }, [
    newpolicyState.getTaxonomyData,
    clientAssignmentState.getActiveClientData,
  ]);

  let allPresent = taxonomyData.some((k) => k.clientCode === "ALL");
  let exportToExcel = (data) => {
    if (data.length > 0) {
      let exportedData = data?.map((d) => {
        return {
          POLICYID: policyId,
          CLIENTGROUPID: d.clientGroupId,
          CLIENTCODE: d.clientGroupId == 0 ? "ALL" : d.clientCode,
          CLIENTGROUPCODE: d.clientGroupId == 0 ? "ALL" : d.clientGroupCode,
          SPECCODE: d.specCode === 0 ? "ALL" : d.specCode,
          SUBSPECCODE: d.subspecCode === 0 ? "ALL" : d.subspecCode,
          SUBSPECDESC: d.subspecDesc === 0 ? "ALL" : d.subspecDesc,
          TAXONOMYCODE: d.taxonomyCode === 0 ? "ALL" : d.taxonomyCode,
          FUNCTION: d.function,
          STATUS: d.action,
        };
      });
      exportedExcelFileData(
        exportedData,
        formState.policyNumber + "/" + formState.version,
        "Taxonomy"
      );
    }
  };
  const check = () => {
    const fields = ["clientCode", "clientGroupCode", "taxonomyCode"];
    const missingFields = fields.filter((field) => {
      const value = taxonomy?.[field]; // Ensure taxonomy is defined
      return Array.isArray(value) ? value.length === 0 : !value;
    });

    if (clientCheck == 1) {
      if (!jiraId) missingFields.push("JiraId");
      if (!jiraDescription) missingFields.push("JiraDescription");
    }

    const checkFields = missingFields.length > 0;
    setFieldError(checkFields);
    return checkFields;
  };

  const checkDelete = () => {
    if (
      jiraId === undefined ||
      jiraId === "" ||
      jiraDescription === "" ||
      jiraDescription === undefined
    ) {
      checkFileds = true;
      setFieldError(checkFileds);
    } else if (active == 0 && open === false) {
      checkFileds = true;
      setFieldError(checkFileds);
    }
    return checkFileds;
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    if (event.target.value.length < 3) {
      taxonomy.clientGroupCode = "";
    }
    setTaxonomy({ ...taxonomy, clientCode: value });
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = filteredClientAssignmentData
        .filter((k) => {
          const clientCodeLower = k.clientCode?.toLowerCase();
          if (
            clientCodeLower.includes(value?.toLowerCase()) &&
            !seen.has(clientCodeLower)
          ) {
            seen.add(clientCodeLower);
            return true;
          }
          return false;
        })
        .map((k) => ({ label: k.clientCode, value: k.clientCode }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
      taxonomy.clientGroupCode = { label: "ALL", value: 0 };
      taxonomy.clientCode = "ALL";
    }
  };
  useEffect(() => {
    if (taxonomy.clientCode == "ALL") {
      setTaxonomy({
        ...taxonomy,
        clientGroupCode: { label: "ALL", value: 0 },
      });
    }
  }, [taxonomy.clientCode === "ALL"]);
  const handleSuggestionClick = (value) => {
    taxonomy.clientCode = value;
    setSuggestions([]);
  };
  let clientGroupExclusion = filteredClientAssignmentData
    .filter((k) => k.clientCode == taxonomy.clientCode)
    .map((k) => {
      return { label: k.clientGroupCode, value: k.clientGroupId };
    });
  const lkpGridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "15px",
      float: "right",
      right: "75px",
      display: "inline",
    }),
    []
  );
  const [selectedRows, setSelectedRows] = useState("");
  const onSelectionChanged = (event) => {
    const selectedCheckBoxvalues = event.api.getSelectedRows();
    const selectedNodes = gridApi.current.getSelectedNodes();
    const totalRows = gridApi.current.getDisplayedRowCount();
    setSelectedRows(selectedCheckBoxvalues.length);
    if (selectedNodes.length === totalRows) {
      setTaxonomy({
        ...taxonomy,
        specCode: "ALL",
        subspecCode: "ALL",
        subspecDesc: "ALL",
      });
    } else {
      setTaxonomy({
        ...taxonomy,
        specCode: selectedCheckBoxvalues.map((value) => value.specCode),
        subspecCode: selectedCheckBoxvalues.map((value) => value.subspecCode),
        subspecDesc: selectedCheckBoxvalues.map((value) => value.subspecDesc),
        taxonomyCode: selectedCheckBoxvalues.map((value) => value.taxonomyCode),
      });
    }
  };

  const duplicateCheck = () => {
    if (
      taxonomyData.some(
        (k) => k.taxonomyCode.includes("ALL") && taxonomy.function === 1
      )
    )
      return true;
    const intersection = taxonomyData.find(
      (obj1) =>
        obj1.action === "Active" &&
        taxonomy.clientGroupId === obj1.clientGroupId &&
        taxonomy.taxonomyCode.includes(obj1.taxonomyCode) &&
        taxonomy.subspecCode.includes(obj1.subspecCode) &&
        taxonomy.specCode.includes(obj1.specCode) &&
        (taxonomy.function === 0 ? "Exclude" : "Applies To") === obj1.function
    );
    return !!intersection;
  };
  

  const handleReview = () => {
    if (!gridApi.current) return;
    gridApi.current.setFilterModel(null);
    const selectedRows = gridApi.current.getSelectedRows();

    const selectedNodes = gridApi.current.getSelectedNodes();
    const totalRows = gridApi.current.getDisplayedRowCount();
    if (
      selectedNodes.length === totalRows &&
      (taxonomy.function === 1 || taxonomy.function === "Applies To")
    ) {
      setShowAllOrNot(true);
    } else {
      setShowAllOrNot(false);
    }
    setTaxonomyValues(selectedRows);
    const taxonomies = new Set(selectedRows.map((row) => row.taxonomyCode));
    setSelectedTaxonomy(taxonomies);
    const remainingRows =
      taxonomy.function === "Exclude" || taxonomy.function === 0
        ? availableTaxonomyCodes
        : rows;
    const sortedRows = [
      ...selectedRows,
      ...remainingRows.filter((row) => !taxonomies?.has(row.taxonomyCode)),
    ];
    setRows([...sortedRows]);
    setGridKey((prevKey) => prevKey + 1);
    setTimeout(() => {
      gridApi.current.forEachNode((node) => {
        if (taxonomies?.has(node.data.taxonomyCode)) {
          node.setSelected(true);
        }
      });
    }, 100);
    setReview(true);
  };

  const handleTaxonomy = () => {
    const selectedCheckBoxvalues = gridApi.current.getSelectedRows();
    setTaxonomyValues(selectedCheckBoxvalues);
    const taxonomies = new Set(
      selectedCheckBoxvalues.map((row) => row.taxonomyCode)
    );
    setSelectedTaxonomy(taxonomies);
    if (
      showAllOrNot &&
      (taxonomy.function === "Applies To" || taxonomy.function === 1)
    ) {
      setTaxonomy({
        ...taxonomy,
        taxonomyCode: "ALL",
      });
    } else {
      setTaxonomy({
        ...taxonomy,
        taxonomyCode: selectedCheckBoxvalues.map((value) => value.taxonomyCode),
      });
    }
    setReview(false);
    setTaxonomyPopUp(false);
  };
  const onGridReady = (params) => {
    if (showAllOrNot) {
      params.api.selectAll();
      gridApi.current = params.api;
    } else {
      gridApi.current = params.api;
    }
  };

  const resetTaxonomy = () => {
    setSelectedRows(null);
    setFieldError(false);
    setIsAdd(false);
    setIsEdit(false);
    setSuggestions([]);
    if (taxonomy.function === 1) {
      setShowAllOrNot(true);
      setTaxonomy({
        ...taxonomy,
        taxonomyCode: ["ALL"],
      });
    } else {
      setTaxonomy({
        ...taxonomy,
        taxonomyCode: [],
      });
    }
    setFieldError(false);
  };

  const resetCommonFields = () => {
    setAddPopUp(false);
    setClientCheck(0);
    setReview(false);
  };

  const handleAddPopUpClose = () => {
    resetCommonFields();
    resetTaxonomy();
    setIsEdit(false);
    setActive(0);
    refreshJiraDetails();
  };

  const handleTaxonomyPopUpClose = () => {
    setTaxonomyPopUp(false);
    resetTaxonomy();
    setReview(false);
  };

  const handleDelete = () => {
    let error = checkDelete();
    if (error) {
      fillRequiredFields();
    } else {
      if (deleteData) {
        handlechanges();
        DisableTaxonomyData(
          dispatch,
          taxonomy.taxonomyKey,
          policyId,
          taxonomy.taxonomyCode
        );
      }
      refreshJiraDetails();
    }
  };

  const handleAddAndDelete = () => {
    if (isEdit) {
      handlechanges();
      handleDelete();
      DisableTaxonomyData(
        dispatch,
        taxonomy.taxonomyKey,
        policyId,
        taxonomy.taxonomyCode
      );
    } else {
      handleAddData();
      handlechanges();
    }
    setClientCheck(0);
    setAddPopUp(false);
    setIsAdd(false);
    setSuggestions([]);
    setClientCheck(0);
    setFieldError(false);
    setReview(false);
    setIsEdit(false);
    setSelectedTaxonomy(undefined);
    refreshJiraDetails();
    setActive(0);
    getTaxonomyOfPolicy(dispatch,policyId);
  };

  const handleAddData = () => {
    let taxonomyData = [];
    if (showAllOrNot) {
      // need to save only record only if user select all
      taxonomyData = [
        {
          policyId: policyId,
          clientGroupId: taxonomy.clientGroupId ? taxonomy.clientGroupId : 0,
          taxonomyCode: 0,
          specCode: 0,
          subSpecCode: 0,
          subSpecDesc: 0,
          function: taxonomy.function,
          deletedB: active,
        },
      ];
    } else {
      taxonomyData = taxonomyValues.map((data) => ({
        policyId: policyId,
        clientGroupId: taxonomy.clientGroupId ? taxonomy.clientGroupId : 0,
        taxonomyCode: data.taxonomyCode,
        specCode: data.specCode,
        subSpecCode: data.subspecCode,
        subSpecDesc: data.subspecDesc,
        function: taxonomy.function,
        deletedB: active,
      }));
    }
    addTaxonomyData(dispatch, taxonomyData, taxonomy.function);
  };

  const handleUploadFile = (file) => {
    var allowedFiles = [".xlsx", ".csv"];
    var regex = new RegExp(
      "([a-zA-Z0-9s_\\.-:()])+(" + allowedFiles.join("|") + ")$"
    );
    if (file != undefined) {
      if (!regex.test(file.name.toLowerCase())) {
        setOpen(false);
        CustomSwal(
          "error",
          `Import Failed.<br>Please Upload the Correct File.`,
          navyColor,
          "Ok",
          ""
        );
        return false;
      } else {
        return true;
      }
    }
  };

  const checkIsPresent = (uniqueCodes, value) => {
    const index = uniqueCodes.indexOf(value);
    return index >= 0;
  };

  async function onFileUpload() {
    let error = checkDelete();
    if (error) {
      fillRequiredFields();
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("uploadfile", selectedFile);
      let validation = handleUploadFile(selectedFile);
      if (validation) {
        let user = localStorage.getItem("emailId");
        formData.append("email", user);
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);
        fileReader.onload = async (e) => {
          let arrayBuffer: any = [];
          arrayBuffer = fileReader.result;
          let uploaddata = new Uint8Array(arrayBuffer);
          let arr = new Array();
          for (var i = 0; i != uploaddata.length; ++i)
            arr[i] = String.fromCharCode(uploaddata[i]);
          let bstr = arr.join("");
          let workbook = XLSX.read(bstr, { type: "binary" });
          let first_sheet_name = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[first_sheet_name];

          // Extract headers from the worksheet
          let headers = (XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })[0] || []) as string[];
          let requiredHeaders = [
            "POLICYID",
            "CLIENTGROUPID",
            "CLIENTCODE",
            "CLIENTGROUPCODE",
            "TAXONOMYCODE",
            "SPECCODE",
            "SUBSPECCODE",
            "SUBSPECDESC",
            "FUNCTION",
            "STATUS",
          ];

          // Check for missing headers
          let missingHeaders = requiredHeaders.filter(
            (header) => !headers.includes(header)
          );

          if (missingHeaders.length > 0) {
            refreshJiraDetails();
            setOpen(false);
            CustomSwal(
              "error",
              `Import Failed.<br>Please Upload a valid File.`,
              navyColor,
              "Ok",
              "Error"
            );
            setLoading(false);
            return;
          }

          var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          let array: any = [];
          let exportarray: any = [];
          array = exportarray.concat(arraylist);
          let uniqueCodes = [];
          let error = false;
          array.forEach((o, i) => {
            if (
              !checkIsPresent(
                uniqueCodes,
                o.TAXONOMYCODE +
                  "-" +
                  o.SPECCODE +
                  "-" +
                  o.SUBSPECCODE +
                  "-" +
                  o.CLIENTGROUPID +
                  "-" +
                  o.POLICYID +
                  "-" +
                  o.STATUS
              )
            ) {
              uniqueCodes.push(
                o.TAXONOMYCODE +
                  "-" +
                  o.SPECCODE +
                  "-" +
                  o.SUBSPECCODE +
                  "-" +
                  o.CLIENTGROUPID +
                  "-" +
                  o.POLICYID +
                  "-" +
                  o.STATUS
              );
            } else {
              setOpen(false);
              error = true;
              CustomSwal(
                "error",
                "Duplicate Row at " +
                  (i + 2) +
                  " - " +
                  "TAXONOMY CODE is : " +
                  o.TAXONOMYCODE +
                  " and " +
                  "CLIENT GROUP ID is : " +
                  o.CLIENTGROUPID,
                navyColor,
                "Ok",
                "Error"
              );
            }
          });
          let importPolicyId = undefined;
          array.filter((d) => {
            if (policyId != d.POLICYID) {
              importPolicyId = d.POLICYID;
              if (d.POLICYID == undefined) {
                importPolicyId = -1;
              }
            } else if (importPolicyId == undefined) {
              importPolicyId = policyId;
            }
          });

          if (importPolicyId == policyId) {
            if (!error) {
              setOpen(false);
              setLoading(false);
              await uploadTaxonomyData(dispatch, formData);
            }
          } else {
            setOpen(false);
            setLoading(false);
            if (importPolicyId == -1) {
              CustomSwal(
                "error",
                "Policy Id is blank.",
                navyColor,
                "Ok",
                "Error"
              );
            } else {
              CustomSwal(
                "error",
                "Policy Id not matched.",
                navyColor,
                "Ok",
                "Error"
              );
            }
          }
          setSelectedFile(undefined);
          setJiraIdExist(false);
          refreshJiraDetails();
          setFieldError(false);
        };
      }
    }
  }
  const gridRef = useRef();

  const target = async () => {
    try {
      await UploadTaxonomyToTarget(dispatch, formState.policyId);
      handlechanges();
      if (gridRef.current) {
        const params = {
          api: gridRef.current,
        };
        await onGridReady(params);
      } else {
        console.warn("Grid API is not available");
      }
    } catch (error) {
      console.error("Error during target operation:", error);
    }

    handleToCloseTargetTaxonomy();
    refreshJiraDetails();
  };
  const handleToCloseTargetTaxonomy = () => {
    dispatch({ type: TAXONOMY_TARGET, payload: false });
  };

  const taxonomyColumnDef = useMemo(
    () =>
      taxonomyTabColumns(
        setAddPopUp,
        setIsEdit,
        taxonomy,
        setTaxonomy,
        fromViewPolicy,
        setIsAdd
      ),
    []
  );

  const fillRequiredFields = () => {
    return dispatch({
      type: DIALOG,
      payload: {isDialog:true,
        title: "Error",
        message: "Please fill in required fields",
      },
    });
  };

  const refreshJiraDetails = () => {
    setJiraId("");
    setJiraDescription("");
    setJiraIdExist(false);
  };

  const handlechanges = async () => {
    if (
      jiraId == undefined ||
      jiraId == "" ||
      jiraDescription == undefined ||
      jiraDescription == ""
    ) {
      return false;
    } else {
      addChangesData(dispatch, policyId, jiraId, jiraDescription);
      return true;
    }
  };
  let customButtonStyle = {
    color: "white",
    margin: 10,
    padding: 4,
    fontSize: 12,
    textTransform: "capitalize",
  };

  const renderJiraDetails = () => {
    return (
      <JiraComponent
        jiraId={jiraId}
        jiraDescription={jiraDescription}
        fieldError={fieldError}
        setJiraId={setJiraId}
        setJiraDescription={setJiraDescription}
        existingJiraIds={[
          ...changesTabState.changesTableData?.map((data) => data.jiraId),
          changesTabState.jiraId,
        ]}
        setJiraIdExist={setJiraIdExist}
      />
    );
  };

  return (
    <>
      {edit ? (
        <div style={{ height: window.innerHeight / 2.2 }}>
          <CustomPaper
            style={{
              paddingLeft: 10,
              position: "relative",
              right: 20,
              paddingRight: 8,
              paddingTop: 0,
              paddingBottom: 15,
              boxShadow: "none",
              border: taxonomyData.length > 0 ? "1px solid #D6D8DA" : "",
            }}
          >
            <IconButton
              onClick={() => {
                if (
                  clientAssignmentState.getClientAssignmentTableData.length == 0
                ) {
                  CustomSwal(
                    "error",
                    "No Client Assignment Data Available.",
                    navyColor,
                    "Ok",
                    ""
                  );
                  return;
                }
                setAddPopUp(true);
                setShowAllOrNot(true);
                setIsEdit(false);
                setTaxonomy({
                  ...taxonomy,
                  clientCode: "ALL",
                  clientGroupCode: { label: "ALL", value: "ALL" },
                  clientGroupId: 0,
                  taxonomyCode: "ALL",
                  specCode: "ALL",
                  subspecCode: "ALL",
                  function: 1,
                });
              }}
              style={{
                backgroundColor: navyColor,
                color: "white",
                padding: 5,
                marginTop: 2,
                opacity: fromViewPolicy ? 0.7 : 1,
                float: "right",
              }}
              disabled={fromViewPolicy}
            >
              <Add />
            </IconButton>
            <div
              style={{
                height: window.innerHeight / 2.2,
              }}
            >
              <AgGrids
                columnDefs={taxonomyColumnDef}
                animateRows={true}
                rowData={taxonomyData}
                onFilterChanged={onFilterChanged}
              />
            </div>
          </CustomPaper>

          <Dialogbox
            disableBackdropClick={true}
            maxWidth="sm"
            open={addPopUp}
            onClose={handleAddPopUpClose}
            title={isEdit ? "Deactivate Taxonomy Code" : "Add Taxonomy Code"}
            message={
              <div>
                <div>
                  <small>Function </small>
                  <RadioButton
                    label={"Applies To"}
                    style={{ marginTop: "2px" }}
                    checked={
                      isEdit
                        ? taxonomy.function === "Applies To"
                        : clientCheck === 0
                    }
                    onChange={() => {
                      setClientCheck(0);
                    }}
                  />
                  <RadioButton
                    label={"Exclude"}
                    style={{ marginTop: "2px" }}
                    checked={
                      isEdit
                        ? taxonomy.function === "Exclude"
                        : clientCheck === 1
                    }
                    disabled={!allPresent}
                    onChange={() => {
                      setClientCheck(1);
                      setShowAllOrNot(false);
                    }}
                  />
                  <CustomCheckBox
                    checked={active === 0}
                    style={{ marginLeft: "40px" }}
                    size="small"
                    className="checkboxes"
                    disabled={
                      !isEdit || (isEdit && taxonomy.function === "Applies To")
                        ? true
                        : false
                    } // Disables checkbox if isEdit is false
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          position: "relative",
                          bottom: "2px",
                        }}
                      >
                        Active
                      </span>
                    }
                    onChange={(event) => {
                      setActive(event.target.checked ? 0 : 1);
                    }}
                  />
                </div>

                {clientCheck === 1 ||
                (isEdit && taxonomy?.function === "Exclude")
                  ? renderJiraDetails()
                  : undefined}
                <div>
                  <CustomInput
                    type={"text"}
                    labelText={"Client Code"}
                    variant={"outlined"}
                    error={!taxonomy.clientCode ? fieldError : false}
                    showStarIcon={true}
                    value={taxonomy.clientCode}
                    onChange={handleInputChange}
                    aria-autocomplete="list"
                    aria-controls="autocomplete-list"
                    disabled={isEdit || taxonomy.function == 1}
                  />
                  {suggestions.length > 0 && (
                    <ul className="suggestions-list" id="suggestionList">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSuggestionClick(suggestion.label)
                          }
                          role="option"
                        >
                          {suggestion.label ? suggestion.label : suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div style={{ width: "75%" }}>
                  <CustomSelect
                    options={clientGroupExclusion}
                    labelText={"Client Group Code"}
                    isDisabled={isEdit || taxonomy.function == 1}
                    showStarIcon={true}
                    styles={{ overflowY: "auto" }}
                    error={!taxonomy.clientGroupCode ? fieldError : false}
                    onSelect={(e) => {
                      setTaxonomy({
                        ...taxonomy,
                        clientGroupCode: clientGroupExclusion.find(
                          (option) => option.label === e?.label
                        ),
                        clientGroupId: e?.value,
                      });
                    }}
                    value={taxonomy.clientGroupCode}
                  />
                </div>
                <CustomInput
                  fullWidth={true}
                  labelText={"Taxonomy Code"}
                  variant={"outlined"}
                  aria-autocomplete="list"
                  disabled={isEdit}
                  aria-controls="autocomplete-list"
                  value={showAllOrNot ? "ALL" : taxonomy.taxonomyCode}
                  showStarIcon={true}
                  error={
                    !taxonomy.taxonomyCode ||
                    (Array.isArray(taxonomy.taxonomyCode) &&
                      taxonomy.taxonomyCode.length === 0)
                      ? fieldError
                      : false
                  }
                  style={{
                    width: "75%",
                  }}
                  endAdornment={
                    <InputAdornment
                      disablePointerEvents={isEdit}
                      position="end"
                      onClick={() => {
                        if (taxonomy.taxonomyCode.length > 0) {
                          let selectedRows = rows.filter((row) =>
                            selectedTaxonomy?.has(row.taxonomyCode)
                          );
                          const sortedRows = [
                            ...selectedRows,
                            ...rows.filter(
                              (row) => !selectedTaxonomy?.has(row.taxonomyCode)
                            ),
                          ];
                          setRows(sortedRows);
                          setTimeout(() => {
                            gridApi.current.forEachNode((node) => {
                              if (
                                selectedTaxonomy?.has(node.data.taxonomyCode)
                              ) {
                                node.setSelected(true);
                              }
                            });
                          }, 100);
                        }
                        setTaxonomyPopUp(true);
                      }}
                    >
                      <MoreHoriz
                        style={{
                          cursor: "pointer",
                          fontSize: 15,
                          color: black,
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </div>
            }
            actions={
              <ButtonGroup>
                <CustomButton
                  disabled={jiraIdExist}
                  onClick={() => {
                    let error = check();
                    if (error) {
                      dispatch({
                        type: DIALOG,
                        payload: {isDialog:true},
                        title: "Error",
                        message: "Please fill in required fields",
                      });
                      return;
                    }
                     if (!isEdit && duplicateCheck()) {
                      dispatch({
                        type: DIALOG,
                        payload: {isDialog:true,
                        message: <>
                        The record already exists.
                        <br />
                        The same Taxonomy Code with the Same Client Group ID
                        cannot have the Same Function Twice (Exclude and
                        Applies To).
                        </>,
                        title:"Error"
                        },
                      });
                    } else if (isEdit && checkDelete()) {
                      dispatch({
                        type: DIALOG,
                        payload: {isDialog:true,
                        message: "Please fill in required fields",
                        title: "Error",
                        },
                      });
                    } else {
                      setIsAdd(true);
                    }
                  }}
                  style={{
                    ...customButtonStyle,
                    backgroundColor: navyColor,
                    opacity: jiraIdExist ? 0.7 : 1,
                  }}
                >
                  Continue
                </CustomButton>
                <CustomButton
                  onClick={handleAddPopUpClose}
                  style={{
                    ...customButtonStyle,
                    backgroundColor: dangerColor,
                  }}
                >
                  cancel
                </CustomButton>
              </ButtonGroup>
            }
          />
          <Dialogbox
            fullWidth={true}
            maxWidth={true}
            disableBackdropClick={true}
            open={taxonomyPopUp}
            onClose={handleTaxonomyPopUpClose}
            message={
              <>
                <div
                  style={{
                    height: window.innerHeight / 1.8,
                    marginTop: "25px",
                  }}
                >
                  <AgGrids
                    rowData={rows}
                    columnDefs={taxonomyColumnDefs(taxonomy.function)}
                    rowSelection={"multiple"}
                    onSelectionChanged={onSelectionChanged}
                    onGridReady={onGridReady}
                    gridIconStyle={lkpGridIconStyle}
                    key={gridKey}
                  />
                </div>
                <span>
                  Selected Rows :{" "}
                  <span style={{ color: dangerColor }}>{selectedRows}</span>
                </span>
              </>
            }
            actions={
              review ? (
                <ButtonGroup style={{ marginTop: "-50px" }}>
                  <CustomButton
                    variant={"contained"}
                    onClick={handleTaxonomy}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: navyColor,
                    }}
                  >
                    Ok
                  </CustomButton>
                  <CustomButton
                    variant={"contained"}
                    onClick={handleTaxonomyPopUpClose}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: dangerColor,
                    }}
                  >
                    Cancel
                  </CustomButton>
                </ButtonGroup>
              ) : (
                <ButtonGroup style={{ marginTop: "-50px" }}>
                  <CustomButton
                    variant={"contained"}
                    onClick={handleReview}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: navyColor,
                    }}
                  >
                    Review
                  </CustomButton>
                </ButtonGroup>
              )
            }
          />
          <Dialogbox
            open={isAdd}
            onClose={() => {
              setIsAdd(false);
            }}
            disableBackdropClick={true}
            title={"Confirm"}
            message={
              isEdit
                ? `Taxonomy code ${taxonomy.taxonomyCode} is DEACTIVATED`
                : "Would you like to add this record?"
            }
            actions={
              <ButtonGroup>
                <CustomButton
                  onClick={handleAddAndDelete}
                  style={{
                    ...customButtonStyle,
                    backgroundColor: isEdit ? successColor : navyColor,
                  }}
                >
                  {isEdit ? "Save" : "Yes"}
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    setIsAdd(false);
                  }}
                  style={{
                    ...customButtonStyle,
                    backgroundColor: dangerColor,
                  }}
                >
                  {isEdit ? "Cancel" : "No"}
                </CustomButton>
              </ButtonGroup>
            }
          />
          <div
            style={{ float: "right", top: 5, position: "relative", right: 18 }}
          >
            <CustomButton
              onClick={() => {
                setOpen(true);
              }}
              variant={"contained"}
              disabled={edit && fromViewPolicy}
              style={{
                ...customButtonStyle,
                backgroundColor: navyColor,
                marginLeft: 10,
                opacity: edit && fromViewPolicy ? 0.7 : 1,
              }}
            >
              Import
            </CustomButton>
            <CustomButton
              onClick={() => {
                exportToExcel(exportData);
              }}
              disabled={taxonomyData.length <= 0}
              variant={"contained"}
              style={{
                ...customButtonStyle,
                backgroundColor: navyColor,
                marginLeft: 10,
                opacity: taxonomyData.length > 0 ? 1 : 0.7,
              }}
            >
              Export
            </CustomButton>
          </div>
          {
            <small style={{ position: "relative", fontSize: "12px" }}>
              Number of rows : {numberOfRows}
            </small>
          }

          <Dialogbox
            open={open}
            onClose={() => {
              setOpen(false);
              setSelectedFile("");
              refreshJiraDetails();
              setJiraIdExist(false);
              setFieldError(false);
            }}
            title={"Upload Taxonomy File"}
            message={
              <>
                {renderJiraDetails()}
                <input
                  style={{ marginTop: 20, marginBottom: 20 }}
                  type="file"
                  disabled={jiraId == "" || jiraDescription == ""}
                  accept=".xlsx"
                  onChange={(event) => {
                    let file = event.target.files[0];
                    setSelectedFile(file);
                  }}
                />
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: 10,
                    fontFamily: "sans-serif",
                  }}
                >
                  Note : Client Group ID will derive the Client Code and <br />
                  Client Group Code regardless of the input value.
                </div>
                {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <span className="loader"></span>
                  </div>
                )}
              </>
            }
            actions={
              <ButtonGroup>
                {selectedFile ? (
                  <CustomButton
                    disabled={jiraIdExist}
                    onClick={() => {
                      onFileUpload();
                    }}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: navyColor,
                    }}
                  >
                    upload
                  </CustomButton>
                ) : undefined}
                <CustomButton
                  onClick={() => {
                    setOpen(false);
                    refreshJiraDetails();
                    setSelectedFile("");
                    setJiraIdExist(false);
                    setFieldError(false);
                  }}
                  style={{
                    ...customButtonStyle,
                    backgroundColor: dangerColor,
                  }}
                >
                  cancel
                </CustomButton>
              </ButtonGroup>
            }
          />

          <Dialogbox
            open={newpolicyState.targetTaxonomy}
            onClose={handleToCloseTargetTaxonomy}
            disableBackdropClick={true}
            title="Confirm"
            message={
              <p>
                Delta Path:{" "}
                <Link target="_blank" href={`${deltaLink}`}>
                  Delta Link
                </Link>{" "}
                <br></br>
                Would you like to Send Stage data to Target?
              </p>
            }
            actions={
              <>
                <ButtonGroup>
                  <CustomButton
                    onClick={() => {
                      target();
                    }}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: navyColor,
                    }}
                  >
                    Yes
                  </CustomButton>
                  <CustomButton
                    onClick={handleToCloseTargetTaxonomy}
                    style={{
                      ...customButtonStyle,
                      backgroundColor: dangerColor,
                    }}
                  >
                    No
                  </CustomButton>
                </ButtonGroup>
                <div>
                  {newpolicyState.stageTaxonomy ? (
                    <CircularProgress />
                  ) : undefined}
                </div>
              </>
            }
          />
        </div>
      ) : undefined}
    </>
  );
};

export default Taxonomy;
