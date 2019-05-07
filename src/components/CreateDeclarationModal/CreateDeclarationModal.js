// @flow
import React, {Component} from 'react';
import FileDrop from 'react-file-drop';

import {Box} from '@infotech/uikit-grid';
import ModalDialogWindow from '@infotech/uikit-dialog-panel';
import Button from '@infotech/uikit-button';
import {ImportCloudIcon, CloseIcon, FiletypePictureIcon} from '@infotech/uikit-icons';
import Textarea from '@infotech/uikit-textarea';
import Input from '@infotech/uikit-input';
import Select from '@infotech/uikit-select';

import {formattedSize} from "../../utils/helpers";
import styles from './CreateDeclarationModal.pcss';

type TProps = {
  switchCreateDeclarationModal: () => mixed
};

type TState = {
  subject: string,
  type: string,
  comment: string,
  uploadedFiles: Array<{
    lastModified: number,
    name: string,
    size: number
  }>,
  error: string
};

const options = [
  {value: 'tech', label: 'Техническое обслуживание'},
  {value: 'extra', label: 'Дополнительная проверка'}
];

export default class CreateDeclarationModal extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      subject: '',
      type: '',
      comment: '',
      uploadedFiles: [],
      error: ''
    }
  }

  closeModal = () => {
    this.setState({
      subject: '',
      type: '',
      comment: '',
      uploadedFiles: [],
      error: ''});
    return this.props.switchCreateDeclarationModal();
  };

  onChange = (name: string) => (value: string | {value?: string}) => {
    this.setState({
      [name]: value.value ? value.value : value,
      error: ''
    })

  };

  handleUploadFile = (files: {target: {files: Array<{lastModified: number, name: string, size: number}>}}) => {
    const {uploadedFiles} = this.state;
    let file = files.target.files[0];
    uploadedFiles.push(file);
    this.setState({
      uploadedFiles
    })
  };

  handleDropFile = (files: Array<{lastModified: number, name: string, size: number}>) => {
    const {uploadedFiles} = this.state;
    let file = files[0];
    uploadedFiles.push(file);
    this.setState({
      uploadedFiles
    })
  };

  deleteUploadedFile = (file: {}) => () => {
    const {uploadedFiles} = this.state;
    const newFiles = uploadedFiles.filter((item: {}) => item !== file);
    return this.setState({uploadedFiles: newFiles})
  };

  createDeclaration = () => {
    if (!this.state.subject) {
      this.setState({error: 'Это поле обязательно'});
    } else {
      this.props.switchCreateDeclarationModal();
    }
  };

  render() {
    const {
      state: {
        uploadedFiles
      }
    } = this;
    return (
      <Box className={styles.modalWrapper}>
        <ModalDialogWindow
          className={styles.modalWindow}
          title="Создание заявки"
          okButton={{
            onClick: this.createDeclaration,
            children: 'Создать'
          }}
          cancelButton={{
            onClick: this.closeModal
          }}
        >
          <Box loose>

            <Box w={1} loose flex column className={styles.declarationContent}>
              <span>Тема заявки*</span>
              <Input onChange={this.onChange('subject')} value={this.state.subject} error={this.state.error}
                     placeholder='Введите тему заявки'/>
            </Box>

            <Box w={1} loose flex column className={styles.declarationContent}>
              <span>Тип заявки</span>
              <Select options={options}
                      onChange={this.onChange('type')}/>
            </Box>

            <Box flex loose>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Объект</span>
                <span>41234 Комаров Абрам Валентинович</span>
              </Box>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Пультовой номер</span>
                <span>41234</span>
              </Box>
            </Box>
            <Box flex loose>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Адрес</span>
                <span>р-н. Москва, Арбатская улица, 16 к. 3, д. 22</span>
              </Box>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Служба сервиса</span>
                <span>ЦАО</span>
              </Box>
            </Box>
            <Box flex loose>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Тип</span>
                <span>Автоколонна</span>
              </Box>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Служба реагирования</span>
                <span>5 БП ЦАО</span>
              </Box>
            </Box>

            <Box>
              <Box w={1} loose flex column className={styles.declarationContent}>
                <span>Комментарий</span>
                <Textarea
                  minRows={3}
                  autoSize
                  onChange={this.onChange('comment')}
                />
              </Box>

              <Box>
                <div>
                  <FileDrop onDrop={this.handleDropFile} className={styles.dropBlock}>
                    <ImportCloudIcon className={styles.dropIconColor}/>
                    <span>Перетащите или <label htmlFor="files" id="file-drop">выберите файл</label></span>
                  </FileDrop>
                </div>

                <input
                  className={styles.uploadHidden}
                  accept="image/*"
                  id='files'
                  type="file"
                  onChange={this.handleUploadFile}
                />

                {uploadedFiles.length > 0 && this.renderUploadedFiles(uploadedFiles)}
              </Box>
            </Box>
          </Box>
        </ModalDialogWindow>
      </Box>
    )
  }

  renderUploadedFiles = (uploadedFiles: Array<{lastModified: number, name: string, size: number}>) => {
    return uploadedFiles.map((item: {lastModified: number, name: string, size: number}) => {
      const {lastModified, name, size} = item;
      return <Box key={lastModified} className={styles.filesListItem}>
        <FiletypePictureIcon/>
        <Box flex loose column className={styles.fileInfo}>
          <span>{name}</span>
          <span>{formattedSize(size)}</span>
        </Box>
        <Button clean rightIcon={CloseIcon} onClick={this.deleteUploadedFile(item)}/>
      </Box>
    })
  };
}