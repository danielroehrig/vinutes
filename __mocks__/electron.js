module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: jest.fn(() => __dirname),
    getAppPath: jest.fn(() => __dirname)
  },
  remote: {
    app: {
      getPath: jest.fn(() => __dirname),
      getAppPath: jest.fn(() => __dirname)
    }
  },
  dialog: jest.fn()
}
