ALTER TABLE "recurrences" ALTER COLUMN "next_occurrence_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "recurrences" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET DATA TYPE timestamp;