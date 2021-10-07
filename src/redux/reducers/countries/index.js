const initialState = {
  countries: [],
  countriesOptions: [],
};

const countriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COUNTRIES":
      const options = [{ value: "", label: "Select Country" }];
      action.payload.map((option) => {
        options.push({
          value: option.code,
          label: option.name,
        });
      });
      console.log(options);
      return {
        ...state,
        countries: action.payload,
        countriesOptions: options,
      };

    default:
      return state;
  }
};

export default countriesReducer;
