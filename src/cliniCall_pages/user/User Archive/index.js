import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../history";
import {
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  restoreData,
  updateData,
  addData,
  filterData,
} from "../../../redux/actions/data-list";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";

import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../assets/scss/pages/data-list.scss";
import { apiCall } from "../../../utils";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import Chip from "../../../components/@vuexy/chips/ChipComponent";
import { Avatar } from "@material-ui/core";

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#204593 !important",
      boxShadow: "0 0 1px 0 #204593 !important",
      "&:hover": {
        transform: "translateY(0px) !important",
      },
    },
  },
};

const ActionsComponent = (props) => {
  return (
    <div className="data-list-action">
      <RotateCcw
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.restoreRow(props.row);
        }}
      />
    </div>
  );
};

const CustomHeader = (props) => {
  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-left d-flex flex-wrap">
        {/* {props.state.selected.length ? ( */}
        <Button
          className="add-new-btn bg-primary mx-1"
          color="white"
          onClick={() => {
            const selectedArray = [];
            if (props.state.selected.length) {
              props.state.selected.map((row) => {
                selectedArray.push(row.id);
              });
              props.handleRestoreToggle();
              props.handleState("restoreID", selectedArray);
            }
          }}
          disabled={!props.state.selected.length}
          outline
        >
          <RotateCcw size={15} />
          <span className="align-middle mx-1">Restore Selected</span>
        </Button>
        {/* ) : null} */}
      </div>
    </div>
  );
};

class UserList extends Component {
  state = {
    data: [],
    totalPages: 0,
    currentPage: 0,
    isLoading: false,
    columns: [
      {
        name: "Name",
        selector: "name",
        sortable: true,
        minWidth: "300px",
        cell: (row) => (
          <span
            title={row.name}
            className="text-truncate text-bold-500 mb-0 d-flex align-items-center"
            onClick={() => {
              // history.push(`/users/view?id=${row.id}`);
            }}
          >
            <Avatar
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
              src={row.image}
              alt=""
            />
            {row.name}
          </span>
        ),
      },
      {
        name: "username",
        selector: "username",
        sortable: true,
        cell: (row) => (
          <p
            title={row.username}
            className="text-truncate text-bold-500 mb-0"
            onClick={() => {
              // history.push(`/users/view?id=${row.id}`);
            }}
          >
            {row.username}
          </p>
        ),
      },
      {
        name: "Deleted By",
        selector: "deleted_by",
        sortable: true,
        cell: (row) =>
          row.deleted_by ? (
            <p
              title={row.deleted_by.name}
              className="text-truncate text-bold-500 mb-0"
            >
              {row.deleted_by.name}
            </p>
          ) : null,
      },
      {
        name: "Status",
        selector: "is_active",
        sortable: true,
        cell: (row) => (
          <Chip
            className="m-0"
            color={row.is_active === 1 ? "success" : "danger"}
            text={row.is_active === 1 ? "Active" : "Inactive"}
          />
        ),
      },
      {
        name: "Actions",
        sortable: false,
        cell: (row) => (
          <ActionsComponent
            row={row}
            getData={this.props.getData}
            parsedFilter={this.props.parsedFilter}
            currentData={this.handleCurrentData}
            restoreRow={(e) => {
              this.confirmRestoreModalToggle();
              this.setState({ restoreID: [e.id] });
            }}
          />
        ),
      },
    ],
    allData: [],
    value: "",
    rowsPerPage: 4,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
    token: this.props.values.userData.token,
    confirmRestoreModal: false,
    restoreID: null,
    show: false,
  };

  thumbView = this.props.thumbView;

  confirmRestoreModalToggle = () => {
    this.setState((prevState) => ({
      confirmRestoreModal: !prevState.confirmRestoreModal,
    }));
  };

