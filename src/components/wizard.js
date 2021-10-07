import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Form,
    Button
} from "reactstrap"
import { AvForm } from "availity-reactstrap-validation"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../redux/actions/flashMessages";
import FlashMessage from "../components/flashMessageList";

class VuexyWizard extends React.Component {
    static getDerivedStateFromProps(props, state) {
        if (props.activeStep) {
            if (props.activeStep !== state.activeStep) {
                if (props.validate) {
                    if (state.errors.length === 0 && state.submitted)
                        return { activeStep: props.activeStep }
                } else return { activeStep: props.activeStep }
            }
        }
        return null
    }

    state = {
        activeStep: this.props.activeStep ? this.props.activeStep : 0,
        errors: [],
        values: []
    }

    validateFormOne = () => {
        let { patientName,
            appointmentType,
            bookingDate,
            medicalCenter,
            treatmentType,
            bookingTime,
        } = this.props;

        if (!patientName.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Patient name is required",
            });
        } else if (!appointmentType) {
            this.props.addFlashMessage({
                type: "error",
                text: "Appointment type is required",
            });
        } else if (!bookingDate) {
            this.props.addFlashMessage({
                type: "error",
                text: "Booking date is required",
            });
        }
        else if (!medicalCenter && appointmentType.value !== 'online') {
            this.props.addFlashMessage({
                type: "error",
                text: "Medical Center is required",
            });
        }
        else if (!bookingTime) {
            this.props.addFlashMessage({
                type: "error",
                text: "Booking time is required",
            });
        }
        else if (!treatmentType) {
            this.props.addFlashMessage({
                type: "error",
                text: "Treatment type is required",
            });
        }
    }

    validateFormTwo = () => {
        const { phone, password } = this.props;
        if (!phone.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Contact number is required",
            });
        } else if (!password.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Password is required",
            });
        }
    }
    validateFormThree = () => {
        const { passcode } = this.props;
        if (!passcode.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Passcode is required",
            });
        }
    }
    validateFormFour = () => {
        const { paymentMethod } = this.props;
        if (!paymentMethod.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Please select a payment method",
            });
        }
    }
    validateFormFive = () => {
        const { accountNumber } = this.props;
        if (!accountNumber.trim()) {
            this.props.addFlashMessage({
                type: "error",
                text: "Account number is required",
            });
        }
    }

    handleNextStep = (index, total, errors = []) => {
        let { activeStep } = this.state;
        let { patientName,
            appointmentType,
            bookingDate,
            medicalCenter,
            treatmentType,
            bookingTime,
            phone,
            password,
            passcode,
            paymentMethod,
            accountNumber
        } = this.props;

        if (activeStep === 0) {
            this.validateFormOne();
        } else if (activeStep === 1) {
            this.validateFormTwo();
        } else if (activeStep === 2) {
            this.validateFormThree();
        }
        else if (activeStep === 3) {
            this.validateFormFour();
        }
        else if (activeStep === 4) {
            this.validateFormFive();
        }

        if (errors.length === 0 && activeStep <= index && activeStep !== total) {
            if (
                (
                    activeStep === 0 &&
                    patientName.trim() &&
                    appointmentType.value === 'online' &&
                    bookingDate &&
                    !medicalCenter &&
                    treatmentType &&
                    bookingTime
                ) ||
                (
                    activeStep === 0 &&
                    patientName.trim() &&
                    appointmentType &&
                    bookingDate &&
                    medicalCenter &&
                    treatmentType &&
                    bookingTime
                )
            ) {
                this.setState({ activeStep: 1 })
            } else if (activeStep === 1 && phone.trim() && password.trim()) {
                this.setState({ activeStep: 2 })
            }
            else if (activeStep === 2 && passcode.trim()) {
                this.setState({ activeStep: 3 })
            }
            else if (activeStep === 3 && paymentMethod) {
                this.setState({ activeStep: 4 })
            } else if (activeStep === 4 && accountNumber) {
                this.setState({ activeStep: 5 })
            }
        } else if (errors.length && this.props.onValidationError) {
            this.props.onValidationError(this.state.errors)
        } else {
            return
        }
    }

    handlePreviousStep = index => {
        let activeStep = this.state.activeStep
        if (activeStep >= index)
            this.setState({
                activeStep: activeStep - 1
            })
    }

    handleEnableAllSteps = index => {
        if (this.props.enableAllSteps) {
            this.setState({ activeStep: index })
        }
    }

    handleSubmit = e => {
        if (
            this.props.steps.length - 1 === this.state.activeStep &&
            this.props.onFinish
        ) {
            this.props.onFinish(e)
        }
    }

    render() {
        let FormTag = this.props.validate ? AvForm : Form

        return (
            <React.Fragment>
                <Nav
                    className={`vx-wizard ${this.props.className ? this.props.className : ""
                        }`}
                    tabs>
                    {this.props.steps.map((item, i) => {
                        return (
                            <NavItem
                                className="step-wrapper"
                                key={i}
                                onClick={() => this.handleEnableAllSteps(i)}>
                                <NavLink
                                    className={classnames(`step step-${i}`, {
                                        active: this.state.activeStep === i ? true : false,
                                        done: i < this.state.activeStep
                                    })}>
                                    <span className="step-text">{item.title}</span>
                                </NavLink>
                            </NavItem>
                        )
                    })}
                </Nav>
                <TabContent
                    className={`vx-wizard-content ${this.props.tabPaneClass ? this.props.tabPaneClass : ""
                        }`}
                    activeTab={this.state.activeStep}>
                    {this.props.steps.map((item, i) => {
                        return (
                            <TabPane
                                className={`step-content step-${i}-content`}
                                key={i}
                                tabId={i}>
                                <FormTag
                                    className="form-horizontal"
                                    onSubmit={(e, errors, values) => {
                                        this.setState({ errors, values })
                                        if (!this.props.validate) e.preventDefault()
                                        this.handleNextStep(i, this.props.steps.length - 1, errors)
                                        this.handleSubmit(e)
                                    }}>
                                    {item.content}
                                    {this.props.pagination ? (
                                        <div className="wizard-actions d-flex justify-content-between">
                                            <Button
                                                color="primary"
                                                disabled={this.state.activeStep === 0}
                                                onClick={() => this.handlePreviousStep(i)}>
                                                Prev
                      </Button>
                                            <Button type="submit" color="primary">
                                                {this.props.steps.length - 1 === i &&
                                                    !this.props.finishBtnText
                                                    ? "Submit"
                                                    : this.props.steps.length - 1 === i &&
                                                        this.props.finishBtnText
                                                        ? this.props.finishBtnText
                                                        : "Next"}
                                            </Button>
                                        </div>
                                    ) : null}
                                </FormTag>
                            </TabPane>
                        )
                    })}
                </TabContent>
                <FlashMessage />
            </React.Fragment>
        )
    }
}

VuexyWizard.propTypes = {
    className: PropTypes.string,
    steps: PropTypes.array.isRequired,
    validate: PropTypes.bool,
    enableAllSteps: PropTypes.bool,
    finishBtnText: PropTypes.string,
    onFinish: PropTypes.func,
    pagination: PropTypes.bool,
    onValidationError: PropTypes.func,
    activeStep: PropTypes.number
}

VuexyWizard.defaultProps = {
    pagination: true
}
const mapStateToProps = (state) => {
    return {
        flashMessages: state.flashMessages,
    };
};

export default connect(mapStateToProps, {
    addFlashMessage,
})(withRouter(VuexyWizard));