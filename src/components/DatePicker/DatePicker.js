// @flow
import React from 'react';
import DatePicker from '@infotech/uikit-datepicker';

import styles from './DatePicker.pcss';

type TProps = {
  fullHeight: boolean,
  value: Date,
  onChange: (value: Date) => mixed,
  inline: boolean
};

export default (props: TProps) => {
  const {
      fullHeight,
      value,
      onChange,
      inline
    } = props;

  return <div className={styles.datePickerContainer}>
    <DatePicker
      className={styles.datePicker}
      popupPlacement={fullHeight ? "bottom-left" : "top-left"}
      inputPlaceholder="ДД.ММ.ГГГГ, ЧЧ:ММ"
      value={value || null}
      inline={inline}
      adjustDirection
      onChange={onChange}
    />
  </div>
};