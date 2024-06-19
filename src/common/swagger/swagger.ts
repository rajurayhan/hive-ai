import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from '../services/env-config.service';

export default function swagger<T extends INestApplication = INestApplication>(app: T, configService: EnvConfigService, docTag: string) {
    const environment = configService.get('NODE_ENV');
    const config = new DocumentBuilder()
        .setTitle(`Estimation - ${environment} mode`)
        .setDescription(`Estimation app Documentation - ${environment} mode`)
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docTag, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
