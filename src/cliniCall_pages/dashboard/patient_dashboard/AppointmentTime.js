import React from "react";
import { Table } from "reactstrap";
import { Avatar } from "@material-ui/core";
import avatar1 from "../../../assets/img/portrait/small/avatar-s-5.jpg";
import avatar2 from "../../../assets/img/portrait/small/avatar-s-7.jpg";
import avatar3 from "../../../assets/img/portrait/small/avatar-s-10.jpg";
import avatar4 from "../../../assets/img/portrait/small/avatar-s-8.jpg";
import avatar5 from "../../../assets/img/portrait/small/avatar-s-1.jpg";
import avatar6 from "../../../assets/img/portrait/small/avatar-s-2.jpg";
import avatar7 from "../../../assets/img/portrait/small/avatar-s-3.jpg";
import avatar8 from "../../../assets/img/portrait/small/avatar-s-4.jpg";

class AppointmentTime extends React.Component {
  render() {
    return (
      <div className="p-2">
        <h4>Appointment</h4>
        <Table
          responsive
          className="dashboard-table table-hover-animation mb-0 mt-1 p-1"
        >
          <thead>
            <tr>
              <th>Treatment Type</th>
              <th> Appint. Type </th>
              <th> Time </th>
              <th> Date </th>
              <th> Status </th>
              <th> Fee </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar1}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Ali</span>
              </td>
              <td className="p-1">Physical</td>
              <td> 07:15 PM </td>
              <td>28-11-2020</td>
              <td>
                <div
                  className="bg-success"
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                />
                <span> Active </span>
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  // style={{
                  //   width: "65px",
                  //   height: "65px",
                  // }}
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar2}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Bilal</span>
              </td>
              <td className="p-1">Online</td>
              <td> 07:30 PM </td>
              <td>28-11-2020</td>
              <td>
                <div
                  className="bg-danger"
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                />
                <span> Inactive </span>
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar1}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Ali</span>
              </td>
              <td className="p-1">Physical</td>
              <td> 07:15 PM </td>
              <td>28-11-2020</td>
              <td>
                <div
                  className="bg-success"
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                />
                <span> Active </span>
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar1}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Ali</span>
              </td>
              <td className="p-1">Physical</td>
              <td> 07:15 PM </td>
              <td>28-11-2020</td>
              <td>
                <div
                  className="bg-success"
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                />
                <span> Active </span>
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar1}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Ali</span>
              </td>
              <td className="p-1">Physical</td>
              <td> 07:15 PM </td>
              <td>28-11-2020</td>
              <td>
                <div
                  className="bg-success"
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                />
                <span> Active </span>
              </td>
              <td>1500</td>
            </tr>
          </tbody>
        </Table>
        {/* </Card> */}
      </div>
    );
  }
}
export default AppointmentTime;
