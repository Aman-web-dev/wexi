import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password,next) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}


export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
