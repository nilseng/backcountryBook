import React from "react";
import AnimatedLogo from "./AnimatedLogo";

interface IProps {
  text?: string;
  height?: string;
  margin?: string;
}

const Loading = ({ text, height, margin }: IProps) => {
  return (
    <div
      className="bg-dark d-flex flex-column justify-content-center align-items-center"
      style={{ height, margin }}
    >
      <AnimatedLogo color="#faf8f9" />
      <p className="small text-light">{text}</p>
    </div>
  );
};

export default Loading;
