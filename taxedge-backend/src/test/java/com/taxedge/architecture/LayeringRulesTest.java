package com.taxedge.architecture;

/**
 * ArchUnit rules enforcing the module boundaries described in
 * docs/architecture/system-architecture.md, e.g.:
 *  - application-tracking must not be depended on by gst/itr/loan for
 *    status (it only listens to events).
 *  - audit must not be depended on by other modules except to publish events.
 *  - catalog is the only module allowed to define price fields.
 *
 * TODO: implement with com.tngtech.archunit.
 */
public class LayeringRulesTest {
}
