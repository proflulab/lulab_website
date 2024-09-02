// // pages/api/getXiaoeToken.js
// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   console.log("Handling request..."); // 添加日志以确认请求到达

//   const { NEXT_PUBLIC_APP_ID, NEXT_PUBLIC_CLIENT_ID, NEXT_PUBLIC_SECRET_KEY } =
//     process.env;
//   console.log("Environment Variables:", {
//     NEXT_PUBLIC_APP_ID,
//     NEXT_PUBLIC_CLIENT_ID,
//     NEXT_PUBLIC_SECRET_KEY,
//   }); // 确认环境变量

//   const apiUrl = "https://api.xiaoe-tech.com/token";
//   const params = new URLSearchParams({
//     app_id: NEXT_PUBLIC_APP_ID,
//     client_id: NEXT_PUBLIC_CLIENT_ID,
//     secret_key: NEXT_PUBLIC_SECRET_KEY,
//     grant_type: "client_credential",
//   });

//   try {
//     const response = await fetch(`${apiUrl}?${params.toString()}`, {
//       method: "GET",
//     });

//     if (!response.ok) {
//       console.error("Failed to fetch Xiaoe access token"); // 添加错误日志
//       throw new Error("Failed to fetch Xiaoe access token");
//     }

//     const data = await response.json();
//     console.log("Xiaoe Token Response:", data); // 添加日志以确认响应内容
//     return res.status(200).json({ access_token: data.data.access_token });
//   } catch (error) {
//     console.error("Error fetching Xiaoe token:", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
// pages/api/getXiaoeToken.js
import { setAccessToken, getAccessToken } from "../api/cache";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 检查是否已经有缓存的 token
  const cachedToken = getAccessToken();
  if (cachedToken) {
    return res.status(200).json({ access_token: cachedToken });
  }

  const { NEXT_PUBLIC_APP_ID, NEXT_PUBLIC_CLIENT_ID, NEXT_PUBLIC_SECRET_KEY } =
    process.env;

  const apiUrl = "https://api.xiaoe-tech.com/token";
  const params = new URLSearchParams({
    app_id: NEXT_PUBLIC_APP_ID,
    client_id: NEXT_PUBLIC_CLIENT_ID,
    secret_key: NEXT_PUBLIC_SECRET_KEY,
    grant_type: "client_credential",
  });

  try {
    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Xiaoe access token");
    }

    const data = await response.json();
    const accessToken = data.data.access_token;
    const expiresIn = data.data.expires_in || 3600; // 假设 token 有效期为 1 小时

    // 缓存 token 和过期时间
    setAccessToken(accessToken, expiresIn);

    return res.status(200).json({ access_token: accessToken });
  } catch (error) {
    console.error("Error fetching Xiaoe token:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
