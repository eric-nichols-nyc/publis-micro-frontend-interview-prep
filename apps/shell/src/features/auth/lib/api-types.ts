export type MeResponse = {
  id: number;
  authUserId: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};
