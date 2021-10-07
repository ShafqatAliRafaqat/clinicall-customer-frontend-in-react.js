import React from "react";
import { Row, Col } from "reactstrap";
import { Icon } from "./index";

export const DetailsRow = (props) => {
  return (
    <Row className="py-2 border-bottom border-grey mx-0">
      <Col sm="2" className="mb-xs-26" className="text-center mb-xs-26">
        <span className="rounded primary-bg sidebar-hdr-clr padding-sm-6">
          <Icon icon={props.icon} />
        </span>
      </Col>
      <Col sm="10">
        <h5 className="font-11pt">
          <span className="view-left">{props.field}:</span>
          <span className="view-right w-50 text-truncate">{props.fieldData}</span>
        </h5>
      </Col>
    </Row>
  );
};
