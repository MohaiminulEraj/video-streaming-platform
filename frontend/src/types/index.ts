export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  userId: string;
  createdAt: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
