import { zones } from '../tzdata';
import Select from './Select';
import moment from 'moment-timezone';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

type Props = {
  value: any;
  onChange: (value: Props['value']) => void;
};

const options = zones
  .map((tz) => {
    const offset = parseInt(moment.tz(tz).format('Z'));
    const zoneAbbv = moment.tz(new Date(), tz).format('z');
    const label = `(GMT${offset >= 0 ? '+' : ''}${offset}) ${tz.replace(
      /_/g,
      ' '
    )} ${Number.isNaN(parseInt(zoneAbbv)) ? '— ' + zoneAbbv : ``}`;

    return {
      label,
      value: tz,
      offset
    };
  })
  .sort((a, b) => a.offset - b.offset);

const TimezoneSelect: React.FC<Props> = ({ value, onChange }) => {
  const guessTimezone = useCallback(() => {
    const assumedTimezone = moment.tz.guess();
    const assumedTimezoneInOptions = options.find(
      (o) => o.value === assumedTimezone
    );

    if (assumedTimezoneInOptions) onChange(assumedTimezoneInOptions);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    if (!value) guessTimezone();
  }, [guessTimezone, value]);

  return (
    <Select
      tagVariant="solid"
      options={options}
      onChange={onChange}
      defaultValue={options.find((o) => o.value === value)}
    />
  );
};

export default TimezoneSelect;
