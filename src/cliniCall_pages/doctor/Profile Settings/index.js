import React from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import { Settings, Link, Award, User, File } from "react-feather";
import Basic from "./Basic/index";
import Assistant from "./Assistant";
import Awards from "./Awards";
import Certificates from "./Certificates";
import ExperienceTab from "./Experience";
import QualificationTab from "./Qualification";
import CenterTab from "./Center";
import Medicines from "./Medicines";
import ScheduleTab from "./Schedule";
import Treatments from "./Treatments";
import WebSettings from "./WebSettings";
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb";
import { Icon } from "../../../components";
import {
  Experience,
  Qualification,
  Center,
  Schedule,
  Medicine,
  Treatment,
} from "../../../assets/icons";

import "../../../assets/scss/pages/account-settings.scss";
import "../../../assets/scss/plugins/extensions/maps.scss";

const Tab = (props) => {
  switch (props.activeTab) {
    case "1":
      return (
        <TabPane tabId={props.activeTab}>
          <Basic />
        </TabPane>
      );
    case "2":
      return (
        <TabPane tabId={props.activeTab}>
          <Assistant />
        </TabPane>
      );
    case "3":
      return (
        <TabPane tabId={props.activeTab}>
          <Awards />
        </TabPane>
      );
    case "4":
      return (
        <TabPane tabId={props.activeTab}>
          <Certificates />
        </TabPane>
      );
    case "5":
      return (
        <TabPane tabId={props.activeTab}>
          <ExperienceTab />
        </TabPane>
      );
    case "6":
      return (
        <TabPane tabId={props.activeTab}>
          <QualificationTab />
        </TabPane>
      );
    case "7":
      return (
        <TabPane tabId={props.activeTab}>
          <CenterTab />
        </TabPane>
      );
    case "8":
      return (
        <TabPane tabId={props.activeTab}>
          <ScheduleTab />
        </TabPane>
      );
    case "9":
      return (
        <TabPane tabId={props.activeTab}>
          <Medicines />
        </TabPane>
      );
    case "10":
      return (
        <TabPane tabId={props.activeTab}>
          <Treatments />
        </TabPane>
      );
    case "11":
      return (
        <TabPane tabId={props.activeTab}>
          <WebSettings />
        </TabPane>
      );
    default:
      return null;
  }
};

class AccountSettings extends React.Component {
  state = {
    activeTab: "1",
    windowWidth: null,
  };

  toggle = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  updateWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    if (window !== undefined) {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth);
    }
  }

  render() {
    let { windowWidth } = this.state;

    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Profile Settings"
          breadCrumbParent="Doctors"
          breadCrumbParentLink="/doctors"
          breadCrumbActive="Profile Settings"
        />
        <div
          className={`${
            windowWidth >= 769 ? "nav-vertical" : "account-setting-wrapper"
          }`}
        >
          <Nav
            className="account-settings-tab nav-left mr-0 mr-sm-3 scroll-x"
            tabs
          >
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <Settings size={16} />
                <h5
                  className={
                    this.state.activeTab === "1"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Basic
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <User size={16} />
                <h5
                  className={
                    this.state.activeTab === "2"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Assistant
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <Award size={16} />
                <h5
                  className={
                    this.state.activeTab === "3"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Awards
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "4",
                })}
                onClick={() => {
                  this.toggle("4");
                }}
              >
                <File size={16} />
                <h5
                  className={
                    this.state.activeTab === "4"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Certificates
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "5",
                })}
                onClick={() => {
                  this.toggle("5");
                }}
              >
                <Icon icon={Experience} width={16} height={16} />
                {/* <Link size={16} /> */}
                <h5
                  className={
                    this.state.activeTab === "5"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Experience
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "6",
                })}
                onClick={() => {
                  this.toggle("6");
                }}
              >
                <Icon icon={Qualification} width={16} height={16} />
                {/* <Bell size={16} /> */}
                <h5
                  className={
                    this.state.activeTab === "6"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Qualification
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "7",
                })}
                onClick={() => {
                  this.toggle("7");
                }}
              >
                <Icon icon={Center} width={16} height={16} />
                <h5
                  className={
                    this.state.activeTab === "7"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Center
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "8",
                })}
                onClick={() => {
                  this.toggle("8");
                }}
              >
                <Icon icon={Schedule} width={16} height={16} />
                <h5
                  className={
                    this.state.activeTab === "8"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Schedule
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "9",
                })}
                onClick={() => {
                  this.toggle("9");
                }}
              >
                <Icon icon={Medicine} width={16} height={16} />
                <h5
                  className={
                    this.state.activeTab === "9"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Medicines
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "10",
                })}
                onClick={() => {
                  this.toggle("10");
                }}
              >
                <Icon icon={Treatment} width={16} height={16} />
                <h5
                  className={
                    this.state.activeTab === "10"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Treatments
                </h5>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "11",
                })}
                onClick={() => {
                  this.toggle("11");
                }}
              >
                <Link size={16} />
                <h5
                  className={
                    this.state.activeTab === "11"
                      ? "align-middle ml-1"
                      : "d-md-inline-block d-none align-middle ml-1"
                  }
                >
                  Social Links
                </h5>
              </NavLink>
            </NavItem>
          </Nav>
          <Card>
            <CardBody>
              <TabContent activeTab={this.state.activeTab}>
                <Tab activeTab={this.state.activeTab} />
              </TabContent>
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default AccountSettings;
