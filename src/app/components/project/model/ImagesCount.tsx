
interface Props {
  imagesCount: number | null;
  missingAnnotation: number | null;
  nullExample: number | null;
}

const ImagesCount = ({ imagesCount, missingAnnotation, nullExample }: Props) => {
  return (<>
            <div className='count'>{imagesCount}</div>
            <p>{missingAnnotation} missing annotations</p>
            <p>{nullExample} null examples</p>
        </>);
};

export default ImagesCount;
