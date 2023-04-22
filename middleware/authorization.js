const jwt = require('jsonwebtoken');

function authenticateToken(context) {
  console.log(context.req.headers)
  const Authorization = context.req.headers.authorization;
  console.log(Authorization)
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  }
  throw new Error('Not authenticated');
}


module.exports = {'authenticateToken':authenticateToken}