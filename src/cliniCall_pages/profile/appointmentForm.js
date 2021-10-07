import React, { Component } from 'react'
import {
    Row,
    Label,
    Col,
} from "reactstrap";
import { InputField, DatePicker, TimePiker } from '../../components';
import Selection from '../../components/select';
import "flatpickr/dist/themes/light.css";

class AppointmentForm extends Component {

    render() {
        const {
            appointmentType,
            bookingDate,
            medicalCenter,
            treatmentType,
            appointmentOptions,
            medicalCenterOptions,
            treatmentOptions,
            bookingTime
        } = this.props
        return (
            <div>
                <h2 className="my-2">Book an Appointment</h2>
                <Selection
                    value={appointmentType}
                    name="appointmentType"
                    placeholder='Type'
                    label='Appointment type'
                    options={appointmentOptions || []}
                    onChange={this.props.handleAppointmentType}
                />
                <Selection
                    value={treatmentType}
                    name="treatmentType"
                    placeholder='Treatment'
                    label='treatmentType'
                    options={treatmentOptions}
                    onChange={this.props.handleTretType}
                />
                <div className='mt-1'>
                    <Selection
                        value={medicalCenter}
                        name="medicalCenter"
                        placeholder='Medical Center'
                        label='Medical center'
                        options={medicalCenterOptions}
                        onChange={this.props.handleMedicalCenter}
                        disabled={appointmentType.value === 'online' ? true : false}
                    />
                </div>
                <Label className="d-block">Booking date</Label>
                <DatePicker
                    value={bookingDate}
                    options={{
                        altInput: false,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                    }}
                    name="year"
                    onChange={this.props.handleDate}
                />
                <Label className="d-block">Booking time</Label>
                <TimePiker
                    className="form-control" options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                    }}
                    value={bookingTime}
                    onChange={this.props.handleBookingTime}
                />
            </div>
        )
    }
}

export default AppointmentForm