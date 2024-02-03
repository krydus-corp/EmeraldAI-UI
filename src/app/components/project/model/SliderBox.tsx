import ReactSlider from 'react-slider';
import styled from 'styled-components';
import { NumberLimit } from '../../../../constant/number';

const StyledThumb = styled.div`
  height: 25px;
  line-height: 25px;
  width: 25px;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  cursor: grab;
`;

const Thumb = (props: any, state: any) => (
  <StyledThumb {...props}>{`${state.valueNow}%`}</StyledThumb>
);
const ThumbDegree = (props: any, state: any) => (
  <StyledThumb {...props}>{`${state.valueNow}°`}</StyledThumb>
);
const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props: any) =>
    props.index === NumberLimit.TWO
      ? '#47484b'
      : props.index === NumberLimit.ONE
      ? '#48fabe'
      : '#47484b'};
  border-radius: 999px;
`;

const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
);

interface Props {
  filterType: string;
  orientation: 'horizontal' | 'vertical';
  streachZoomin?: Function;
  changeCropRatio?: Function;
  sliderRange: Array<number>;
  forImageRotate?: Function;
  maxRange?: number;
}

const SliderBox = ({
  orientation,
  filterType,
  streachZoomin,
  changeCropRatio,
  sliderRange,
  forImageRotate,
  maxRange,
}: Props) => {
  const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 6px;
  `;
  const onSliderChange = (value: any) => {
    if (streachZoomin) {
      streachZoomin(value);
    }
    if (changeCropRatio) {
      changeCropRatio(value, orientation);
    }
    if (forImageRotate) {
      forImageRotate(value);
    }
  };
  return (
    <>
      <StyledSlider
        defaultValue={sliderRange}
        renderTrack={Track}
        renderThumb={forImageRotate ? ThumbDegree : Thumb}
        orientation={'horizontal'}
        onAfterChange={onSliderChange}
        className='slider'
        max={maxRange ? maxRange : NumberLimit.ONE_HUNDRED}
      />
    </>
  );
};

export default SliderBox;
