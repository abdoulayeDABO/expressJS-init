const fs = require('fs');

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

try {
    try {   
        readFile('src/mails/activation.htm').then(body => console.log(body)).catch(error => {throw new Error("erreur")});
      } catch (error) {
        console.log(" error 1: " + error);
        throw new Error(error);
      }
} catch (error) {
    console.log(" error 2: " + error);
}