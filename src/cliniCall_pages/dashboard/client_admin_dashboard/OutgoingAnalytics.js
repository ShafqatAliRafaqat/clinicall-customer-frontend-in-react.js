import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";
import { DollarSign } from "react-feather";
import { ordersReceived, ordersReceivedSeries } from "./StatisticsData";

class StatisticsCards extends React.Component {
  render() {
    return (
      <Card>
        <CardBody
          className={`${
            this.props.className ? this.props.className : "stats-card-body"
          } d-flex ${
            !this.props.iconRight && !this.props.hideChart
              ? "flex-column align-items-start"
              : this.props.iconRight
              ? "justify-content-between flex-row-reverse align-items-center"
              : this.props.hideChart && !this.props.iconRight
              ? "justify-content-center flex-column text-center"
              : null
          } ${!this.props.hideChart ? "pb-0" : "pb-2"} pt-2`}
        >
          <div className="icon-section">
            <div
              className={`avatar avatar-stats p-50 m-0 ${
                this.props.iconBg
                  ? `bg-rgba-${this.props.iconBg}`
                  : "bg-rgba-primary"
              }`}
            >
              <div className="avatar-content">
                <DollarSign className="primary" size={22} />
              </div>
            </div>
          </div>
          <div className="title-section">
            <h2 className="text-bold-600 mt-1 mb-25">32.6k</h2>
            <p className="mb-0">Outgoing Payment</p>
          </div>
        </CardBody>
        {!this.props.hideChart && (
          <Chart
            options={ordersReceived}
            series={ordersReceivedSeries}
            type="area"
            height={this.props.height ? this.props.height : 100}
          />
        )}
      </Card>
    );
  }
}
export default StatisticsCards;
