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
  // Control (dropdown box)
  control: (provided) => ({
    ...provided,
    minWidth: "250px",
    maxWidth: "400px",
    borderRadius: "0.375rem",
    borderColor: theme === "dark" ? "#A0AEC0" : "#A0AEC0", // Visible border
    backgroundColor: theme === "dark" ? "#2D3748" : "#FFFFFF",
    color: theme === "dark" ? "#FFFFFF" : "#1A202C",
    "&:hover": {
      borderColor: theme === "dark" ? "#B794F4" : "#5A67D8", // Indigo on hover
    },
  }),

  // Menu (dropdown container)
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#2D3748" : "#FFFFFF",
    zIndex: 9999,
  }),

  // Dropdown Indicator (arrow down to open options)
  dropdownIndicator: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#A0AEC0" : "#4A5568", // Gray by default
    "&:hover": {
      color: theme === "dark" ? "#B794F4" : "#5A67D8", // Indigo on hover
    },
  }),

  // Clear Indicator (the "x" button to clear the selected value)
  clearIndicator: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#A0AEC0" : "#4A5568", // Gray by default
    "&:hover": {
      color: theme === "dark" ? "#B794F4" : "#5A67D8", // Indigo on hover
    },
  }),

  // Menu list (dropdown options container)
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    backgroundColor: theme === "dark" ? "#2D3748" : "#FFFFFF",
  }),

  // Option (each option in the dropdown)
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "rgba(99, 102, 241, 0.7)" // Darker indigo on hover in dark mode
        : "rgba(99, 102, 241, 0.5)" // Lighter indigo on hover in light mode
      : theme === "dark"
      ? "#2D3748"
      : "#FFFFFF",
    color: state.isSelected
      ? "#FFFFFF" // Selected option text color
      : theme === "dark"
      ? "#F7FAFC"
      : "#1A202C", // Dark gray for light mode
  }),

  // Input (text inside the select box)
  input: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#F7FAFC" : "#1A202C",
    backgroundColor: "transparent",
  }),

  // Placeholder (text when nothing is selected)
  placeholder: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#A0AEC0" : "#4A5568", // Lighter gray for better visibility
  }),

  // SingleValue (selected item in the dropdown)
  singleValue: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#F7FAFC" : "#1A202C", // Visible selected value
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
    aria-label="Select an option"
    placeholder="Select an option"
    {...props}
    classNamePrefix="react-select"
  />
);

export default CustomSelect;
