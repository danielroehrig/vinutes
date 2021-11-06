module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: jest.fn(() => __dirname),
    getAppPath: jest.fn(() => __dirname),
    getName: jest.fn(() => 'vinutes'),
    getVersion: jest.fn(() => '0.1')
  },
  remote: {
    app: {
      getPath: jest.fn(() => __dirname),
      getAppPath: jest.fn(() => __dirname),
      getName: jest.fn(() => 'vinutes'),
      getVersion: jest.fn(() => '0.1')
    }
  },
  dialog: jest.fn()
}
