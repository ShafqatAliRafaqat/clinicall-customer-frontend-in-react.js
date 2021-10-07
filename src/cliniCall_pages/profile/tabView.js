import React from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardBody,
  Card,
  CardHeader,
  CardTitle,
  Button,
  CardSubtitle,
} from "reactstrap";
import classnames from "classnames";

const calculateEx = (date) => {
  date = date.split("-");
  let d = new Date();
  let n = d.getFullYear();
  return n - date[0];
};

const populateQualification = (qual) => {
  var qualification = "";
  qual.map((item) => {
    qualification = qualification.concat(`${item.title}, `);
  });
  return qualification.slice(0, -2);
};
const AboutTab = (props) => {
  return (
    <div>
      <div className="m-3">
        <h3>{`${props.data.title}. ${props.data.full_name}`}</h3>
        <p className="mb-0">
          {populateQualification(props.data.doctor_qualification)}
        </p>
        <p>{props.data.speciality}</p>

          <div xs="12" className='mt-2'>
            <p>
              <i className="fas fa-briefcase-medical text-primary profileIcon"></i>{" "}
              <span className="iconText">{props.data.pmdc}</span>
            </p>
          </div>
          <div xs="12">
            <p>
              <i className="fas fa-calendar text-primary profileIcon"></i>{" "}
              <span className="iconText">
                Monday to Saturday 12:00pm to 09:00PM
              </span>
            </p>
          </div>
        <div xs="12">
            <p>
              <i className="fas fa-venus-mars text-primary profileIcon"></i>{" "}
              <span className="iconText">{props.data.gender}</span>
            </p>
          </div>
          <div xs="12">
            <p>
              <i className="fas fa-envelope text-primary profileIcon"></i>{" "}
              <span className="iconText">{props.data.email}</span>
            </p>
          </div>
        <div xs="12">
            <p>
              <i className="fas fa-user-clock text-primary profileIcon"></i>
              {calculateEx(props.data.practice_start_year) < 1 ? (
                <span className="iconText">less than a year</span>
              ) : (
                <span className="iconText">Years Experience</span>
              )}
            </p>
          </div>
          <div xs="12">
            <p>
              <i className="fas fa-phone text-primary profileIcon"></i>{" "}
              <span className="iconText">{props.data.phone}</span>
            </p>
          </div>
        <p>{props.data.about}</p>
      </div>
    </div>
  );
};

const LocationTab = (props) => {
  const { data } = props;
  return (
    <div>
      <h2 className="my-2">Location</h2>
      <div className="mt-3">
        {data.doctor_center.map((center) => {
          return (
            <Card className="card-action" key={center.id}>
              <CardHeader className="py-0">
                <CardTitle className="text-primary">{center.name}</CardTitle>
              </CardHeader>
              <CardBody className="p-1">
                <Row>
                  <Col md="8">
                    <p>
                      <i className="fas fa-map-marker-alt text-primary profileIconSize" />{" "}
                      {center.address}
                    </p>
                  </Col>
                  <Col md="4" className="text-center">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="btn-block mx-auto"
                    >
                      <a
                        style={{ color: "white" }}
                        href={`https://www.google.com/maps?q=${center.lat},${center.lng}`}
                        target="_blank"
                      >
                        <i className="fas fa-map-marker-alt profileIconSize" />
                        View on map
                      </a>
                    </Button.Ripple>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const QualificationTab = (props) => {
  const { data } = props;
  return (
    <div>
      <h2>Qualification</h2>
      {!data.doctor_qualification.length ? (
        <div className="m-3">No qualification availible</div>
      ) : (
        <div className="m-3">
          {data.doctor_qualification.map((item) => {
            return (
              <Card className="card-action" key={item.id}>
                <CardHeader className="py-0">
                  <CardTitle className="text-primary">
                    <i className="fas fa-graduation-cap text-primary" />{" "}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-1">
                  <CardSubtitle className="fontSizeDate mt-0">
                    From: {item.start_year} To: {item.end_year}
                  </CardSubtitle>
                  <p>Institute: {item.university} </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CertificationTab = (props) => {
  const { data } = props;
  return (
    <div>
      <h2 className="my-2">Certification</h2>
      {!data.doctor_certification.length ? (
        <div className="m-3">No certification availible</div>
      ) : (
        <div className="m-3">
          {data.doctor_certification.map((item) => {
            return (
              <Card className="card-action" key={item.id}>
                <CardHeader className="py-0">
                  <CardTitle className="text-primary">
                    <i className="fas fa-award text-primary" /> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-1">
                  <CardSubtitle className="fontSizeDate mt-0">
                    Year: {item.completed_year}
                  </CardSubtitle>
                  <p>Institute: {item.institute}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AwardTab = (props) => {
  const { data } = props;
  return (
    <div>
      <h2 className="my-2">Awards</h2>
      {!data.doctor_award.length ? (
        <div className="m-3">No awards availible</div>
      ) : (
        <div className="m-3">
          {data.doctor_award.map((award) => {
            return (
              <Card className="card-action" key={award.id}>
                <CardHeader className="py-0">
                  <CardTitle className="text-primary">
                    <i className="fas fa-trophy text-primary" /> {award.name}
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-1">
                  <p>Year: {award.year}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ExpereinceTab = (props) => {
  const { data } = props;
  return (
    <div>
      <h2 className="my-2">Expereince</h2>
      {!data.doctor_experience.length ? (
        <div className="m-3">No expereince availible</div>
      ) : (
        <div className="m-3">
          {data.doctor_experience.map((item) => {
            return (
              <Card className="card-action" key={item.id}>
                <CardHeader className="py-0">
                  <CardTitle className="text-primary">
                    <i className="fas fa-briefcase text-primary" />{" "}
                    {item.designation} at {item.institute}
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-1">
                  <CardSubtitle className="fontSizeDate mt-0">
                    From: {item.year_from} To: {item.year_to}
                  </CardSubtitle>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "1",
    };
  }
  toggle = (tab) => {
    if (this.state.active !== tab) {
      this.setState({ active: tab });
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div className="mt-3">
        <Card>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "1",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  About
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "2",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  Location
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "3",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("3");
                  }}
                >
                  Qualification
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "4",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("4");
                  }}
                >
                  Certification
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "5",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("5");
                  }}
                >
                  Awards
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      active: this.state.active === "6",
                    },
                    "profileIconSize"
                  )}
                  onClick={() => {
                    this.toggle("6");
                  }}
                >
                  Expereince
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.active}>
              <TabPane tabId="1">
                <AboutTab data={data} />
              </TabPane>
              <TabPane tabId="2">
                <LocationTab data={data} />
              </TabPane>
              <TabPane tabId="3">
                <QualificationTab data={data} />
              </TabPane>
              <TabPane tabId="4">
                <CertificationTab data={data} />
              </TabPane>
              <TabPane tabId="5">
                <AwardTab data={data} />
              </TabPane>
              <TabPane tabId="6">
                <ExpereinceTab data={data} />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Posts;
