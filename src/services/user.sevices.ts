import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient();

const createUser = async ({ name, email, password }) => {
    const result = await prisma.user.create({
        data: {
          name,
          email,
          password
        },
    })

    return result;
}

const findAllUsers = async () => {
  const allUsers = await prisma.user.findMany()
}


const findUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  return user
}

const updateUser = async (email: string, data: any) => {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data,
  })
}

const deteteUser = async (id: number) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  })
}   

const userService = {
  createUser,
  findAllUsers,
  findUser,
  updateUser,
  deteteUser
};

export default userService;