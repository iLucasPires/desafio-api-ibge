declare module "#auth-utils" {
  interface User {
    username: string;
    name: string;
    password?: string;
    avatar?: string;
  }
}

export {};
