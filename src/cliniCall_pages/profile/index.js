import React from "react";
import { Row, Col } from "reactstrap";
import ProfileHeader from "./ProfileHeader";
import TabView from "./tabView";
import LoginBox from "./loginBox";
import "../../assets/scss/pages/users-profile.scss";
import { apiCall } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import Appointments from "./appointments";
import Footer from "./footer";

class Profile extends React.Component {
  state = {
    isLoading: true,
    data: {},
  };

  componentDidMount() {
    this.getDoctorInfo(this.props.match.params.dr);
  }

  getDoctorInfo = async (url) => {
    try {
      const res = await apiCall(
        "get",
        `/landing/${url}`,
        undefined,
        this.state.token
      );
      this.setState({ isLoading: false, data: res.data.data });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { isLoading, data } = this.state;
    return (
      <React.Fragment>
        {isLoading ? (
          <Spinner />
        ) : (
          <div id="user-profile">
            <Row>
              <Col sm="12" className="px-0">
                <ProfileHeader data={data} />
              </Col>
            </Row>
            <div id="profile-info" className="px-2">
              <Row>
                <Col lg="8" md="12">
                  <TabView data={data} />
                </Col>
                <Col lg="4" md="12">
                  <Appointments data={data} />
                  {/* <LoginBox /> */}
                </Col>
              </Row>
            </div>
            <Footer />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Profile;
