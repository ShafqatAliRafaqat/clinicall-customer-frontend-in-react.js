import React from "react";
import { Row, Col, Card } from "reactstrap";
import DoctorInfo from "./DoctorInfo";
import IncomingAnalytics from "./IncomingAnalytics";
import OutgoingAnalytics from "./OutgoingAnalytics";
import AppointmentHistory from "./AppointmentHistory";
import Patients from "./Patients";
import PrescriptionReports from "./Prescription&Reports";
import ActivityTimeline from "./Reviews";
import AppointmentAnalytics from "./AppointmentAnalytics";
import AppointmentTime from "./AppointmentTime";
import "../../../assets/scss/pages/dashboard-analytics.scss";
import ChatWidget from "./chatWidget";

let $primary = "#204593",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $primary_light = "#9c8cfc",
  $warning_light = "#FFC085",
  $danger_light = "#f29292",
  $info_light = "#1edec5",
  $stroke_color = "#e8e8e8",
  $label_color = "#e7eef7",
  $white = "#fff";

class AnalyticsDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row className="match-height">
          <Col lg="5" md="12">
            <DoctorInfo />
          </Col>
          <Col md="7" sm="12">
            <Card>
              <AppointmentTime />
            </Card>
          </Col>
        </Row>
        <Row className="match-height">
          <Col md="5" sm="12">
            <ChatWidget />
          </Col>
          <Col md="7" sm="12">
            <AppointmentAnalytics />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default AnalyticsDashboard;
