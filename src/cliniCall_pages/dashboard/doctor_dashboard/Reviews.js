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
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="activity-timeline list-unstyled">
            <li className="border-bottom my-2 py-1">
              <Row>
                <Col lg="2">
                  <Avatar
                    style={{ width: "45px", height: "45px" }}
                    className="mx-auto my-0"
                    src={avatar3}
                    alt=""
                  />
                </Col>
                <Col lg="10">
                  <h5>Ayesha</h5>
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
                  <p>
                    Great Doctor.He is very knowledgable and he has a great
                    sense of humor! I will refer my entire family to him.
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
            <li className="border-bottom my-2 py-1">
              <Row>
                <Col lg="2">
                  <Avatar
                    style={{ width: "45px", height: "45px" }}
                    className="mx-auto my-0"
                    src={avatar2}
                    alt=""
                  />
                </Col>
                <Col lg="10">
                  <h5>Ikrama</h5>
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
                        <i class="far fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Dr. was smart and respectful. In my opinion most important
                    things when it comes to this kind of medical care.
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col lg="2">
                  <Avatar
                    style={{ width: "45px", height: "45px" }}
                    className="mx-auto my-0"
                    src={avatar1}
                    alt=""
                  />
                </Col>
                <Col lg="10">
                  <h5>Alisha</h5>
                  <div className="d-flex justify-content-between">
                    <ul className="unstyled-list list-inline ratings-list mb-0">
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="fas fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                      <li className="ratings-list-item">
                        <i class="far fa-star text-warning"></i>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Was very professional and asked a lot of questions. Also was
                    able to answer all of my questions as well. Very nice guy!
                  </p>
                  <small className="text-muted float-right">25 mins ago</small>
                </Col>
              </Row>
            </li>
          </ul>
        </CardBody>
      </Card>
    );
  }
}
export default Reviews;
