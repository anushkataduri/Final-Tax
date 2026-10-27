import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { validateGstinFull, isValidGstin as isValidGstinFromValidation } from "../../modules/gst/utils/gstValidation";
import { validateGstin as sharedValidateGstin, isValidGstin as sharedIsValidGstin } from "../../shared/validators/gstValidators";
import { validateGstin as indianTaxValidateGstin } from "../../shared/validators/indianTaxValidators";
import { validateGstin as filingValidateGstin } from "../../modules/gst/gst-filing/utils/gstFilingValidation";
import { validateGstin as msmeValidateGstin } from "../../modules/loans/msme/validation/msmeLoanValidation";
import { GstValidators } from "../../modules/gst/utils/gstValidators";
import { validateGstinInput } from "../../modules/gst/gst-amendment/utils/gstAmendmentValidation";

const VALID_GSTINS = [
  "07AAAPZ1234A1Z0",
  "27AABCU9603R1ZP",
  "19AAACR5055K1ZB",
  "99AAAPZ1234A1Z0",
  "25AAAPZ1234A1Z0",
  "28AAAPZ1234A1Z0",
  "27AABCU9603R1Z0",
  "07AAAPZ1234A1Z5",
  "07AAADZ1234A1Z0",
];

const INVALID_GSTINS = [
  "07AAAPZ1234A1Z",
  "07AAAPZ1234A1Z0X",
  "07123PZ1234A1Z0",
  "07AAAPZ1234A1A0",
  "U62010TS2025PTC",
];

describe("GSTIN cross-module validation — all validators produce consistent results", () => {
  describe("valid GSTINs accepted by all validators", () => {
    VALID_GSTINS.forEach((gstin) => {
      it(`${gstin}: validateGstinFull returns null`, () => {
        assert.equal(validateGstinFull(gstin), null);
      });

      it(`${gstin}: isValidGstin (gstValidation) returns true`, () => {
        assert.equal(isValidGstinFromValidation(gstin), true);
      });

      it(`${gstin}: shared validateGstin (touched) returns null`, () => {
        assert.equal(sharedValidateGstin(gstin, true), null);
      });

      it(`${gstin}: shared isValidGstin returns true`, () => {
        assert.equal(sharedIsValidGstin(gstin), true);
      });

      it(`${gstin}: indianTaxValidators validateGstin returns true`, () => {
        assert.equal(indianTaxValidateGstin(gstin), true);
      });

      it(`${gstin}: filing validateGstin (touched) returns null`, () => {
        assert.equal(filingValidateGstin(gstin, true), null);
      });

      it(`${gstin}: GstValidators.isValidGstin returns true`, () => {
        assert.equal(GstValidators.isValidGstin(gstin), true);
      });

      it(`${gstin}: amendment validateGstinInput returns isValid:true`, () => {
        assert.equal(validateGstinInput(gstin).isValid, true);
      });

      it(`${gstin}: msme validateGstin (Registered) returns undefined`, () => {
        assert.equal(msmeValidateGstin(gstin, "Registered"), undefined);
      });
    });
  });

  describe("invalid GSTINs rejected by all validators", () => {
    INVALID_GSTINS.forEach((gstin) => {
      it(`"${gstin}": validateGstinFull returns error`, () => {
        assert.ok(validateGstinFull(gstin) !== null);
      });

      it(`"${gstin}": sharedIsValidGstin returns false`, () => {
        assert.equal(sharedIsValidGstin(gstin), false);
      });

      it(`"${gstin}": indianTaxValidators validateGstin returns false`, () => {
        assert.equal(indianTaxValidateGstin(gstin), false);
      });

      it(`"${gstin}": GstValidators.isValidGstin returns false`, () => {
        assert.equal(GstValidators.isValidGstin(gstin), false);
      });

      it(`"${gstin}": amendment validateGstinInput returns isValid:false`, () => {
        assert.equal(validateGstinInput(gstin).isValid, false);
      });
    });
  });

  describe("MSME validator skips check when not registered", () => {
    it("returns undefined for any GSTIN when status is not Registered", () => {
      assert.equal(msmeValidateGstin("INVALID", "Not Registered"), undefined);
      assert.equal(msmeValidateGstin("INVALID", ""), undefined);
    });

    it("returns error for invalid GSTIN when status is Registered", () => {
      assert.ok(msmeValidateGstin("INVALID_GSTIN_X", "Registered") !== undefined);
    });
  });

  describe("partial-validation behaviour (isTouched = false)", () => {
    it("shared validateGstin returns null for 14-char partial when untouched", () => {
      assert.equal(sharedValidateGstin("07AAAPZ1234A1Z", false), null);
    });

    it("filing validateGstin returns null for 14-char partial when untouched", () => {
      assert.equal(filingValidateGstin("07AAAPZ1234A1Z", false), null);
    });

    it("shared validateGstin returns error for 14-char partial when touched", () => {
      assert.ok(sharedValidateGstin("07AAAPZ1234A1Z", true) !== null);
    });
  });
});
