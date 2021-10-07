import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DoctorDashboard from "./doctor_dashboard";
import PatientDashboard from "./patient_dashboard";
import AdminDashboard from "./admin_dashboard";
import ClientAdminDashboard from "./client_admin_dashboard";

const Dashboard = (props) => {
  return props.userData.actor === "DOCTOR" ? (
    <DoctorDashboard />
  ) : props.userData.actor === "ADMIN" ? (
    <AdminDashboard />
  ) : (
    props.userData.actor === "STAFF" && <PatientDashboard />
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
  };
};
export default connect(mapStateToProps)(withRouter(Dashboard));
