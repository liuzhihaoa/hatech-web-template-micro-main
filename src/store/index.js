import { Store } from 'hatech-web-core'
import app from './app'

const store = new Store({
  modules: { app }
})


export default store