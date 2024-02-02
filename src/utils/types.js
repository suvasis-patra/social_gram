import zod from "zod";

export const validteSignupUser = zod.object({
  username: zod.string().min(2).max(30),
  email: zod.string().email().min(8).max(30),
  password: zod.string().min(2).max(30),
});
