import storage from '../../utility/storage'

// const isAuthenticated = () => {
//   // if (typeof(Storage) !== 'undefined') {
//   storage.getItem("csrfToken")
//     .then()
//     .catch()
//     // if (localStorage.getItem("csrfToken")) {
//     //   return true;
//     // }
//   // }
//   // return false;
// },
const getToken = async () => {
  try {
    const value = await storage.getItem('csrfToken')
    return value
  } catch (e) {
    // console.log('error getitem',e)
    return null
    // read error
  }
}

const getStoredSessionInfo = async () => {
  try {
    const value = await storage.getItem('user')
    return JSON.parse(value)
  } catch (e) {
    console.log('error getitem', e)
    return null
    // read error
  }
}

export {
  getToken,
  getStoredSessionInfo
  // isAuthenticated
}
