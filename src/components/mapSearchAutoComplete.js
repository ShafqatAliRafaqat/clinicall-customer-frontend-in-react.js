import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Button } from "reactstrap";

export class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address: address });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);
        this.props.handleSearch(address, latLng);
      })
      .catch((error) => console.error("Error", error));
  };
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <div className="col-8">
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="form-label-group position-relative form-group">
                <input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "form-control",
                  })}
                />
                <div
                  className="map-autocomplete-search"
                  style={{ zIndex: 500, display: "block" }}
                >
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = "";
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span
                          className="suggestion-item suggestion-title text-primary text-bold-600"
                          onClick={(e) => {
                            console.log(e.target.innerHTML);
                            this.handleSelect(e.target.innerHTML);
                          }}
                        >
                          {suggestion.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div className="col-3">
          <Button
            color="primary"
            onClick={() => {
              this.handleSelect(this.state.address);
            }}
          >
            Locate
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
