// @flow
import React from 'react';
import {Div} from '@infotech/uikit-grid';
import {OkIcon, CloseIcon} from '@infotech/uikit-icons';

import styles from './Toast.pcss';

export default function (props: {text: string, closeToast: () => mixed}) {
  const { closeToast, text } = props;
  return (<Div flex align="center">
    <OkIcon className={styles.okIcon} />
    <Div className={styles.text} mr={"38px"} ml={"24px"}>{text} взята в работу</Div>
    <button type="button" onClick={closeToast} className={styles.button}><CloseIcon className={styles.closeBtn} /></button>
  </Div>);
}