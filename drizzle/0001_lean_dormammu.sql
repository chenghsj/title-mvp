ALTER TABLE "education" ALTER COLUMN "institution" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "degree" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "field_of_study" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "resume" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "cover" text;