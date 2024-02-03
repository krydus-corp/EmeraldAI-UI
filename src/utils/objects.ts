const getObjectSortedBy = <T extends {[key: string]: any}>(obj: { [key: string]: T }, sortKey?: string): { [key: string]: T } => {
    const newObj: { [key: string]: T } = {};
    const keys = Object.keys(obj);
    if (sortKey) {
      keys.sort((a, b) => obj[b][sortKey] - obj[a][sortKey]); // Sort in descending order
    }
    keys.forEach((key) => {
      newObj[key] = obj[key];
    });
    return newObj;
}
  
export default getObjectSortedBy