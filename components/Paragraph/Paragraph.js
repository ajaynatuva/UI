import PropTypes from "prop-types";


export default function Paragraph(props){
    const{
        labelText,
        style,
} = props;
return(
<p>{labelText}</p>
);
}

Paragraph.propTypes ={
    labelText:PropTypes.node,
    style:PropTypes.any,
};