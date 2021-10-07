import React from "react";
import { Card, CardBody, Button, Media, Row, Col } from "reactstrap";
import doctorPicture from "../../../assets/img/portrait/small/avatar-s-3.jpg";
import ActivityTimeline from "./Reviews";

class SalesCard extends React.Component {
  render() {
    return (
      <React.Fragment>
       <Card>
       <CardBody>
          <Row>
            <Col lg="4" md="12">
              <Media
                src={doctorPicture}
                alt="profile picture"
                className="doctorRound"
                height="110px"
                width="110px"
              />
              <h4 className="mt-1">Dr. Shafqat Mirza</h4>
              <h5 className="text-muted">ENT Specialist</h5>
            </Col>
            <Col lg="8" md="12">
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> ENT specialist
              </p>
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> MBBS, FCP UK, USA
              </p>
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> 10 Years
              </p>
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> ENT specialist
              </p>
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> Best ENT Physician
                of the year
              </p>
              <p className="font-9pt">
                <i className="fas fa-award text-primary" /> Lahore | Gujranwala
                | Faisalabad
              </p>
            </Col>
          </Row>
          <ActivityTimeline />
        </CardBody>
      </Card>
      </React.Fragment>
    );
  }
}
export default SalesCard;
