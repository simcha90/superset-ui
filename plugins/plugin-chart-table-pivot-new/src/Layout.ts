import { styled } from '@superset-ui/core';
import { supersetTheme } from '@superset-ui/style';

export const Grid = styled.div`
  ${({ bordered }) => bordered && 'border: 1px solid black;'}
  display: grid;
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridAutoFlow }) => gridAutoFlow && `grid-auto-flow: ${gridAutoFlow};`}
  ${({ gridTemplateColumns }) =>
    gridTemplateColumns && `grid-template-columns: ${gridTemplateColumns};`}
  ${({ gridTemplateRows }) => gridTemplateRows && `grid-template-rows: ${gridTemplateRows};`}
`;

export const FillItem = styled.div`
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const GridItem = styled(FillItem)`
  ${({ bgLevel }) =>
    bgLevel && `background-color: ${supersetTheme.colors.grayscale[`light${bgLevel}`]};`}
  ${({ header }) => header && 'font-weight: bolder;'}
  ${({ bordered }) => bordered && 'border: 1px solid black;'}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
`;
