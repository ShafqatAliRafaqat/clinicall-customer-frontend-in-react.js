import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../history";
import {
  ChevronDown,
  Edit,
  Trash,
  Eye,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from "../../redux/actions/data-list";
import Sidebar from "./MedicineForm";
import SidebarView from "./MedicineView";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";

import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";
import { apiCall, Capitalize } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";
import { MenuItem, Menu } from "@material-ui/core";

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
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row);
        }}
      />
      <Trash
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          props.deleteRow(props.row);
        }}
      />
    </div>
  );
};

const CustomHeader = (props) => {
  return (
    <div>
      <Breadcrumbs breadCrumbTitle="Medicines" breadCrumbActive="Medicines" />
      <div className="data-list-header d-flex justify-content-between flex-wrap">
        <div className="actions-left d-flex flex-wrap">
          {props.state.selected.length ? (
            <Button
              className="add-new-btn bg-danger mx-1"
              color="white"
              onClick={() => {
                const selectedArray = [];
                if (props.state.selected.length) {
                  props.state.selected.map((row) => {
                    selectedArray.push(row.id);
                    return true;
                  });
                  props.handleDeleteToggle();
                  props.handleState("deleteID", selectedArray);
                }
              }}
              outline
            >
              <span className="align-middle">Delete Selected</span>
            </Button>
          ) : (
            <Button
              className="add-new-btn bg-primary"
              color="white"
              onClick={() => props.handleSidebar(true, true)}
              outline
            >
              <Plus size={15} />
              <span className="align-middle">Add New</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

class MedicineList extends Component {
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
        minWidth: "200px",
        cell: (row) => (
          <p
            title={row.name}
            className="text-truncate text-bold-500 mb-0"
            onClick={() => {
              this.handleSidebarDetails(true, row);
            }}
          >
            {row.name}
          </p>
        ),
      },
      {
        name: "Type",
        selector: "type",
        sortable: true,
        cell: (row) => (
          <p
            title={row.type}
            className="text-truncate text-bold-500 mb-0"
            onClick={() => {
              this.handleSidebarDetails(true, row);
            }}
          >
            {Capitalize(row.type)}
          </p>
        ),
      },
      {
        name: "Created By",
        selector: "created_by.name",
        sortable: true,
        cell: (row) =>
          row.created_by ? (
            <p
              title={row.created_by.name}
              className="text-truncate text-bold-500 mb-0"
              // onClick={() => {
              //   history.push(`/roles/assign-persmissions?id=${row.id}`);
              // }}
              onClick={() => {
                this.handleSidebarDetails(true, row);
              }}
            >
              {row.created_by.name}
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
            // onClick={() => {
            //   history.push(`/roles/assign-persmissions?id=${row.id}`);
            // }}
            onClick={() => {
              this.handleSidebarDetails(true, row);
            }}
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
            deleteRow={(e) => {
              this.confirmDeleteModalToggle();
              this.setState({ deleteID: [e.id] });
            }}
            handleSidebar={this.handleSidebarDetails}
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
    confirmDeleteModal: false,
    deleteID: null,
    show: false,
    detailsData: null,
    sidebarDetails: false,
    showDetails: false,
  };

  thumbView = this.props.thumbView;

  confirmDeleteModalToggle = () => {
    this.setState((prevState) => ({
      confirmDeleteModal: !prevState.confirmDeleteModal,
    }));
  };

  created = (data) => {
    const doctors = [data, ...this.state.data];
    this.setState({ data: doctors });
  };

  updated = (data, id) => {
    const updatedArray = [...this.state.data];
    const index = updatedArray.findIndex((doctor) => id === doctor.id);
    updatedArray[index] = data;
    this.setState({ data: updatedArray });
  };

  getMedicines = async (page) => {
    try {
      let url = "admin/medicine?page=1";
      if (page) url = `admin/medicine?page=${page}`;
      this.setState({
        isLoading: true,
      });
      const res = await apiCall("get", url, undefined, this.state.token);
      console.log(res);
      this.setState({
        data: res.data.data,
        rowPerPage: res.data.pagination.per_page,
        totalPages: res.data.pagination.last_page,

        isLoading: false,
      });
    } catch (err) {
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

  componentDidMount() {
    this.getMedicines();
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
  handleSidebarDetails = (boolean, row) => {
    this.setState({ sidebarDetails: boolean, detailsData: row });
  };

  handleDelete = async () => {
    try {
      this.confirmDeleteModalToggle();
      let url = "admin/delete_medicine";

      const res = await apiCall(
        "post",
        url,
        { ids: this.state.deleteID },
        this.state.token
      );
      const updatedArray = [...this.state.data];
      this.state.deleteID.map((id) => {
        const index = updatedArray.findIndex((doctor) => id === doctor.id);
        updatedArray.splice(index, 1);
      });
      this.setState({ data: updatedArray });
      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
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

  handleState = (key, value) => {
    this.setState((prevState) => ({ ...prevState, [key]: value }));
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  handlePagination = (page) => {
    let urlPrefix = "/medicines";
    history.push(`${urlPrefix}?page=${page.selected + 1}`);
    this.setState({ currentPage: page.selected });
    this.getMedicines(page.selected + 1);
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
      sidebarDetails,
      totalRecords,
      sortIndex,
      isLoading,
      detailsData,
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
            <DataTable
              columns={columns}
              data={value.length ? allData : data}
              pagination
              onRowClicked={(e) => {
                this.handleSidebarDetails(true, e);
              }}
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
                  handleDeleteToggle={this.confirmDeleteModalToggle}
                  handleRowsPerPage={this.handleRowsPerPage}
                  handleDelete={this.handleDelete}
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
            <Sidebar
              show={sidebar}
              data={currentData}
              updateData={this.props.updateData}
              addData={this.props.addData}
              created={this.created}
              updated={this.updated}
              handleSidebar={this.handleSidebar}
              getData={this.getMedicines}
              addNew={this.state.addNew}
            />
            <SidebarView
              show={sidebarDetails}
              data={detailsData}
              handleSidebar={this.handleSidebarDetails}
            />
            <div
              className={classnames("data-list-overlay", {
                show: sidebar,
              })}
              onClick={() => this.handleSidebar(false, true)}
            />
            <div
              className={classnames("data-list-overlay", {
                show: sidebarDetails,
              })}
              onClick={() => this.handleSidebarDetails(false, {})}
            />
          </div>
        )}
        <Modal
          isOpen={this.state.confirmDeleteModal}
          toggle={this.confirmDeleteModalToggle}
          className="modal-dialog-centered"
        >
          <ModalHeader
            toggle={this.confirmDeleteModalToggle}
            className="bg-danger"
          >
            Confirm
          </ModalHeader>
          <ModalBody>Do you really want to delete Medicine(s)?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDelete}>
              Confirm
            </Button>
            <Button color="secondary" onClick={this.confirmDeleteModalToggle}>
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
  deleteData,
  addFlashMessage,
  updateData,
  addData,
  getInitialData,
  filterData,
})(MedicineList);
