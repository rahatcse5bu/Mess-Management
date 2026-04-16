type EnvConfig = Record<string, unknown>;

const getString = (config: EnvConfig, key: string): string | undefined => {
  const value = config[key];
  return typeof value === 'string' ? value : undefined;
};

export const validateEnv = (config: EnvConfig) => {
  const requiredKeys = ['MONGO_URI', 'JWT_SECRET'];
  const missing = requiredKeys.filter((key) => !getString(config, key)?.trim());

  if (getString(config, 'SEED_DEFAULT_USER') === 'true') {
    const seedKeys = ['DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD'];
    missing.push(
      ...seedKeys.filter((key) => !getString(config, key)?.trim()),
    );
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${[...new Set(missing)].join(', ')}`,
    );
  }

  return {
    ...config,
    JWT_EXPIRES_IN: getString(config, 'JWT_EXPIRES_IN') || '7d',
    MONGO_DB: getString(config, 'MONGO_DB') || 'mess_management',
    PORT: getString(config, 'PORT') || '3000',
    SEED_DEFAULT_USER: getString(config, 'SEED_DEFAULT_USER') || 'false',
  };
};
