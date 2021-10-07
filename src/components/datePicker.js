import React from "react";
import Date from "react-flatpickr";
import { FormGroup } from "reactstrap";

export const DatePicker = (props) => {
  return (
    <FormGroup>
      <Date className="form-control" {...props} />
    </FormGroup>
  );
};
