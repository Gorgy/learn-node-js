const auth = {
  login: "gorgy_below",
  pass: "r3Z4rSbJiQimP9Q",
};

const url = `mongodb+srv://${auth.login}:${auth.pass}@cluster0.15yem.mongodb.net/test?retryWrites=true&w=majority`;

module.exports = url;
