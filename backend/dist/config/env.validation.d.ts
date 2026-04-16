type EnvConfig = Record<string, unknown>;
export declare const validateEnv: (config: EnvConfig) => {
    JWT_EXPIRES_IN: string;
    MONGO_DB: string;
    PORT: string;
    SEED_DEFAULT_USER: string;
};
export {};
