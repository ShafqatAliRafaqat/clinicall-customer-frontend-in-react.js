import React, { useState } from 'react';
import { InputField } from './inputField';
import Selection from './select';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Collapse,
    Button
} from "reactstrap";
import {
    ChevronDown,
    RotateCw,
    Plus,
} from "react-feather";
import classnames from "classnames"


const Filter = (props) => {

    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <Row className="app-user-list">
            <Col sm="12">
                <Card
                className={classnames("card-action card-reload", {
                    "card-collapsed": isOpen === false
                  })}
                >
                    <CardHeader>
                        <CardTitle>
                            {props.selected.length ? (
                                <Button
                                    className="add-new-btn bg-danger"
                                    color="white"
                                    onClick={() => {
                                        const selectedArray = [];
                                        if (props.selected.length) {
                                            props.selected.map((row) => {
                                                selectedArray.push(row.id);
                                            });
                                            props.handleDeleteToggle();
                                            props.handleState("deleteID", selectedArray);
                                        }
                                    }}
                                    outline
                                >
                                    {/* <Delete size={15} /> */}
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
                        </CardTitle>
                        <div className="actions">
                            <ChevronDown
                                className="collapse-icon mr-50"
                                size={15}
                                onClick={toggle}
                            />
                            <RotateCw
                                className="mr-50"
                                size={15}
                                onClick={props.refreshFilter}
                            />
                        </div>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            <Row>
                                {props.filterArray.map((item) => (
                                    item.type === "text" ?
                                        <Col lg="3" md="6" sm="12" key={item.id}>
                                            <div>
                                                <InputField
                                                    type="text"
                                                    placeholder={item.placeholder}
                                                    value={item.value}
                                                    label={item.label}
                                                    onChange={e => props.headerFilterChange(item.name, e.target.value)}
                                                />
                                            </div>
                                        </Col>
                                        :
                                        <Col lg="3" md="6" sm="12" key={item.id}>
                                            <div key={item.id}>
                                                <Selection
                                                    label={item.label}
                                                    className="w-100"
                                                    placeholder={item.label}
                                                    value={item.value}
                                                    options={item.options || []}
                                                    onChange={(e) => {
                                                        props.headerFilterChange(item.name, e);
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                ))}
                                <Col lg="3" md="6" sm="12">
                                    <Button
                                        className="add-new-btn bg-primary"
                                        color="white"
                                        outline
                                        onClick={() => props.initiateFilterObject()}
                                    >
                                        Filter
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
        </Row>
    )
}
export default Filter;
