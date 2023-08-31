import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './custom-request.interface'; // Import the custom interface file
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
