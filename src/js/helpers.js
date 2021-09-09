import { TIME_OUT } from './config';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (apiURL, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(apiURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(apiURL);
    const res = await Promise.race([fetchPro, timeout(TIME_OUT)]);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (apiURL) {
//   try {
//     const res = await Promise.race([fetch(apiURL), timeout(TIME_OUT)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (apiURL, uploadData) {
//   try {
//     const fetchPro = fetch(apiURL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIME_OUT)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
