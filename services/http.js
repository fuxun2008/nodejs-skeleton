exports.fetch = (input, init) => {
  console.info('[fetch input]', input);
  console.info('[fetch headers]', init.headers._headers);
  console.info('[fetch method]', init.method);

  return fetch(input, init);
};
