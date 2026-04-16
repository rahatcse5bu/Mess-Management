"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const getAllowedOrigins = (value) => {
    const configured = value
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (configured && configured.length > 0) {
        return configured;
    }
    return ['http://localhost:5173', 'http://127.0.0.1:5173'];
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const allowedOrigins = getAllowedOrigins(configService.get('CORS_ORIGINS'));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin ||
                allowedOrigins.includes('*') ||
                allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map