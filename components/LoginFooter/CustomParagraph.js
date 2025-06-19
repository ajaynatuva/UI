import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { version } from "../../../package.json";
import Dialogbox from "../Dialog/DialogBox";
import {
  getCrawlerVersion,
  getCurationVersion,
  getEmailVersion,
  getPolicyConfigVersion,
  getPolicyEngineVersion,
  getUserVersion,
} from "../../redux/ApiCalls/VersionApi/versionApis";

const styles = {
  loginfotter: {},
};

const footStyles = makeStyles(styles);

export default function CustomParagraph(props) {
  const { children, style, className } = props;
  const updatedState = useSelector((state) => state.newPolicy);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (updatedState.curationVer == "") {
      getCurationVersion(dispatch);
    }

    if (updatedState.crawleVer == "") {
      getCrawlerVersion(dispatch);
    }
    if (updatedState.configVer == "") {
      getPolicyConfigVersion(dispatch);
    }
    if (updatedState.email == "") {
      getEmailVersion(dispatch);
    }
    if (updatedState.engineVer == "") {
      getPolicyEngineVersion(dispatch);
    }

    if (updatedState.userVer == "") {
      getUserVersion(dispatch);
    }
  }, []);

  const handleToClose = () => {
    setOpen(false);
  };
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div
        style={{
          padding: "5px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <p
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            textAlign: "center",
            color: "darkgrey",
            fontSize: 13,
            backgroundColor: "white",
            padding: "10px 0",
            margin: 0,
          }}
        >
          CPT copyright {currentYear} American Medical Association. All rights
          reserved.&nbsp;
          <br />
          Fee schedules, relative value units, conversion factors and/or related
          components are not assigned by the AMA, are not part of CPT,
          <br /> and the AMA is not recommending their use. The AMA does not
          directly or indirectly practice medicine or dispense medical services.
          <br />
          The AMA assumes no liability for data contained or not contained
          herein. CPT is a registered trademark of the American Medical
          Association
          <p
            style={{
              fontSize: "13px",
              cursor: "pointer",
              color: "lightseagreen",
              textDecoration: "underline",
            }}
            onClick={() => {
              setOpen(true);
            }}
          >
            v{version}
          </p>
        </p>
      </div>
      <Dialogbox
        onClose={handleToClose}
        open={open}
        title={"Versions"}
        message={
          <div>
            <div>Data Curation : {updatedState.curationVer}</div>
            <div>
              Data Crawler
              <span style={{ marginLeft: 5 }}>: {updatedState.crawleVer}</span>
            </div>
            <div>
              Policy Config
              <span style={{ marginLeft: 5 }}>: {updatedState.configVer}</span>
            </div>
            <div>
              Policy Engine
              <span style={{ marginLeft: 2 }}>: {updatedState.engineVer}</span>
            </div>
            <div>
              IPU User
              <span style={{ marginLeft: 32 }}>: {updatedState.userVer}</span>
            </div>
            <div>
              Email
              <span style={{ marginLeft: 51 }}> : {updatedState.email}</span>
            </div>
          </div>
        }
      />
    </>
  );
}

CustomParagraph.propTypes = {
  children: PropTypes.node,
};
