import React, { useState } from 'react';
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
  cnicNumber: string;
  mobile: string;
  city: string;
  playerType: string;
  picture: File | null;
  cnic: File | null;
  receipt: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    cnicNumber: '',
    mobile: '',
    city: '',
    playerType: '',
    picture: null,
    cnic: null,
    receipt: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!form.cnicNumber.trim()) {
      nextErrors.cnicNumber = 'Please enter your CNIC number.';
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

  const uploadFile = async (file: File) => {
    return storage.createFile(
      storageBucketId,
      ID.unique(),
      file,
      [
      Permission.read(Role.any()),
      Permission.write(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ]
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
    setSubmitMessage(null);

    try {
      const [pictureFile, cnicFile, receiptFile] = await Promise.all([
        uploadFile(form.picture as File),
        uploadFile(form.cnic as File),
        uploadFile(form.receipt as File),
      ]);

      await databases.createDocument(
        databaseId,
        registrationCollectionId,
        ID.unique(),
        {
          username: form.name.trim(),
          user_cnic: form.cnicNumber.trim(),
          mobilenumber: form.mobile.trim(),
          city: form.city,
          playerType: form.playerType,
          user_picture: pictureFile.$id,
          cnic_picture: cnicFile.$id,
          payment_picture: receiptFile.$id,
        },
      );

      setSubmitMessage('Registration submitted successfully to Appwrite.');
      setForm({
        name: '',
        cnicNumber: '',
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
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit registration. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>Player Registration</h2>
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

        <label htmlFor="cnicNumber">CNIC Number:</label>
        <input
          id="cnicNumber"
          type="text"
          name="cnicNumber"
          value={form.cnicNumber}
          onChange={handleChange}
          placeholder="Enter your CNIC number"
          className={errors.cnicNumber ? 'inputError' : ''}
        />
        {errors.cnicNumber && <div className="fieldError">{errors.cnicNumber}</div>}

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
          {submitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
      {submitMessage && <div className="submitMessage">{submitMessage}</div>}
    </div>
  );
}

export const RegistrationComponent = () => {
  return (
    <div>
      <Header />
      <div className="row">
        <div className="tournament-logo-col">
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