import { Module } from '@nestjs/common';
import { ContactService } from './contact/contact.service';
import { ContactController } from './contact/contact.controller';

@Module({
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService]
})
export class ContactModule {}
