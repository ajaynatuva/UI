import PropTypes from "prop-types";

export default function CustomHeader(props){
const {
    labelText,
    style,
    className
  
} = props;
return(
<h5 className={className} style={{fontFamily:'Arial, Helvetica, sans-serif'}}>{labelText}</h5>
);

}

CustomHeader.propTypes ={
labelText:PropTypes.node,
style:PropTypes.any,
className:PropTypes.string
};
