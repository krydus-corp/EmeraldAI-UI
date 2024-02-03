interface Props {
  averageImageHeightPixels: number | null;
  averageImageWidthPixels: number | null;
}
const MedianImageRatio = ({ averageImageHeightPixels, averageImageWidthPixels }: Props) => {
    return (<>
               <div className='count'>{averageImageHeightPixels}x{averageImageWidthPixels}</div>
                <p>wide</p>
          </>);
  };
  
export default MedianImageRatio;
