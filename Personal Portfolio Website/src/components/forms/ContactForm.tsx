"use client";

import React, { useState, useId } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";

interface FormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
  _gotcha: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const projectTypeId = useId();
  const messageId = useId();

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    projectType: "Website Development",
    message: "",
    _gotcha: "",
  });

  // Track submission attempt so errors NEVER show on initial page load
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!values.name.trim()) {
      errs.name = "Please enter your name.";
    } else if (values.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = "Please provide a valid email address.";
    }

    if (!values.message.trim()) {
      errs.message = "Please share a few details about your project.";
    } else if (values.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear inline field error as soon as user edits
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }

    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsSubmitted(true);
        setHasAttemptedSubmit(false);
        setErrors({});
        // Reset form values on success
        setValues({
          name: "",
          email: "",
          projectType: "Website Development",
          message: "",
          _gotcha: "",
        });
      } else {
        if (data.details) {
          setErrors(data.details);
        }
        setSubmitError(
          data.error || "Something went wrong. Please try again or contact me directly by email."
        );
      }
    } catch {
      setSubmitError(
        "Network connection error. Please try again or contact me directly by email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="border-t-2 border-t-[#C6F277] border-x border-b border-[#FFF3E6]/10 bg-[#240f20]/50 p-8 sm:p-12 space-y-6 transition-all animate-observatory-reveal"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-[#C6F277]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold">
            {"// DISPATCH SUCCESSFUL"}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#FFF3E6] tracking-tight">
            MESSAGE RECEIVED
          </h3>
          <p className="font-serif italic text-lg sm:text-xl text-[#FFF3E6]/90 leading-relaxed">
            &ldquo;Your message has been sent successfully. I&apos;ll get back to you soon.&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setHasAttemptedSubmit(false);
          }}
          className="font-mono text-xs text-[#C6F277] hover:underline uppercase tracking-wider pt-2 block cursor-pointer transition-colors"
        >
          &larr; Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-t-2 border-t-[#C6F277] border-x border-b border-[#FFF3E6]/10 bg-[#240f20]/40 p-6 sm:p-8 lg:p-10 space-y-7 relative"
      aria-label="Direct Project Inquiry Form"
    >
      {/* Invisible spam honeypot trap */}
      <input
        type="text"
        name="_gotcha"
        value={values._gotcha}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden absolute -left-[9999px]"
        aria-hidden="true"
      />

      {/* General Submission Error Banner */}
      {submitError && (
        <div
          className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-mono"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Field 1: Name */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={nameId}
              className="font-mono text-xs uppercase tracking-wider text-[#FFF3E6]/70 font-medium"
            >
              NAME
              <span className="text-[#C6F277] ml-1 font-bold" aria-hidden="true">
                *
              </span>
            </label>
            {hasAttemptedSubmit && errors.name && (
              <span className="text-red-400 font-sans normal-case text-[11px] leading-tight">
                {errors.name}
              </span>
            )}
          </div>
          <input
            id={nameId}
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasAttemptedSubmit && !!errors.name}
            className={`w-full bg-[#1b0a18]/70 border text-[#FFF3E6] px-4 py-3.5 font-sans text-sm placeholder:text-[#FFF3E6]/25 focus:outline-none transition-all duration-200 ${
              hasAttemptedSubmit && errors.name
                ? "border-red-400/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                : "border-[#FFF3E6]/15 hover:border-[#FFF3E6]/30 focus:border-[#C6F277] focus:ring-1 focus:ring-[#C6F277]/30"
            }`}
          />
        </div>

        {/* Field 2: Email */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={emailId}
              className="font-mono text-xs uppercase tracking-wider text-[#FFF3E6]/70 font-medium"
            >
              EMAIL
              <span className="text-[#C6F277] ml-1 font-bold" aria-hidden="true">
                *
              </span>
            </label>
            {hasAttemptedSubmit && errors.email && (
              <span className="text-red-400 font-sans normal-case text-[11px] leading-tight">
                {errors.email}
              </span>
            )}
          </div>
          <input
            id={emailId}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Your email address"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasAttemptedSubmit && !!errors.email}
            className={`w-full bg-[#1b0a18]/70 border text-[#FFF3E6] px-4 py-3.5 font-sans text-sm placeholder:text-[#FFF3E6]/25 focus:outline-none transition-all duration-200 ${
              hasAttemptedSubmit && errors.email
                ? "border-red-400/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                : "border-[#FFF3E6]/15 hover:border-[#FFF3E6]/30 focus:border-[#C6F277] focus:ring-1 focus:ring-[#C6F277]/30"
            }`}
          />
        </div>
      </div>

      {/* Field 3: Project Type (Select) */}
      <div className="space-y-2">
        <label
          htmlFor={projectTypeId}
          className="font-mono text-xs uppercase tracking-wider text-[#FFF3E6]/70 font-medium block"
        >
          PROJECT TYPE
          <span className="text-[#FFF3E6]/40 text-[10px] ml-2 tracking-normal font-normal">
            (OPTIONAL)
          </span>
        </label>
        <div className="relative">
          <select
            id={projectTypeId}
            name="projectType"
            value={values.projectType}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full bg-[#1b0a18]/70 border border-[#FFF3E6]/15 text-[#FFF3E6] px-4 py-3.5 font-sans text-sm appearance-none cursor-pointer focus:outline-none hover:border-[#FFF3E6]/30 focus:border-[#C6F277] focus:ring-1 focus:ring-[#C6F277]/30 transition-all duration-200"
          >
            <option value="Website Development">Website Development</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Other">Other</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-xs text-[#C6F277]">
            &darr;
          </div>
        </div>
      </div>

      {/* Field 4: Message */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={messageId}
            className="font-mono text-xs uppercase tracking-wider text-[#FFF3E6]/70 font-medium"
          >
            MESSAGE
            <span className="text-[#C6F277] ml-1 font-bold" aria-hidden="true">
              *
            </span>
          </label>
          {hasAttemptedSubmit && errors.message && (
            <span className="text-red-400 font-sans normal-case text-[11px] leading-tight">
              {errors.message}
            </span>
          )}
        </div>
        <textarea
          id={messageId}
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell me a little about your idea..."
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={hasAttemptedSubmit && !!errors.message}
          className={`w-full bg-[#1b0a18]/70 border text-[#FFF3E6] p-4 font-sans text-sm placeholder:text-[#FFF3E6]/25 focus:outline-none transition-all duration-200 resize-y min-h-[120px] ${
            hasAttemptedSubmit && errors.message
              ? "border-red-400/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
              : "border-[#FFF3E6]/15 hover:border-[#FFF3E6]/30 focus:border-[#C6F277] focus:ring-1 focus:ring-[#C6F277]/30"
          }`}
        />
      </div>

      {/* Submit Button & Assurance */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#FFF3E6]/10 pt-5">
        <p className="font-mono text-[11px] text-[#FFF3E6]/40 tracking-wider">
          DIRECT INBOX DISPATCH &bull; STRICT CONFIDENTIALITY
        </p>

        <MagneticButton strength={0.25} maxOffset={6}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center gap-3 bg-[#C6F277] text-[#381932] px-7 sm:px-9 py-3.5 sm:py-4 font-display font-extrabold text-sm uppercase tracking-wider hover:bg-[#FFF3E6] hover:text-[#381932] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md select-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#381932]" />
                <span>DISPATCHING...</span>
              </>
            ) : (
              <>
                <span>SEND MESSAGE</span>
                <ArrowUpRight className="w-4 h-4 text-[#381932] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </>
            )}
          </button>
        </MagneticButton>
      </div>
    </form>
  );
}
