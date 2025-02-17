export default function (date) {
  let stringDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const dateArray = stringDate.split(" ");
  const formattedDate = `${dateArray[0].slice(0, 3)} ${
    String(new Date().getFullYear()) === String(dateArray[2])
      ? dateArray[1].split(",")[0]
      : dateArray[1]
  } ${
    String(new Date().getFullYear()) === String(dateArray[2])
      ? ""
      : dateArray[2]
  }`;

  return formattedDate;
}
