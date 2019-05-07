// @flow
import React, {Component} from 'react';
import {Div} from '@infotech/uikit-grid';
import {CloseIcon, TimerIcon} from '@infotech/uikit-icons';
import {Button} from '@infotech/uikit-button';

import styles from './Toast.pcss';

type TProps = {closeToast: () => mixed};

export default class ToastTimer extends Component {
  constructor(props: TProps) {
    super(props);
  }

  repeatReminer = () => {
    this.props.repeatReminder(1);
    this.props.closeToast();
  }

  render() {
    const {
      props: {closeToast},
    } = this;
    return (<Div flex align="center">
      <TimerIcon />
      <Div className={styles.text} mr={"22px"} ml={"24px"}>Истекло время закрытия тревоги, воспользуйтесь кнопкой «Напомнить» или отмените таймер</Div>
      <Button transparent className={styles.timerBtns} onClick={this.repeatReminer}>Напомнить</Button>
      <Button transparent className={styles.timerBtns} onClick={closeToast}>Отменить</Button>
      <Button transparent onClick={closeToast} className={styles.button}><CloseIcon className={styles.closeBtn} /></Button>
    </Div>);
  }
}