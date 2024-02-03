import { getFromCache } from 'small-cache';
import Async from 'react-async';
import { getTagsDetail } from '../../../service/tags';
interface Props {
    tag_id: string,
}
const DisplayTagName = ({ tag_id }: Props) => {
    const getTagsName = async () => {   
        if (tag_id) {
            const tagData = await getFromCache(
                `${tag_id}`,
                async () => {
                    const { data } = await getTagsDetail(tag_id);
                    return data;
                },
                {
                    TTL_InSeconds: 60,
                    enabled:true
                }
                );
                if (!tagData?.name) {
                return
            }else{
                return tagData?.name;
            }
            
        }
         
    };

    return (
      <>
        <Async promiseFn={() => {
                           return getTagsName();
                        }}>
            <Async.Loading>...</Async.Loading>
            <Async.Fulfilled>
                {data => {
                    return (<>{data}</>);
                }} 
            </Async.Fulfilled>
            <Async.Rejected>-</Async.Rejected>
        </Async>
      </>
    );
  };
  
  export default DisplayTagName;
