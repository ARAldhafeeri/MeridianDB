export const formatDate = (date: Date) => {
  if (typeof date.getMonth !== "function") {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
