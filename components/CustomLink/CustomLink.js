import { Link } from "@material-ui/core";
import PropTypes from "prop-types";

export default function CustomLink(props){
    const {
        labelText,
        link,
        title,
        href,
        target
        
    }=props;
    return(
        <Link 
        link={link}
        title={title}
        href={href}
        target={target}
        >
        {labelText}
        </Link>
    );
}

CustomLink.propTypes ={
    labelText:PropTypes.any,
link: PropTypes.func,
title : PropTypes.any,
href : PropTypes.string,
target: PropTypes.any,
}
