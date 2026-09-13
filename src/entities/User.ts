import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export enum userRole {
	ADMIN = "ADMIN",
	STAFF = "STAFF",
}

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
	id!: number;

	@Column("varchar", { length: 255, nullable: false })
	name!: string;

	@Column("varchar", { length: 255, nullable: false, unique: true })
	email!: string;

	@Column("varchar", { length: 255, nullable: false })
	password!: string;

	@Column({ type: "enum", enum: userRole, default: userRole.STAFF })
	role!: userRole;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@DeleteDateColumn()
	deletedAt!: Date;
}
