import { Global, Module } from '@nestjs/common';


const commonServices = [];

@Global()
@Module({
    providers: [...commonServices],
    exports: [...commonServices],
})
export class CommonServiceModule {}
