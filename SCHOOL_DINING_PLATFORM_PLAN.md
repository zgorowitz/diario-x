# School Dining Platform Plan (Argentina)

## Goal

Build a multi-tenant school dining platform where:

- Parents enroll kids in monthly or daily meal plans and pay.
- School admins manage students, classes, plans, payments, and reporting.
- The system fits this repo's existing Next.js + Clerk + Prisma architecture.

## Product Boundaries

- One `School` has many `Classes`, `Students`, `Plans`, `Invoices`, and `Payments`.
- `Parent` users can manage one or more students.
- `Admin/Owner` users can manage all school data.
- Billing supports:
  - Monthly plan enrollment.
  - Daily meal purchases.
- Payment provider should be abstracted:
  - Primary: Mercado Pago.
  - Optional later: Stripe.

## Data Model Plan (Prisma)

Primary models to add in `packages/database/prisma/schema.prisma`:

- `School`
  - `id`, `name`, `slug`, `currency` (`ARS`), `clerkOrgId`, timestamps.
  - Unique: `slug`, `clerkOrgId`.
- `UserProfile`
  - `id`, `clerkUserId`, `email`, `fullName`, timestamps.
  - Unique: `clerkUserId`.
- `SchoolMembership`
  - `id`, `schoolId`, `userId`, `role` (`OWNER|ADMIN|PARENT|STAFF`), `status`.
  - Unique: `(schoolId, userId)`.
- `SchoolClass`
  - `id`, `schoolId`, `name`, `gradeLevel`, `year`, `active`.
  - Unique: `(schoolId, name, year)`.
- `Student`
  - `id`, `schoolId`, `classId`, `firstName`, `lastName`, `dni`, `active`.
  - Index: `(schoolId, classId)`.
  - Optional unique: `(schoolId, dni)`.
- `StudentGuardian`
  - `id`, `studentId`, `userId`, `relationship` (`MOTHER|FATHER|TUTOR|OTHER`), `isPrimaryPayer`.
  - Unique: `(studentId, userId)`.
- `Plan`
  - `id`, `schoolId`, `name`, `type` (`MONTHLY|DAILY|PACK`), `description`, `active`.
- `PlanPrice`
  - `id`, `planId`, `amountCents`, `currency`, `billingPeriod` (`MONTH|DAY|PACK`), `validFrom`, `validTo`.
  - Used for price history.
- `StudentPlanEnrollment`
  - `id`, `studentId`, `planId`, `priceId`, `startDate`, `endDate`, `status` (`ACTIVE|PAUSED|CANCELLED`), `autoRenew`.
  - Index: `(studentId, status)`.
- `MealServiceDay`
  - `id`, `schoolId`, `serviceDate`, `isOpen`, `notes`.
  - Unique: `(schoolId, serviceDate)`.
- `MealBooking`
  - `id`, `studentId`, `serviceDayId`, `source` (`PLAN|DAILY_PURCHASE|MANUAL`), `status`.
  - Unique: `(studentId, serviceDayId)`.
- `Invoice`
  - `id`, `schoolId`, `payerUserId`, `studentId`, `periodMonth`, `subtotalCents`, `discountCents`, `totalCents`, `status` (`DRAFT|OPEN|PAID|VOID`), `dueDate`.
  - Index: `(schoolId, periodMonth, status)`.
- `InvoiceLine`
  - `id`, `invoiceId`, `type` (`MONTHLY_PLAN|DAILY_MEAL|ADJUSTMENT|DISCOUNT`), `description`, `qty`, `unitAmountCents`, `lineTotalCents`.
  - Optional refs: `planId`, `serviceDayId`.
- `Payment`
  - `id`, `schoolId`, `invoiceId`, `provider` (`MERCADOPAGO|STRIPE`), `providerPaymentId`, `status`, `amountCents`, `currency`, `paidAt`, `rawPayload` (JSON).
  - Unique: `(provider, providerPaymentId)`.
- `PaymentEvent`
  - `id`, `paymentId`, `provider`, `eventType`, `eventId`, `payload` (JSON), `processedAt`.
  - Unique: `(provider, eventId)`.
- `AuditLog`
  - Track key admin actions and sensitive changes.

Enums:

- `MembershipRole`
- `MembershipStatus`
- `PlanType`
- `BillingPeriod`
- `EnrollmentStatus`
- `InvoiceStatus`
- `PaymentStatus`
- `PaymentProvider`

## Data Layer Structure (Repo-Aligned)

Use `apps/app` with clear separation:

- `app/actions/*`
  - Thin server action entrypoints only.
- `lib/server/repositories/*`
  - Prisma read/write only, scoped by tenant (`schoolId`).
- `lib/server/services/*`
  - Business logic and transactions:
  - `student.service.ts`
  - `enrollment.service.ts`
  - `billing.service.ts`
  - `payment.service.ts`
- `lib/server/policies/*`
  - Authorization checks by role.
- `lib/server/payments/*`
  - Provider abstraction and implementations.

Rule: never query/write cross-tenant data without explicit `schoolId` scoping.

## Auth and Tenancy

Map Clerk orgs to schools:

- `School.clerkOrgId` is the tenant key.
- Request context from `auth()`:
  - `orgId` -> `School`
  - `userId` -> `UserProfile`
- Access control from `SchoolMembership`.
- Keep parents and admins in same school org for v1 simplicity.

## Payment Architecture

Implement a provider interface:

- `createCheckout(invoice)`
- `handleWebhook(event)`
- `reconcilePayment(providerPaymentId)`

Persist:

- Raw provider payload (`Payment.rawPayload`).
- Normalized payment status for app logic.
- Idempotent webhooks via unique `PaymentEvent(provider, eventId)`.

## Migration and Rollout Plan

1. Add Prisma models/enums.
2. Run migration and generate client.
3. Seed baseline data (school, classes, plans, users).
4. Implement repositories.
5. Implement services with transactions and validation.
6. Implement Mercado Pago provider adapter.
7. Add webhook ingestion + idempotency.
8. Add audit logs + reporting queries.

## Core Integrity Rules

- One booking per student per service day.
- No overlapping active enrollments for conflicting plan periods.
- Invoice totals must match line totals.
- Payment events must be idempotent.
- All writes require tenant and role checks.

## Initial Repo Change List

- `packages/database/prisma/schema.prisma`
- `packages/database/seed.js`
- `apps/app/lib/server/repositories/*`
- `apps/app/lib/server/services/*`
- `apps/app/lib/server/policies/*`
- `apps/app/lib/server/payments/*`
- `apps/app/app/actions/*` (refactor to service-driven flow)

## Notes for Argentina

- Start with Mercado Pago as default provider for local adoption.
- Keep payment layer provider-agnostic to add Stripe later.
- Keep currency handling in cents (`amountCents`) with explicit `currency` (`ARS`).
