// @flow
import {toast} from 'react-toastify';
import React from 'react';

import {playNotifySound} from './sound';
import {ToastGetToWork, ToastTimer} from '../components';
import {toastTypes} from './enums';

export default function Toast(message: {type: string}, props?: {} = {}, func: () => mixed) {
  const typesToast = {
    [toastTypes.getToWork]: <ToastGetToWork />,
    [toastTypes.timer]: <ToastTimer repeatReminder={func}/>,
  };
  const autoClose = message.type === toastTypes.timer ? false : 5000;
  toast(typesToast[message.type], {...props, onOpen: playNotifySound(), autoClose});
}