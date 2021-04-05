export enum AuthSchema {
  APIKey = "APIKey",
  Bearer = "Bearer",
}

export const isJWT = (token: string): boolean => {
  try {
    return JSON.parse(atob(token.split(".")[0])).typ === "JWT";
  } catch (e) {
    return false;
  }
};

export const haveAuthSchema = (target: string): boolean => {
  try {
    const schema = target.split(" ");
    return schema[0] in AuthSchema;
  } catch (e) {
    return true;
  }
};

export const getAuthorizationValue = (token: string): string => {
  if (token.length === 0) {
    return "";
  }

  if (!haveAuthSchema(token)) {
    return isJWT(token)
      ? `${AuthSchema.Bearer} ${token}`
      : `${AuthSchema.APIKey} ${token}`;
  }
  return token;
};