  getArchiveUser = async (page) => {
    try {
      let url = "admin/deleted_users?page=1";
      if (page) url = `admin/deleted_users?page=${page}`;
      this.setState({
        isLoading: true,
      });
      const res = await apiCall("get", url, undefined, this.state.token);
      this.setState({
        data: res.data.data,
        rowPerPage: res.data.pagination.per_page,
        totalPages: res.data.pagination.last_page,

        isLoading: false,
      });
    } catch (err) {
      console.log(err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

  componentDidMount() {
    this.getArchiveUser();
  }

  handleFilter = (e) => {
    this.setState({ value: e.target.value });
    this.props.filterData(e.target.value);
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getData } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/data-list/list-view?page=${page}&perPage=${value}`);
    this.setState({ rowsPerPage: value });
    getData({ page: parsedFilter.page, perPage: value });
  };

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  handleDetailsToggle = (boolean) => {
    this.setState({ show: boolean });
  };

  handleRestore = async () => {
    try {
      this.confirmRestoreModalToggle();
      let url = "admin/restore_users";
      this.setState({
        isLoading: true,
      });

      const res = await apiCall(
        "post",
        url,
        { ids: this.state.restoreID },
        this.state.token
      );
      this.setState({
        isLoading: false,
      });
      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
      });
      this.getArchiveUser();
    } catch (err) {
      console.log(err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

  handleState = (key, value) => {
    this.setState((prevState) => ({ ...prevState, [key]: value }));
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  handlePagination = (page) => {
    let perPage = this.state.per_page;
    // let urlPrefix = "archive/permissions";
    // history.push(`${urlPrefix}?page=${page.selected + 1}`);
    this.setState({ currentPage: page.selected });
    this.getArchiveUser(page.selected + 1);
  };

  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
      isLoading,
      show,
    } = this.state;
    return (
      <React.Fragment>
        <FlashMessage />
        {isLoading ? (
          <Spinner />
        ) : (
          <div
            className={`data-list ${
              this.props.thumbView ? "thumb-view" : "list-view"
            }`}
          >
            {console.log(this.state)}
            <DataTable
              columns={columns}
              data={value.length ? allData : data}
              pagination
              paginationServer
              paginationComponent={() => (
                <ReactPaginate
                  previousLabel={<ChevronLeft size={15} />}
                  nextLabel={<ChevronRight size={15} />}
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={totalPages}
                  containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
                  activeClassName="active"
                  forcePage={this.state.currentPage}
                  onPageChange={(page) => this.handlePagination(page)}
                />
              )}
              noHeader
              subHeader
              selectableRows
              responsive
              pointerOnHover
              selectableRowsHighlight
              onSelectedRowsChange={(data) =>
                this.setState({ selected: data.selectedRows })
              }
              customStyles={selectedStyle}
              subHeaderComponent={
                <CustomHeader
                  handleSidebar={this.handleSidebar}
                  handleFilter={this.handleFilter}
                  handleRestoreToggle={this.confirmRestoreModalToggle}
                  handleRowsPerPage={this.handleRowsPerPage}
                  handleRestore={this.handleRestore}
                  rowsPerPage={rowsPerPage}
                  total={totalRecords}
                  index={sortIndex}
                  state={this.state}
                  handleState={this.handleState}
                />
              }
              sortIcon={<ChevronDown />}
              selectableRowsComponent={Checkbox}
              selectableRowsComponentProps={{
                color: "primary",
                icon: <Check className="vx-icon" size={12} />,
                label: "",
                size: "sm",
              }}
            />
          </div>
        )}{" "}
        <Modal
          isOpen={this.state.confirmRestoreModal}
          toggle={this.confirmRestoreModalToggle}
          className="modal-dialog-centered"
        >
          <ModalHeader
            toggle={this.confirmRestoreModalToggle}
            className="bg-danger"
          >
            Confirm
          </ModalHeader>
          <ModalBody>Do you really want to Restore User(s)?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleRestore}>
              Confirm
            </Button>
            <Button color="secondary" onClick={this.confirmRestoreModalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataList: state.dataList,
    values: state.auth.login,
  };
};

export default connect(mapStateToProps, {
  getData,
  restoreData,
  addFlashMessage,
  updateData,
  addData,
  getInitialData,
  filterData,
})(UserList);
