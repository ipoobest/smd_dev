import axios from 'axios'
// const getToken = function() {
//   if (process.server) {
//     return
//   }
//   if (window.$nuxt) {
//     return window.$nuxt.$auth.getToken('local')
//   }
// }

export async function request(method, url, data) {
  const headers = {
    'X-Parse-Application-Id': `${process.env.parseAppId}`,
    'X-Parse-Master-Key': `${process.env.parseMasterKey}`,
    'X-Parse-Session-Token': `${window.$nuxt.$store.state.sessionToken}`
  }
  try {
    const response = await axios({
      method,
      url,
      data,
      headers
    })
    return response
  } catch (error) {
    return error
  }
}
