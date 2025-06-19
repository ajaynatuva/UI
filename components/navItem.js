import { Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RESET_STATE }from "../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { TAB_PATHS } from "../redux/ApiCalls/UserApis/UserApiActionType";
import './navItems.css';
export const NavItem = (props) => {
  const { href, icon, title, subHeaders, ...others } = props;
  const dispatch = useDispatch();
  const [selectedNav,setSelectedNav]=useState([])
  const navigate = useNavigate();
  const resetInputField = () => {
    dispatch({ type: RESET_STATE });
  };
  const handleClick = (value) => {
    props.onSetSelectedTab(value);
    switch (value) {
      case "newPolicy": {
        resetInputField();
        navigate("/newPolicy",{ state: { new: true } });
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "search": {
        resetInputField();
        navigate("/search");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "metaDataLoader": {
        navigate("/metaDataLoader");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "groupTask": {
        navigate("/groupTask");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "myTask": {
        navigate("/myTask");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "loadConfig": {
        navigate("/loadConfig");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "viewConfig": {
        navigate("/viewConfig");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "configValidation": {
        navigate("/configValidation");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "viewCrawler": {
        navigate("/viewCrawler");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "addCrawler": {
        navigate("/addCrawler", { state: { add: true } });
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "userList": {
        navigate("/userList");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "createUser": {
        navigate("/createUser");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "testingReport": {
        navigate("/testingReport");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "login": {
        navigate("/login");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "claim": {
        navigate("/claim");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      // currently not using
      // case "ClientgroupExclusions": {
      //   navigate("/ClientgroupExclusions");
      //   dispatch({ type: TAB_PATHS, payload:value });
      //   break;
      // }
      case "NewClientSetUp": {
        navigate("/NewClientSetUp");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "cache": {
        navigate("/cache");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      case "policyDisplay": {
        navigate("/policyDisplay");
        dispatch({ type: TAB_PATHS, payload:value });
        break;
      }
      default:
        break;
    }
  };
  const roleState = useSelector((state) => state.userReducer);
useEffect(()=>{
  let navTab=roleState.tabPaths
  setSelectedNav(navTab)
},[roleState.tabPaths])
  return (
   <div>
   <Divider />
      <h2
        style={{
          color: "lightseagreen",
          fontSize: "15px",
          fontWeight: "200",
          paddingLeft: 13,
          marginTop:4,
          marginBottom:4,
          fontFamily: "Arial,Helvetica,sans-serif",
        }}
      >
        {title}
      </h2>
      <Divider />
      {props.subHeaders.map((sh, idx) => (
        <div style={{padding:2}}>
        <p
          style={{
            backgroundColor: selectedNav == sh.path  ? "#555" : "#ecf0f1",
            borderLeft:selectedNav == sh.path  ? "3px solid #EE5209" : "",
            color: selectedNav == sh.path ? "white" : "black",
            cursor: "pointer",
            marginBottom:0
          }}
          className="sideNav"
          onClick={() => handleClick(sh.path)}
        >
          <span style={{ paddingLeft:5}}>{sh.icon}</span>
          <span style={{paddingLeft:5, fontSize: 13}}>{sh.label}</span>
          {/* {selectedNav == sh.path ? <ArrowRightOutlined style={{float:'right'}}/>:undefined} */}
        </p>
        </div>
        
      ))}
    </div>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
};
