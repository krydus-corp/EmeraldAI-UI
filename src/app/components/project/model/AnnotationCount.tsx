import { displayRoundNumber } from "../../../../utils/common";

interface Props {
  annotationCount: number | null;
  averagePerImage: number | null;
  classesCount: number | null;
}

const AnnotationCount = ({ annotationCount, averagePerImage, classesCount }: Props) => {
    return (<>
              <div className='count'>{annotationCount}</div>
              <p>{displayRoundNumber(averagePerImage)} per image (average)</p>
              <p>across {classesCount} classes</p>
          </>);
  };
  
export default AnnotationCount;
