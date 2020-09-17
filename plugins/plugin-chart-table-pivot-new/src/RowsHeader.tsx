import { Grid, GridItem } from './Layout';
import React from 'react';
import { t } from '@superset-ui/core';

const RowsHeader = ({ rowUnits, numberOfRows, uiColumnUnits, columns, rows, uiRowUnits }) => (
  <Grid
    gridTemplateColumns={`repeat(${Object.keys(rowUnits).length}, max-content)`}
    gridTemplateRows={`repeat(${numberOfRows + 2}, max-content)`}
    gridAutoFlow="column"
  >
    <Grid
      gridColumn={`span ${Object.keys(rowUnits).length}`}
      gridTemplateColumns="1fr"
      gridTemplateRows={`repeat(${Object.keys(uiColumnUnits).length}, max-content)`}
    >
      <GridItem bordered header bgLevel={2}>
        {t('metrics')}
      </GridItem>
      {columns.map(column => (
        <GridItem bordered header bgLevel={2}>
          {column}
        </GridItem>
      ))}
    </Grid>
    {rows.map(row =>
      uiRowUnits[row].map((item, index) => (
        <GridItem
          header
          bordered
          bgLevel={3}
          // If index === 0, it's header of columns for rows
          gridRow={`span ${index === 0 ? 1 : numberOfRows / (uiRowUnits[row].length - 1)}`}
        >
          {item}
        </GridItem>
      )),
    )}
  </Grid>
);

export default RowsHeader;
