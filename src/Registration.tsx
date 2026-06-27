import React, { useEffect, useRef, useState } from 'react';
import { Header } from './Home';
import {
  databases,
  storage,
  storageBucketId,
  databaseId,
  registrationCollectionId,
} from './appwrite/config.ts';

import { ID, Permission, Role } from 'appwrite';
import gsslLogo from './assets/gssl-logo.jpg';
import './RegistrationForm.css';

type FormState = {
  name: string;
  mobile: string;
  city: string;
  playerType: string;
  picture: File | null;
  cnic: File | null;
  receipt: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type SubmittedData = {
  username: string;
  mobilenumber: string;
  documentId?: string;
  pictureFileId?: string;
  cnicFileId?: string;
  receiptFileId?: string;
};

function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    mobile: '',
    city: '',
    playerType: '',
    picture: null,
    cnic: null,
    receipt: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ((submitting || apiError) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitting, apiError]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = 'Please enter your mobile number.';
    } else if (!/^[0-9]{10,15}$/.test(form.mobile.trim())) {
      nextErrors.mobile = 'Enter a valid mobile number with 10–15 digits.';
    }

    if (!form.city) {
      nextErrors.city = 'Please select a city.';
    }

    if (!form.playerType) {
      nextErrors.playerType = 'Please choose a player type.';
    }

    if (!form.picture) {
      nextErrors.picture = 'Please upload a player picture.';
    }

    if (!form.cnic) {
      nextErrors.cnic = 'Please upload your CNIC image.';
    }

    if (!form.receipt) {
      nextErrors.receipt = 'Please upload your payment receipt.';
    }

    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const { name, type, value, files } = target as HTMLInputElement;
    const nextValue = type === 'file' ? files?.[0] ?? null : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const uploadFile = async (file: File, username?: string) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeUsername = username ? username.replace(/[^a-zA-Z0-9._-]/g, '_') : undefined;
    const prefixedName = safeUsername ? `${safeUsername}_${safeName}` : safeName;
    const fileToUpload = new File([file], prefixedName, { type: file.type });
    return storage.createFile(
      storageBucketId,
      ID.unique(),
      fileToUpload,
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const username = form.name.trim();
      const [pictureFile, cnicFile, receiptFile] = await Promise.all([
        uploadFile(form.picture as File, username),
        uploadFile(form.cnic as File, username),
        uploadFile(form.receipt as File, username),
      ]);

      const created = await databases.createDocument(
        databaseId,
        registrationCollectionId,
        ID.unique(),
        {
          username: form.name.trim(),
          mobilenumber: form.mobile.trim(),
          city: form.city,
          playerType: form.playerType,
          user_picture: pictureFile.$id,
          cnic_picture: cnicFile.$id,
          payment_picture: receiptFile.$id,
        },
      );

      // store submitted info and show success component instead of message
      setSubmittedData({
        username: form.name.trim(),
        mobilenumber: form.mobile.trim(),
        documentId: created.$id,
        pictureFileId: pictureFile.$id,
        cnicFileId: cnicFile.$id,
        receiptFileId: receiptFile.$id,
      });
      setSuccess(true);
      setForm({
        name: '',
        mobile: '',
        city: '',
        playerType: '',
        picture: null,
        cnic: null,
        receipt: null,
      });
      setErrors({});
    } catch (error) {
      console.error('Appwrite submit error', error);
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unable to submit registration. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-form" ref={formRef}>
      <h2>Player Registration</h2>
      {success && submittedData ? (
        <RegistrationSuccess data={submittedData} onClose={() => { setSuccess(false); setSubmittedData(null); }} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className={errors.name ? 'inputError' : ''}
        />
        {errors.name && <div className="fieldError">{errors.name}</div>}

        <label htmlFor="mobile">Mobile Number:</label>
        <input
          id="mobile"
          type="tel"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile number"
          className={errors.mobile ? 'inputError' : ''}
        />
        {errors.mobile && <div className="fieldError">{errors.mobile}</div>}

        <label htmlFor="city">City:</label>
        <select
          id="city"
          name="city"
          value={form.city}
          onChange={handleChange}
          className={errors.city ? 'inputError' : ''}
        >
          <option value="">Select City</option>
          <option value="islamabad">Islamabad</option>
          <option value="rawalpindi">Rawalpindi</option>
        </select>
        {errors.city && <div className="fieldError">{errors.city}</div>}

        <label>Player Type:</label>
        <div className="playerType">
          <label className="radioLabel">
            <input
              type="radio"
              name="playerType"
              value="batsman"
              checked={form.playerType === 'batsman'}
              onChange={handleChange}
            />
            Batsman
          </label>
          <label className="radioLabel">
            <input
              type="radio"
              name="playerType"
              value="bowler"
              checked={form.playerType === 'bowler'}
              onChange={handleChange}
            />
            Bowler
          </label>
          
        </div>
        {errors.playerType && (
          <div className="fieldError">{errors.playerType}</div>
        )}

        <label htmlFor="picture">Upload Picture:</label>
        <div className="fileUpload">
          <input
            id="picture"
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleChange}
            className={errors.picture ? 'inputError' : ''}
          />
          <div className="fileName">
            {form.picture ? form.picture.name : 'No file selected yet.'}
          </div>
        </div>
        {errors.picture && <div className="fieldError">{errors.picture}</div>}

        <label htmlFor="cnic">Upload CNIC:</label>
        <div className="fileUpload">
          <input
            id="cnic"
            type="file"
            name="cnic"
            accept="image/*"
            onChange={handleChange}
            className={errors.cnic ? 'inputError' : ''}
          />
          <div className="fileName">
            {form.cnic ? form.cnic.name : 'No file selected yet.'}
          </div>
        </div>
        {errors.cnic && <div className="fieldError">{errors.cnic}</div>}

        <label htmlFor="receipt">Upload Payment Receipt:</label>
        <div className="fileUpload">
          <input
            id="receipt"
            type="file"
            name="receipt"
            accept="image/*"
            onChange={handleChange}
            className={errors.receipt ? 'inputError' : ''}
          />
          <div className="fileName">
            {form.receipt ? form.receipt.name : 'No file selected yet.'}
          </div>
        </div>
        {errors.receipt && <div className="fieldError">{errors.receipt}</div>}

          <button type="submit" className="submitButton" disabled={submitting}>
            Submit Registration
          </button>
        </form>
      )}

      {submitting && (
        <div className="dialogOverlay">
          <div className="dialogBox loadingDialog">
            <div className="spinner" />
            <h3>Submitting registration</h3>
            <p>Please wait while we process your submission.</p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="dialogOverlay">
          <div className="dialogBox errorDialog">
            <h3>Submission failed</h3>
            <p>{apiError}</p>
            <button
              type="button"
              className="submitButton secondary"
              onClick={() => setApiError(null)}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type SuccessProps = {
  data: NonNullable<SubmittedData>;
  onClose: () => void;
};

function RegistrationSuccess({ data, onClose }: SuccessProps) {
  return (
    <div className="registration-success">
      <h3>Registration Successful</h3>
      <p>Thank you, <strong>{data.username}</strong>. Your registration ID is <em>{data.documentId}</em>.</p>
      <ul>
        <li>Mobile: {data.mobilenumber}</li>
      </ul>
      <button className="submitButton" onClick={onClose}>
        Register another
      </button>
    </div>
  );
}

function PaymentRegistration() {
  return (
    <div className="payment-registration">
      <div className="payment-header">
        <span className="payment-lock-icon">🔒</span>
        <div>
          <h3>Registration Payment Rs.200</h3>
          <p>Complete payment to register your account</p>
        </div>
      </div>

      <div className="payment-method">
        <label className="payment-label">SEND PAYMENT VIA</label>
        <div className="easypaisa-card">
          <div className="easypaisa-icon">E</div>
          <div className="easypaisa-name">Easypaisa Rs.200</div>
        </div>
      </div>

      <div className="account-info">
        <div className="account-field">
          <label>Account Number</label>
          <div className="account-number">0313-5076017</div>
        </div>

        <div className="account-title-field">
          <div className="account-badge">MK</div>
          <div>
            <label>Account Title</label>
            <div className="account-name">Muhammad Afsar Khan</div>
          </div>
        </div>
      </div>

      <div className="how-to-register">
        <h4>How to register</h4>
        <ol className="register-steps">
          <li>Send payment to the Easypaisa number above</li>
          <li>Take a screenshot of your payment receipt</li>
          <li>Upload the screenshot during registration</li>
        </ol>
      </div>

      <div className="registration-warning">
        <span className="warning-icon">⚠️</span>
        <p>Registration will only be approved after payment is verified</p>
      </div>
    </div>
  );
}

export const RegistrationComponent = () => {
  return (
    <div>
      <Header />
      <div className="row">
        <div className="tournament-logo-col">
          <PaymentRegistration />
          <img src={gsslLogo} alt="GSSL Logo" className="gssl-logo" />
          <h3>Golra Station Super League 2026</h3>
          <p>Register now to participate in the upcoming season!</p>
          
        </div>

        <div className="registration-col">
          <RegistrationForm />
        </div>
        
      </div>
    </div>
  );
};