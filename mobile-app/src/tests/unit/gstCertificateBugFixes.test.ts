import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

import { validateGstinFull } from "../../modules/gst/utils/gstValidation";
import { validateGstinInput } from "../../modules/gst/gst-amendment/utils/gstAmendmentValidation";

const ROOT = path.resolve(__dirname, "../../..");
const SCREEN_FILE = path.join(
  ROOT,
  "src/modules/gst/gst-certificate/screens/GstCertificateScreen/GstCertificateScreen.tsx"
);
const HOOK_FILE = path.join(
  ROOT,
  "src/modules/gst/gst-certificate/hooks/useGstCertificateFlow.ts"
);

describe("GST Certificate Bug Fixes", () => {
  describe("Bug 1 — validateGstinFull: valid GSTINs", () => {
    it("accepts Delhi GSTIN with correct checksum", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1Z0"), null);
    });

    it("accepts Maharashtra GSTIN with correct checksum", () => {
      assert.equal(validateGstinFull("27AABCU9603R1ZP"), null);
    });

    it("accepts West Bengal GSTIN with correct checksum", () => {
      assert.equal(validateGstinFull("19AAACR5055K1ZB"), null);
    });

    it("normalises lowercase input before validating", () => {
      assert.equal(validateGstinFull("07aaapz1234a1z0"), null);
    });
  });

  describe("Bug 1 — validateGstinFull: empty / length errors", () => {
    it("rejects empty string", () => {
      assert.equal(validateGstinFull(""), "Enter a valid 15-character GSTIN.");
    });

    it("rejects whitespace-only input", () => {
      assert.equal(validateGstinFull("   "), "Enter a valid 15-character GSTIN.");
    });

    it("rejects GSTIN shorter than 15 chars", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1Z"), "Enter a valid 15-character GSTIN.");
    });

    it("rejects GSTIN longer than 15 chars", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1Z0X"), "Enter a valid 15-character GSTIN.");
    });
  });

  describe("Bug 1 — validateGstinFull: format errors", () => {
    it("rejects GSTIN containing spaces", () => {
      assert.equal(validateGstinFull("07 AAAPZ1234A1Z0"), "Enter a valid GSTIN format.");
    });

    it("rejects GSTIN containing emoji", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1Z😂"), "Enter a valid GSTIN format.");
    });

    it("rejects GSTIN with invalid Z position (position 13 is not Z)", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1A0"), "Enter a valid GSTIN format.");
    });

    it("rejects GSTIN with invalid PAN entity character (D not in ABCFGHJLPT)", () => {
      assert.equal(validateGstinFull("07AAADZ1234A1Z0"), "Enter a valid GSTIN format.");
    });
  });

  describe("Bug 1 — validateGstinFull: state code errors", () => {
    it("rejects state code 99 (not a domestic GST code)", () => {
      const err = validateGstinFull("99AAAPZ1234A1Z0");
      assert.equal(err, "Enter a valid GSTIN state code.");
    });

    it("rejects state code 25 (excluded from active codes)", () => {
      const err = validateGstinFull("25AAAPZ1234A1Z0");
      assert.equal(err, "Enter a valid GSTIN state code.");
    });

    it("rejects state code 28 (defunct code)", () => {
      const err = validateGstinFull("28AAAPZ1234A1Z0");
      assert.equal(err, "Enter a valid GSTIN state code.");
    });
  });

  describe("Bug 1 — validateGstinFull: checksum errors", () => {
    it("rejects correct-format GSTIN with wrong checksum digit", () => {
      assert.equal(validateGstinFull("07AAAPZ1234A1Z5"), "The GSTIN checksum is invalid.");
    });

    it("rejects Maharashtra GSTIN with flipped checksum", () => {
      assert.equal(validateGstinFull("27AABCU9603R1Z0"), "The GSTIN checksum is invalid.");
    });
  });

  describe("Bug 1 — validateGstinFull: CIN / company numbers rejected", () => {
    it("rejects CIN U62010TS2025PTC (starts with letter, not 2-digit state code)", () => {
      assert.equal(validateGstinFull("U62010TS2025PTC"), "Enter a valid GSTIN format.");
    });

    it("rejects another CIN format L12345MH2020PLC", () => {
      assert.equal(validateGstinFull("L12345MH2020PLC"), "Enter a valid GSTIN format.");
    });
  });

  describe("Bug 1 — validateGstinFull: invalid PAN portion", () => {
    it("rejects GSTIN with digits in PAN alphabetic prefix (first 3 chars)", () => {
      assert.equal(validateGstinFull("07123PZ1234A1Z0"), "Enter a valid GSTIN format.");
    });

    it("rejects GSTIN with invalid PAN entity character D (not in ABCFGHJLPT)", () => {
      assert.equal(validateGstinFull("07AAADZ1234A1Z0"), "Enter a valid GSTIN format.");
    });
  });

  describe("Bug 2 — Back button absent on completed screen", () => {
    it("back button is absent when flow.isCompleted is true", () => {
      const source = fs.readFileSync(SCREEN_FILE, "utf-8");
      assert.ok(
        source.includes("!flow.isCompleted"),
        "Screen must conditionally hide back button based on flow.isCompleted"
      );
    });

    it("completed state renders a placeholder instead of TouchableOpacity back button", () => {
      const source = fs.readFileSync(SCREEN_FILE, "utf-8");
      assert.ok(
        source.includes("<View style={st.backBtn} />"),
        "A placeholder View must replace the back button when completed"
      );
    });

    it("back button onPress no longer contains isCompleted branch", () => {
      const source = fs.readFileSync(SCREEN_FILE, "utf-8");
      assert.ok(
        source.includes("onPress={() => flow.router.back()}"),
        "Back button onPress must be a simple router.back() call, not an isCompleted branch"
      );
    });

    it("Go to My Applications button is still present on completed screen", () => {
      const source = fs.readFileSync(SCREEN_FILE, "utf-8");
      assert.ok(
        source.includes("Go to My Applications"),
        "Go to My Applications button must remain intact"
      );
    });
  });

  describe("Bug 1 — Hook uses validateGstinFull", () => {
    it("hook imports validateGstinFull from gstValidation", () => {
      const source = fs.readFileSync(HOOK_FILE, "utf-8");
      assert.ok(
        source.includes("validateGstinFull"),
        "Hook must import and use validateGstinFull"
      );
    });

    it("hook performs real-time validation when GSTIN reaches 15 chars", () => {
      const source = fs.readFileSync(HOOK_FILE, "utf-8");
      assert.ok(
        source.includes("cleaned.length === 15"),
        "Hook must trigger validateGstinFull when GSTIN reaches 15 characters"
      );
    });

    it("hook provides handleGstinBlur for blur validation", () => {
      const source = fs.readFileSync(HOOK_FILE, "utf-8");
      assert.ok(
        source.includes("handleGstinBlur"),
        "Hook must export handleGstinBlur"
      );
    });

    it("screen calls handleGstinBlur onBlur", () => {
      const source = fs.readFileSync(SCREEN_FILE, "utf-8");
      assert.ok(
        source.includes("onBlur={flow.handleGstinBlur}"),
        "Screen must bind onBlur to flow.handleGstinBlur"
      );
    });
  });
});

