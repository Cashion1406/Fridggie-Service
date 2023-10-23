import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DATABASE_CONFIG, validateConfig } from './config'
import { TypeOrmModule } from '@nestjs/typeorm'
import databaseConfig from './config/database.config'
import { ProductModule } from './modules/product'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig],
			validate: validateConfig,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) =>
				configService.get(DATABASE_CONFIG),
			inject: [ConfigService],
		}),

		ProductModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
