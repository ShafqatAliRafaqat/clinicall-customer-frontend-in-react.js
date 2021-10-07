import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { HorizontalBar } from "react-chartjs-2";

const $primary = "#204593",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $label_color = "#1E1E1E",
  grid_line_color = "#dae1e7";
const themeColors = [$primary, $warning, $success, $label_color, $danger];

const data = {
  labels: [
    "ENT examination",
    "Audiometric testing",
    "Nasal endoscopy",
    "Allergy testing",
    "CT scan",
  ],
  datasets: [
    {
      label: "No. of Prescriptions",
      data: [2478, 784, 5267, 734, 433],
      backgroundColor: themeColors,
      borderColor: "transparent",
    },
  ],
};

const options = {
  elements: {
    rectangle: {
      borderWidth: 2,
      borderSkipped: "right",
    },
  },
  responsive: true,
  responsiveAnimationDuration: 500,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        },
      },
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        },
      },
    ],
  },
  title: {
    display: true,
    text: "Top 5 Lab Tests Prescripted",
  },
  legend: {
    display: false,
  },
};

class LabTest extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lab Test</CardTitle>
        </CardHeader>
        <CardBody>
          <HorizontalBar data={data} options={options} height={300} />
        </CardBody>
      </Card>
    );
  }
}
export default LabTest;
