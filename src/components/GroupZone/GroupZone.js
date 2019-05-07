// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import {Div} from '@infotech/uikit-grid';

import styles from './GroupZone.pcss';

type TProps = {
  item: {
    zones: Array<{
      zone: TZone
    }>
  },
  shrinkGroups: boolean
};

type TZone = {
  name: string,
  number: number
};

class GroupZone extends Component<TProps> {
  render() {
    const {
      item,
      shrinkGroups,
    } = this.props;

    return (<Div>
      <div className={styles.title}>Группа</div>
      {get(item, 'zones', []).map(({zone}: TZone) => {
        return <div className={classNames({
          [styles.sensor]: true,
          [styles.alarmSensor]: false,
          [styles.shrink]: shrinkGroups
        })} key={zone.number}>
          <span>{zone.number}</span> — {zone.name}
        </div>
      }
        )}
    </Div>);
  }
}

export default GroupZone;
