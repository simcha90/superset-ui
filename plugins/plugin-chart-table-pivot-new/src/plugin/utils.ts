const buildUnits = (item, dimension, _units) => {
  const units = { ..._units };
  dimension.forEach(unit => {
    if (!units[unit]) {
      units[unit] = new Set([]);
    }
    units[unit].add(item[unit]);
  });
  return units;
};

const multiplyArray = (arr, times) => {
  let newArray = [...arr];
  for (let i = 0; i < times - 1; i++) {
    newArray = newArray.concat(arr);
  }
  return newArray;
};

const extractUnits = (dimensionUnits, rootDimension, withHeader = false) => {
  let unitsSize = 1;
  let prevKey = null;
  const { units, uiUnits } = Object.entries(dimensionUnits).reduce(
    (acc, [key, val], i) => {
      acc.units[key] = [...val];
      unitsSize *= acc.units[key].length;

      acc.uiUnits[key] = multiplyArray(
        [...val],
        // For rows we need to add also column name to render it's correctly in css grid
        (acc.uiUnits[prevKey] || rootDimension).length - (withHeader ? 1 : 0),
      );
      if (withHeader) {
        acc.uiUnits[key].unshift(key);
      }
      prevKey = key;

      return acc;
    },
    {
      units: {},
      uiUnits: {},
    },
  );
  return {
    unitsSize,
    units,
    uiUnits,
  };
};

const buildOneDimensionUnits = (dimension, dimensionUnits) => {
  let oneDimensionUnits = [];
  const diveInDimension = dimensionIndex => {
    if (dimensionIndex === dimension.length - 1) {
      oneDimensionUnits = oneDimensionUnits.concat(dimensionUnits[dimension[dimensionIndex]]);
    } else {
      dimensionUnits[dimension[dimensionIndex]].forEach(dimensionUnit => {
        oneDimensionUnits.push(dimensionUnit);
        diveInDimension(dimensionIndex + 1);
      });
    }
  };
  diveInDimension(0);
  return oneDimensionUnits;
};

export const getUnits = (data, columns, rows, metrics) => {
  let baseColumnUnits = {};
  let baseRowUnits = {};

  data.forEach(item => {
    baseColumnUnits = buildUnits(item, columns, baseColumnUnits);
    baseRowUnits = buildUnits(item, rows, baseRowUnits);
  });

  const { units: columnUnits, unitsSize: numberOfColumns, uiUnits: uiColumnUnits } = extractUnits(
    baseColumnUnits,
    metrics,
  );
  const { units: rowUnits, unitsSize: numberOfRows, uiUnits: uiRowUnits } = extractUnits(
    baseRowUnits,
    [null, null],
    true,
  );

  const oneDimensionColumns = buildOneDimensionUnits(columns, columnUnits);
  const oneDimensionRows = buildOneDimensionUnits(rows, rowUnits);

  return {
    numberOfColumns,
    numberOfRows,
    columnUnits,
    rowUnits,
    uiColumnUnits,
    uiRowUnits,
    oneDimensionRows,
    oneDimensionColumns,
  };
};

const findUnitsIndex = (dimension, dimensionUnits, oneDimensionArray, item) => {
  let position = 0;
  let realIndex = 0;
  dimension.forEach(column => {
    position = oneDimensionArray.indexOf(item[column], position);
  });
  oneDimensionArray.slice(0, position).forEach(dim => {
    if (dimensionUnits[dimension[dimension.length - 1]].includes(dim)) {
      realIndex++;
    }
  });
  return realIndex;
};

export const getOneDimensionData = ({
  data,
  metrics,
  columnUnits,
  rowUnits,
  numberOfColumns,
  numberOfRows,
  columns,
  rows,
  oneDimensionColumns,
  oneDimensionRows,
}) => {
  const result = [];

  result.length = numberOfRows * numberOfColumns * metrics.length;
  result.fill(null);

  data.forEach(item => {
    metrics.forEach((metric, metricIndex) => {
      const columnIndex = findUnitsIndex(columns, columnUnits, oneDimensionColumns, item);
      const rowIndex = findUnitsIndex(rows, rowUnits, oneDimensionRows, item);

      result[
        columnIndex + metricIndex * numberOfColumns + rowIndex * (numberOfColumns * metrics.length)
      ] = item[metric];
    });
  });
  return result;
};
