# TaxEdge — System Architecture

This document consolidates the two structures reviewed so far.

## Guiding principles

1. Use full DDD (domain/application/infrastructure/interfaces) only where the
   domain is genuinely complex: `gst`, `itr`, `loan`, `insurance`,
   `companyregistration`. These have many statuses and external providers.
2. Use a simpler layered style (`entity/repository/service/controller/dto`)
   where the extra ceremony doesn't pay for itself: `customer`, `document`,
   `notification`, `catalog`, `lead`, `messaging`.
3. `application-tracking` is a read/orchestration layer only. It never owns
   filing logic — each domain module owns its own status internally and
   publishes events to `application-tracking`. This avoids a dual-source-of-
   truth between the domain module and the tracking module.
4. `audit` is write-only from other modules' side — modules publish domain
   events, `audit` listens and persists, nobody queries back through it from
   business modules.
5. Package base is `com.taxedge` (standardize before more code is written —
   do not drift to `com.tax.taxedge`).

## Module map

See the root README for the module table.

## Open questions / ADRs

Track significant decisions as ADRs in `docs/architecture/adr/`.
