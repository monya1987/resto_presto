// @flow
import React from 'react';

import Spin from '@infotech/uikit-spin';
import {LoaderIcon} from '@infotech/uikit-icons';

import styles from './Loader.pcss';

type TProps = {
  size: string,
  loading?: boolean
};

export default ({size='big', loading}: TProps) => {
  if (loading === undefined || loading) {
    return <Spin speed='1s' className={styles.loader}>
      <LoaderIcon size={size} color='#2880FF'/>
    </Spin>
  }
  return '';
}
