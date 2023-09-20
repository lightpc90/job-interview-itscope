const axios = require("axios");
const FormData = require("form-data");
const path = require("path")
const fs = require("fs");

const saveProductImages = (images_paths) => {
    
const imagePath = path.join();
let data = new FormData();
data.append("file", fs.createReadStream("/path/to/file"));
data.append("public_id", "<yourPublicId>");
data.append("signature", "signature");
data.append("api_key", "{{Username}}");
data.append("timestamp", "1695212929");

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.cloudinary.com/v1_1/{{cloud_name}}/image/upload",
  headers: {
    ...data.getHeaders(),
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

}