interface Props {
  isLoading: boolean;
}
const Loader = ({ isLoading }: Props) => {
  return (
    <>
      <div className={`loader ${!isLoading && 'd-none'}`}>
        <div className='loader-inner'></div>
      </div>
    </>
  );
};
export default Loader;
