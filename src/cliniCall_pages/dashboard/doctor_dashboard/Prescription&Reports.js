import React, { useState } from "react";
import { Button, Row, Col } from "reactstrap";
import { Avatar } from "@material-ui/core";
import avatar1 from "../../../assets/img/portrait/small/avatar-s-5.jpg";
import avatar2 from "../../../assets/img/portrait/small/avatar-s-7.jpg";
import { Link } from "react-router-dom";

const PrescriptionReports = (props) => {
  return (
    <div className="p-2">
      <h3>Prescription and Reports</h3>
      <Row className="mx-0 text-center">
        <Col className="mt-2">
          <Avatar
            style={{ width: "85px", height: "85px" }}
            className="mx-auto my-0"
            src={avatar2}
            alt=""
          />
          <h4 className="mt-2">Ali</h4>
          <span className="text-light">Blood Report</span>
          <div className="text-center mt-2">
            <Button color="primary">View</Button>
          </div>
        </Col>
        <Col className="mt-2">
          <Avatar
            style={{ width: "85px", height: "85px" }}
            className="mx-auto my-0"
            src={avatar1}
            alt=""
          />
          <h4 className="mt-2">Ali</h4>
          <span className="text-light">Blood Report</span>
          <div className="text-center mt-2">
            <Button color="primary">View</Button>
          </div>
        </Col>
        <Col className="mt-2">
          <Avatar
            style={{ width: "85px", height: "85px" }}
            className="mx-auto my-0"
            src={avatar2}
            alt=""
          />
          <h4 className="mt-2">Ali</h4>
          <span className="text-light">Blood Report</span>
          <div className="text-center mt-2">
            <Button color="primary">View</Button>
          </div>
        </Col>
        <Col className="mt-2">
          <Avatar
            style={{ width: "85px", height: "85px" }}
            className="mx-auto my-0"
            src={avatar1}
            alt=""
          />
          <h4 className="mt-2">Ali</h4>
          <span className="text-light">Blood Report</span>
          <div className="text-center mt-2">
            <Button color="primary">View</Button>
          </div>
        </Col>
        <Col className="mt-2">
          <Avatar
            style={{ width: "85px", height: "85px" }}
            className="mx-auto my-0"
            src={avatar1}
            alt=""
          />
          <h4 className="mt-2">Ali</h4>
          <span className="text-light">Blood Report</span>
          <div className="text-center mt-2">
            <Button color="primary">View</Button>
          </div>
        </Col>
      </Row>
      <div className="text-right py-2">
        <Link to="#" className="text-primary cursor-pointer">
          See all
        </Link>
      </div>
    </div>
  );
};

export default PrescriptionReports;
