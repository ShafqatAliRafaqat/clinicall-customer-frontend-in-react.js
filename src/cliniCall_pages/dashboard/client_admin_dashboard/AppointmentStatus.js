import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import Chart from "react-apexcharts";
import { Circle } from "react-feather";

let $primary = "#204593",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $label_color_light = "#202020";

let themeColors = [
  $primary,
  $success,
  $danger,
  $warning,
  $info,
  $label_color_light,
  "#694EFE",
];

class AppointmentStatus extends React.Component {
  state = {
    options: {
      colors: themeColors,
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return 24900;
              },
            },
          },
        },
      },
      labels: [
        "Cancelled by Doctor",
        "Cancelled by Patient",
        "Rescheduled by Doctor",
        "Appointment Refunds",
        "Upcoming",
        "Pending",
        "Active",
      ],
    },
    series: [44, 55, 67, 83, 93, 54, 67],
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments Status</CardTitle>
        </CardHeader>
        <CardBody>
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            height={350}
          />
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color="#694EFE" />
              <span className="text-bold-600 ml-50">Active</span>
            </div>
            <div className="series-result">
              <span className="align-middle">16043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$label_color_light} />
              <span className="text-bold-600 ml-50">Pending</span>
            </div>
            <div className="series-result">
              <span className="align-middle">11043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$info} />
              <span className="text-bold-600 ml-50">Upcoming</span>
            </div>
            <div className="series-result">
              <span className="align-middle">15043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$warning} />
              <span className="text-bold-600 ml-50">Appointment Refunds</span>
            </div>
            <div className="series-result">
              <span className="align-middle">18043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$danger} />
              <span className="text-bold-600 ml-50">Rescheduled By Doctor</span>
            </div>
            <div className="series-result">
              <span className="align-middle">26043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$success} />
              <span className="text-bold-600 ml-50">Cancelled By Patient</span>
            </div>
            <div className="series-result">
              <span className="align-middle">22043</span>
            </div>
          </div>
          <div className="chart-info d-flex justify-content-between mb-1">
            <div className="series-info d-flex align-items-center">
              <Circle strokeWidth={5} size="12" color={$primary} />
              <span className="text-bold-600 ml-50">Cancelled By Doctor</span>
            </div>
            <div className="series-result">
              <span className="align-middle">23043</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}
export default AppointmentStatus;
