import { SHA256 } from "crypto-js";

type AuthenticateType = "login" | "register";
type AuthenticateData = {
  password: string;
  email: string;
};

const authenticate = async (
  type: AuthenticateType,
  userData: AuthenticateData
): Promise<FetchResponse> => {
  const hashedPassword = SHA256(userData.password).toString();
  const resp = await fetch(`${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: hashedPassword, email: userData.email }),
  });
  const data = await resp.json();
  console.log(data);

  return data;
};

const loaderMsg = "Wait until Authentication process Complete";

export default authenticate;
export { loaderMsg };
