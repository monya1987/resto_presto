// @flow
import React from 'react';
import {Box} from '@infotech/uikit-grid';

import styles from './Modal.pcss';

export default function (props: {children: typeof React}) {
  return (<Box className={styles.modalWrapper}>{props.children}</Box>)
}