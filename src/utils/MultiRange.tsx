import React, { useEffect, useState } from 'react';
import { useRanger } from 'react-ranger';
import styled, { createGlobalStyle } from 'styled-components';
import { NumberLimit } from '../constant/number';

interface Props {
  range: Array<number>;
  setRange: Function;
}

const GlobalStyles = createGlobalStyle`
  body {
   font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; 
   font-weight: 300;
  }
`;

export const Track = styled('div')`
  display: inline-block;
  height: 4px;
  width: 100%;
  margin: 0;
  border-radius: 4px;
`;

export const Tick = styled('div')`
  :before {
    content: '';
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 5px;
    width: 2px;
    transform: translate(-50%, 0.7rem);
  }
`;

export const TickLabel = styled('div')`
  position: absolute;
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.5);
  top: 100%;
  transform: translate(-50%, 1.2rem);
  white-space: nowrap;
`;

export const Segment = styled('div')`
  background: ${(props: { index: number }) =>
    props.index === NumberLimit.ZERO
      ? '#48fabe'
      : props.index === NumberLimit.ONE
      ? '#ffda56'
      : props.index === NumberLimit.TWO
      ? '#6fb9ff'
      : '#48fabe'};
  height: 100%;
`;

export const Handle = styled('div')`
  background: #fff;
  border: solid 3px #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  font-size: 0;
  white-space: nowrap;
  color: white;
  font-weight: ${(props: { active: any }) =>
    props.active ? 'bold' : 'normal'};
`;

const MultiRange = ({ range, setRange }: Props) => {
  const [values, setValues] = useState(range);

  useEffect(() => {
    setRange(values);
  }, [values]);

  const { getTrackProps, segments, handles } = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values: range,
    onChange: setValues,
  });

  return (
    <div>
      <GlobalStyles />
      <Track {...getTrackProps()}>
        {segments.map(({ getSegmentProps }: any, i: any) => (
          <Segment {...getSegmentProps()} index={i} />
        ))}
        {handles.map(({ value, active, getHandleProps }) => (
          <button
            {...getHandleProps({
              style: {
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                outline: 'none',
              },
            })}
            className='slider-btn'
          >
            <Handle active={active}>{value}</Handle>
          </button>
        ))}
      </Track>
    </div>
  );
};

export default MultiRange;
