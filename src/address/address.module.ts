import { Module } from '@nestjs/common';
import { AddressService } from './address/address.service';
import { AddressController } from './address/address.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [ContactModule],
  providers: [AddressService],
  controllers: [AddressController]
})
export class AddressModule {}
