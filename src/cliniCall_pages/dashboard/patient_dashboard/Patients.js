import React, { useState } from "react";
import { Table } from "reactstrap";
import { Avatar } from "@material-ui/core";
import avatar1 from "../../../assets/img/portrait/small/avatar-s-5.jpg";
import avatar2 from "../../../assets/img/portrait/small/avatar-s-7.jpg";
import avatar3 from "../../../assets/img/portrait/small/avatar-s-6.jpg";
import avatar4 from "../../../assets/img/portrait/small/avatar-s-3.jpg";
import avatar5 from "../../../assets/img/portrait/small/avatar-s-4.jpg";
import avatar6 from "../../../assets/img/portrait/small/avatar-s-2.jpg";
import { Link } from "react-router-dom";

const TodayAppointments = (props) => {
  return (
    <div className="p-2">
      {/* <Card>
        <CardHeader>
          <CardTitle> Dispatched Orders </CardTitle>
        </CardHeader> */}
      <h4>Patients</h4>
      <Table
        responsive
        className="dashboard-table table-hover-animation mb-0 mt-1 p-1"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th> Gender </th> <th> Phone </th>
            <th> City </th>
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
            <td> Male</td>
            <td> 03068016170 </td>
            <td>Lahore</td>
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
            <td className="p-1">Male</td>
            <td> 03068016171 </td>
            <td>Lahore</td>
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
              <span className="mt-sm-6 ml-1"> Duaa</span>
            </td>
            <td className="p-1">Female</td>
            <td> 03068016172 </td>
            <td>Lahore</td>
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
              <span className="mt-sm-6 ml-1"> Shafqat</span>
            </td>
            <td className="p-1">Male</td>
            <td> 03068016173 </td>
            <td>Lahore</td>
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
              <span className="mt-sm-6 ml-1"> Iqra</span>
            </td>
            <td className="p-1">Female</td>
            <td> 03068016174 </td>
            <td>Lahore</td>
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
              <span className="mt-sm-6 ml-1"> Ayesha</span>
            </td>
            <td className="p-1">Female</td>
            <td> 03068016175 </td>
            <td>Lahore</td>
          </tr>
        </tbody>
      </Table>
      {/* </Card> */}
    </div>
  );
};

export default TodayAppointments;
