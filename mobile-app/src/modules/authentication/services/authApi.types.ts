export interface DevUser {
  customerId: string;
  mobileNumber: string;
  name: string;
  email: string;
  gender?: string;
  fatherSpouseName?: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pincode?: string;
  state?: string;
  customerType?: string;
  avatarUri?: string | null;
  passcode?: string;
  hasPasscode?: boolean;
  pushToken?: string;
  registrationCompleted?: boolean;
  createdAt?: string;
}

/** Customer record as returned by the customer endpoints (backend CustomerDto; legacy aliases included). */
export interface CustomerApiRecord {
  custId?: string;
  customerId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  mobile?: string;
  customerType?: string;
  custType?: string;
  pan?: string;
  aadhaar?: string;
  adhar?: string;
  dob?: string;
  dateOfBirth?: string;
  gender?: string;
  fatherSpouseName?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pinCode?: string;
  avatarUri?: string | null;
  profileCompleted?: boolean;
  registrationCompleted?: boolean;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  /** Server limit code ("OTP_LOCKED" / "OTP_RESEND_LIMITED") when the request was refused with HTTP 429. */
  code?: string;
  retryAfterSeconds?: number;
}

/** `POST /otp/verify` body. The embedded customer is present only for registered numbers. */
export interface VerifyOtpApiResponse {
  customerExists?: boolean;
  isExistingUser?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  message?: string;
  customer?: CustomerApiRecord & { custId: string; name: string; email: string };
  /** Single-use proof that a new number passed OTP; required by `POST /customer/register`. */
  registrationProof?: string;
  registrationProofExpiresInSeconds?: number;
}

/** `GET /customer/exists/:mobile` body. */
export interface CustomerStatusResponse {
  exists?: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
}

/** Token pair and identity returned by `/customer/login` and `/customer/register`. */
export interface CustomerLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  custId: string;
  mobileNumber: string;
  name: string;
}

/** Result of `getCustomerDetails`. */
export type CustomerDetailsResult =
  | { success: true; data: CustomerApiRecord }
  | { success: false; message: string };

/** Fields sent to `PUT /customer/update`; other profile fields pass through unchanged. */
export interface CustomerProfileUpdate {
  mobileNumber?: string;
  dob?: string;
  [field: string]: unknown;
}

export interface VerifyOtpResponse {
  success: boolean;
  isExistingUser?: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  message?: string;
  user?: DevUser;
  customer?: CustomerApiRecord;
  registrationProof?: string;
  registrationProofExpiresInSeconds?: number;
  /** Server limit code ("OTP_LOCKED") when verification was refused with HTTP 429. */
  code?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
}

export interface CheckUserResponse {
  success: boolean;
  exists: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  user?: DevUser;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: DevUser;
  token?: string;
  message?: string;
  /** Server error code, e.g. "REGISTRATION_PROOF_EXPIRED". */
  code?: string;
}

export interface PasscodeResponse {
  success: boolean;
  user?: DevUser;
  token?: string;
  message?: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}
