import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import _ from 'lodash';
interface IProps {
    open: boolean,
    closeModal: Function,
    queryTags: Array<Object>,
    selectedTagId: Function,
    existingTagId: Array<string>,
    searchTag: (value: string) => void
    predictionData?:any
    setColorIndex?:any
    strictMode?:boolean
    setStrict?:any
    strict?:boolean
    filterEnable?:boolean
    setFilterEnable?:any,
  }

const AnnotateFilterModal = ({ open, closeModal, queryTags, selectedTagId, existingTagId,filterEnable, searchTag, predictionData, setColorIndex, strictMode=false, setStrict,strict=false }: IProps) => {
  const [selectedTagIds, setSelectedTagIds] = useState<Array<string>>(existingTagId || []);
  const [tag, setTag] = useState<string>('');
  const [disabledSwitch, setDisabledSwitch] = useState(true)
  
  
  useEffect(() => {
    clearTag();
  }, []);
  
  const updateTagId = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const data = [...selectedTagIds];
    if (e.target.checked) {
      data.push(id);
    } else {
      const index = data.indexOf(id);
      if (index > -1) {
        data.splice(index, 1);
      }
    }
    setSelectedTagIds(data);
  };
  
  const applyFilter = () => {
    let indexValue:any=[]
    selectedTagIds.length === 0 && setColorIndex && setColorIndex([])
    selectedTagIds?.forEach((data:any,ind:number)=>{
      const sortedpredictions=predictionData?.predictions_per_class && _.sortBy(predictionData?.predictions_per_class,'count').reverse(); 
      sortedpredictions?.forEach((predict:any,i:number)=>{
        if(predict.tagid === data){
          indexValue.push({tagName:predict.classname,index:i})
          setColorIndex((prev:any)=>{
            return indexValue;
          })
        }
      })
    })
    
    selectedTagId(selectedTagIds, true);
    closeModal();
    };

    const clearFilter = () => {
        setSelectedTagIds([]);
        // strict && document.getElementById('switch1')?.click()
    };

    const findTag = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTag(value);
      searchTag(value);
    };

    const clearTag = () => {
      setTag('');
      searchTag('');
    };

    const strickModeEnabled = (e:any) => {
      setStrict(e.target.checked)
    }

    useEffect(()=>{
      if(strictMode && selectedTagIds?.length===0){
        strict && document.getElementById('switch1')?.click()
        setDisabledSwitch(true)
      }else{
        setDisabledSwitch(false)
      }
    },[selectedTagIds])

    return (
        <>
        <Modal
        dialogClassName='annotation-filter'
        className='filter-modal modal-right'
        show={open}
        onHide={() => closeModal()}
        backdrop="static"
      >
        <div className='modal-head-section'>
          <div className='modal-head'>
            <h3>
              Filters{' '}
              <Button
                variant='secondary'
                className='btn-close'
                onClick={() => closeModal()}
              ></Button>
            </h3>
          </div>
        </div>
        <Modal.Body>
          <div className='from-flex'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='form-group project-type'>
                <div className='input-box'>
                  <span className="search-icon"></span>
                    <input
                      type='text'
                      className='form-control'
                      value={tag}
                      placeholder='Search'
                      onChange={(e) => findTag(e)}
                    />
                    {tag && <span className='close-icon' onClick={clearTag}></span>}
                  </div>
                  {strictMode ? <div className='filter-switch-sec'>
                    <div className='label-switch'>Strict mode</div>
                      <div className="filter-switch">
                        <label className="switch">
                          <input type="checkbox" id='switch1' disabled={disabledSwitch} defaultChecked={strict || filterEnable} onClick={strickModeEnabled}/>
                          <span className="slider round"></span>
                        </label>
                      </div>
                  </div> :
                  <p className='label-txt'>Filter by Annotation</p>}
                  <div className='checkbox-list'>
                    <Scrollbars className='custom-scrollbar' renderThumbVertical={() => (<div className='thumb-horizontal' />)}>
                    <ul className='list-group list-group-flush'>
                    {!tag && strictMode && <li className='list-group-item'>
                        <div className='checkbox-panel'>
                          <label>
                            <input type='checkbox' id="null" checked={selectedTagIds.includes("null")} onChange={(e)=>updateTagId(e,"null")}/>
                            <span className='checkbox'>null</span>
                          </label>
                        </div>
                      </li>}
                      {queryTags && queryTags.length && queryTags.map((ele: any, index: number) => (
                      <li className='list-group-item' key={index}>
                        <div className='checkbox-panel'>
                          <label>
                            <input type='checkbox' checked={selectedTagIds.includes(ele.id)} onChange={(e) => updateTagId(e, ele.id)} />
                            <span className='checkbox'>{ele.name}</span>
                          </label>
                        </div>
                      </li>
                      ))}
                    </ul>
                    </Scrollbars>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='form-group'>
              <div className='button-panel'>
                <button type='button' className='btn link-btn green-btn' onClick={() => clearFilter()}>
                  Clear
                </button>
                <button type='button' className='btn primary-btn' onClick={() => applyFilter()}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </>
    );
};

export default AnnotateFilterModal;
