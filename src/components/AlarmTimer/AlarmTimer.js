// @flow
import React, {Component} from 'react';
import moment from 'moment';
import {TimerIcon} from '@infotech/uikit-icons';
import {Div} from '@infotech/uikit-grid';

import styles from './AlarmTimer.pcss';

export default class AlarmTimer extends Component {
  constructor(props: {startProcess: string}) {
    super(props);

    this.state = {diffSeconds: 0};
  }

  componentDidMount() {
    const startTime = moment(this.props.startProcess);
    const endTime = startTime.clone().add(20, 'm');
    const diffSeconds = endTime.diff(moment()) / 1000;
    this.setTimer(diffSeconds);
  }

  setTimer = (diffSeconds: number) => {
    this.timer = setInterval(() => {
      if (diffSeconds > 0) {
        diffSeconds -= 1;
        this.setState({ diffSeconds });
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  formatTime(diffSeconds: number) {
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = parseInt(diffSeconds % 60, 10);
    return `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
  }

  render() {
    const { diffSeconds } = this.state;
    return (
      <Div flex align="center">
        <TimerIcon className={styles.timerIcon} />
        <span className={styles.time}>{diffSeconds > 0 ? this.formatTime(diffSeconds) : '00:00'}</span>
      </Div>
    );
  }
}