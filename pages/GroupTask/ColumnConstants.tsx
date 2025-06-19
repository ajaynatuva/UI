import CustomLink from "../../components/CustomLink/CustomLink";

export const TaskColumns = [
  {
    field: "sourceName",
    headerName: "Source Name",
    minWidth: 109,
    headerTooltip: "Source Name",
    checkboxSelection: true,
  },
  {
    field: "tasktype",
    headerName: "Task Name",
    minWidth: 90,
    headerTooltip: "Task Name",
  },
  {
    field: "sourceLocation",
    headerName: "Source Link",
    minWidth: 83,
    headerTooltip: "Source Link",
    cellRenderer: (cell, row, rowIndex, formatExtraData) => {
      return (
        <CustomLink
          title={cell.data.sourceLocation}
          href={cell.data.sourceLocation}
          labelText={cell.data.sourceName + "," + " " + cell.data.quarterName}
          target={"_blank"}
        />
      );
    },
  },
  {
    field: "taskstatus",
    headerName: "Task Status",
    minWidth: 83,
    headerTooltip: "Task Status",
  },
  {
    field: "assignee",
    headerName: "Assignee Name",
    minWidth: 83,
    headerTooltip: "Assignee Name",
  },
  {
    field: "date",
    headerName: "Updated Date",
    minWidth: 80,
    headerTooltip: "Updated Date",
    resizable: false,
  },
];