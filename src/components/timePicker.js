import React from "react";
import Flatpickr from "react-flatpickr";
import { FormGroup } from "reactstrap";

export const TimePiker = (props) => {
  return (
    <FormGroup>
      <Flatpickr {...props} />
    </FormGroup>
  );
};

