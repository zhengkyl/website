export const addParams = (base, params) =>
  base +
  "?" +
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
