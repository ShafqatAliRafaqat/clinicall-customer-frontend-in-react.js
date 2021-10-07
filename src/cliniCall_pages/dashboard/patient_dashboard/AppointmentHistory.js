import React from "react";
import { Row, Col, Progress } from "reactstrap";

class AvgSessions extends React.Component {
  state = {
    options: {
      chart: {
        sparkline: { enabled: true },
        toolbar: { show: false },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: [
        this.props.labelColor,
        this.props.labelColor,
        this.props.primary,
        this.props.labelColor,
        this.props.labelColor,
        this.props.labelColor,
      ],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          endingShape: "rounded",
        },
      },
      tooltip: {
        x: { show: false },
      },
      xaxis: {
        type: "numeric",
      },
    },
    series: [
      {
        name: "Sessions",
        data: [75, 125, 225, 175, 125, 75, 25],
      },
    ],
  };
  render() {
    return (
      <div className="p-2">
        <h4>Appointment History</h4>
        <Row className="pt-50 px-1">
          <Col md="6" sm="12">
            <p className="mb-0">Approved: 100000</p>
            <Progress className="mt-25" value="50" />
          </Col>
          <Col md="6" sm="12">
            <p className="mb-0">Upcoming: 100K</p>
            <Progress className="mt-25" color="warning" value="60" />
          </Col>
          <Col md="6" sm="12">
            <p className="mb-0">Pending: 90</p>
            <Progress className="mt-25" color="danger" value="70" />
          </Col>
          <Col md="6" sm="12">
            <p className="mb-0">Ongoing: 10000</p>
            <Progress className="mt-25" color="success" value="80" />
          </Col>
        </Row>
      </div>
    );
  }
}
export default AvgSessions;
