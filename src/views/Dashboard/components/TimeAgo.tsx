import React, { useState, useEffect } from 'react';

interface TimeAgoProps {
  timestamp: string;
}
export const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [timeAgoText, setTimeAgoText] = useState<string>('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const pastTime = new Date(timestamp);
      const timeDifference = currentTime.getTime() - pastTime.getTime();
      const secondsDifference = Math.floor(timeDifference / 1000);

      if (secondsDifference < 60) {
        setTimeAgoText(
          `${secondsDifference} ${
            secondsDifference === 1 ? 'second' : 'seconds'
          } ago`
        );
      } else {
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        if (minutesDifference < 60) {
          setTimeAgoText(
            `${minutesDifference} ${
              minutesDifference === 1 ? 'minute' : 'minutes'
            } ago`
          );
        } else {
          const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
          if (hoursDifference >= 24) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (
              pastTime.getDate() === yesterday.getDate() &&
              pastTime.getMonth() === yesterday.getMonth() &&
              pastTime.getFullYear() === yesterday.getFullYear()
            ) {
              setTimeAgoText('Yesterday');
            } else {
              const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
              );
              setTimeAgoText(
                `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`
              );
            }
          } else {
            setTimeAgoText(
              `${hoursDifference} ${
                hoursDifference === 1 ? 'hour' : 'hours'
              } ago`
            );
          }
        }
      }
    };

    calculateTimeAgo();
  }, [timestamp]);

  return <div>{timeAgoText}</div>;
};
