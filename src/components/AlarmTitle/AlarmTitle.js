// @flow
import React from 'react';
import { NavLink } from 'react-router-dom';
import {BackIcon} from '@infotech/uikit-icons';

import styles from './AlarmTitle.pcss';

export default function ({title}: {title: string}) {
  return (<div className={styles.alarmTitleWrapper}>
      <NavLink className={styles.goBackButton} to={"/"}>
        <BackIcon/>
      </NavLink>
      <span>{title}</span>
    </div>);
}
