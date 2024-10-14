"use client";
import { useState, type FC } from "react";
import cx from "classnames";

interface Props {
  label: string;
  onClick?: (selected: boolean) => void;
  type?: "button";
  className?: string;
}

export const Chip: FC<Props> = ({
  label,
  onClick,
  type = "button",
  className = "",
}) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    const newSelectedState = !selected;
    setSelected(newSelectedState);

    if (onClick) {
      onClick(newSelectedState);
    }
  };

  const buttonClasses = cx(
    "rounded-md w-fit px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out",
    selected
      ? "bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black"
      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    "hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white",
    className
  );

  return (
    <button type={type} onClick={handleClick} className={buttonClasses}>
      {label}
    </button>
  );
};
