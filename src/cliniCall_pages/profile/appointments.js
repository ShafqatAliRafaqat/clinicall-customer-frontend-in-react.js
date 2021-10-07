import React, { Component } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import Wizard from "../../components/wizard";
import AppointmentForm from "./appointmentForm";
import PatientSignUp from "./patientSignUp";
import { InputField } from "../../components";
import EasypaisaLogo from "../../assets/img/icons/easypaisa_logo.png";
import JazzCash from "../../assets/img/icons/jazz_cash.png";
import MasterCard from "../../assets/img/icons/master_card.png";
import { sendDateFormat, formatTime } from "../../utils";
import FlashMessage from "../../components/flashMessageList";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AuthenticationModal from "./modal";

const PasscodeCom = (props) => {
  return (
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }}>
        <InputField
          type="password"
          placeholder="Enter Passcode"
          value={props.passcode}
          name="passcode"
          label="Passcode"
          onChange={props.handleChangeText}
        />
      </Col>
    </Row>
  );
};

const PaymentMethodCom = (props) => {
  return (
    <Row>
      <Col sm="12" md={{ size: 7, offset: 3 }}>
        <Row>
          <Col
            xs="4"
            style={
              props.paymentMethod === "easypaisa"
                ? { border: "2px solid #204593", borderRadius: "5px" }
                : {}
            }
          >
            <img
              src={EasypaisaLogo}
              onClick={() => props.selectPayMethod("easypaisa")}
            />
          </Col>
          <Col
            xs="4"
            className="pl-0"
            style={
              props.paymentMethod === "jazzcash"
                ? { border: "2px solid #204593", borderRadius: "5px" }
                : {}
            }
          >
            <img
              src={JazzCash}
              className="mt-1"
              onClick={() => props.selectPayMethod("jazzcash")}
            />
          </Col>
          <Col
            xs="4"
            style={
              props.paymentMethod === "mastercard"
                ? { border: "2px solid #204593", borderRadius: "5px" }
                : {}
            }
          >
            <img
              src={MasterCard}
              className="mt-1"
              onClick={() => props.selectPayMethod("mastercard")}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const AccountPayInfo = (props) => {
  return (
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }}>
        <InputField
          type="text"
          placeholder="Enter Account Number"
          value={props.accountNumber}
          name="accountNumber"
          label="Account Number"
          onChange={props.handleChangeText}
        />
      </Col>
    </Row>
  );
};
const DisplayInfo = (props) => {
  return (
    props.accountNumber && (
      <div>
        <Row className="my-2">
          <Col xs="6" className="my-2">
            Patient Name: <b>{props.patientName}</b>
          </Col>
          <Col xs="6" className="my-2">
            Appointment Type: <b>{props.appointmentType.label}</b>
          </Col>
          <Col xs="6" className="my-2">
            Booking Date: <b>{sendDateFormat(props.bookingDate)}</b>
          </Col>
          {props.appointmentType.value !== "online" && (
            <Col xs="6" className="my-2">
              Medical Center: <b>{props.medicalCenter.label}</b>
            </Col>
          )}
          <Col xs="6" className="my-2">
            Booking Time: <b>{formatTime(props.bookingTime)}</b>
          </Col>
          <Col xs="6" className="my-2">
            Treatment Type: <b>{props.treatmentType.label}</b>
          </Col>
          <Col xs="6" className="my-2">
            Account Number: <b>{props.accountNumber}</b>
          </Col>
        </Row>
        <Row>
          <Col xs="6" className="my-2">
            Payment Method:
          </Col>
          <Col xs="6" className="my-2">
            {props.paymentMethod === "easypaisa" && <img src={EasypaisaLogo} />}
            {props.paymentMethod === "jazzcash" && (
              <img src={JazzCash} className="mt-1" />
            )}
            {props.paymentMethod === "mastercard" && (
              <img src={MasterCard} className="mt-1" />
            )}
          </Col>
        </Row>
      </div>
    )
  );
};

