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

export const stripTrailingSlash = (url: string): string => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const removeHttpPrefix = (url: string): string =>
  url.replace(/^https?:\/\//, "");

export const getHostnameValue = (url: string): string => {
  return stripTrailingSlash(removeHttpPrefix(url));
};
