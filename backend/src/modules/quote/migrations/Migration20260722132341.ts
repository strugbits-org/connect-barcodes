import { Migration } from '@mikro-orm/migrations';

export class Migration20260722132341 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "quote" ("id" text not null, "customer_name" text not null, "customer_email" text not null, "company_name" text null, "phone" text null, "items" jsonb not null, "message" text null, "status" text check ("status" in ('pending', 'reviewed', 'approved', 'rejected')) not null default 'pending', "admin_notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "quote_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quote_deleted_at" ON "quote" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "quote" cascade;`);
  }

}
