export interface User {
  email: String;
  password: String;
}
export interface Message {
  message: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}
