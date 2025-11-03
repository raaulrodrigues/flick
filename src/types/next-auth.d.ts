import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * Estende o objeto User padrão para incluir o 'id'
   */
  interface User extends DefaultUser {
    id: string
  }

  /**
   * Estende o objeto Session padrão para incluir nosso User atualizado
   */
  interface Session extends DefaultSession {
    user: User
  }
}