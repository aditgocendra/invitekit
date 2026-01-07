import { prisma } from "@/lib/prisma.init";
import { Role } from "@/types/next-auth";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (props: CreateUserProps) => {
  const r = await prisma.user.create({
    data: {
      name: props.name,
      email: props.email,
      password: props.password,
    },
  });

  return r;
};

export const userIsExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (user) {
    return true;
  }
  return false;
};

interface UpdateUserProps {
  email: string;
  name?: string;
  password?: string;
  emailVerified?: Date;
  image?: string;
  role?: Role;
}

export const updateUser = async (props: UpdateUserProps) => {
  const r = await prisma.user.update({
    where: {
      email: props.email,
    },
    data: {
      name: props.name,
      password: props.password,
      emailVerified: props.emailVerified,
      image: props.image,
      role: props.role,
    },
  });
  return r;
};


