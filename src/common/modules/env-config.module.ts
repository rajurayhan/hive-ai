import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { z } from 'zod';

export const EnvironmentVariablesValidation = z.object({
  NODE_ENV: z.string().min(1),
  APP_PORT: z.coerce.number().nonnegative().min(1024),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().nonnegative(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_DB: z.string().min(1),
  TLDV_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_ASSISTANT_ID: z.string().min(1),
  PAYROLL_USER_X_AUTH_USER: z.string().min(1),
  PAYROLL_USER_X_AUTH_TOKEN: z.string().min(1),
});

export type TEnvironmentVariables = z.infer<typeof EnvironmentVariablesValidation>;
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            envFilePath: [`.env`],
            validate: (config) => {
                const parsed = EnvironmentVariablesValidation.parse(config);
                // This to make data types coerced
                return { ...config, ...parsed };
            },
        }),
    ],
})
export class EnvConfigModule {}
