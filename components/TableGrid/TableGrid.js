
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function TableGrid(props) {
  const rowHeight = 25;
  const { children, className, hideFooterPagination, xs, isRowSelectable, showPagination, sm, md, style, rows, checked, columns, onPageChange, onSelectionModelChange, selectionModel, ...rest } = props;

  return (
    <DataGrid xs={xs} sm={sm} md={md} container {...rest}
      rows={rows}
      getRowId={(row) => {
        return row.id
      }}
      columns={columns}
      // pageSize={10}
      //  rowsPerPageOptions={[10]}
      // rowsPerPageOptions={[1000]}
      sx={{
        height: 300,
        width: 1,
        fontSize:12,
        '& .super-app-theme--header': {
          backgroundColor: '#004f71',
          color: "white",
          fontSize: 13
        },
        '& .MuiDataGrid-row': {
          border: 0.001,
          borderColor: "lightgray"
        },
        '& .MuiDataGrid-columnHeadersInner': {
          backgroundColor: '#004f71',
          color: "white",
          fontSize: 13
        }

      }}
      style={{ height: "100%" }}
      rowHeight={rowHeight}
      // rowsPerPageOptions={[]}
      isRowSelectable={isRowSelectable}
      headerHeight={rowHeight}
      onPageChange={onPageChange}
      onSelectionModelChange={onSelectionModelChange}
      selectionModel={selectionModel}
      hideFooterPagination={false}
    />
  )
}

TableGrid.defaultProps = {
  className: "",
}
TableGrid.propTypes = {
  rows: PropTypes.any,
  columns: PropTypes.any,
  sx: PropTypes.any,
  style: PropTypes.any,
  rowHeight: PropTypes.any,
  headerHeight: PropTypes.any,
  onRowDoubleClick: PropTypes.func,
  checkboxSelection: PropTypes.bool,
  onPageChange: PropTypes.func,
  onSelectionModelChange: PropTypes.func,
  isRowSelectable: PropTypes.func,
  selectionModel: PropTypes.any,
  hideFooterPagination: PropTypes.bool,
  checked: PropTypes.bool
}