class Appointments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appointmentType: "",
      bookingDate: new Date(),
      bookingTime: new Date(),
      medicalCenter: "",
      treatmentType: "",
      phone: "",
      password: "",
      passcode: "",
      accountNumber: "",
      appointmentOptions: [
        { value: "physical", label: "Physical" },
        { value: "online", label: "Online" },
      ],
      medicalCenterOptions: [
        { value: "Lahore CMH", label: "Lahore CMH" },
        {
          value: "National Hospital, Lahore",
          label: "National Hospital, Lahore",
        },
      ],
      treatmentOptions: [
        { value: "eye infection", label: "Eye Infection" },
        { value: "ENT", label: "ENT" },
        { value: "dentistry", label: "Dentistry" },
      ],
      modal: false,
    };
  }
  handleChangeText = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleAppointmentType = (selectedOption) => {
    if (selectedOption.value === "online") {
      this.setState({ medicalCenter: "" });
    }
    this.setState({ appointmentType: selectedOption });
  };
  handleDate = (selectedOption) => {
    this.setState({ bookingDate: selectedOption[0] });
  };
  handleMedicalCenter = (selectedOption) => {
    this.setState({ medicalCenter: selectedOption });
  };
  handleTretType = (selectedOption) => {
    this.setState({ treatmentType: selectedOption });
  };
  handleBookingTime = (selectedOption) => {
    this.setState({ bookingTime: selectedOption[0] }, () => {
      console.log(formatTime(this.state.bookingTime));
    });
  };
  selectPayMethod = (selectedValue) => {
    this.setState({ paymentMethod: selectedValue });
  };
  validateFormOne = () => {
    let {
      appointmentType,
      bookingDate,
      medicalCenter,
      treatmentType,
      bookingTime,
    } = this.state;

    if (!appointmentType) {
      this.props.addFlashMessage({
        type: "error",
        text: "Appointment type is required",
      });
    } else if (!treatmentType) {
      this.props.addFlashMessage({
        type: "error",
        text: "Treatment type is required",
      });
    } else if (!bookingDate) {
      this.props.addFlashMessage({
        type: "error",
        text: "Booking date is required",
      });
    } else if (!medicalCenter && appointmentType.value !== "online") {
      this.props.addFlashMessage({
        type: "error",
        text: "Medical Center is required",
      });
    } else if (!bookingTime) {
      this.props.addFlashMessage({
        type: "error",
        text: "Booking time is required",
      });
    } else {
      this.toggleModal();
    }
  };
  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
      appointmentType,
      bookingDate,
      medicalCenter,
      treatmentType,
      appointmentOptions,
      medicalCenterOptions,
      treatmentOptions,
      bookingTime,
      phone,
      password,
      passcode,
      paymentMethod,
      accountNumber,
      modal,
    } = this.state;

    return (
      <div className="mt-3">
        <Card>
          <CardBody>
            <AppointmentForm
              appointmentType={appointmentType}
              bookingDate={bookingDate}
              medicalCenter={medicalCenter}
              treatmentType={treatmentType}
              appointmentOptions={appointmentOptions}
              medicalCenterOptions={medicalCenterOptions}
              treatmentOptions={treatmentOptions}
              bookingTime={bookingTime}
              handleChangeText={this.handleChangeText}
              handleAppointmentType={this.handleAppointmentType}
              handleDate={this.handleDate}
              handleMedicalCenter={this.handleMedicalCenter}
              handleTretType={this.handleTretType}
              handleBookingTime={this.handleBookingTime}
            />
            <div className="text-center d-block mb-1">
              <Button.Ripple
                color="primary"
                type="submit"
                className="px-75 btn-block"
                onClick={this.validateFormOne}
              >
                Book Appointment
              </Button.Ripple>
            </div>
          </CardBody>
        </Card>
        <FlashMessage />
        <AuthenticationModal
          modal={modal}
          phone={phone}
          data={this.props.data}
          handleChange={this.handleChange}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    flashMessages: state.flashMessages,
  };
};

export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Appointments));
