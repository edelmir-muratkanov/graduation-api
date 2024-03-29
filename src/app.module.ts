import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import * as Joi from 'joi'
import {
	HeaderResolver,
	I18nModule,
	I18nValidationExceptionFilter,
	I18nValidationPipe,
	QueryResolver,
} from 'nestjs-i18n'
import { join } from 'path'

import { AuthModule } from './auth/auth.module'
import { CalculationsModule } from './calculations/calculations.module'
import { MethodsModule } from './methods/methods.module'
import { ProjectsModule } from './projects/projects.module'
import { PropertiesModule } from './properties/properties.module'
import { PrismaModule } from './shared/prisma'
import { LoggingInterceptor } from './shared/services'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().required(),
				ACCESS_TOKEN_SECRET: Joi.string().required(),
				ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
				REFRESH_TOKEN_SECRET: Joi.string().required(),
				REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
			}),
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'ru',
			fallbacks: {
				en: 'en',
				ru: 'ru',
				kz: 'kz',
			},
			loaderOptions: {
				path: join(process.cwd(), '/assets/i18n/'),
				watch: true,
			},
			resolvers: [
				{
					use: QueryResolver,
					options: ['lang'],
				},
				new HeaderResolver(['x-lang']),
			],
			typesOutputPath: join(process.cwd(), '/src/shared/generated/i18n.ts'),
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
		PropertiesModule,
		MethodsModule,
		ProjectsModule,
		CalculationsModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new I18nValidationPipe({
				transform: true,
				whitelist: true,
			}),
		},
		{
			provide: APP_FILTER,
			useValue: new I18nValidationExceptionFilter(),
		},
		{
			provide: APP_INTERCEPTOR,
			useValue: new LoggingInterceptor(),
		},
	],
})
export class AppModule {}
