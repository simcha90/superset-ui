/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

import React from 'react';
import { styled, t } from '@superset-ui/core';
import { Grid, GridItem } from './Layout';
import RowsHeader from './RowsHeader';
import ColumnsHeader from './ColumnsHeader';
import { ROW_HEIGHT } from '../plugin/utils';

export type TablePivotNewProps = {
  height: number;
  width: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<any, any>; // please add additional typing for your data here
};

const StyledGrid = styled(Grid)`
  overflow: scroll;
`;

const NoData = styled.div`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function TablePivotNew(props: TablePivotNewProps) {
  const {
    data,
    columns,
    rows,
    numberOfRows,
    metrics,
    width,
    height,
    totalNumberOfColumns,
    uiColumnUnits,
    columnsFillData,
    rowsFillData,
    uiRowUnits,
  } = props;

  return (
    <StyledGrid
      height={height}
      width={width}
      gridTemplateColumns="max-content"
      gridTemplateRows="auto"
    >
      {rows.length === 0 && columns.length === 0 ? (
        <NoData>{t('No data to show')}</NoData>
      ) : (
        <Grid bordered gridTemplateColumns="auto auto">
          <RowsHeader
            rowsFillData={rowsFillData}
            numberOfRows={numberOfRows}
            columns={columns}
            rows={rows}
            uiRowUnits={uiRowUnits}
          />
          <Grid
            gridTemplateColumns={columnsFillData
              .map(fillData => `${fillData ? 'max-content' : 0}`)
              .join(' ')}
            gridTemplateRows={`repeat(${columns.length + 2}, ${ROW_HEIGHT}) ${rowsFillData
              .map(fillData => `${fillData ? ROW_HEIGHT : 0}`)
              .join(' ')}`}
          >
            <ColumnsHeader
              columnsFillData={columnsFillData}
              metrics={metrics}
              uiColumnUnits={uiColumnUnits}
              columns={columns}
              totalNumberOfColumns={totalNumberOfColumns}
            />
            {data.map((item, index) => {
              return (
                <GridItem
                  bordered
                  hidden={
                    !(
                      columnsFillData[index % totalNumberOfColumns] &&
                      rowsFillData[Math.floor(index / totalNumberOfColumns)]
                    )
                  }
                >
                  {item}
                </GridItem>
              );
            })}
          </Grid>
        </Grid>
      )}
    </StyledGrid>
  );
}
