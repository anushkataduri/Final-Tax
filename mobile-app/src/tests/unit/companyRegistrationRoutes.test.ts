/// <reference types="node" />
/**
 * Regression tests for H4: company-registration service routes.
 *
 * Run with:
 *   node scripts/run-auth-lockout-tests.cjs src/tests/unit/companyRegistrationRoutes.test.ts
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { SERVICES } from "../../data/services";
import { SERVICE_CATALOGUE } from "../../data/catalogue";
import {
  decideServiceAccess,
  serviceRouteNeedsProfile,
} from "../../shared/guards/serviceAccess";

const read = (relative: string) =>
  fs.readFileSync(path.join(process.cwd(), relative), "utf8");

const exists = (relative: string) =>
  fs.existsSync(path.join(process.cwd(), relative));

const SIGNED_IN_COMPLETE   = { isLoggedIn: true, isProfileComplete: true };
const SIGNED_IN_INCOMPLETE = { isLoggedIn: true, isProfileComplete: false };
const SIGNED_OUT           = { isLoggedIn: false, isProfileComplete: false };

// ── Service 1: /service/company-registration ─────────────────────────────────

test("S1-1: company-registration entry exists in the SERVICES data array", () => {
  const svc = SERVICES.find((s) => s.id === "company-registration");
  assert.ok(svc, "company-registration must be in SERVICES");
  assert.equal(svc!.category, "BUSINESS");
});

test("S1-2: company-registration service ID resolves correctly in the catalogue", () => {
  const allItems = SERVICE_CATALOGUE.flatMap((s) => s.items);
  const entry = allItems.find((item) => item.serviceId === "company-registration");
  assert.ok(entry, "company-registration must have a serviceId entry in SERVICE_CATALOGUE");
  assert.equal(entry!.serviceId, "company-registration");
});

test("S1-3: /service/company-registration route file exists", () => {
  assert.ok(
    exists("src/app/service/company-registration.tsx"),
    "src/app/service/company-registration.tsx must exist",
  );
});

test("S1-4: /service/company-registration delegates to CompanyRegistrationLandingScreen, not the wizard", () => {
  const source = read("src/app/service/company-registration.tsx");
  assert.ok(
    source.includes("CompanyRegistrationLandingScreen"),
    "company-registration.tsx must render the landing screen, not jump directly to the wizard",
  );
  assert.equal(
    source.includes("CompanyRegistrationScreen") && !source.includes("CompanyRegistrationLandingScreen"),
    false,
    "company-registration.tsx must NOT bypass the landing screen by rendering CompanyRegistrationScreen directly",
  );
});

test("S1-5: /service/company-registration does not resolve to any other service's screen", () => {
  const source = read("src/app/service/company-registration.tsx");
  for (const forbidden of ["GstScreen", "ItrScreen", "LoansMainScreen", "TdsRefundScreen", "CompanyRegistrationWizard"]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `company-registration.tsx must not render ${forbidden}`,
    );
  }
});

test("S1-6: back navigation is present on the landing screen", () => {
  const source = read(
    "src/modules/company-registration/screens/CompanyRegistrationLandingScreen/CompanyRegistrationLandingScreen.tsx",
  );
  assert.ok(
    source.includes("showBack") || source.includes("router.back"),
    "CompanyRegistrationLandingScreen must support back navigation",
  );
});

// ── Service 2: /service/company-registration-wizard ──────────────────────────

test("S2-1: company-registration-wizard route file exists", () => {
  assert.ok(
    exists("src/app/service/company-registration-wizard.tsx"),
    "src/app/service/company-registration-wizard.tsx must exist",
  );
});

test("S2-2: company-registration-wizard is reachable from the landing screen", () => {
  const source = read(
    "src/modules/company-registration/screens/CompanyRegistrationLandingScreen/CompanyRegistrationLandingScreen.tsx",
  );
  assert.ok(
    source.includes("/service/company-registration-wizard"),
    "CompanyRegistrationLandingScreen must push to /service/company-registration-wizard",
  );
});

test("S2-3: company-registration-wizard delegates to CompanyRegistrationScreen (the wizard)", () => {
  const source = read("src/app/service/company-registration-wizard.tsx");
  assert.ok(
    source.includes("CompanyRegistrationScreen"),
    "company-registration-wizard.tsx must render CompanyRegistrationScreen",
  );
});

test("S2-4: /service/company-registration-wizard does not throw on direct navigation (route file is valid)", () => {
  const source = read("src/app/service/company-registration-wizard.tsx");
  assert.ok(source.includes("export default"), "route file must have a default export");
  assert.ok(source.includes("return <"), "route file must render a component");
});

test("S2-5: company-registration-wizard does not resolve to any other service's screen", () => {
  const source = read("src/app/service/company-registration-wizard.tsx");
  for (const forbidden of ["GstScreen", "ItrScreen", "LoansMainScreen", "TdsRefundScreen"]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `company-registration-wizard.tsx must not render ${forbidden}`,
    );
  }
});

test("S2-6: wizard screen has its own back navigation", () => {
  const source = read(
    "src/modules/company-registration/screens/CompanyRegistrationScreen/CompanyRegistrationScreen.tsx",
  );
  assert.ok(
    source.includes("router.back") || source.includes("onBack") || source.includes("showBack"),
    "CompanyRegistrationScreen must support back navigation",
  );
});

// ── Route guard ───────────────────────────────────────────────────────────────

test("both company-registration routes require profile completion", () => {
  for (const route of ["/service/company-registration", "/service/company-registration-wizard"]) {
    assert.equal(serviceRouteNeedsProfile(route), true, `${route} must require profile`);
    assert.equal(decideServiceAccess(route, SIGNED_IN_INCOMPLETE), "complete-profile", route);
    assert.equal(decideServiceAccess(route, SIGNED_OUT), "login", route);
    assert.equal(decideServiceAccess(route, SIGNED_IN_COMPLETE), "allow", route);
  }
});

// ── Cross-service isolation ───────────────────────────────────────────────────

test("company-registration and company-registration-wizard are distinct routes", () => {
  const landing = read("src/app/service/company-registration.tsx");
  const wizard  = read("src/app/service/company-registration-wizard.tsx");
  assert.notEqual(
    landing,
    wizard,
    "company-registration and company-registration-wizard must delegate to different screens",
  );
  assert.ok(
    landing.includes("LandingScreen"),
    "company-registration must render the LandingScreen",
  );
  assert.ok(
    wizard.includes("CompanyRegistrationScreen") && !wizard.includes("LandingScreen"),
    "company-registration-wizard must render CompanyRegistrationScreen (not the landing)",
  );
});

test("neither company-registration route resolves to GST, ITR, or Loans", () => {
  for (const route of ["/service/company-registration", "/service/company-registration-wizard"]) {
    for (const forbidden of ["/service/gst", "/service/itr", "/service/loans"]) {
      assert.notEqual(route, forbidden, `${route} must not be a hub route`);
    }
    assert.equal(serviceRouteNeedsProfile(route), true, `${route} must be gated`);
  }
});

test("missing or unsupported service routes resolve safely without crashing", () => {
  // An unknown service ID falls through to [id].tsx but decideServiceAccess still gates it
  assert.equal(decideServiceAccess("/service/unknown-service-xyz", SIGNED_IN_COMPLETE), "allow");
  assert.equal(decideServiceAccess("/service/unknown-service-xyz", SIGNED_IN_INCOMPLETE), "complete-profile");
  assert.equal(decideServiceAccess("/service/unknown-service-xyz", SIGNED_OUT), "login");
});

test("the two company-registration routes are correctly listed in the route guard check", () => {
  const files = fs
    .readdirSync(path.join(process.cwd(), "src/app/service"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""));
  assert.ok(files.includes("company-registration"), "company-registration.tsx must exist in src/app/service/");
  assert.ok(files.includes("company-registration-wizard"), "company-registration-wizard.tsx must exist in src/app/service/");
});
