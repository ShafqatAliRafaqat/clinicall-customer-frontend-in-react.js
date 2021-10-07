import React from "react";

import { FormGroup, Input, Label } from "reactstrap";

export const InputField = (props) => {
  const type = props.type || "text";
  const Icon = props.icon;
  return (
    <FormGroup
      className={
        Icon
          ? "form-label-group position-relative has-icon-left"
          : "form-label-group position-relative"
      }
    >
      <Input type={type} {...props} />
      {Icon && (
        <div className="form-control-position">
          <Icon size={props.size || 15} />
        </div>
      )}
      <Label>{props.label}</Label>
    </FormGroup>
  );
};
