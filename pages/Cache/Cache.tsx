import { useDispatch } from "react-redux";
import { navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import '../../components/FontFamily/fontFamily.css';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Template from "../../components/Template/Template";
import { getRefreshChallengeCache, getRefreshPolicyCache } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import './Cache.css';

const Cache = () => {
  const dispatch = useDispatch();

  async function refreshChallengeCodeCache() {
    await getRefreshChallengeCache(dispatch);  
  }
  async function refreshPolicyCache() {
    await getRefreshPolicyCache(dispatch);
  }


  return (
    <Template>
      <div style={{ alignSelf: "center" }}>
        <div style={{ height: 25 }} />
        <GridItem sm={6} md={12} xs={6}>
          <GridItem sm={6} md={12} xs={6}>
            <CustomHeader
              labelText={'Cache'}
            />
            <div style={{ height: 30 }} />
          </GridItem>
        </GridItem>

        <CustomPaper style={{
          height: window.innerHeight / 2,
           width: window.innerWidth / 2,
          textAlign: "center",
          marginLeft: 250,
          boxShadow: 'none',
          border: '1px solid #D6D8DA'
        }}>
          <div />
          <GridContainer style={{marginTop:150,marginRight:40}}>
            <GridItem sm={2} md={6} xs={2}>
              <CustomButton
                variant={"contained"}
                onClick={() => refreshChallengeCodeCache()}
                style={{
                  backgroundColor: navyColor,
                  float: "right",
                  color: "white",
                  padding: 5,
                  fontSize: 12,
                  textTransform: 'capitalize',

                }}
              >
                Refresh Challenge Cache
              </CustomButton>

            </GridItem>
            <GridItem sm={2} md={4} xs={2}>
              <CustomButton
                variant={"text"}
                onClick={() => refreshPolicyCache()}
                style={{ backgroundColor: navyColor, color: "white", alignSelf: "center", textTransform: 'capitalize', fontSize: 12 }}
              >
                Refresh Policy Cache
              </CustomButton>
            </GridItem>
          </GridContainer>
        </CustomPaper>
      </div>
    </Template>
  );
};

export default Cache;
