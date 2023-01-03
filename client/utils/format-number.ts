export const formatNumber = (num: number) => {
  const rounded = Math.round(num * 100) / 100;
  // return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: true,
  });
};
