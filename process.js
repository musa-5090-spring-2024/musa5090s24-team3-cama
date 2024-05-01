// // URL of the object stored in the Google Cloud Storage bucket
// const url =
//   "https://storage.googleapis.com/musa5090s24_team3_public/tiles/properties/12/1191/1550.pbf";

// // Use the Fetch API to request the data
// fetch(url)
//   .then((response) => {
//     if (response.ok) {
//       return response.blob(); // or .json(), .text(), etc. depending on the data type
//     }
//     throw new Error("Network response was not ok.");
//   })
//   .then((data) => {
//     // Process the data
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error("There was a problem with your fetch operation:", error);
//   });
