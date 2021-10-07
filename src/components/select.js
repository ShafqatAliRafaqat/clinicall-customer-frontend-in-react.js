import React, { useRef } from "react";
import "../assets/scss/plugins/forms/react-select/_react-select.scss";
import Selection from "react-select";
import { FormGroup } from "reactstrap";

export const Select = (props) => {
  const optionss = [{ value: "", label: `Select ${props.label}` }];
  let selector = useRef(null);
  props.options.length &&
    props.filterkey &&
    props.options.map((option) => {
      optionss.push({
        value: option[props.filterkey],
        label: option[props.filterkey],
      });
    });
  const defaultValue = optionss.filter((option) => {
    return option.value == props.defaultValue;
  });
  return (
    <FormGroup className={"form-label-group position-relative"}>
      <Selection
        className="React"
        classNamePrefix="select"
        defaultValue={defaultValue.length ? defaultValue[0] : optionss[0]}
        ref={selector}
        name={props.label}
        options={optionss}
        onChange={props.onChange}
        isDisabled={props.disabled}
        {...props}
      />
    </FormGroup>
  );
};

export default Select;
