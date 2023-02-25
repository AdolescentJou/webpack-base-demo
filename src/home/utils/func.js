export const add = (a, b) => {
  return new Promise((resolve, reject) => {
    const a = Math.random() * 100;
    if (a > 50) {
      resolve(a);
    } else {
      reject('a is small');
    }
  });
};
