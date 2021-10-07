import React, { Component } from 'react';
import {
    Row,
    Label,
    Col,
} from "reactstrap";
import { InputField } from '../../components';
import "flatpickr/dist/themes/light.css";

class PatientSignUp extends Component {


    render() {
        const { phone, password, patientName } = this.props;
        return (
            <div>
                <h2 className="my-2">Sign Up as Patient</h2>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }} >
                        <InputField
                            type="text"
                            placeholder="Patient Name"
                            value={patientName}
                            name="patientName"
                            label="Patient Name"
                            disabled
                        />
                        <InputField
                            type="number"
                            placeholder="Contact Number"
                            value={phone}
                            name="phone"
                            label="Contact Number"
                            onChange={this.props.handleChangeText}
                        />
                        <InputField
                            type="password"
                            placeholder="Password"
                            value={password}
                            name="password"
                            label="Password"
                            onChange={this.props.handleChangeText}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default PatientSignUp