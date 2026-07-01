require('ts-node/register');
const { handlers } = require('./auth.ts');
console.log("Handlers keys:", Object.keys(handlers));
console.log("GET handler:", typeof handlers.GET);
