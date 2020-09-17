import { GridItem } from './Layout';
import React from 'react';

const ColumnsHeader = ({ metrics, uiColumnUnits, columns, totalNumberOfColumns }) => (
  <>
    {metrics.map(metric => (
      <GridItem
        bordered
        header
        bgLevel={2}
        gridColumn={`span ${totalNumberOfColumns / metrics.length}`}
      >
        {metric}
      </GridItem>
    ))}
    {columns.map(column =>
      uiColumnUnits[column].map(item => (
        <GridItem
          header
          bordered
          bgLevel={2}
          gridColumn={`span ${totalNumberOfColumns / uiColumnUnits[column].length}`}
        >
          <div>{item}</div>
        </GridItem>
      )),
    )}
    {/* One empty line for header columns of rows */}
    <GridItem
      header
      bordered
      gridColumn={`span ${totalNumberOfColumns}`}
      style={{ color: 'transparent' }}
    >
      :)
    </GridItem>
  </>
);

export default ColumnsHeader;
