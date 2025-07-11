/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button,
         Divider,
         Header,
         Tab,
         AccordionTitle,
         AccordionContent,
         Accordion,
         Icon,
         TableRow,
         TableHeaderCell,
         TableHeader,
         TableCell,
         TableBody,
         Table,
         Transition
} from 'semantic-ui-react';

// echarts
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

import styles from './SummaryPane.module.scss';
import { use } from 'i18next';

const SummaryPane = React.memo(() => {
  // TODO: rename?

  const [isActive, setActive] = useState([0,1]);

  const onClick = (e, titleProps) => {

    const { index } = titleProps;
    const activeIndex  = isActive
    const newIndex = activeIndex.includes(index)
    ? activeIndex.filter(i => i !== index) // remove if exists
    : [...activeIndex, index]
    setActive(newIndex)

  }

  useEffect(() => {
    console.log('isActive', isActive);
  }, [isActive]);


  const SummaryCurve = () => {

    let option = {
      grid: { top: 8, right: 8, bottom: 24, left: 36 },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [10, 12, 24, 76, 90, 95, 100],
          type: 'line'
        }
      ]
    };

    return (
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={true}
      />
    )
  }

  const SummaryTable = () => {
    return (
    <div className={styles.tableWrapper}>
      <Table celled striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Task</TableHeaderCell>
            <TableHeaderCell>Harga</TableHeaderCell>
            <TableHeaderCell>Start</TableHeaderCell>
            <TableHeaderCell>Finish</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>
              IUPTLS - NIDI - SLO
            </TableCell>
            <TableCell> 35.000.000 IDR </TableCell>
            <TableCell> 2025/07/01 </TableCell>
            <TableCell> 2025/07/30 </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              PV Cable
            </TableCell>
            <TableCell>230.000.000 IDR</TableCell>
            <TableCell> 2025/07/01 </TableCell>
            <TableCell> 2025/07/30 </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              ACDB
            </TableCell>
            <TableCell>53.000.000 IDR</TableCell>
            <TableCell> 2025/07/01 </TableCell>
            <TableCell> 2025/07/30 </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Sensor
            </TableCell>
            <TableCell>34.000.000 IDR</TableCell>
            <TableCell> 2025/07/01 </TableCell>
            <TableCell> 2025/07/30 </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              PV Mounting
            </TableCell>
            <TableCell>23.000.000 IDR</TableCell>
            <TableCell> 2025/07/01 </TableCell>
            <TableCell> 2025/07/30 </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    )
  }

  const panels = [
    {
      index: 0,
      key: "overview",
      title: "Overview",
      content: { content:<SummaryCurve/> },
      onTitleClick: onClick,
      active: isActive.includes(0) ? true : false
    },
    {
      index: 1,
      key: "procurement-list",
      title: "Procurement List",
      content: { content: <SummaryTable />},
      onTitleClick: onClick,
      active: isActive.includes(1) ? true : false
    }
  ]
  return (
    <Tab.Pane attached={false} className={styles.wrapper}>
      <Accordion fluid styled exclusive={false} panels={panels}>
      </Accordion>
    </Tab.Pane>
  );
});

export default SummaryPane;
