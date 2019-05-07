// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {Box} from '@infotech/uikit-grid';

import styles from './BreadCrumbs.pcss';

export default ({breadcrumbs}: {breadcrumbs: Array<{name: string, to?: string, id: number | string }>}) => {
  return <Box className={styles.breadcrumbsWrapper}>
    {breadcrumbs.map((item: { name: string, to?: string, id: number | string }, i: number) => {
      const isLastBC = breadcrumbs.length === i + 1;
      return <Link to={item.to || '/'} key={item.id}
                   onClick={item.to ? null : (e: { preventDefault: () => mixed }) => e.preventDefault()}
                   className={classNames({
                     [styles.breadcrumbs]: true,
                     [styles.breadcrumbsLast]: isLastBC,
                   })}>
        &nbsp;{item.name}
        <span>{isLastBC ? '' : ` /`}</span>
      </Link>
    })}
  </Box>
};
