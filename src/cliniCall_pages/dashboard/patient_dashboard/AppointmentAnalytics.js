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
        "Unpaid",
        "Paid",
      ],
    },
    series: [45, 55],
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardBody>
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            height={350}
          />
        </CardBody>
      </Card>
    );
  }
}
export default AppointmentStatus;
