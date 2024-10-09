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
    "rounded-md w-fit px-2 py-1 text-body-regular border-[1px]",
    selected
      ? "bg-primary-200 border-primary-500 "
      : "bg-white border-neutral-400  "
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
