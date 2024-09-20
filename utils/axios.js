const axios = require('axios');

async function downloadFileAsArrayBuffer(url) {
  try {
    const response = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    });
    console.log('axios success');
    if (response.data instanceof ArrayBuffer) {
      console.log('Received an ArrayBuffer');
    } else if (response.data instanceof Buffer) {
      console.log('Received a Buffer');
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = downloadFileAsArrayBuffer;
