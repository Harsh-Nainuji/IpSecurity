import axios from 'axios'

const username = 'nexiscraft'
const password = 'CqkbjtYwFJ'

// Test the API directly
async function testAPI() {
  const url = `https://markerapi.com/api/v2/trademarks/trademark/youtube/status/active/start/1/username/${encodeURIComponent(username)}/password/${encodeURIComponent(password)}`

  console.log('Testing API with URL:', url)

  try {
    const response = await axios.get(url)
    console.log('Success! Response:', response.data)
  } catch (error) {
    console.error('API Error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Response:', error.response.data)
    }
  }
}

testAPI()