describe("GST Certificate & Amendment — same canonical GSTIN validator", () => {
  const VALID_GSTINS = [
    "07AAAPZ1234A1Z0",
    "27AABCU9603R1ZP",
    "19AAACR5055K1ZB",
  ];

  const INVALID_CASES: [string, string][] = [
    ["07AAAPZ1234A1Z",  "14 chars — too short"],
    ["07AAAPZ1234A1Z0X", "16 chars — too long"],
    ["99AAAPZ1234A1Z0",  "state code 99 — inactive"],
    ["25AAAPZ1234A1Z0",  "state code 25 — defunct"],
    ["28AAAPZ1234A1Z0",  "state code 28 — defunct"],
    ["07AAADZ1234A1Z0",  "PAN entity char D — not in ABCFGHJLPT"],
    ["07123PZ1234A1Z0",  "digits in PAN alpha prefix"],
    ["07AAAPZ1234A1A0",  "invalid Z position (position 13 is A not Z)"],
    ["07AAAPZ1234A1Z5",  "wrong checksum digit"],
    ["U62010TS2025PTC",  "CIN format — starts with letter"],
    ["L12345MH2020PLC",  "CIN format — L prefix"],
  ];

  describe("valid GSTINs — both validators accept", () => {
    VALID_GSTINS.forEach((gstin) => {
      it(`${gstin} is accepted by validateGstinFull (Certificate)`, () => {
        assert.equal(validateGstinFull(gstin), null, `${gstin} must be valid`);
      });

      it(`${gstin} accepted by Amendment validator maps to isValid:true`, () => {
        const res = validateGstinInput(gstin);
        assert.equal(res.isValid, true, `${gstin} must pass Amendment validator`);
      });
    });
  });

  describe("invalid GSTINs — both validators reject", () => {
    INVALID_CASES.forEach(([gstin, label]) => {
      it(`Certificate validator rejects: ${label}`, () => {
        assert.ok(
          validateGstinFull(gstin) !== null,
          `validateGstinFull must reject "${gstin}" (${label})`
        );
      });

      it(`Amendment validator rejects: ${label}`, () => {
        const res = validateGstinInput(gstin);
        assert.equal(res.isValid, false, `validateGstinInput must reject "${gstin}" (${label})`);
      });
    });
  });

  describe("Amendment validator delegates to validateGstinFull", () => {
    it("gstAmendmentValidation imports validateGstinFull", () => {
      const source = fs.readFileSync(
        path.join(ROOT, "src/modules/gst/gst-amendment/utils/gstAmendmentValidation.ts"),
        "utf-8"
      );
      assert.ok(
        source.includes("validateGstinFull"),
        "gstAmendmentValidation must import and call validateGstinFull"
      );
    });
  });
});
