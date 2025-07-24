import { CSSProperties } from 'react';

export const outerDivStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
};

const common: CSSProperties = {
  gap: '1rem',
  padding: '1rem',
  justifyContent: 'center',
};

export const divContainerButtons: CSSProperties = {
  maxHeight: '30vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export const divButtonsStylesRow: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  ...common,
};

export const divButtonsStylesColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  ...common,
};
