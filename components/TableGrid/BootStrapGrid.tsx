import { IconButton, Tooltip } from "@material-ui/core";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import _ from "lodash";
import PropTypes from "prop-types";
import { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import ColumnFilter from "./TableTypes";
// omit...
export default function BootstrapGrid(props) {
  const [showFilter, setShowFilter] = useState(false);
  const [reset, setReset] = useState(false);
  const {
    keyField,
    pagination,
    columnStyle,
    rowEvents,
    headerClasses,
    rowStyle,
    onTableChange,
    remote,
    data,
    filter,
    selectRow,
    columns,
    xs,
    sm,
    md,
    style,
    defaultSorted,
    striped,
    hover,
    condensed,
    isFilter
  } = props;
  const [column, setColumn] = useState<ColumnFilter>({ filters: [] });

  columns.forEach((c) => {
    if (showFilter) {
      c.filter = textFilter({
        style: {
          height: "20px",
          fontSize: "12px",
        },
        getFilter: (filter) => {
          let f = c.dataField + "Filter";
          if (column && column.filters) {
            let isPresent = checkIsPresent(f);
            if (!isPresent) {
              let obj = { columnName: f, filter: filter };
              column.filters.push(obj);
            }
          }
        },
      });
    } else {
      c.filter = null;
    }
  });

  function checkIsPresent(columnName: string) {
    let isPresent = false;
    column.filters.forEach((cf) => {
      if (cf.columnName == columnName) {
        isPresent = true;
      }
    });
    return isPresent;
  }
  const resetFields = () => {
    let obj: ColumnFilter = _.cloneDeep(column);
    obj.filters.forEach((c) => {
      if (c.filter && c.filter != null) {
        c.filter("");
      }
    });
    setColumn(obj);
    setShowFilter(false);
  };

  return (
    <div>
      <div style={{position:'fixed',marginTop:'-45px'}}>
        {isFilter ?!showFilter ? (
          <Tooltip title={"Filter"}>
            <IconButton
              onClick={() => setShowFilter(!showFilter)}
              aria-label="delete"
              style={{ padding: 4 }}
            >
              <FilterAltIcon style={{ height: "20px" }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={"Reset Filters"}>
            <IconButton
              onClick={() => resetFields()}
              aria-label="delete"
              style={{ padding: 4 }}
            >
              <FilterAltOffIcon style={{ height: "20px" }} />
            </IconButton>
          </Tooltip>
        ):''}
      </div>
      <div className="Table" style={{marginTop:'0px'}}>
        <BootstrapTable
          keyField="id"
          data={data}
          columns={columns}
          bootstrap4
          striped
          hover
          condensed
          rowStyle={rowStyle}
          //@ts-ignore
          columnStyle={columnStyle}
          filter={filterFactory()}
          remote={remote}
          defaultSorted={defaultSorted}
          selectRow={selectRow}
          onTableChange={onTableChange}
          headerClasses="header-class"
          rowEvents={rowEvents}
          pagination={pagination}
          isFilter={isFilter}
        />
      </div>
    </div>
  );
}

BootstrapGrid.defaultProps = {
  classname: "",
};

BootstrapGrid.propTypes = {
  data: PropTypes.any,
  columns: PropTypes.any,
  keyField: PropTypes.any,
  striped: PropTypes.any,
  hover: PropTypes.any,
  condensed: PropTypes.any,
  defaultSorted: PropTypes.any,
  selectRow: PropTypes.any,
  sm: PropTypes.any,
  md: PropTypes.any,
  xs: PropTypes.any,
  filter: PropTypes.any,
  remote: PropTypes.any,
  onTableChange: PropTypes.any,
  headerClasses: PropTypes.any,
  rowStyle: PropTypes.any,
  columnStyle: PropTypes.any,
  style: PropTypes.any,
  rowEvents: PropTypes.any,
  pagination: PropTypes.any,
  isFilter:PropTypes.bool
};
