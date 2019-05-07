// @flow
import React, {Component} from 'react';
import {Box} from '@infotech/uikit-grid';
import ModalDialogWindow from '@infotech/uikit-dialog-panel';
import Select from '@infotech/uikit-select';

import styles from './AlarmClosureModal.pcss';
import type {TAlarm} from '../../utils/types';

type TProps = {
  closeAlarm: (uuid: string) => mixed,
  getReasonsList: () => mixed,
  alarm: TAlarm,
  closureReasons: Array<TReason>
};

type TState = {
  selectedReason: TReason
};

type TReason = {
  value: string,
  label: string
};

export default class AlarmClosureModal extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      selectedReason: {}
    }
  };

  componentDidMount() {
    this.props.getReasonsList();
  }

  selectReason = (selectedReason: TReason) => {
    this.setState({selectedReason});
  };

  closeAlarm = () => {
    this.props.closeAlarm(this.state.selectedReason, this.props.alarm)
  };

  render() {
    const {
      props: {
        closureReasons,
        alarm: {
          objectName,
          panelNumber,
          text
        }
      },
      state: {
        selectedReason
      }
    } = this;

    const disabledBtn = Object.keys(selectedReason).length === 0;

    return (
      <Box className={styles.modalWrapper}>
        <ModalDialogWindow
          className={styles.modalWindow}
          title="Укажите причину закрытия тревоги"
          okButton={{
            onClick: this.closeAlarm,
            children: 'Закрыть тревогу',
            disabled: disabledBtn
          }}
          cancelButton={{
            onClick: this.props.closeAlarmClosureModal
          }}
        >
          <Box loose className={styles.contentWrapper}>
            <Box loose flex column className={styles.contentItem}>
              <span>Объект</span>
              <span>{objectName}</span>
            </Box>

            <Box loose flex column className={styles.contentItem}>
              <span>Пультовой номер</span>
              <span>{panelNumber}</span>
            </Box>

            <Box w={1} loose flex column className={styles.contentItem}>
              <span>Тревога</span>
              <span>{text}</span>
            </Box>

            <Box w={1} loose flex column className={styles.contentItem}>
              <span>Причина закрытия тревоги</span>
              <Select
                className={styles.select}
                placeholder="Выберите причину"
                options={closureReasons}
                uncontrollable
                onChange={this.selectReason}
              />
            </Box>
          </Box>
        </ModalDialogWindow>
      </Box>
    )
  }
}
