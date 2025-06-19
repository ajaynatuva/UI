import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "@ag-grid-community/react";

import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  Tooltip,
} from "@material-ui/core";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRoundedIcon';
import "@ag-grid-community/infinite-row-model";
import { useDispatch, useSelector } from "react-redux";
import { GRID_COLUMNS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { GridState } from "../../redux/reducers/AgGridReducer/AggridReducer";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import "../TableGrid/TableGrid.css";
const _ = require("lodash");
export default function AgGrids(props) {
  const dispatch = useDispatch();
  const rowHeight = 25;
  const headerHeight = 25;

  const updatedState: GridState = useSelector((state: any) => state.gridState);
  const {
    children,
    className,
    maxBlocksInCache,
    cacheBlockSize,
    infiniteInitialRowCount,
    maxConcurrentDatasourceRequests,
    rowModelType,
    cacheOverflowSize,
    context,
    pageinationPerSize,
    rowData,
    rowDeselection,
    rowBuffer,
    style,
    debug,
    isRowSelectable,
    components,
    enableCellTextSelection,
    modules,
    onBodyScroll,
    gridOptions,
    ref,
    onBodyScrollEnd,
    onGridReady,
    rowEvents,
    onRowDoubleClicked,
    paginationPageSize,
    onSelectionChanged,
    onFilterChanged,
    loadingCellRendererParams,
    loadingCellRenderer,
    animateRows,
    suppressRowClickSelection,
    onRowClicked,
    rowSelection,
    gridIconStyle,
    columnDefs,
    showGridFilters,
    suppressRowTransform,
    enableBrowserTooltips,
    ...rest
  } = props;

  const containerStyle = useMemo(
    () => ({ height: "95%", marginTop: "2px" }),
    []
  );
  const { state } = useLocation();
  const [columns, setColumns] = useState(columnDefs);
  const [filterColumns, setFilteredColumns] = useState([]);
  const [isAllColumnSelected, setIsAllColumnsSelected] = useState(true);
  useEffect(() => {
    columnDefs.forEach((c, i) => {
      c.isVisible = true;
    });
    columns.forEach((c, i) => {
      if (columns.length == columnDefs.length) {
        if (columnDefs[i]?.headerName == c?.headerName) {
          if (!c.isVisible) {
            columnDefs[i].isVisible = false;
          }
        }
      }
    });
    let col = _.cloneDeep(columnDefs);
    col = columnDefs.map((c) => {
      if (c.hide == undefined || (c.hide != undefined && c.hide == false)) {
        return c;
      }
    });
    setIsAllColumnsSelected(true);
    setColumns(col);
  }, [columnDefs]);

  //@ts-ignore
  const Search = state?.search;

  const gridRef = useRef<HTMLDivElement>(null);
  const resetFilter = () => {
    let col = _.cloneDeep(columnDefs);
    // col.forEach((c, i) => {
    //     c.isVisible = true
    // })
    col = col.map((c) => {
      if (c.hide == undefined || (c.hide != undefined && c.hide == false)) {
        c.isVisible = true;
        return c;
      }
    });
    setColumns(col);
    //@ts-ignore
    gridRef.current.api.setFilterModel(null);
    //@ts-ignore
    gridRef.current.api.onFilterChanged();
    // const rowData = [];
    // //@ts-ignore
    // gridRef.current.api.forEachNode((node) => rowData.push(node.data));
    // //@ts-ignore
    // gridRef.current.api.setRowData(rowData);
    setIsAllColumnsSelected(true);
  };
  const ITEM_HEIGHT = 48;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    let fc = [];
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] != null) {
        if (columns[i].isVisible) {
          fc.push(columns[i]);
        }
      }
    }
    setFilteredColumns(fc);
    dispatch({ type: GRID_COLUMNS, payload: fc });
  }, [columns]);

  const filterParams = {
    suppressAndOrCondition: true,
    buttons: ["reset", "apply"],
  };
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      filter: true,
      sortable: true,
      flex: 1,
      filterParams: filterParams,
      suppressAutoComplete: true,
      tooltipValueGetter: (params) => {
        return Array.isArray(params.value)
          ? params.value.map((v) => v.value).join(", ")
          : params.value;
      },
    };
  }, []);

  const selectAllCheckboxes = (e) => {
    let col = _.cloneDeep(columns);
    if (e.target.checked) {
      col.forEach((c, i) => {
        if (c != null) c.isVisible = true;
      });
      setIsAllColumnsSelected(true);
      setColumns(col);
    } else {
      col.forEach((c, i) => {
        if (c != null) c.isVisible = false;
      });
      setIsAllColumnsSelected(false);
      setColumns(col);
    }
  };
  const onVirtualColumnsChanged = (params) => {
    let displayedColumns = params.api.columnModel.displayedColumns;
    let visibleColumns = [];
    let col = _.cloneDeep(columns);
    if (displayedColumns.length != columns.length) {
      displayedColumns.forEach((c) => {
        visibleColumns.push(c.userProvidedColDef.headerName);
      });

      col.map((d, i) => {
        if (d != null)
          if (!visibleColumns.includes(d.headerName)) {
            setIsAllColumnsSelected(false);
            d.isVisible = false;
          }
      });
      setColumns(col);
    }
  };

  return (
    <>
      {!showGridFilters ? (
        <div style={gridIconStyle}>
          <Tooltip title={"Reset Table Filters"}>
            <IconButton
              onClick={resetFilter}
              aria-label="delete"
              style={{ padding: 4 }}
            >
              <FilterAltOffIcon style={{ height: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hide/Show Table Columns">
            <IconButton
              onClick={handleClick}
              style={{ padding: 4 }}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <ViewWeekRoundedIcon style={{ height: "20px" }} />
            </IconButton>
          </Tooltip>
        </div>
      ) : undefined}

      <GridContainer style={containerStyle} className="ag-theme-alpine">
        <GridItem sm={12} md={12} xs={12}>
          <AgGridReact
            {...rest}
            modules={[ClientSideRowModelModule]}
            ref={gridRef}
            rowData={rowData}
            onGridReady={onGridReady}
            columnDefs={filterColumns}
            rowHeight={rowHeight}
            rowEvents={rowEvents}
            onRowDoubleClicked={onRowDoubleClicked}
            onRowClicked={onRowClicked}
            headerHeight={headerHeight}
            rowSelection={rowSelection}
            suppressRowClickSelection={suppressRowClickSelection}
            onSelectionChanged={onSelectionChanged}
            isRowSelectable={isRowSelectable}
            enableCellTextSelection={true}
            style={style}
            components={components}
            debug={debug}
            rowBuffer={rowBuffer}
            rowDeselection={rowDeselection}
            rowModelType={rowModelType}
            pageinationPerSize={pageinationPerSize}
            cacheOverflowSize={cacheOverflowSize}
            maxConcurrentDatasourceRequests={maxConcurrentDatasourceRequests}
            infiniteInitialRowCount={infiniteInitialRowCount}
            maxBlocksInCache={maxBlocksInCache}
            cacheBlockSize={1000}
            gridOptions={gridOptions}
            defaultColDef={defaultColDef}
            gridIconStyle={gridIconStyle}
            onFilterChanged={onFilterChanged}
            paginationPageSize={paginationPageSize}
            onDisplayedColumnsChanged={onVirtualColumnsChanged}
            loadingCellRendererParams={loadingCellRendererParams}
            loadingCellRenderer={loadingCellRenderer}
            animateRows={animateRows}
            context={context}
            rowMultiSelectWithClick={true}
            showGridFilters={showGridFilters}
            suppressRowTransform={suppressRowTransform}
            enableBrowserTooltips={enableBrowserTooltips ?? true}
          />
        </GridItem>
      </GridContainer>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        // TransitionComponent={Fade}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            maxWidth: 230,
            // position: 'absolute',
            // top: '224px',
            marginTop: "35px",
            maxHeight: ITEM_HEIGHT * 4.5,
            // width: '20ch',
          },
        }}
      >
        {/* <> */}
        <li>
          <FormControlLabel
            style={{
              alignContent: "center",
              marginBottom: "-10px",
            }}
            control={
              <Checkbox
                size="small"
                style={{ paddingLeft: 38 }}
                onClick={(e) => selectAllCheckboxes(e)}
                checked={isAllColumnSelected}
              />
            }
            label={<span style={{ fontSize: "10px" }}>Select All</span>}
          />
        </li>
        {columns.map((c, i) => {
          // if ((c.hide == undefined) || (c.hide != undefined && c.hide == false)) {
          if (c != null) {
            return (
              // <>
              <li key={i}>
                <FormControlLabel
                  style={{
                    alignContent: "center",
                    marginBottom: "-10px",
                  }}
                  control={
                    <Checkbox
                      size="small"
                      style={{ paddingLeft: 45 }}
                      onClick={() => {
                        let col = _.cloneDeep(columns);
                        if (col != null) col[i].isVisible = !col[i].isVisible;
                        setColumns(col);
                        let flag = false;
                        col.map((a) => {
                          if (a != null)
                            if (!a.isVisible) {
                              flag = true;
                            }
                        });
                        flag
                          ? setIsAllColumnsSelected(false)
                          : setIsAllColumnsSelected(true);
                      }}
                      checked={c.isVisible}
                    />
                  }
                  label={
                    <span style={{ fontSize: "10px" }}>{c.headerName}</span>
                  }
                />
              </li>
              // </>
            );
          }
        })}
        {/* </> */}
      </Menu>
    </>
  );
}

