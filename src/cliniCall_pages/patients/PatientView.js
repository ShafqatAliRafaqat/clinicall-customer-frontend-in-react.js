import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { formatTime } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import {
  Building,
  City,
  Phone,
  Email,
  Country,
  Disscount,
  CreatedBy,
  CreatedAt,
  UpdatedBy,
  UpdatedAt,
  DeletedAt,
  DeletedBy,
  RestoredBy,
  RestoredAt,
} from "../../assets/icons";
import { DetailsRow, Icon } from "../../components";

class PatientView extends Component {
  state = {
    isLoading: false,
  };
  render() {
    let { show, handleSidebar, data } = this.props;

    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div
            className={classnames("data-list-sidebar", {
              show: show,
            })}
          >
            {data !== null ? (
              <React.Fragment>
                <div className="data-list-sidebar-header pt-1 px-2 d-flex justify-content-between primary-bg sidebar-hdr-clr">
                  <Icon icon={Building} width={22} height={22} />
                  <h4 className="sidebar-hdr-clr">{data.name}</h4>
                  <X size={20} onClick={() => handleSidebar(false, {})} />
                </div>
                <PerfectScrollbar
                  className=" px-0 mt-1"
                  options={{ wheelPropagation: false }}
                >
                  {data.phone ? (
                    <DetailsRow
                      icon={Phone}
                      fieldData={data.phone}
                      field="Phone"
                    />
                  ) : null}

                  {data.email ? (
                    <DetailsRow
                      icon={Email}
                      fieldData={data.email}
                      field="Email"
                    />
                  ) : null}
                  {data.country_code ? (
                    <DetailsRow
                      icon={Country}
                      fieldData={data.country_code.name}
                      field="Country"
                    />
                  ) : null}
                  {data.city_id ? (
                    <DetailsRow
                      icon={City}
                      fieldData={data.city_id.name}
                      field="City"
                    />
                  ) : null}
                  {data.doctor_max_discount ? (
                    <DetailsRow
                      icon={Disscount}
                      fieldData={data.doctor_max_discount}
                      field="Max Discount"
                    />
                  ) : null}
                  {data.created_by ? (
                    <DetailsRow
                      icon={CreatedBy}
                      fieldData={data.created_by.name}
                      field="Created By"
                    />
                  ) : null}
                  {data.created_at ? (
                    <DetailsRow
                      icon={CreatedAt}
                      fieldData={data.created_at}
                      field="Created At"
                    />
                  ) : null}
                  {data.updated_by ? (
                    <DetailsRow
                      icon={UpdatedBy}
                      fieldData={data.updated_by.name}
                      field="Updated By"
                    />
                  ) : null}
                  {data.updated_at ? (
                    <DetailsRow
                      icon={UpdatedAt}
                      fieldData={data.updated_at}
                      field="Updated At"
                    />
                  ) : null}

                  {data.deleted_by ? (
                    <DetailsRow
                      icon={DeletedBy}
                      fieldData={data.deleted_by.name}
                      field="Deleted By"
                    />
                  ) : null}
                  {data.deleted_at ? (
                    <DetailsRow
                      icon={DeletedAt}
                      fieldData={data.deleted_at}
                      field="Deleted At"
                    />
                  ) : null}
                  {data.restored_by ? (
                    <DetailsRow
                      icon={RestoredBy}
                      fieldData={data.restored_by.name}
                      field="Restored By"
                    />
                  ) : null}
                  {data.restored_at ? (
                    <DetailsRow
                      icon={RestoredAt}
                      fieldData={data.restored_at}
                      field="Restored At"
                    />
                  ) : null}
                </PerfectScrollbar>
              </React.Fragment>
            ) : null}
          </div>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(PatientView));
// export default PatientView;
