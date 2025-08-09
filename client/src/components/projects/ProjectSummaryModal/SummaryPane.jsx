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
import selectors from '../../../selectors';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

import styles from './SummaryPane.module.scss';
import { use } from 'i18next';
import { color } from 'echarts';

const SummaryPane = React.memo(() => {
  // TODO: rename?

  // Hardcoded for now
  const token = 'eix4lohp8os2pief5ieDahngahg7ku6oxor5UkeiMo7ra5tha2oiphaed2toitai0gaefahPhu7eequeiriech2ahm8Yeinahpe2die2eehagh0thuu7ooKahD0shah3ohNgeeSoyeeb9eiGhee0eiV0exoo4foovai2aijaiTaiQuohXie8hae3Owoongi0aiTh0waighaeraichaegiS8Iewohva0lai0ahDahngeebaeng0oud8aew5waixeichoh1ooriP8Ohrohjeikae9xiu3ieJaiyohsoh1IeKoxoh5aevaic3eekei2eon5johchei0ohohj4ieng3Phaijeef1aisoolood1AiGiNgeek9AhK5zoo6eeveepheil3Soh0ookaexa7xaj2ita0thahx5piechee7vae7yieFamei1Eisaeciewi6AemaiXahSheofephaiwahbihaseo8ierahngiTie3kohk3mieghe2kieneiHu4zoocu'

  const project = useSelector(selectors.selectCurrentProject);

  const [projectData, setProjectData] = useState([]);
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
    fetch(`https://ext.workspace.powerbrain.id/${token}/project/1563943224110744964`).then( async x => setProjectData( await x.json() ));
  }, []);

  useEffect(() => {
    console.log('isActive', isActive);
  }, [isActive]);

  useEffect(() => {
    console.log('projectData', projectData);
  }, [projectData]);


  const SummaryCurve = ({data}) => {

    let option = {
      tooltip: {
        show:true,
        trigger: 'axis',
        valueFormatter: (value) => `${value} %`,
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
				bottom: '20px',
				left: '50px',
				right: '10px',
				top: '12px'
			},
      xAxis: {
        type: 'category',
        data: data['echarts_cat']
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100
      },
      series: data['echarts_series']
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

  const SummaryTable = ({data}) => {
    const TableRows = data.procurement_list?.map( x => (
      <TableRow>
            <TableCell>
              {x.name}
            </TableCell>
            <TableCell> {x.budget} IDR </TableCell>
            <TableCell> {x.start} </TableCell>
            <TableCell> {x.finish} </TableCell>
          </TableRow>
    ))

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
          {TableRows}
        </TableBody>
      </Table>
    </div>
    )
  }

  const panels = [
    {
      index: 0,
      key: "s-curve",
      title: "S Curve",
      content: { content:<SummaryCurve data={projectData}/> },
      onTitleClick: onClick,
      active: isActive.includes(0) ? true : false
    },
    {
      index: 1,
      key: "procurement-list",
      title: "Procurement List",
      content: { content: <SummaryTable data={projectData}/>},
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
