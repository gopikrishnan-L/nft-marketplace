// // require("dotenv").config();
// const key = import.meta.env.PINATA_KEY;
// const secret = import.meta.env.PINATA_SECRET;

// import axios from "axios";
// import FormData from "form-data";

// export const uploadJSONToIPFS = async (JSONBody) => {
//   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//   //making axios POST request to Pinata ⬇️
//   return axios
//     .post(url, JSONBody, {
//       headers: {
//         pinata_api_key: key,
//         pinata_secret_api_key: secret,
//       },
//     })
//     .then(function (response) {
//       return {
//         success: true,
//         pinataURL:
//           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
//       };
//     })
//     .catch(function (error) {
//       console.log(error);
//       return {
//         success: false,
//         message: error.message,
//       };
//     });
// };

// export const uploadFileToIPFS = async (file) => {
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//   //making axios POST request to Pinata ⬇️

//   let data = new FormData();
//   data.append("file", file);

//   const metadata = JSON.stringify({
//     name: "testname",
//     keyvalues: {
//       exampleKey: "exampleValue",
//     },
//   });
//   data.append("pinataMetadata", metadata);

//   //pinataOptions are optional
//   const pinataOptions = JSON.stringify({
//     cidVersion: 0,
//     customPinPolicy: {
//       regions: [
//         {
//           id: "FRA1",
//           desiredReplicationCount: 1,
//         },
//         {
//           id: "NYC1",
//           desiredReplicationCount: 2,
//         },
//       ],
//     },
//   });
//   data.append("pinataOptions", pinataOptions);

//   return axios
//     .post(url, data, {
//       maxBodyLength: "Infinity",
//       headers: {
//         "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
//         pinata_api_key: key,
//         pinata_secret_api_key: secret,
//       },
//     })
//     .then(function (response) {
//       console.log("image uploaded", response.data.IpfsHash);
//       return {
//         success: true,
//         pinataURL:
//           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
//       };
//     })
//     .catch(function (error) {
//       console.log(error);
//       return {
//         success: false,
//         message: error.message,
//       };
//     });
// };

// require("dotenv").config();
const key = import.meta.env.PINATA_KEY;
const secret = import.meta.env.PINATA_SECRET;
const jwt_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxOGY2YTk5Zi1kMjZjLTQxMmQtYjc2Zi02YzM1YTJiZjc1YmQiLCJlbWFpbCI6ImdrcmlzaG5hbjEyMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjEyZTRjZTg4NDdlNjA4MmVjOGRjIiwic2NvcGVkS2V5U2VjcmV0IjoiOTUzZTI1OTYwZjEwMzk4NjBiOGM0ZWNlZTI1MTk2MWQ5NjI2ZWZkZTk1ZDc4Y2MxN2U3ZTgwYTUzZGE3M2UwNyIsImlhdCI6MTcwODg4MDA2M30.24DnORjYVzDAuOVHXplq6ortEe5yarqt2nJKRHRxjUU";

import axios from "axios";
import FormData from "form-data";

export const uploadJSONToIPFS = async (JSONBody) => {
  //making axios POST request to Pinata ⬇️
  return axios
    .post("https://api.pinata.cloud/pinning/pinJSONToIPFS", JSONBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt_key}`,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file) => {
  //making axios POST request to Pinata ⬇️
  const fileName = file.name;
  console.log(fileName);
  let data = new FormData();
  data.append("file", file);
  data.append("pinataOptions", '{"cidVersion": 0}');
  data.append("pinataMetadata", `{"name": "cat"}`);

  return await axios
    .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      headers: {
        Authorization: `Bearer ${jwt_key}`,
      },
    })
    .then(function (response) {
      console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const GetIpfsUrlFromPinata = (pinataUrl) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};
