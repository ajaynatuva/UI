import { ButtonGroup } from "@mui/material";
import Moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import Dialogbox from "../../components/Dialog/DialogBox";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import {
  getMyTasks,
  unAssignGroupTasks
} from "../../redux/ApiCalls/TaskApis/TaskApis";
import { DELTA_CONFIG } from "../../redux/ApiCalls/TaskApis/TaskApiType";
import { TAB_PATHS } from "../../redux/ApiCalls/UserApis/UserApiActionType";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import { TaskColumns } from "../GroupTask/ColumnConstants";
import { GroupAndMyTaskConstants } from "../GroupTask/GroupAndMyTaskConst";
import "./MyTask.css";
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
const MyTask = (props) => {
  // let currentUser = JSON.parse(sessionStorage.getItem("user-info"));
  const roleState: UserState = useSelector((state: any) => state.userReducer);
  const rowHeight = 30;
  let navigate = useNavigate();

  const [selectedData, setSelectedData] = useState<
    { task: task; isChecked: boolean }[]
  >([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [data, setData] = useState<task[]>([]);
  const dispatch = useDispatch();
  const [numberOfRows, setNumberOfRows] = useState(0)
  const updatedState: TaskState = useSelector(
    (state: any) => state.taskReducer
  );


  const gridIconStyle = useMemo(() => ({
    position: "absolute",
    top: '70px',
    float: 'right',
    right: '35px',
    display: 'inline'
  }), [])
  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();
    setSelectedTask(a);
  };
  const isRowSelectable = (node) => {
    let a = node.data;

    return node.data
      ? node.data.taskStatus.taskStatus === GroupAndMyTaskConstants.ASSIGNED ||
      node.data.taskStatus.taskStatus === GroupAndMyTaskConstants.ASSIGNED
      : false;
  };

  let emailId = localStorage.getItem("emailId");
  useEffect(() => {
    getMyTasks(dispatch,emailId);
    dispatch({ type: TAB_PATHS, payload: "myTask" });
  }, []);

 
  // useEffect(() => {
  //   let taskData = updatedState.myTask.map((td) => {
  //     td.id = td.taskId;
  //     td.taskstatus = td.taskStatus.taskStatus;
  //     td.date = Moment(td.updatedDate).format("MM-DD-YYYY hh:mm:ss");
  //     td.tasktype = td.taskType.taskType;
  //     return td;
  //   });
  //   setData(taskData);
  //   setNumberOfRows(taskData.length);
  // }, [updatedState]);
  useEffect(() => {
    // Create a new array of tasks to avoid direct mutation
    const taskData = updatedState.myTask.map((td) => {
      return{
        ...td,
        id: td.taskId,
        taskstatus: td.taskStatus.taskStatus,
        date: Moment(td.updatedDate).format("MM-DD-YYYY hh:mm:ss"),
        tasktype: td.taskType.taskType,
      }
  });

    // Update state with the new array
    setData(taskData);
    setNumberOfRows(taskData.length);
  }, [updatedState]);

  

  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const handleClickOpen = () => {
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
  };
  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount())
  }
  const rowEvents = {
    onDoubleClick: (e, row, rowIndex) => {
      if (row.taskDesc == GroupAndMyTaskConstants.ERROR_TASK) {
        dispatch({ type: DELTA_CONFIG, action: row.taskId });
        navigate("/deltaConfig", {
          state: { taskId: row.taskId, error: true },
        });
      } else {
        dispatch({ type: DELTA_CONFIG, action: row.taskId });
        navigate("/deltaConfig", {
          state: { taskId: row.taskId, error: false },
        });
      }
    },
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Template>
      <div>
        <CustomHeader labelText={"My Task"} />
        <div className="grid" style={{ height: window.innerHeight / 1.28,width: '100%' }}>
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
              } else {
                dispatch({ type: DELTA_CONFIG, action: event.data.taskId });
                navigate("/deltaConfig", {
                  state: { taskId: event.data.taskId, error: false },
                });
              }
            }}
          />
        </div>
        <small style={{ position: 'relative', top: '-25px', fontSize: '12px' }}>Number of rows : {numberOfRows}</small>
      </div>
      <div className="button">
        {selectedTask.length > 0 ? (<CustomButton
          variant={"contained"}
          style={{
            backgroundColor: navyColor,
            color: "white",
            // margin: 10,
            // marginTop:-10,
            fontSize: 12,
            padding: 4,
            textTransform: "capitalize",
          }}
          onClick={handleClickOpen}
        >
          UnAssign
        </CustomButton>) : (undefined)}

      </div>
      <div>
        {selectedTask.length > 0 ? (
          <Dialogbox
            onClose={handleClose}
            open={open}
            disableBackdropClick={true}
            title={"Confirm"}
            message={" Would you like to Unassign the task?"}
            actions={
              <ButtonGroup>
                {selectedTask.length > 0 ? (
                  <div>
                    <CustomButton
                      style={{
                        backgroundColor: navyColor,
                        color: "white",
                        textTransform: "capitalize",
                        fontSize: 12,
                        padding: 4,
                        marginRight: 10,
                      }}
                      onClick={async () => {
                        handleClose();
                        await unAssignData();
                        navigate("/groupTask");
                      }}
                    >
                      Yes
                    </CustomButton>
                    <CustomButton
                      style={{
                        backgroundColor: dangerColor,
                        color: "white",
                        textTransform: "capitalize",
                        fontSize: 12,
                        padding: 4,
                      }}
                      onClick={handleClose}
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
          />
        ) : undefined}
      </div>
    </Template>
  );

  function checkIsDisabled() {
    let isDisabled = true;
    selectedData?.map((d) => {
      if (d.isChecked) {
        isDisabled = false;
      }
    });
    return isDisabled;
  }

  async function unAssignData() {
    selectedTask?.forEach((c) => {
      c.assignee = "";
    });
    await unAssignGroupTasks(dispatch, navigate, selectedTask, roleState,emailId);
  }
};

export default MyTask;
