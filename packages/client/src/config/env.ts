export const ENVIROMENT_VARS = {
  VITE_API_URL: "VITE_API_URL",
  VITE_BRAND_NAME: "VITE_BRAND_NAME",
  VITE_PAYPAL_API_KEY: "VITE_PAYPAL_API_KEY",
  VITE_CLIENT_URL: "VITE_CLIENT_URL",
};

const enviromentMode = import.meta.env.VITE_MODE;

export const getEnvVar = (envVarName: string) => {
  const mode = enviromentMode === "dev" ? "_DEV" : "_PROD";
  return import.meta.env[`${envVarName}${mode}`];
};
