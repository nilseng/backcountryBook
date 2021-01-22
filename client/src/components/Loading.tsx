import React from "react";
import AnimatedLogo from "./AnimatedLogo";

interface IProps {
  text?: string;
  height?: string;
}

const Loading = ({ text, height }: IProps) => {
  return (
    <div
      className="bg-dark d-flex flex-column justify-content-center align-items-center"
      style={{ height: height }}
    >
      <AnimatedLogo color="#faf8f9" />
      <p className="small text-light">{text}</p>
    </div>
  );
};

export default Loading;
