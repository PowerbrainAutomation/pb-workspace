/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tab } from 'semantic-ui-react';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { useClosableModal } from '../../../hooks';
import SummaryPane from './SummaryPane';

import styles from './ProjectSummaryModal.module.scss';

const ProjectSummaryModal = React.memo(() => {
  const withManagablePanes = useSelector(selectors.selectIsCurrentUserManagerForCurrentProject);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleClose = useCallback(() => {
    dispatch(entryActions.closeModal());
  }, [dispatch]);

  const handleTabChange = useCallback((_, { activeIndex }) => {
    setActiveTabIndex(activeIndex);
  }, []);

  const [ClosableModal] = useClosableModal();

  const panes = [
    {
      menuItem: "Project Summary",
      render: () => <SummaryPane />,
    },
  ];

  return (
    <ClosableModal
      closeIcon
      size="large"
      centered={false}
      onClose={handleClose}
    >
      <ClosableModal.Content>
        <Tab
          menu={{
            secondary: true,
            pointing: true,
          }}
          panes={panes}
          onTabChange={handleTabChange}
        />
      </ClosableModal.Content>
    </ClosableModal>
  );
});

export default ProjectSummaryModal;
