// import { DatePicker, DesktopDatePicker } from "@mui/lab";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const customStyles = {
  control: (styles) => ({
    ...styles,
    border: "1px solid black",
    fontSize: 14,
    width: 50,
    height: 20,
  }),
};

const DateViewer = (props) => {
  const { placeholder, value, onChange, selected, renderInput, dateFormat } =
    props;
  return (
    <DatePicker
      styles={customStyles}
      onChange={onChange}
      selected={selected}
      placeholder="MM-DD-YYYY"
      value={value}
      renderInput={renderInput}
      dateFormat={dateFormat}
    />
  );
};
DateViewer.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string | PropTypes.number,
  onChange: PropTypes.func,
  renderInput: PropTypes.func,
  dateFormat: PropTypes.string,
  selected: PropTypes.any,
  styles:PropTypes.any
};

export default DateViewer;
