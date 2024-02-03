import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
    images: (Array<object>);
    fetchData: any;
    content: (any);
    renderImages: any;
}

const InfiniteScrollComponent = (props: IProps) => {
    return (
        <InfiniteScroll
        className='scroll'
        scrollThreshold='200px'
        dataLength={props.images.length}
        next={props.fetchData}
        hasMore={props.images.length !== props.content.count}
        loader={
          <div className='loader-inline'>
            <div className='loader-inner'></div>
          </div>
        }
      >
        {props.renderImages}
      </InfiniteScroll>
    );
};

export default InfiniteScrollComponent;
