# ADR 0003: application-tracking is orchestration-only

## Status
Accepted

## Context
Earlier structures risked two sources of truth for application status: one
inside the domain module (e.g. gst.GstApplication.status) and one inside a
generic case-management module.

## Decision
`application-tracking` holds a thin `Application` entity that references the
domain-specific application by ID + module tag. Domain modules own their own
status internally and publish domain events; `application-tracking` only
subscribes and denormalizes for cross-module dashboards/queues.

## Consequences
Any cross-module "what's the status of this case" query goes through
application-tracking's read model, never by joining into domain modules
directly.