AgGrids.defaultProps = {
  className: "",
};
AgGrids.propTypes = {
  modules: PropTypes.any,
  rowData: PropTypes.any,
  columnDefs: PropTypes.any,
  style: PropTypes.any,
  rowHeight: PropTypes.any,
  headerHeight: PropTypes.any,
  rowEvents: PropTypes.any,
  onRowDoubleClicked: PropTypes.func,
  onRowClicked: PropTypes.func,
  rowSelection: PropTypes.any,
  suppressRowClickSelection: PropTypes.any,
  onSelectionChanged: PropTypes.any,
  isRowSelectable: PropTypes.any,
  enableCellTextSelection: PropTypes.bool,
  onGridReady: PropTypes.any,
  onBodyScroll: PropTypes.any,
  onBodyScrollEnd: PropTypes.any,
  ref: PropTypes.any,
  context: PropTypes.any,
  components: PropTypes.any,
  debug: PropTypes.any,
  rowBuffer: PropTypes.any,
  rowDeselection: PropTypes.any,
  rowModelType: PropTypes.any,
  pageinationPerSize: PropTypes.any,
  cacheOverflowSize: PropTypes.any,
  maxConcurrentDatasourceRequests: PropTypes.any,
  infiniteInitialRowCount: PropTypes.any,
  maxBlocksInCache: PropTypes.any,
  cacheBlockSize: PropTypes.any,
  gridOptions: PropTypes.any,
  defaultColDef: PropTypes.any,
  gridIconStyle: PropTypes.any,
  paginationPageSize: PropTypes.any,
  onFilterChanged: PropTypes.any,
  loadingCellRendererParams: PropTypes.any,
  loadingCellRenderer: PropTypes.any,
  animateRows: PropTypes.bool,
  showGridFilters: PropTypes.bool,
  suppressRowTransform: PropTypes.bool,
  enableBrowserTooltips: PropTypes.bool,
};
