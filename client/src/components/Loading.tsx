import React from "react";
import AnimatedLogo from "./AnimatedLogo";

interface IProps {
  text?: string;
  height?: string;
  margin?: string;
  backgroundColor?: string;
}

const Loading = ({
  text,
  height,
  margin,
  backgroundColor = "#343a40",
}: IProps) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height, margin, backgroundColor }}
    >
      <AnimatedLogo color="#faf8f9" />
      <p className="small text-light">{text}</p>
    </div>
  );
};

export default Loading;
