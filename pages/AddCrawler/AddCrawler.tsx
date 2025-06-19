import { Stack } from "@mui/material";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import RadioButton from "../../components/RadioButton/RadioButton";
import Template from "../../components/Template/Template";
import {
  errorValidation,
  getCrawlerClass,
  getFrequency,
  saveConfig,
  updateConfig,
} from "../../redux/ApiCalls/CrawlerApis/CrawlerApis";
import {
  CRAWLER_CLASS,
  EMAILID,
  FREQUENCY,
  LAST_PUBLISHED_DATE,
  RESET_CRAWLER_STATE,
  SOURCE_NAME,
  URL,
  XPATHDELIMETER,
  XPATHS,
} from "../../redux/ApiCalls/CrawlerApis/CrwalerActionType";
import { CrawlerState } from "../../redux/reducers/CrawlerReducer/CrawlerReducer";
import "./AddCrawler.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";

const _ = require("lodash");

const AddCrawler = (fromViewCrawler) => {
  const { state } = useLocation();

  //@ts-ignore
  let row: any = state?.row;
  //@ts-ignore
  let isEdit: any = state?.edit;
  const intialCrawlerState = {
    name: row?.name,
    url: row?.url,
    // subLink: undefined,
    xpaths: row?.xpaths,
    xpathDelimiter: row?.xpathDelimiter,
    frequency: row?.frequency?.frequencyId,
    filesToBeExtracted: row?.filesToBeExtracted,
    checkSum: row?.checkSum,
    sourceLocationPath: row?.sourceLocationPath,
    lastPublishedDate: row?.lastPublishedDate,
    sourceTableName: row?.sourceTableName,
    crawlerClass: row?.crawlerClass?.crawlerClassId,
    emailIds: row?.emailIds,
    isZipFile: row?.isZipFile,
    sourceCrawlerId: undefined,
    lastDownloadDate: row?.lastDownloadDate,
    lastRunTime: row?.lastRunTime,
  };

  let cd = null;
  if (row?.lastPublishedDate) {
    cd = Moment(row.lastPublishedDate).format("MM-DD-yyyy");
  }
  const dispatch = useDispatch();
  const [frequency, setFrequency] = useState([]);
  const [crawlerClass, setCrawlerClass] = useState([]);
  const [crawlerState, setCrawlerState] = useState(intialCrawlerState);

  const [selectedCrawler, setSelectedCrawler] = useState(
    row
      ? {
          label: row?.crawlerClass?.crawlerClassName,
          value: row?.crawlerClass?.crawlerClassId,
        }
      : undefined
  );

  const crawlerFormState: CrawlerState = useSelector(
    (state: any) => state.crawlerReducer
  );

  const [selectedFrequency, setSelectedFrequency] = useState(
    row
      ? {
          label: row?.frequency?.frequencyDesc,
          value: row?.frequency?.frequencyId,
        }
      : undefined
  );
  const [createDate, setCreatedate] = React.useState(cd);

  useEffect(() => {
    getFrequency(dispatch);
    getCrawlerClass(dispatch);
  }, []);

  //@ts-ignore
  const Add = state?.add;
  const resetInputField = () => {
    dispatch({ type: RESET_CRAWLER_STATE });
    const clearIntitalState = {
      name: "",
      url: "",
      // subLink: "",
      xpaths: "",
      xpathDelimiter: "",
      frequency: "",
      filesToBeExtracted: "",
      checkSum: "",
      sourceLocationPath: "",
      lastPublishedDate: "",
      sourceTableName: "",
      crawlerClass: "",
      emailIds: "",
      isZipFile: "",
      sourceCrawlerId: "",
    };
    if (Add) {
      let obj = _.cloneDeep(crawlerState);
      obj = clearIntitalState;
      setCrawlerState(obj);
      setCreatedate(null);
      setSelectedFrequency(null);
      setSelectedCrawler(null);
    } else {
      const intialCrawlerState = {
        name: row?.name,
        url: row?.url,
        // subLink: "",
        xpaths: row?.xpaths,
        xpathDelimiter: row?.xpathDelimiter,
        frequency: row?.frequency?.frequencyId,
        filesToBeExtracted: row?.filesToBeExtracted,
        checkSum: row?.checkSum,
        sourceLocationPath: row?.sourceLocationPath,
        lastPublishedDate: row?.lastPublishedDate,
        sourceTableName: row?.sourceTableName,
        crawlerClass: row?.crawlerClass?.crawlerClassId,
        emailIds: row?.emailIds,
        isZipFile: row?.isZipFile,
        sourceCrawlerId: undefined,
        lastDownloadDate: row?.lastDownloadDate,
        lastRunTime: row?.lastRunTime,
      };
      setCrawlerState(intialCrawlerState);
      setSelectedCrawler({
        label: row?.crawlerClass?.crawlerClassName,
        value: row?.crawlerClass?.crawlerClassId,
      });
      setSelectedFrequency({
        label: row?.frequency?.frequencyDesc,
        value: row?.frequency?.frequencyId,
      });
      setCreatedate(Moment(row.lastPublishedDate).format("yyyy-MM-DD"));
    }
  };

  useEffect(() => {
    if (Add) {
      const ClearIntitalState = {
        name: "",
        url: "",
        // subLink: "",
        xpaths: "",
        xpathDelimiter: "",
        frequency: "",
        filesToBeExtracted: "",
        // checkSum: "",
        sourceLocationPath: "",
        lastPublishedDate: "",
        sourceTableName: "",
        crawlerClass: "",
        emailIds: "",
        isZipFile: false,
        sourceCrawlerId: "",
      };
      let obj = _.cloneDeep(crawlerState);
      obj = ClearIntitalState;
      setCrawlerState(obj);
      setCreatedate(null);
      setSelectedFrequency(null);
      setSelectedCrawler(null);
      setCreatedate(null);
    }
  }, [Add]);
  const navigate = useNavigate();
  const updatedState: CrawlerState = useSelector(
    (state: any) => state.crawlerReducer
  );
  useEffect(() => {
    setFrequency(updatedState.getFrequency);
    setCrawlerClass(updatedState.getCrawlerlass);
  }, [updatedState]);

  const frequencyCM = frequency?.map((f) => {
    return { label: f.frequencyDesc, value: f.frequencyId };
  });
  const crawlerClassCM = crawlerClass?.map((cc) => {
    return { label: cc.crawlerClassName, value: cc.crawlerClassId };
  });
  async function addCrawler() {
    crawlerState.lastPublishedDate =
      createDate == "" ? "" : Moment(createDate).format("yyyy-MM-DD");
    //@ts-ignore
    if (state?.edit) {
      crawlerState.lastDownloadDate =
        crawlerState.lastDownloadDate == null
          ? ""
          : Moment(crawlerState.lastDownloadDate).format("yyyy-MM-DD");
      crawlerState.lastRunTime =
        crawlerState.lastRunTime == null
          ? ""
          : Moment(crawlerState.lastRunTime).format("yyyy-MM-DD");
      crawlerState.sourceCrawlerId = row?.sourceCrawlerId;
      let obj = {};
      Object.entries(crawlerState).forEach(
        ([key, val]) => (obj[key] = val?.toString())
      );
      let error = await errorValidation(dispatch, obj);
      if (error) {
        CustomSwal("info","Please fill required fields*",navyColor,"Ok","")

      } else {
        updateConfig(dispatch, obj, navigate);
      }
    } else {
      crawlerState.lastDownloadDate = null;
      crawlerState.lastRunTime = null;
      crawlerState.lastPublishedDate = Moment(createDate).format("yyyy-MM-DD");
      let obj = {};
      Object.entries(crawlerState).forEach(
        ([key, val]) => (obj[key] = val?.toString())
      );
      let error = await errorValidation(dispatch, obj);
      if (error) {
        CustomSwal("info","Please fill required fields*",navyColor,"Ok","")
      } else {
        saveConfig(dispatch, obj, navigate);
      }
    }
  }
  return (
    <Template>
      <div>
        <div style={{ height: 5 }} />
        {isEdit ? (
          <CustomHeader labelText={"Edit Crawler"} />
        ) : (
          <CustomHeader labelText={"Add Crawler"} />
        )}
        <div className="gridContainerAlignment">
          <GridContainer>
            <GridItem sm={5} md={5} xs={5}>
              <CustomInput
                fullWidth={true}
                labelText={"Name"}
                variant={"outlined"}
                value={crawlerState?.name}
                disabled={fromViewCrawler.fromViewCrawler}
                error={crawlerFormState.errors?.name}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.name = event.target.value;
                  setCrawlerState(obj);
                  dispatch({ type: SOURCE_NAME, payload: event.target.value });
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"Link to Source"}
                variant={"outlined"}
                value={crawlerState.url}
                error={crawlerFormState.errors?.url}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.url = event.target.value;
                  setCrawlerState(obj);
                  dispatch({ type: URL, payload: event.target.value });
                }}
              />
            </GridItem>
            {/* <GridItem sm={6} md={6} xs={6} />
          <GridItem sm={4} md={5} xs={4}>
            <CustomInput
              fullWidth={true}
              labelText={"Sub Link"}
              variant={"outlined"}
              value={crawlerState.subLink}
              onChange={(event) => {
                let obj = _.cloneDeep(crawlerState);
                obj.subLink = event.target.value;
                setCrawlerState(obj);
              }}
            />
          </GridItem> */}
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"XPaths"}
                variant={"outlined"}
                error={crawlerFormState.errors?.xpaths}
                value={crawlerState.xpaths}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.xpaths = event.target.value;
                  setCrawlerState(obj);
                  dispatch({ type: XPATHS, payload: event.target.value });
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"Delimiter"}
                variant={"outlined"}
                value={crawlerState.xpathDelimiter}
                error={crawlerFormState.errors?.xpathDelimeter}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.xpathDelimiter = event.target.value;
                  setCrawlerState(obj);
                  dispatch({
                    type: XPATHDELIMETER,
                    payload: event.target.value,
                  });
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomSelect
                value={selectedFrequency}
                error={crawlerFormState.errors?.frequency}
                onSelect={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  if (event != null) {
                    obj.frequency = event.value;
                    setSelectedFrequency(event);
                    setCrawlerState(obj);
                    dispatch({ type: FREQUENCY, payload: event.value });
                  } else {
                    obj.frequency = undefined;
                    setSelectedFrequency(undefined);
                    setCrawlerState(obj);
                    dispatch({ type: FREQUENCY, payload: undefined });

                  }
                }}
                options={frequencyCM}
                labelText={"Frequency"}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={6} md={6} xs={6}>
              <span style={{ marginRight: "10px" }}>Zip File</span>
              <RadioButton
                label={"Yes"}
                checked={crawlerState.isZipFile == true}
                onChange={(e) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.isZipFile = e.target.checked;
                  setCrawlerState(obj);
                }}
              />
              <RadioButton
                label={"No"}
                checked={crawlerState.isZipFile == false}
                onChange={(e) => {
                  let obj = _.cloneDeep(crawlerState);
                  if (e.target.checked) {
                    obj.isZipFile = false;
                  }
                  setCrawlerState(obj);
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              {crawlerState.isZipFile ? (
                <CustomInput
                  fullWidth={true}
                  labelText={"File To be Extracted"}
                  variant={"outlined"}
                  value={crawlerState.filesToBeExtracted}
                  onChange={(event) => {
                    let obj = _.cloneDeep(crawlerState);
                    obj.filesToBeExtracted = event.target.value;
                    setCrawlerState(obj);
                  }}
                />
              ) : undefined}
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />

            {Add ? (
              <GridItem sm={6} md={6} xs={6} />
            ) : (
              <GridItem sm={4} md={5} xs={4}>
                <CustomInput
                  fullWidth={true}
                  labelText={"Checksum"}
                  variant={"outlined"}
                  value={crawlerState.checkSum}
                  onChange={(event) => {
                    let obj = _.cloneDeep(crawlerState);
                    obj.checkSum = event.target.value;
                    setCrawlerState(obj);
                  }}
                />
              </GridItem>
            )}
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"Source Location Path"}
                variant={"outlined"}
                value={crawlerState.sourceLocationPath}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.dropboxPath = event.target.value;
                  setCrawlerState(obj);
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <Stack component="form" noValidate spacing={3}>
                <CustomInput
                  id="date"
                  type="date"
                  variant={"outlined"}
                  labelText={"Last Published Date"}
                  error={crawlerFormState.errors?.lastPublishedDate}
                  value={
                    createDate ? Moment(createDate).format("YYYY-MM-DD") : null
                  }
                  onChange={(event) => {
                    setCreatedate(event.target.value);
                    dispatch({
                      type: LAST_PUBLISHED_DATE,
                      payload: event.target.value,
                    });
                  }}
                  InputProps={{
                    style: {
                      height: 24,
                      width: "100%",
                      marginTop: 1,
                    },
                  }}
                />
              </Stack>
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"Source Table Name"}
                variant={"outlined"}
                value={crawlerState.sourceTableName}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.sourceTableName = event.target.value;
                  setCrawlerState(obj);
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomSelect
                value={selectedCrawler}
                error={crawlerFormState.errors?.crawlerClass}
                onSelect={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  if (event != null) {
                    obj.crawlerClass = event.value;
                    setSelectedCrawler(event);
                    setCrawlerState(obj);
                    dispatch({ type: CRAWLER_CLASS, payload: event.value });
                  } else {
                    obj.crawlerClass = undefined;
                    setSelectedCrawler(undefined);
                    setCrawlerState(obj);
                    dispatch({ type: CRAWLER_CLASS, payload: undefined });
                  }
                }}
                options={crawlerClassCM}
                labelText={"Crawler Class"}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={4} md={5} xs={4}>
              <CustomInput
                fullWidth={true}
                labelText={"Email"}
                error={crawlerFormState.errors?.emailIds}
                variant={"outlined"}
                value={crawlerState.emailIds}
                onChange={(event) => {
                  let obj = _.cloneDeep(crawlerState);
                  obj.emailIds = event.target.value;
                  setCrawlerState(obj);
                  dispatch({ type: EMAILID, payload: event.target.value });
                }}
              />
            </GridItem>
            <GridItem sm={6} md={6} xs={6} />
            <GridItem sm={2} md={2} xs={2} />
            <GridItem sm={1} md={1} xs={1}>
              <CustomButton
                variant={"contained"}
                onClick={() => addCrawler()}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  alignSelf: "center",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                  float: "right",
                  marginTop: 20,
                }}
              >
                Submit
              </CustomButton>
            </GridItem>
            <GridItem sm={1} md={1} xs={1}>
              <CustomButton
                variant={"text"}
                onClick={resetInputField}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  alignSelf: "center",
                  fontSize: 12,
                  padding: 4,
                  textTransform: "capitalize",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                Reset
              </CustomButton>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </Template>
  );
};

export default AddCrawler;
