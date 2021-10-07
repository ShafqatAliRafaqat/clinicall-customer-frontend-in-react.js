const initialState = {
  cities: [],
  citiesOptions: [],
};

const citiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CITIES":
      const options = [{ value: "", label: "Select City" }];
      action.payload[0].city.map((option) => {
        options.push({
          value: option.id,
          label: option.name,
        });
      });
      return {
        ...state,
        cities: action.payload[0].city,
        citiesOptions: options,
      };

    default:
      return state;
  }
};

export default citiesReducer;
