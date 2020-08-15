export default function (user) {
  console.log(user);
  if (user && user["https://devchirps.com/user_authorization"]) {
    return user["https://devchirps.com/user_authorization"].permissions;
  }
  return [];
}
