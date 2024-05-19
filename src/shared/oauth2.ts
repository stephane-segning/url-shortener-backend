export default () => ({
  oauth2: {
    defaultClient: {
      id: process.env.OAUTH2_CLIENT_ID,
      secret: process.env.OAUTH2_CLIENT_SECRET,
    },
  },
});
