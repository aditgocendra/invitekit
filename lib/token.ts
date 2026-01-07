import { SignJWT, jwtVerify, JWTPayload } from "jose"

const VERIFY_SECRET = new TextEncoder().encode(process.env.VERIFY_SECRET!)
const RESET_SECRET = new TextEncoder().encode(process.env.RESET_SECRET!)

export type VerifyEmailPayload = JWTPayload & {
  type: "verify-email"
  email: string
  jti: string
}

export type ResetPasswordPayload = JWTPayload & {
  type: "reset-password"
  email: string
  jti: string
}

// 60 menit
export async function signVerifyEmailToken(payload: VerifyEmailPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60m")
    .sign(VERIFY_SECRET)
}

// 30 menit
export async function signResetPasswordToken(payload: ResetPasswordPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(RESET_SECRET)
}

export async function verifyEmailToken(token: string) {
  const { payload } = await jwtVerify<VerifyEmailPayload>(token, VERIFY_SECRET)
  return payload
}

export async function verifyResetToken(token: string) {
  const { payload } = await jwtVerify<ResetPasswordPayload>(token, RESET_SECRET)
  return payload
}
