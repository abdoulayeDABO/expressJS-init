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


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


