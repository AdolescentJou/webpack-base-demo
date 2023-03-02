export const add = (a, b) => {
  const obj = { find_node_key: 123 };
  console.log(obj);
  return new Promise((resolve, reject) => {
    const a = Math.random() * 100;
    if (a > 50) {
      resolve(a);
    } else {
      reject('a is small');
    }
  });
};
