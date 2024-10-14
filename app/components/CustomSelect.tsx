import React from "react";
import Select, {
  Props as SelectProps,
  SingleValue,
  ActionMeta,
  StylesConfig,
  GroupBase,
} from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps
  extends Omit<SelectProps<Option, false, GroupBase<Option>>, "theme"> {
  options: Option[];
  value?: SingleValue<Option>;
  onChange: (
    selected: SingleValue<Option> | null,
    actionMeta: ActionMeta<Option>
  ) => void;
  theme: "light" | "dark";
}

const customStyles = (
  theme: "light" | "dark"
): StylesConfig<Option, false> => ({
  control: (provided) => ({
    ...provided,
    padding: "0.5rem",
    minWidth: "250px",
    maxWidth: "400px",
    borderRadius: "0.375rem",
    borderColor: theme === "dark" ? "gray" : "gray",
    boxShadow: "none",
    backgroundColor: theme === "dark" ? "#4A5568" : "white",
    color: theme === "dark" ? "white" : "black",
    "&:hover": {
      borderColor: theme === "dark" ? "indigo" : "indigo",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    backgroundColor: theme === "dark" ? "#4A5568" : "white",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "rgba(99, 102, 241, 0.4)"
        : "rgba(99, 102, 241, 0.2)"
      : theme === "dark"
      ? "#4A5568"
      : "white",
    color: state.isFocused ? "black" : theme === "dark" ? "white" : "gray",
    padding: "0.5rem 1rem",
    transition: "background-color 0.2s",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme === "dark" ? "gray" : "gray",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === "dark" ? "white" : "black",
  }),
});

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  theme,
  ...props
}) => (
  <Select
    styles={customStyles(theme)}
    options={options}
    value={value}
    onChange={onChange}
    isClearable
    isSearchable
    placeholder="Select an option"
    {...props}
    classNamePrefix="react-select"
  />
);

export default CustomSelect;
