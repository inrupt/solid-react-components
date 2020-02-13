import data from '@solid/query-ldflex';

export const getPodStoragePath = async webId => {
  const podStoragePath = await data[webId].storage;
  console.log('value', podStoragePath && podStoragePath.value);
  return podStoragePath && podStoragePath.value.trim().length > 0 ? podStoragePath.value : '';
};
