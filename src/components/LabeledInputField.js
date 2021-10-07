import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

export const LabeledInputField = (props) => {
  const type = props.type || "text";
  const label = props.label;
  const id = props.id;
  return (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <Input {...props} id={id} type={type} />
    </FormGroup>
  );
};
