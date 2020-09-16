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
import { ChartProps, DataRecord } from '@superset-ui/core';

type TablePivotNewDatum = DataRecord;
export const SPLITTER = '±!@#$';

const multiplyArray = (arr, times) => {
  let newArray = [...arr];
  for (let i = 0; i < times - 1; i++) {
    newArray = newArray.concat(arr);
  }
  return newArray;
};

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your TablePivotNew.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queryData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queryData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queryData } = chartProps;
  const data = queryData.data as TablePivotNewDatum[];
  const metrics = formData.metrics.map(({ label }) => label);
  const { rows, columns } = formData;

  let columnUnits = {};
  let rowUnits = {};

  console.log('formData via TransformProps.ts', formData, data);

  const buildUnits = (item, dimension, dimensionUnits) => {
    dimension.forEach(unit => {
      if (!dimensionUnits[unit]) {
        dimensionUnits[unit] = new Set([]);
      }
      dimensionUnits[unit].add(item[unit]);
    });
    return dimensionUnits;
  };

  data.forEach(item => {
    columnUnits = buildUnits(item, columns, columnUnits);
    rowUnits = buildUnits(item, rows, rowUnits);
  });

  let prevKey = null;

  const uiColumnUnits = Object.entries(columnUnits).reduce((acc, [key, val], i) => {
    acc[key] = multiplyArray([...val], (acc[prevKey] || metrics).length);
    prevKey = key;
    return acc;
  }, {});

  let numberOfColumns = 1;
  columnUnits = Object.entries(columnUnits).reduce((acc, [key, val], i) => {
    acc[key] = [...val];
    prevKey = key;
    numberOfColumns *= acc[key].length;
    return acc;
  }, {});

  rowUnits = Object.entries(rowUnits).reduce((acc, [key, val], i) => {
    acc[key] = [...val];
    return acc;
  }, {});

  let columnsOneDimension = [];
  const getAllColumns = columnIndex => {
    if (columnIndex === columns.length - 1) {
      columnsOneDimension = columnsOneDimension.concat(columnUnits[columns[columnIndex]]);
    } else {
      columnUnits[columns[columnIndex]].forEach(columnUnit => {
        columnsOneDimension.push(columnUnit);
        getAllColumns(columnIndex + 1);
      });
    }
  };

  getAllColumns(0);

  let rowsOneDimension = [];
  const getAllRows = rowIndex => {
    if (rowIndex === rows.length - 1) {
      rowsOneDimension = rowsOneDimension.concat(rowUnits[rows[rowIndex]]);
    } else {
      rowUnits[rows[rowIndex]].forEach(rowUnit => {
        rowsOneDimension.push(rowUnit);
        getAllRows(rowIndex + 1);
      });
    }
  };

  getAllRows(0);

  const numberOfRows = rows.reduce((acc, cur) => acc * rowUnits[cur].length, 1);
  const result = [];
  result.length = numberOfRows * numberOfColumns * metrics.length;
  result.fill(-1);
  data.forEach(item => {
    metrics.forEach((metric, metricIndex) => {
      let positionColumn = 0;
      let realColumnIndex = 0;
      columns.forEach((column, columnIndex) => {
        positionColumn = columnsOneDimension.indexOf(item[column], positionColumn);
      });
      columnsOneDimension.slice(0, positionColumn).forEach(dim => {
        if (columnUnits[columns[columns.length - 1]].includes(dim)) {
          realColumnIndex++;
        }
      });

      let positionRow = 0;
      let realRowIndex = 0;
      rows.forEach(row => {
        positionRow = rowsOneDimension.indexOf(item[row], positionRow);
      });
      rowsOneDimension.slice(0, positionRow).forEach(dim => {
        if (rowUnits[rows[rows.length - 1]].includes(dim)) {
          realRowIndex++;
        }
      });

      result[
        realColumnIndex +
          metricIndex * numberOfColumns +
          realRowIndex * (numberOfColumns * metrics.length)
      ] = item[metric];
    });
  });

  return {
    width,
    height,
    data: result,
    rows,
    columnUnits: uiColumnUnits,
    rowUnits,
    columns,
    numberOfColumns: numberOfColumns * metrics.length,
    numberOfRows,
    metrics,
  };
}
