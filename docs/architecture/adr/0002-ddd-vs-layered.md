# ADR 0002: Mixed DDD / layered module styles

## Status
Accepted

## Context
Applying full DDD ceremony uniformly across all modules adds overhead where
the domain is simple (e.g. customer profile, document vault, notifications).

## Decision
Use full DDD (domain/application/infrastructure/interfaces) only for
gst, itr, loan, insurance, companyregistration. Use a simpler layered style
elsewhere.

## Consequences
Contributors must know which style a module follows before adding code to it.
