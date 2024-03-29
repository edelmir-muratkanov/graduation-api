import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/shared/prisma'

import { PropertiesController } from './properties.controller'
import { PropertiesService } from './properties.service'

@Module({
	imports: [PrismaModule],
	controllers: [PropertiesController],
	providers: [PropertiesService],
})
export class PropertiesModule {}
