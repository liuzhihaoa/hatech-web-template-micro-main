import defaultConfig from './config.default'

export default {
  ...defaultConfig,
  ...(process.env.NODE_ENV === 'development' ? require('./config.dev').default : process.env.NODE_ENV === 'production' ? require('./config.prod').default : {})
}
