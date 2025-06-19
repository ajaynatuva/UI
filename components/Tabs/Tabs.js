import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';

const Tabs=(props) =>{
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, value) => {
      setValue(value);
    };
    const classes = useStyles();
    const { headerColor, plainTabs, tabs, title, rtlActive } = props;
    const cardTitle = classNames({
      [classes.cardTitle]: true,
      [classes.cardTitleRTL]: rtlActive,
    });
    return (
    
         <Box>
             <TabContext value={value} >
             <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.displayNone,y
          }}
        ></Tabs>
                 <Tab
                classes={{
                  root: classes.tabRootButton,
                  label: classes.tabLabel,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper,
                }}
                key={key}
                label={prop.tabName}
                {...icon}
              />
                 <TabPanel value={value}/>
             </TabContext>
          
         </Box>
      
    );
  }
  Tabs.propTypes = {
    headerColor: PropTypes.oneOf([
      "warning",
      "success",
      "danger",
      "info",
      "primary",
      "rose",
    ]),
    title: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        tabName: PropTypes.string.isRequired,
        tabIcon: PropTypes.object,
        tabContent: PropTypes.node.isRequired,
      })
    ),
    rtlActive: PropTypes.bool,
    plainTabs: PropTypes.bool,
  };
  
  export default Tabs;