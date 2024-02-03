interface Props {
  calcuateAvgImgSize: Function;
  calcuateMaxImgSize: Function;
  calcuateMinImgSize: Function;
}

const AverageImageSize = ({ calcuateAvgImgSize, calcuateMinImgSize,
  calcuateMaxImgSize }: Props) => {
    return (<>
              <div className='count'>{calcuateAvgImgSize()} MB</div>
                <p>
                from <span className='green'>{calcuateMinImgSize()} MB</span>
                </p>
                <p>
                to <span className='green'>{calcuateMaxImgSize()} MB</span>
                </p>
          </>);
  };
  
export default AverageImageSize;
