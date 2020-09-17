import { Grid, GridItem } from './Layout';
import React from 'react';
import { t } from '@superset-ui/core';

const HeadersOfHeader = ({ rows, columns }) => (
  <Grid
    gridColumn={`span ${rows.length || 1}`}
    gridTemplateColumns="1fr"
    gridTemplateRows={`repeat(${columns.length || 1}, max-content)`}
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
);

export default HeadersOfHeader;
