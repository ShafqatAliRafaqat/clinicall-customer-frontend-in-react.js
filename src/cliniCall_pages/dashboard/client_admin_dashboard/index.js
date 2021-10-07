import React from "react";
import { Row, Col, Card } from "reactstrap";
import Analytics from "./Analytics";
import AppointmentStatus from "./AppointmentStatus";
import Medicines from "./Medicine";
import LabTest from "./LabTest";
import TotalRevenue from "./TotalRevenue";
import OnboardDoctors from "./OnboardDoctors";
import "../../../assets/scss/pages/dashboard-analytics.scss";
import { DollarSign, File, User, Users, X } from "react-feather";

class AnalyticsDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row className="match-height">
          <Col lg="3" md="12">
            <Analytics
              hideChart
              iconRight
              iconBg="danger"
              icon={<User className="danger" size={22} />}
              stat="786"
              statTitle="Doctors"
            />
          </Col>
          <Col lg="3" md="6" sm="12">
            <Analytics
              hideChart
              iconRight
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat="1577"
              statTitle="Patients"
            />
          </Col>
          <Col lg="3" md="6" sm="12">
            <Analytics
              hideChart
              iconRight
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat="550k"
              statTitle="Revenue"
            />
          </Col>
          <Col lg="3" md="6" sm="12">
            <Analytics
              hideChart
              iconRight
              iconBg="info"
              icon={<File className="info" size={22} />}
              stat="2700"
              statTitle="Appointments"
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col md="7" sm="12">
            <Card>
              {/* <AppointmentHistory
                labelColor={$label_color}
                primary={$primary}
              />
              <hr /> */}
              <OnboardDoctors />
            </Card>
          </Col>
          <Col md="5" sm="12">
            <TotalRevenue />
          </Col>
        </Row>
        <Row className="match-height">
          <Col md="7" sm="12">
            <Card>
              <AppointmentStatus />
            </Card>
          </Col>
          <Col md="5" sm="12">
            <div>
              <Medicines />
            </div>
            <div>
              <LabTest />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default AnalyticsDashboard;
