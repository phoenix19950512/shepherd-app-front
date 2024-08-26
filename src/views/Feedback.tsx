import React, { useEffect } from 'react';

const BoardToken = process.env.REACT_APP_CANNY_BOARD_TOKEN;

const Feedback = () => {
  useEffect(() => {
    window.location.href =
      'https://shepherdtutors.canny.io/shepherd/p/feature-requests';
  }, []);

  return <div></div>;
};

export default Feedback;
