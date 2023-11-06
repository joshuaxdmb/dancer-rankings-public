import React from 'react';
import Lottie from 'lottie-react';
import animationData from './fireanimation.json'; // path to your lottie file

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice' // Supports the same options as the svg element's preserveAspectRatio property
  }
};

const FireAnimation = () => {
  return (
    <div>
      <Lottie options={defaultOptions} animationData={animationData} style={{height:100, marginBottom:20}} loop={true} />
    </div>
  );
};

export default FireAnimation;
