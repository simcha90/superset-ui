import React from 'react';
import { Grid, GridItem } from './Layout';
import { ROW_HEIGHT } from '../plugin/utils';
import HeadersOfHeader from './HeaderOfHeader';

const RowsHeader = ({ numberOfRows, columns, rows, uiRowUnits, rowsFillData }) => (
  <Grid
    gridTemplateColumns={`repeat(${rows.length || 1}, max-content)`}
    gridTemplateRows={`max-content max-content ${rowsFillData
      .map(fillData => `${fillData ? ROW_HEIGHT : 0}`)
      .join(' ')}`}
    gridAutoFlow="column"
  >
    <HeadersOfHeader rows={rows} columns={columns} />
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
