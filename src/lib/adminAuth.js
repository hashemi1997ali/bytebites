import crypto from "crypto";

const SECRET = process.env.ADMIN_TOKEN_SECRET || "dev_secret";

function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(b64, "base64").toString());
}

export function signToken(payload, opts = {}) {
  const header = { alg: "HS256", typ: "JWT" };
  const expiresIn = opts.expiresInSeconds ?? 60 * 60 * 24; // 1 day
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const body = { ...payload, exp };

  const encodedHeader = base64UrlEncode(header);
  const encodedBody = base64UrlEncode(body);
  const unsigned = `${encodedHeader}.${encodedBody}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(unsigned)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsigned}.${signature}`;
}

export function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${h}.${p}`)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

    const sigMatch = crypto.timingSafeEqual(
      Buffer.from(s),
      Buffer.from(expected),
    );
    if (!sigMatch) return null;

    const payload = base64UrlDecode(p);
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
