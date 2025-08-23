/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tab,
         Accordion,
         TableRow,
         TableHeaderCell,
         TableHeader,
         TableCell,
         TableBody,
         Table,
         Dimmer,
         Loader,
         DimmerDimmable,
         Message,
         MessageHeader,
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
  const [isActive, setActive] = useState([0]); // all open by default
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const onClick = (e, titleProps) => {

    const { index } = titleProps;
    const activeIndex  = isActive
    const newIndex = activeIndex.includes(index)
    ? activeIndex.filter(i => i !== index) // remove if exists
    : [...activeIndex, index]
    setActive(newIndex)

  }

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await fetch(`https://ext.workspace.powerbrain.id/${token}/project/1576716688517236434`);
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        setFetchError("No Data Available for This Project");
        console.error("Error fetching project data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
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

  const SummaryTable = ({data, type}) => {
    data.sort((a, b) => new Date(a.start) - new Date(b.start));
    const TableRows = data.map( x => (
      <TableRow>
            <TableCell>
              {x.name}
            </TableCell>
            <TableCell> {type.toLowerCase().includes('scm') || type.toLowerCase().includes('delivery') ? Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', currencyDisplay: 'symbol' }).format(x.budget) : x.budget}</TableCell>
            <TableCell> {x.start} </TableCell>
            <TableCell> {x.finish} </TableCell>
          </TableRow>
    ))

    return (
    <div className={styles.tableWrapper}>
      <Table celled striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Item Name</TableHeaderCell>
            <TableHeaderCell>{type.toLowerCase().includes('scm') || type.toLowerCase().includes('delivery') ? 'Harga' : 'Beban'}</TableHeaderCell>
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

  const panels = React.useMemo(() => {
    return [
      {
        index: 0,
        key: "s-curve",
        title: "S Curve",
        content: { content: <SummaryCurve data={projectData} /> },
        onTitleClick: onClick,
        active: isActive.includes(0)
      },
      ...(projectData?.board_card_list || []).map((item, index) => {
        const panelIndex = index + 1;
        return {
          index: panelIndex,
          key: item.name || `tab-${panelIndex}`,
          title: item.name || `Tab ${panelIndex}`,
          content: { content: <SummaryTable data={item.plans} type={item.name}/> },
          onTitleClick: onClick,
          active: isActive.includes(panelIndex)
        };
      })
    ];
  }, [projectData, isActive, onClick]);

  return (
      <DimmerDimmable as={Tab.Pane} blurring dimmed={isFetching || fetchError} attached={false} className={styles.wrapper}>
      <Dimmer active={isFetching || fetchError} inverted>
        {
          isFetching
          ? <Loader size='huge'><b>Fetching Data</b></Loader>
          : fetchError
            ?   <Message size='huge' negative>
                  <MessageHeader>{fetchError}</MessageHeader>
                </Message>
            : null
        }
      </Dimmer>
      <Accordion fluid styled exclusive={false} panels={panels}>
      </Accordion>
      </DimmerDimmable>
  );
});

export default SummaryPane;
