// @flow
import React from 'react';
import moment from 'moment';

export default function(props: {timestamp: number, className: ?string, oneRow: ?boolean}) {
  const {timestamp, className, oneRow} = props;
  if (timestamp) {
    const momentDate = moment(timestamp);
    return (<div className={className}>
      {momentDate.format('DD.MM.YY')}{oneRow ? ' ' : <br/>}
      {momentDate.format('LTS')}
    </div>);
  }
  return <div>-</div>;
}
