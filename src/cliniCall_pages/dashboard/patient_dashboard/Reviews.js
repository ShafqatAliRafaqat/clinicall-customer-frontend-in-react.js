import React from "react";
import { Card, CardHeader, CardTitle, CardBody, Col, Row } from "reactstrap";
import { Star } from "react-feather";
import { Avatar } from "@material-ui/core";
import avatar1 from "../../../assets/img/portrait/small/avatar-s-6.jpg";
import avatar2 from "../../../assets/img/portrait/small/avatar-s-3.jpg";
import avatar3 from "../../../assets/img/portrait/small/avatar-s-4.jpg";

class Reviews extends React.Component {
  render() {
    return (
      <React.Fragment>
      {/* <Card>
        <CardBody className="p-0"> */}
          <h5>Reviews</h5>
          <ul className="activity-timeline list-unstyled">
            <li className="border-bottom">
              <Row>
                <Col lg="2" className="p-0">
                  <Avatar
                    className="mx-auto my-0"
                    src={avatar3}
                    alt=""
                  />
                </Col>
                <Col lg="10" className="p-0">
                  <p className="mb-0">Ayesha</p>
                  <div className="d-flex justify-content-between">
                    <ul className="unstyled-list list-inline ratings-list mb-0">
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                    </ul>
                  </div>
                  <p className="reviewFont mb-0" >
                    Lorem Ipsum is simply dummy text of the printing ...
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
            <li className="border-bottom">
            <Row>
                <Col lg="2" className="p-0">
                  <Avatar
                    className="mx-auto my-0"
                    src={avatar3}
                    alt=""
                  />
                </Col>
                <Col lg="10" className="p-0">
                  <p className="mb-0">Ayesha</p>
                  <div className="d-flex justify-content-between">
                    <ul className="unstyled-list list-inline ratings-list mb-0">
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                    </ul>
                  </div>
                  <p className="reviewFont mb-0" >
                    Lorem Ipsum is simply dummy text of the printing ...
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
            <li>
            <Row>
                <Col lg="2" className="p-0">
                  <Avatar
                    className="mx-auto my-0"
                    src={avatar3}
                    alt=""
                  />
                </Col>
                <Col lg="10" className="p-0">
                  <p className="mb-0">Ayesha</p>
                  <div className="d-flex justify-content-between">
                    <ul className="unstyled-list list-inline ratings-list mb-0">
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                    </ul>
                  </div>
                  <p className="reviewFont mb-0" >
                    Lorem Ipsum is simply dummy text of the printing ...
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
          </ul>
        {/* </CardBody>
      </Card> */}
      </React.Fragment>
    );
  }
}
export default Reviews;
