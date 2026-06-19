import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto lo hace disponible en todos lados sin importar de nuevo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}