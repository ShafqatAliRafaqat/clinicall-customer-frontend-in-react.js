import React from "react";
import { Avatar } from "@material-ui/core";
import coverImg from "../../assets/img/profile/user-uploads/user-cover.png";

class ProfileHeader extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  render() {
    const { data } = this.props;
    return (
      <div className="profile-header mb-2">
        <div className="position-relative">
          <div className="cover-container">
            <img
              src={!data.banner ? coverImg : data.banner}
              alt="CoverImg"
              className="cover-image bg-cover w-100 rounded-0"
            />
          </div>
          <div className="profile-img-container d-flex align-items-center justify-content-between">
            <Avatar
              style={{
                width: "140px",
                height: "140px",
              }}
              className="my-0 img-fluid"
              src={data.image}
              alt=""
            />
          </div>
        </div>
      </div>
    );
  }
}
export default ProfileHeader;
