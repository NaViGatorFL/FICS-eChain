import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://10.245.69.209:7081`
  })
}