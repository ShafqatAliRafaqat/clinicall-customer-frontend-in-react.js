import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../history";
import {
  Edit,
  Trash,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
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
import Sidebar from "./PatientForm";
import SidebarView from "./PatientView";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";

import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";
import { apiCall, filterUrl } from "../../utils";
import { GENDERS } from "../../configs/constants";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";
import FilterHeader from "../../components/filter";
import shortId from "shortid";
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
          // return props.currentData(props.row);
        }}
      />
      <Trash
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          // props.deleteRow(props.row);
        }}
      />
    </div>
  );
};

const CustomHeader = (props) => {
  return (
    <div>
      <Breadcrumbs breadCrumbTitle="Patients" breadCrumbActive="Patients" />
      <div className="data-list-header d-flex justify-content-between flex-wrap">
        <div className="actions-left d-flex flex-wrap">
          {props.state.selected.length ? (
            <Button
              className="add-new-btn bg-danger mx-1"
              color="white"
              onClick={() => {
                // const selectedArray = [];
                // if (props.state.selected.length) {
                //   props.state.selected.map((row) => {
                //     selectedArray.push(row.id);
                //   });
                //   props.handleDeleteToggle();
                //   props.handleState("deleteID", selectedArray);
                // }
              }}
              outline
            >
              Delete Selected
            </Button>
          ) : (
            <Button
              className="add-new-btn bg-primary"
              color="white"
              // onClick={() => props.handleSidebar(true, true)}
              outline
            >
              <Plus size={15} />
              Add New
            </Button>
          )}
        </div>
      </div>
      {/* <FilterHeader
        filterArray={props.filterArray}
        headerFilterChange={props.filterCall}
        initiateFilterObject={props.initiateFilterObject}
        selected={props.state.selected}
        handleDeleteToggle={props.handleDeleteToggle}
        handleState={props.handleState}
        handleSidebar={props.handleSidebar}
        refreshFilter={props.refreshFilter}
      /> */}
    </div>
  );
};

class PatientList extends Component {
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
        cell: (row) => {
          return (
            <p
              title={row.name}
              className="text-truncate text-bold-500 mb-0"
              onClick={() => {
                // this.handleSidebarDetails(true, row);
              }}
            >
              {row.name}
            </p>
          );
        },
      },
      {
        name: "Phone",
        selector: "phone",
        sortable: true,
        cell: (row) => (
          <p
            className="text-truncate text-bold-500 mb-0"
            onClick={() => {
              // this.handleSidebarDetails(true, row);
            }}
          >
            {row.phone}
          </p>
        ),
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        cell: (row) => (
          <p
            onClick={() => {
              // this.handleSidebarDetails(true, row);
            }}
            className="text-truncate mb-0"
          >
            {row.email}
          </p>
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
    filterUrl: "",
    filterArray: [
      {
        id: shortId.generate(),
        type: "text",
        value: "",
        name: "name",
        placeholder: "Name",
        label: "Name",
      },
      {
        id: shortId.generate(),
        type: "text",
        value: "",
        name: "title",
        placeholder: "Title",
        label: "Title",
      },
      {
        id: shortId.generate(),
        type: "text",
        value: "",
        name: "location",
        placeholder: "Location",
        label: "Location",
      },
      {
        id: shortId.generate(),
        type: "select",
        value: { value: "", label: "Select Gender" },
        name: "gender",
        placeholder: "Please select gender",
        label: "Gender",
        options: [...GENDERS],
      },
      {
        id: shortId.generate(),
        type: "text",
        value: "",
        name: "phone",
        placeholder: "phone",
        label: "Phone",
      },
    ],
  };

  thumbView = this.props.thumbView;

  ///////// Functions for filter starts here////////
  headerFilterChange = (name, value) => {
    const { filterArray } = this.state;
    filterArray.map((item) => {
      if (item.name === name) {
        item.value = value;
        this.setState({ filterArray });
        return;
      }
    });
  };
  refreshFilter = () => {
    const { filterArray } = this.state;
    filterArray.map((item) => {
      item.value = "";
    });
    this.setState(
      { filterArray, filterUrl: "", currentPage: 0, filterUrl: "" },
      () => {
        this.getPatients();
      }
    );
  };

  initiateFilterObject = () => {
    this.setState(
      { filterUrl: filterUrl(this.state.filterArray), currentPage: 1 },
      () => {
        const { currentPage, filterUrl } = this.state;
        this.getPatients(currentPage, filterUrl);
      }
    );
  };
  ///////// Functions for filter ends here ////////

  confirmDeleteModalToggle = () => {
    this.setState((prevState) => ({
      confirmDeleteModal: !prevState.confirmDeleteModal,
    }));
  };

  getPatients = async (page) => {
    try {
      const { filterUrl } = this.state;
      let url = "auth/patients?page=1";
      if (page) url = `auth/patients?page=${page}`;
      if (filterUrl) url = `auth/patients?page=${page}&${filterUrl}`;
      this.setState({
        isLoading: true,
      });
      const res = await apiCall("get", url, undefined, this.state.token);
      console.log(res.data.data);
      this.setState({
        data: res.data.data,
        rowPerPage: res.data.pagination.per_page,
        totalPages: res.data.pagination.last_page,

        isLoading: false,
      });
    } catch (err) {
      console.log("error", err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

  componentDidMount() {
    this.getPatients();
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
      let url = "admin/delete_organization";
      this.setState({
        isLoading: true,
      });

      const res = await apiCall(
        "post",
        url,
        { ids: this.state.deleteID },
        this.state.token
      );
      this.setState({
        isLoading: false,
      });
      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
      });
      this.setState({ selected: [] });
      this.getPatients();
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
    // let urlPrefix = "/patients";
    // history.push(`${urlPrefix}?page=${page.selected + 1}`);
    this.setState({ currentPage: page.selected });
    this.getPatients(page.selected + 1);
  };

  render() {
    let {
      columns,
      data,
      totalPages,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
      isLoading,
      detailsData,
      sidebarDetails,
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
            <DataTable
              columns={columns}
              data={data}
              pagination
              paginationServer
              onRowClicked={(e) => {
                // this.handleSidebarDetails(true, e);
              }}
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
                  filterCall={this.headerFilterChange}
                  filterArray={this.state.filterArray}
                  initiateFilterObject={this.initiateFilterObject}
                  refreshFilter={this.refreshFilter}
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
              handleSidebar={this.handleSidebar}
              getData={this.getPatients}
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
        )}{" "}
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
          <ModalBody>Do you really want to delete organization(s)?</ModalBody>
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
})(PatientList);
