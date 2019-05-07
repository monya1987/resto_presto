//@flow
import React, {PureComponent} from 'react';
import moment from 'moment-timezone';

import styles from './Clock.pcss';

class Clock extends PureComponent {
  state = {
    currentTime: moment().format('DD MMM HH:mm:ss').replace(/\./g, ""),
    mscTime: moment().tz('Europe/Moscow').format('HH:mm:ss').replace(/\./g, "")
  };

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        currentTime: moment().add(1, 'second').format('DD MMM HH:mm:ss').replace(/\./g, ""),
        mscTime: moment().tz('Europe/Moscow').add(1, 'second').format('HH:mm:ss').replace(/\./g, "")
      })
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime, mscTime} = this.state;
    return (<div className={styles.clockWrapper}>
      <div className={styles.clockTime}>
        <span>{currentTime}</span>
        <span className={styles.mscTime}>Мск {mscTime}</span>
      </div>
    </div>)
  }
}

export default Clock;