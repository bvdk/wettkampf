const arrayMoveMutate = (array, from, to) => {
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

export const arrayMove = (array: any[], from: number, to: number) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};
