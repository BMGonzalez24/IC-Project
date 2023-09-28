// eslint-disable-next-line import/prefer-default-export
export function groupBy<T>(arr: Record<string, T>[], key: string): Record<string, T>[][] {
  const res = [[arr[0]]] as typeof arr[];
  let last = res.length - 1;

  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i][key] === res[last][0][key]) {
      res[last].push(arr[i]);
    } else {
      res.push([arr[i]]);
      last += 1;
    }
  }

  return res;
}
