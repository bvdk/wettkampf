// Usage (from `scripts` directory):
// $ node -r dotenv/config -r esm authenticateUser.js <YOUR_EMAIL> <YOUR PASSWORD>

import getToken from "../lib/getToken";

const authenticateUser = async () => {
  const [email, password] = process.argv.slice(2);
  const accessToken = await getToken(email, password).catch((error) => {
    console.log(error);
  });
  console.log(accessToken);
};

authenticateUser().catch(console.error);
