import https from 'https';
import fs from 'fs';

const url = 'https://res.cloudinary.com/djqlnkkcb/image/upload/v1778435050/medify_materials/xy69nslpyyfnfkqxdgqo.pdf';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  
  let data = [];
  res.on('data', (chunk) => {
    data.push(chunk);
  });
  
  res.on('end', () => {
    const buffer = Buffer.concat(data);
    console.log('Size:', buffer.length, 'bytes');
    console.log('First 20 bytes:', buffer.toString('hex', 0, 20));
    console.log('First 20 chars:', buffer.toString('utf8', 0, 20));
    fs.writeFileSync('test_download.pdf', buffer);
  });
});
