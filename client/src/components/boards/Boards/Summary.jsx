/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Icon } from 'semantic-ui-react';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import Paths from '../../../constants/Paths';

import styles from './Summary.module.scss';

const Summary = React.memo(({ id, index }) => {


  const isActive = true
  const dispatch = useDispatch();

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={true}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div {...draggableProps} {...dragHandleProps} ref={innerRef} className={styles.wrapper}>
          <div className={classNames(styles.tab, isActive && styles.tabActive)}>
            <Link

              title="Summary"
              className={styles.link}
            >
              <span className={styles.name}>Summary</span>
            </Link>
          </div>
        </div>
      )}
    </Draggable>
  );
});

Summary.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Summary;
