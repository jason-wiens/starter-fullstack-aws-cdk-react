export const isArrayOfType = (input: any, type: string): boolean => {
  if (!Array.isArray(input)) {
    return false;
  }
  return input.every((item) => typeof item === type);
};
