export const objectToQueryString = (object: { [key: string]: any }) => {
  const params = new URLSearchParams();

  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const value = object[key];
      params.append(key, value);
    }
  }

  return params.toString();
};
