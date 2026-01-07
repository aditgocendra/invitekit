import { prisma } from "@/lib/prisma.init";

interface CreateEmailActionTokenProps {
  jti: string;
  email: string;
  type: "verify-email" | "reset-password";
  expiresAt: Date;
}

export const createActionToken = async (props: CreateEmailActionTokenProps) => {
  const r = await prisma.emailActionToken.create({
    data: {
      jti: props.jti,
      email: props.email,
      type: props.type,
      expiresAt: props.expiresAt,
    },
  });

  return r;
};

export const getActionToken = async (jti: string) => {
  const r = await prisma.emailActionToken.findUnique({ where: { jti } });
  return r;
};

export const updateActionToken = async (jti: string) => {
  const r = await prisma.emailActionToken.update({
    where: { jti },
    data: { usedAt: new Date() },
  });
  return r;
};
