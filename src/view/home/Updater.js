import React, { useState, useEffect, useRef } from "react";

/**
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const Updater = props => {
  const [count, setCount] = useState(0),
    date = Date.now();

  useInterval(() => {
    props.refetch();
  }, 10 * 60 * 100 /*ten minutes*/);

  return null;
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Updater;
