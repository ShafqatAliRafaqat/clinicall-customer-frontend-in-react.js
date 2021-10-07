import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { Award } from "react-feather";

import decorLeft from "../../../assets/img/good_morning_image.png";
import decorRight from "../../../assets/img/elements/decore-right.png";

class SalesCard extends React.Component {
  render() {
    return (
      <Card
        className="bg-analytics text-white sales-card bg-white"
        style={{
          backgroundImage: `url(${decorLeft})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <CardBody className="text-center">
          {/* <img src={decorLeft} alt="card-img-left" className="img-left" /> */}
          {/* <img src={decorRight} alt="card-img-right" className="img-right" /> */}
          <div className="mt-4"></div>
          <div className="award-info text-center">
            <h1 className="mb-2 text-white">
              <strong className="text-primary"> Good Morning </strong>
              <strong className="text-dark">Doctor</strong>
            </h1>
            <p className="m-auto mb-0 w-75 text-dark">
              <strong> Have a nice day at work</strong>
            </p>
          </div>
          <div className="text-center mt-2">
            <Button color="primary">+ Add Patient</Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}
export default SalesCard;
