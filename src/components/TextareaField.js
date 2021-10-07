import React from "react";
import { Input, Label } from "reactstrap";

export const TextareaField = (props) => {
  const row = props.row || 3;
  const type = props.type || "textarea";
  const length = props.length || 1000;
  return (
    <React.Fragment>
      <div className="form-label-group mt-2">
        <Input {...props} type={type} row={row} />
        <Label>{props.label}</Label>
        <small
          className={`counter-value float-right ${
            props.value.length > length ? "bg-danger" : ""
          }`}
        >
          {`${props.value.length}/${length}`}
        </small>
      </div>
    </React.Fragment>
  );
};
