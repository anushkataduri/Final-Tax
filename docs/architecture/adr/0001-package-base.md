# ADR 0001: Standardize package base to com.taxedge

## Status
Accepted

## Context
Two prior structures drifted: v1 used `com.taxedge`, v2 drifted to
`com.tax.taxedge`. This causes import churn and confusion.

## Decision
Standardize on `com.taxedge` for all new and existing code before further
development continues.

## Consequences
Any code under `com.tax.taxedge` must be migrated.
