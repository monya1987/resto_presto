// @flow
import React, {Component} from 'react';
import {inject, observer} from "mobx-react/index";
import classNames from 'classnames';

import {Box} from '@infotech/uikit-grid';
import ModalDialogWindow from '@infotech/uikit-dialog-panel';
import DataGrid from '@infotech/uikit-datagrid';
import {OkIcon} from '@infotech/uikit-icons';
import {Modal} from '../../components';
import styles from './ResponseServiceModal.pcss';

type TData = {
  address: string,
  service: string,
  type: string,
  description: string,
  contacts: Array<{ name: string, phone: string, password: string, info: string }>,
  length: number
};

type TProps = {
  data: Array<TData>,
  setActiveTeam: (selectedTeam: {}) => {},
  switchServiceModalState: () => {},
  fetchResponseTeams: () => {},
  responseTeam: {}
};

type TState = {
  selectedTeam: {status?: string}
};

const columns = [{
  Header: 'Номер',
  accessor: 'number',
  width: 75
}, {
  Header: 'Статус',
  accessor: 'status',
  width: 100,
  Cell: (props: { original: { status: string } }) => {
    const {original: {status}} = props;
  return <Box loose className={styles.statusCell}>
    <span className={status === 'Свободен' ? styles.statusAvailable : styles.statusBusy} />
    <span>{status}</span>
  </Box>
},
}, {
  Header: 'Расстояние до объекта',
  accessor: 'distance',
  width: 185
}, {
  Header: 'ФИО',
  accessor: 'fio',
  width: 150
}, {
  Header: 'Телефон',
  accessor: 'phone',
  width: 160,
  Cell: (props: { original: { phone: '' }, classes: Array<{ indexOf: (styles: Array<{active: string}>) => number}> }) => {
    const {original: {phone}, classes} = props;
    const isActive = classes[0].indexOf(styles.active) > -1;
    return <Box loose className={styles.phoneCell}>
      <span>{phone}</span>
      <OkIcon className={isActive ? styles.show : styles.hidden}/>
    </Box>
  },
}];

@inject('store')
@observer
class ResponseServiceModal extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      selectedTeam: {}
    }
  }

  componentDidMount() {
    this.props.fetchResponseTeams();
  }

  selectService = (selectedTeam: {status?: string}) => {
    this.setState({
      selectedTeam
    })
  };

  setActiveTeam = () => {
    this.props.setActiveTeam(this.state.selectedTeam);
    return this.closeModal();
  };

  closeModal = () => {
    this.setState({selectedTeam: {}});
    return this.props.switchServiceModalState();
  };

  render() {
    const {
      props: {
        responseTeam,
        data
      },
      state: {
        selectedTeam
      }
    } = this;
    const disabledBtn = (Object.keys(selectedTeam).length === 0 && Object.keys(responseTeam).length === 0 && selectedTeam.status !== 'Свободен');

    return (
      <Modal>
        <ModalDialogWindow
          className={styles.modalWindow}
          title="Выбор наряда реагирования"
          okButton={{
            onClick: this.setActiveTeam,
            children: 'Выбрать',
            disabled: disabledBtn
          }}
          cancelButton={{
            onClick: this.closeModal
          }}
        >
          {data.length > 0 && <DataGrid
            data={data}
            columns={columns}
            className={styles.table}
            showPagination={false}
            getTdProps={(state: {}, rowInfo: {original: {}}) => {
              return {
                className: classNames({
                  [styles.row]: true,
                  [styles.active]: (rowInfo.original === selectedTeam || rowInfo.original === responseTeam)
                }),
                onClick: () => {
                  this.selectService(rowInfo.original);
                }
              }
            }}
          />}
        </ModalDialogWindow>
      </Modal>
    )
  }
}

export default ResponseServiceModal;
