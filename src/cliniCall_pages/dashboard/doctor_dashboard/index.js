import React from "react";
import { Row, Col, Card } from "reactstrap";
import SalesCard from "./SalesCard";
import IncomingAnalytics from "./IncomingAnalytics";
import OutgoingAnalytics from "./OutgoingAnalytics";
import AppointmentHistory from "./AppointmentHistory";
import Patients from "./Patients";
import PrescriptionReports from "./Prescription&Reports";
import ActivityTimeline from "./Reviews";
import AppointmentAnalytics from "./AppointmentAnalytics";
import AppointmentTime from "./AppointmentTime";
import "../../../assets/scss/pages/dashboard-analytics.scss";

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
          <Col lg="6" md="12">
            <SalesCard />
          </Col>
          <Col lg="3" md="6" sm="12">
            <IncomingAnalytics />
          </Col>
          <Col lg="3" md="6" sm="12">
            <OutgoingAnalytics />
          </Col>
        </Row>
        <Row className="match-height">
          <Col md="7" sm="12">
            <Card>
              <AppointmentHistory
                labelColor={$label_color}
                primary={$primary}
              />
              <hr />
              <AppointmentTime />
            </Card>
          </Col>
          <Col md="5" sm="12">
            <AppointmentAnalytics />
          </Col>
        </Row>
        <Row className="match-height">
          <Col md="7" sm="12">
            <Card>
              <Patients />
              {/* <hr />
              <PrescriptionReports /> */}
            </Card>
          </Col>
          <Col md="5" sm="12">
            <ActivityTimeline />
          </Col>
        </Row>
        {/* <Row className="match-height">
          <Col lg="4">
            <ProductOrders
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
            />
          </Col>
          <Col lg="4">
            <SalesStat
              strokeColor={$stroke_color}
              infoLight={$info_light}
              primary={$primary}
              info={$info}
            />
          </Col>
          <Col lg="4">
            <SupportTracker
              primary={$primary}
              danger={$danger}
              white={$white}
            />
          </Col>
        </Row> */}
      </React.Fragment>
    );
  }
}

export default AnalyticsDashboard;
