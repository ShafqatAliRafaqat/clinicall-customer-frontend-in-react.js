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

class OnboardDoctors extends React.Component {
  render() {
    return (
      <div className="p-2">
        {/* <Card>
        <CardHeader>
          <CardTitle> Dispatched Orders </CardTitle>
        </CardHeader> */}
        <h4>Onboard Doctors</h4>
        <Table
          responsive
          className="dashboard-table table-hover-animation mb-0 mt-1 p-1"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th> Speciality </th> <th> Total Patients </th>
              <th> Total Revenue </th>
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
              <td className="p-1">ENT Specialist</td>
              <td> 221 </td>
              <td>50,000 Rs</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar2}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Bilal</span>
              </td>
              <td className="p-1">ENT Specialist</td>
              <td> 450 </td>
              <td>99,000 Rs</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar3}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Aliya</span>
              </td>
              <td className="p-1">ENT Specialist</td>
              <td> 784 </td>
              <td>89,000 Rs</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar4}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Alisha</span>
              </td>
              <td className="p-1">ENT Specialist</td>
              <td> 341 </td>
              <td>57,000 Rs</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar5}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Zeeshan</span>
              </td>
              <td className="p-1">ENT Specialist</td>
              <td> 254 </td>
              <td>70,000 Rs</td>
            </tr>
            <tr>
              <td className="d-flex">
                <Avatar
                  height={20}
                  width={20}
                  className=" my-0"
                  src={avatar6}
                  alt=""
                />
                <span className="mt-sm-6 ml-1"> Rabia</span>
              </td>
              <td className="p-1">ENT Specialist</td>
              <td> 456 </td>
              <td>45,000 Rs</td>
            </tr>
          </tbody>
        </Table>
        {/* </Card> */}
      </div>
    );
  }
}
export default OnboardDoctors;
