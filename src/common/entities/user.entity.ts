import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base/app-base.entity';


export const UserEntityTableName = 'users';

@Entity(UserEntityTableName)
export class UserEntity extends AppBaseEntity {
    @Column({ length: 255 })
    email: string;
}
