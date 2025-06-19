import Moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import "../../components/FontFamily/fontFamily.css";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import {
  // getAllUsers,
  getUserList,
  removeUsers,
} from "../../redux/ApiCalls/UserApis/UserApis";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "./User.css";
import { ButtonGroup } from "@material-ui/core";
import Dialogbox from "../../components/Dialog/DialogBox";

const UserList = (props) => {
  const [data, setData] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [user, setUserKey] = useState("");

  const [userName, setUserName] = useState("");

  const handleToClose = () => {
    setOpen(false);
  };

  const handleClickToOpendelete = () => {
    setOpen(true);
  };

  useEffect(() => {
    getUserList(dispatch);
  }, []);
  const DeletedMethod = () => {
    removeUsers(dispatch, user);
    setOpen(false);
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
  function handleClick(event, data) {
    navigate("/editUser", { state: { user: data } });
  }
  const columnDefs = [
    {
      field: "userName",
      headerName: "User Name",
      minWidth: 109,
      headerTooltip: "User Name",
    },
    {
      field: "emailId",
      headerName: "Email ID",
      minWidth: 90,
      headerTooltip: "Email ID",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      minWidth: 83,
      headerTooltip: "Created On",
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      minWidth: 83,
      headerTooltip: "Last Login",
    },
    {
      field: "action",
      headerName: "Action",
      width: 90,
      resizable: false,
      filter: false,
      cellRenderer: (row) => {
        return (
          <ButtonGroup>
            <CustomButton
              variant="contained"
              style={{
                height: 18,
                fontSize: "11px",
                textTransform: "capitalize",
                backgroundColor: navyColor,
                color: "white",
                marginTop: -6,
              }}
              onClick={(event) => {
                handleClick(event, row.data);
              }}
            >
              Edit
            </CustomButton>

            <CustomButton
              variant="contained"
              style={{
                height: 18,
                fontSize: "11px",
                textTransform: "capitalize",
                backgroundColor: dangerColor,
                color: "white",
                marginTop: -6,
                left: 10,
              }}
              onClick={async (event) => {
                handleClickToOpendelete();
                setUserKey(row.data.userId);
                setUserName(row.data.userName);
              }}
            >
              Delete
            </CustomButton>
          </ButtonGroup>
        );
      },
    },
  ];

  const updatedState: UserState = useSelector(
    (state: any) => state.userReducer
  );

  useEffect(() => {
    let us = updatedState.users?.map((u) => {
      return {
        ...u,  // Create a new object with the same properties as the original user
        id: u.userId,
        createdOn: Moment(u.createdOn).format("MM-DD-YYYY"),
        lastLogin: Moment(u.lastLogin).format("MM-DD-YYYY")
      };
    });

    setData(us);
    setNumberOfRows(us.length);
  }, [updatedState.users]);
  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };
  return (
    <Template>
      <div>
        <CustomHeader labelText={"User List"} />
        <div className="userGrid" style={{ height: window.innerHeight / 1.28 }}>
          <AgGrids
            rowData={data}
            columnDefs={columnDefs}
            gridIconStyle={gridIconStyle}
            onFilterChanged={onFilterChanged}
          />
        </div>
        <small style={{ position: "relative", top: "-25px", fontSize: "12px" }}>
          Number of rows : {numberOfRows}
        </small>
      </div>

      <Dialogbox
        open={open}
        onClose={handleToClose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={"Are you sure you want to remove " + userName + " ?"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={DeletedMethod}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={handleToClose}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                //  margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    </Template>
  );
};
export default UserList;
