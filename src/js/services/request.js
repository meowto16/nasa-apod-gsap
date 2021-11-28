const axios = require('axios')

const request = axios.create({
  baseURL: 'https://api.nasa.gov',
  params: {
    api_key: 'UBbjCI0ZqtlFCpqlXUFvieg7LVI7wvft95cEVSb4'
  },
  headers: {
    'Content-Type': 'application/json',
  }
})

module.exports = request
