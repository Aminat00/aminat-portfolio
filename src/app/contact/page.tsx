"use client";
import { Button, Input, Textarea } from "@/components/";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

const info = [
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "moldalievaaminat@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Location",
    description: "Remote, EMEA Timezone",
  },
];

type FormErrors = {
  email?: string;
  [key: string]: string | undefined;
};

const Contact = () => {
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    title: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailRegex.test(value) ? "" : "Please enter a valid email.",
      }));
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors: FormErrors = {};

    if (!formData.firstName) {
      formIsValid = false;
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName) {
      formIsValid = false;
      newErrors.lastName = "Last name is required.";
    }
    if (!formData.email) {
      formIsValid = false;
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        formIsValid = false;
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!formData.title) {
      formIsValid = false;
      newErrors.title = "Title is required.";
    }
    if (!formData.message) {
      formIsValid = false;
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);

    if (!formIsValid) {
      alert("Please fill in all required fields.");
      return;
    }

    const body = new URLSearchParams({
      "form-name": "contact",
      ...formData,
    });

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            title: "",
            message: "",
          });
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch(() => alert("Something went wrong. Please try again."));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.2, duration: 0.4, ease: "easeIn" },
      }}
      className="py-12"
    >
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-col gap-8">
          {/* success message */}
          {submitted && (
            <div className="p-6 bg-surface border border-primary/30 rounded-xl text-center">
              <h3 className="text-xl font-bold text-heading">Message sent!</h3>
              <p className="text-body">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            </div>
          )}

          {/* form */}
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="flex flex-col gap-6 p-8 bg-white border border-border rounded-xl shadow-sm"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>
            <h3 className="text-3xl font-extrabold text-heading">
              Let&apos;s work together
            </h3>
            <p className="text-body">
              I&apos;m always open to new challenges and eager to contribute to
              projects that make a difference. Let&apos;s create something
              meaningful!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  name="firstName"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  name="lastName"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                name="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                placeholder="Subject"
                value={formData.title}
                onChange={handleChange}
                name="title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                className="h-[150px]"
                placeholder="Type your message here."
                value={formData.message}
                onChange={handleChange}
                name="message"
              />
              {errors.message && (
                <p className="text-red-500 text-xs">{errors.message}</p>
              )}
            </div>
            <Button
              size="md"
              className="max-w-40 self-center w-full"
              onClick={(e) => handleSubmit(e)}
            >
              Send message
            </Button>
          </form>

          {/* info */}
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            {info.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-[52px] h-[52px] bg-surface border border-border text-primary rounded-lg flex items-center justify-center">
                  <div className="text-xl">{item.icon}</div>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted text-sm">{item.title}</p>
                  <p className="text-heading font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
