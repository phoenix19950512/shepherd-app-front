import { useState } from 'react';
import useInterval from './useInterval';
import { isBoolean, isNil, toNumber } from 'lodash';

type PropType = {
  delay?: number;
  timestamp?: number;
  timerCallback: (value?: boolean) => void;
  isInfinite?: boolean;
  sendOnce?: boolean;
};

type Returntype = {
  timestamp?: number;
  finalDisplayTime: string;
  sendOnce: boolean;
  resetTimer: (timestamp?: PropType['timestamp'], sendonce?: boolean) => void;
};

function useTimer(props: PropType): Returntype {
  // For Total seconds
  const [timeStamp, setTimeStamp] = useState(
    props.timestamp ? props.timestamp : 0
  );
  // Delay Required
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [delay] = useState(props.delay ? props.delay : 1000);

  // Flag for informing parent component when timer is over
  const [sendOnce, setSendOnce] = useState<boolean>(
    !isNil(props?.sendOnce) && isBoolean(props?.sendOnce)
      ? props.sendOnce
      : true
  );

  // Flag for final display time format
  const [finalDisplayTime, setFinalDisplayTime] = useState('');

  function secondsToDhms(seconds: number | string) {
    seconds = toNumber(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + 'd ' : '';
    var hDisplay = h > 0 ? h + 'h ' : '';
    var mDisplay = m > 0 ? m + 'm ' : '';
    var sDisplay = s > 0 ? s + 's ' : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
  const resetTimer = (
    timestamp = props.timestamp,
    sendonce: boolean = true
  ) => {
    // Clearing days, hours, minutes and seconds
    // Clearing Timestamp
    setSendOnce(sendonce);
    setTimeStamp(timestamp as number);
  };

  useInterval(() => {
    if (timeStamp > 0) {
      //console.log(timeStamp, sendOnce);
      setTimeStamp(timeStamp - 1);
    } else if (sendOnce) {
      if (typeof props.timerCallback === 'function') {
        props.timerCallback(true);
      }
      if (props.isInfinite) {
        setSendOnce(true);
        resetTimer();
      } else {
        setSendOnce(false);
      }
    }
    setFinalDisplayTime(secondsToDhms(timeStamp));
  }, delay);

  return { finalDisplayTime, resetTimer, sendOnce };
}

export default useTimer;
