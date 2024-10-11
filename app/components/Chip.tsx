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
    "rounded-md w-fit px-4 py-2 text-sm font-medium transition-colors",
    selected
      ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "hover:bg-gray-400 dark:hover:bg-gray-700",
    className
  );

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${buttonClasses}  ${className}`}
    >
      {label}
    </button>
  );
};
