import Moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navyColor, successColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomLink from "../../components/CustomLink/CustomLink";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import { environment } from "../../environments/environment.prod";
import {
  crawlerRun,
  getAllCrawlerDetails
} from "../../redux/ApiCalls/CrawlerApis/CrawlerApis";
import { CrawlerState } from "../../redux/reducers/CrawlerReducer/CrawlerReducer";
import "./ViewCrawler.css";


export default function ViewCrawler() {
  let isProd = environment.isProd == 0 ? true : false;

  const actionStyle = {
    backgroundColor: navyColor,
    color: "white",
    fontWeight: 450,
    zIndex: 100,
  };
  const gridIconStyle = useMemo(() => ({
    position: "absolute",
    top: '70px',
    float: 'right',
    right: '35px',
    display: 'inline'
  }), [])
  const columnDefs = [
    {
      field: "name",
      headerName: "Crawler Name",
      minWidth: 109,
      headerTooltip: "Crawler Name",
    },

    {
      field: "url",
      headerName: "URL",
      minWidth: 83,
      headerTooltip: "URL",
      cellRenderer: (cell) => {
        return (
          <CustomLink
            title={cell.data.url}
            href={cell.data.url}
            labelText={cell.data.name + " URL"}
            target={"_blank"}
          />
        );
      },
    },
    {
      field: "sourceLocationPath",
      headerName: "Source Location Path",
      minWidth: 83,
      headerTooltip: "Source Location Path",
      cellRenderer: (cell) => {
        return (
          <CustomLink
            title={cell.data.sourceLocationPath}
            href={cell.data.sourceLocationPath}
            labelText={cell.data.name + " Source Location Path"}
            target={"_blank"}
          />
        );
      },
    },

    {
      field: "lastDownloadDate",
      headerName: "Last Download Date",
      minWidth: 83,
      headerTooltip: "Last Download Date",
    },
    {
      field: "lastRunTime",
      headerName: "Last Run Time",
      minWidth: 83,
      headerTooltip: "Last Run Time",
    },
    {
      field: "lastPublishedDate",
      headerName: "Download Published Date",
      minWidth: 83,
      headerTooltip: "Download Published Date",
    },
    {
      field: "action",
      headerName: "Action",
      width: 90,
      resizable: false,
      // headerStyle: actionStyle,
      headerTitle: true,
      filter: false,
      cellRenderer: (row) => {
        return (
          <GridContainer style={{ marginTop: '2px', position: 'relative', left: 20 }}>
            <CustomButton
              variant="contained"
              style={{
                height: 18,
                marginTop: -1,
                fontSize: "11px",
                textTransform: "capitalize",
                backgroundColor: navyColor,
                color: "white",
              }}
              onClick={(event) => {
                handleClick(event, row.data);
              }}
            >
              Edit
            </CustomButton>
            <div style={{ marginLeft: 8 }}>
              {!isProd ? <CustomButton
                variant="contained"
                style={{
                  height: 18,
                  marginTop: -12,
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: successColor,
                  color: "white",
                }}
                onClick={(event) => {
                  onRunCrawler(event, row.data);
                }}
              >
                Run
              </CustomButton> : undefined}
            </div>
          </GridContainer>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updatedState: CrawlerState = useSelector(
    (state: any) => state.crawlerReducer
  );

  useEffect(() => {
    getAllCrawlerDetails(dispatch);
  }, []);
  useEffect(() => {
    let crawlerDetails = updatedState.getAllCrawler?.map((cd) => {
      return {
        ...cd, // Spread operator to create a new object
        id: cd.sourceCrawlerId,
        lastRunTime: cd.lastRunTime
          ? Moment(cd.lastRunTime).format("MM-DD-YYYY hh:mm:ss")
          : null,
        lastPublishedDate: cd.lastPublishedDate
          ? Moment(cd.lastPublishedDate).format("MM-DD-YYYY hh:mm:ss")
          : null,
        lastDownloadDate: cd.lastDownloadDate
          ? Moment(cd.lastDownloadDate).format("MM-DD-YYYY hh:mm:ss")
          : null,
      };
    });
  
    setData(crawlerDetails);
    setNumberOfRows(crawlerDetails.length);
  }, [updatedState.getAllCrawler]);

  function onRunCrawler(event, cellValues) {
    crawlerRun(dispatch, cellValues.name);
  }

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount())
  }

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  return (
    <Template>
      <div>
        <CustomHeader labelText={"Crawler Details"} />
        <div className="crawlerGrid" style={{ height: window.innerHeight / 1.28, width: '100%' }}>
          <AgGrids
            //@ts-ignore
            rowData={data}
            columnDefs={columnDefs}
            gridIconStyle={gridIconStyle}
            onFilterChanged={onFilterChanged}
          />
        </div>
        <small style={{ position: 'relative', top: '-25px', fontSize: '12px' }}>Number of rows : {numberOfRows}</small>
      </div>
    </Template>
  );

  function handleClick(event, data) {
    navigate("/editCrawler", { state: { row: data, edit: true ,fromViewCrawler:true} });
  }
}
