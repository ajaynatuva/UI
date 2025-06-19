import { MultiSelect } from 'react-multi-select-component'
import React from 'react';

const CustomMultiSelect = (props) => {
      const {children,onChange,value,labelledBy,disableSearch,className,options}=props;

  return (
    <MultiSelect
    options={options}
    value={value}
    onChange={onChange}
    labelledBy={labelledBy}
    className={className}
    disableSearch={true}
    />
  )
}

export default CustomMultiSelect