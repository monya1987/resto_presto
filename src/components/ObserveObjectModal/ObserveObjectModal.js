// @flow
import React, { Component } from 'react';
import moment from 'moment';
import ModalDialogWindow from '@infotech/uikit-dialog-panel';
import Select from '@infotech/uikit-select';
import {Div} from '@infotech/uikit-grid';
import Input from '@infotech/uikit-input'
import {TimeIcon} from '@infotech/uikit-icons';

import {Modal} from '../../components';
import styles from './ObserveObjectModal.pcss';

type TProps = {
  observeObject: (params: {}) => mixed,
  closeModal: () => mixed,
  connectionId: string,
  getEmployees: () => mixed,
  employess: Array<{uuid: string, fullname: string}>,
  isFetchingEmployees: boolean
};

type TState = {
  countHours: string,
  activeTech: {value: string, label: string}
};

export default class ObserveObjectModal extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      countHours: '48',
      activeTech: null,
    };
  }

  componentDidMount() {
    if (this.props.employess.length < 1) {
      this.props.getEmployees();
    }
  }

  onChangeCountHours = (countHours: string) => {
    this.setState({ countHours });
  }

  onChangeActiveTech = (activeTech: {value: string, label: string}) => {
    this.setState({ activeTech });
  }

  observeObject = () => {
    const {
      state: {activeTech, countHours},
      props: {observeObject, connectionId, closeModal, ObjectId, supervisionId},
    } = this;
    const params = {
      techId: activeTech.uuid,
      connectionId,
      observeFrom: moment().format('X'),
      observeUntil: moment().add(countHours, 'h').format('X'),
      supervisionStatus: 'ACTIVE',
    };
    observeObject(supervisionId, params, ObjectId);
    closeModal();
  }

  render() {
    const {
      state: {countHours, activeTech},
      props: {isFetchingEmployees, employess}
    } = this;
    const disabledBtn = isFetchingEmployees || !activeTech || !countHours;

    return (<Modal>
      <ModalDialogWindow
        className={styles.modalWindow}
        title="Взятие под наблюдение"
        okButton={{
          onClick: this.observeObject,
          children: 'Наблюдать',
          disabled: disabledBtn,
        }}
        cancelButton={{
          onClick: this.props.closeModal
        }}
      >
        <Div flex>
          <Div w={'252px'} mr={'1md'}>
            <Div>Техник</Div>
            <Select
              placeholder="Выбрать"
              options={employess}
              searchable
              value={activeTech}
              onChange={this.onChangeActiveTech}
              isLoading={isFetchingEmployees}
              getOptionLabel={(option: {fullname: string}) => option.fullname}
              getOptionValue={(option: {uuid: string}) => option.uuid}
            />
          </Div>
          <Div w={'112px'}>
            <Div>Кол-во часов</Div>
            <div className={styles.inputWrapper}>
              <Input
                value={countHours}
                onChange={this.onChangeCountHours}
              />
              <TimeIcon className={styles.timeIcon} />
            </div>
          </Div>
        </Div>
      </ModalDialogWindow>
    </Modal>);
  }
}