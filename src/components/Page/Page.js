// @flow
import React, {Component} from 'react';
import type {Node} from 'react';
import Helmet from 'react-helmet';
import {ToastContainer, toast} from 'react-toastify';

import {Box} from '@infotech/uikit-grid';

import Header from '../Header/Header';
import styles from './Page.pcss';

type TProps = {
  title: string,
  children: Node,
  breadcrumbs: Array<{ name: string, to?: string, id: number | string }>
};

class Page extends Component<TProps> {
  render() {
    return (
      <Box flex column h="100vh" loose className={styles.page}>
        <Header title={this.props.title}
                className={styles.header}
                breadcrumbs={this.props.breadcrumbs}
                type=""
        />
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <Box grow={1} shrink="1" basic="auto" className={styles.content}>
          {this.props.children}
        </Box>
        <ToastContainer
          className={styles.toastContainer}
          position={toast.POSITION.BOTTOM_LEFT}
          hideProgressBar
          closeButton={false}
          closeOnClick={false}
        />
      </Box>
    );
  }
}

export default Page;
