// import React from "react";
// import Select, {
//   Props as SelectProps,
//   SingleValue,
//   ActionMeta,
// } from "react-select";

// export interface Option {
//   value: string;
//   label: string;
// }

// interface CustomSelectProps extends SelectProps<Option, false> {
//   options: Option[];
//   value?: SingleValue<Option>;
//   onChange: (
//     selected: SingleValue<Option> | null,
//     actionMeta: ActionMeta<Option>
//   ) => void;
// }

// const customStyles = {
//   control: (provided: any) => ({
//     ...provided,
//     borderColor: "gray",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "indigo-500",
//     },
//     padding: "4px",
//     minWidth: "150px",
//     maxWidth: "250px",
//   }),
//   menu: (provided: any) => ({
//     ...provided,
//     zIndex: 9999,
//   }),
//   option: (provided: any, state: any) => ({
//     ...provided,
//     backgroundColor: state.isFocused ? "rgba(99, 102, 241, 0.2)" : "white",
//     color: state.isFocused ? "black" : "gray",
//     padding: "10px",
//   }),
// };

// const CustomSelect: React.FC<CustomSelectProps> = ({
//   options,
//   value,
//   onChange,
//   ...props
// }) => (
//   <Select
//     styles={customStyles}
//     options={options}
//     value={value}
//     onChange={onChange}
//     isClearable
//     isSearchable
//     placeholder="Select an option"
//     {...props}
//   />
// );

// export default CustomSelect;

import React from "react";
import Select, {
  Props as SelectProps,
  SingleValue,
  ActionMeta,
  StylesConfig,
} from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends SelectProps<Option, false> {
  options: Option[];
  value?: SingleValue<Option>;
  onChange: (
    selected: SingleValue<Option> | null,
    actionMeta: ActionMeta<Option>
  ) => void;
}

// Custom styles with Tailwind CSS
const customStyles: StylesConfig<Option, false> = {
  control: (provided) => ({
    ...provided,
    padding: "0.5rem", // Padding to match Tailwind styles
    minWidth: "150px",
    maxWidth: "250px",
    borderRadius: "0.375rem", // Tailwind rounded-md
    borderColor: "gray", // Default border color
    boxShadow: "none",
    "&:hover": {
      borderColor: "indigo", // Change border color on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "rgba(99, 102, 241, 0.2)" : "white",
    color: state.isFocused ? "black" : "gray",
    padding: "0.5rem 1rem", // Padding to match Tailwind styles
    transition: "background-color 0.2s", // Smooth transition for hover
  }),
};

// Main component
const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  ...props
}) => (
  <Select
    styles={customStyles}
    options={options}
    value={value}
    onChange={onChange}
    isClearable
    isSearchable
    placeholder="Select an option"
    {...props}
    className="bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
    classNamePrefix="react-select" // Prefix for applying Tailwind to the component
  />
);

export default CustomSelect;
