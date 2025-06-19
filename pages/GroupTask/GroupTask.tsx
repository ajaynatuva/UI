
import { ErrorOutline } from "@material-ui/icons";
import { ButtonGroup } from "@mui/material";
import { GridSelectionModel } from "@mui/x-data-grid";
import Moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import {
  dangerColor,
  navyColor
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import Dialogbox from "../../components/Dialog/DialogBox";
import DialogBoxWithOutBorder from "../../components/Dialog/DialogBoxWithOutBorder";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import {
  AssignMyTasks,
  getGroupTasks,
  totalData
} from "../../redux/ApiCalls/TaskApis/TaskApis";
import { DELTA_CONFIG } from "../../redux/ApiCalls/TaskApis/TaskApiType";
import { TAB_PATHS } from "../../redux/ApiCalls/UserApis/UserApiActionType";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "../GroupTask/Group.css";
import { TaskColumns } from "./ColumnConstants";
import { GroupAndMyTaskConstants } from "./GroupAndMyTaskConst";
const fullWidth = undefined;
  const maxWidth = "lg";
export interface task {
  taskId: number;
  taskType: [];
  quarterName: string;
  taskDesc: string;
  loadType: any;
  assignee: string;
  createdAt: Date;
  sourceName: string;
  sourceLocation: string;
  deltaLocation: string;
  errorLog: string;
  updatdDate: Date;
  taskStatus: any;
}
const GroupTask = (props) => {
  const navigate = useNavigate();

  //  let currentUser = JSON.parse(sessionStorage.getItem("user-info"));
  const [data, setData] = useState<task[]>([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [disableSelect, setDisableSelect] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0)
  const rowHeight = 30;
  const dispatch = useDispatch();
  const updatedState: TaskState = useSelector(
    (state: any) => state.taskReducer
  );
  const roleState: UserState = useSelector((state: any) => state.userReducer);
  const [openDRS, setOpenDRS] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const [roleName, setRoleName] = useState<string[]>([]);
  const header = {};
  let currentUser = localStorage.getItem('emailId');
  
  const handleToClose = () => {
    setOpenDRS(false);
  };
  function logout() {
    navigate("/");
    localStorage.clear();
    sessionStorage.clear();
    // sessionStorage.clear();
    props.onLogout();
  }
  const colStyle = {
    backgroundColor: navyColor,
    color: "white",
    fontWeight: "400px",
    fontFamily: "Arial, Helvetica, sans-serif",
  };
  const gridIconStyle = useMemo(() => ({
    position: "absolute",
    top: '70px',
    float: 'right',
    right: '35px',
    display: 'inline'
  }), [])
  useEffect(() => {
    let RoleData = roleState.roleName;
    let Role = JSON.stringify(RoleData);
    let adminIdx = Role.toLocaleLowerCase().search("admin");
    if (adminIdx > 0) {
      totalData(dispatch);
    }
    else {
      getGroupTasks(dispatch);
    }
    dispatch({ type: TAB_PATHS, payload: "groupTask" });
  }, []);

  useEffect(() => {
    // Create a new array for the group task data
    const groupTaskData = updatedState.groupTasks?.map((gt) => {
        // Clone the task object and update its properties
        return {
            ...gt,
            id: gt.taskId,
            taskstatus: gt.taskStatus.taskStatus,
            tasktype: gt.taskType.taskType,
            date: Moment(gt.updatedDate).format("MM-DD-YYYY hh:mm:ss"),
        };
    }) || [];

    // Create a new array for the disableSelect values
    const value = [...disableSelect];
    groupTaskData.forEach((gt) => {
        if (gt.taskStatus !== "Created") {
            const idx = value.indexOf(gt.id);
            if (idx < 0) {
                value.push(gt.id);
            }
        }
    });

    setDisableSelect(value);
    setData(groupTaskData);
    setNumberOfRows(groupTaskData.length);
}, [ updatedState.groupTasks]);

  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const prevSelectionModel = React.useRef<GridSelectionModel>(selectionModel);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const gridRef = useRef();
  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();
    setSelectedTask(a);
  };
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      if (row.taskDesc == GroupAndMyTaskConstants.ERROR_TASK) {
        dispatch({ type: DELTA_CONFIG, action: row.taskId });
        navigate("/deltaConfig", {
          state: { taskId: row.taskId, error: true },
        });
      }
    },
  };
  const handleClickOpen = () => {
    if(currentUser){
    if (!(selectedTask.length > 0)) {
      swal.fire({
        icon: "info",
        text: "Select atleast one task",
        confirmButtonColor: navyColor,
        confirmButtonText: "OK",
      });
    } else {
      setOpen(true);
    }
  }else{
    setOpenDRS(true)
  }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    hideSelectAll: true,
    nonSelectable: disableSelect,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        selectedTask.push(row);
      } else {
        selectedTask?.forEach((a, rowIndex) => {
          if (a.id == row.id) {
            selectedTask.splice(rowIndex, 1);
          }
        });
      }
    },
  };
  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount())
  }
  const isRowSelectable = (node) => {
    return node.data
      ? node.data.taskStatus.taskStatus != GroupAndMyTaskConstants.ASSIGNED &&
      node.data.taskStatus.taskStatus != GroupAndMyTaskConstants.REJECTED &&
      node.data.taskStatus.taskStatus != GroupAndMyTaskConstants.ERROR &&
      node.data.taskStatus.taskStatus != GroupAndMyTaskConstants.COMPLETED
      : false;
  };
  return (
    <Template>
      <div>
        <CustomHeader labelText={"Group Task"} />
        <div className="grid" style={{ height: window.innerHeight / 1.28 }}>
          <AgGrids
            rowData={data}
            columnDefs={TaskColumns}
            rowSelection={"multiple"}
            onSelectionChanged={onSelectionChanged}
            isRowSelectable={isRowSelectable}
            gridIconStyle={gridIconStyle}
            onFilterChanged={onFilterChanged}
            onRowDoubleClicked={(event: any) => {
              if (event.data.taskDesc == GroupAndMyTaskConstants.ERROR_TASK) {
                dispatch({ type: DELTA_CONFIG, action: event.data.taskId });
                navigate("/deltaConfig", {
                  state: { taskId: event.data.taskId, error: true },
                });
              }
            }}
          />
        </div>
        <small style={{ position: 'relative', top: '-25px', fontSize: '12px' }}>Number of rows : {numberOfRows}</small>

        <div className="assignbutton">
          {selectedTask.length > 0 ? <CustomButton
            variant={"contained"}
            onClick={handleClickOpen}
            style={{
              backgroundColor: navyColor,
              color: "white",
              positon: "relative",
              fontSize: 11,
              padding: 4,
              textTransform: "capitalize",
            }}
          >
            Assign
          </CustomButton> : undefined}
        </div>
        <div>
          {selectedTask.length > 0 ? <Dialogbox
            disableBackdropClick={true}
            open={open}
            onClose={handleClose}
            title={"Confirm"}
            message={" Would you like to claim the Task?"}
            actions={
              <ButtonGroup>
                {selectedTask.length > 0 ? (
                  <div>
                    <CustomButton
                      style={{
                        backgroundColor: navyColor,
                        color: "white",
                        marginRight: 10,
                        fontSize: 12,
                        padding: 4,
                        textTransform: "capitalize",
                      }}
                      onClick={async () => {
                        handleClose();
                        await assignData();
                        navigate("/myTask");
                        dispatch({ type: TAB_PATHS, payload: "myTask" });
                      }}
                    >
                      Yes
                    </CustomButton>
                    <CustomButton
                      style={{
                        backgroundColor: dangerColor,
                        color: "white",
                        fontSize: 12,
                        padding: 4,
                        textTransform: "capitalize",
                      }}
                      onClick={async () => {
                        handleClose();
                      }}
                    >
                      No
                    </CustomButton>
                  </div>
                ) : (
                  <CustomButton
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      fontSize: 12,
                      padding: 4,
                      textTransform: "capitalize",
                    }}
                    onClick={handleClose}
                  >
                    Ok
                  </CustomButton>
                )}
              </ButtonGroup>
            }
          /> : undefined}
        </div>
      </div>
      <DialogBoxWithOutBorder
      fullWidth={ fullWidth}
      maxWidth={maxWidth}
      open={openDRS}
      onClose={handleToClose}
      message={
        <>
                <ErrorOutline
                  style={{
                    fontSize: "50px",
                    color: "red",
                    position: "relative",
                    left: "52px",
                  }}
                />
                <p style={{position:"relative",left:"23px",top:"9px"}}>Session is Expired</p>
              </>
      }
      actions={
        <ButtonGroup>
          <CustomButton
                onClick={logout}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  position: "relative",
                  right: "71px",
                  bottom: "30px",
                  textTransform: "capitalize",
                }}
              >
                Ok
              </CustomButton>
        </ButtonGroup>
      }
      />
    </Template>
  );

  async function assignData() {
    selectedTask.forEach((st) => {
      st.assignee = currentUser;
    });

    let result = await AssignMyTasks(dispatch, selectedTask, roleState);
    setSelectedTask([]);
  }
};
export default GroupTask;
