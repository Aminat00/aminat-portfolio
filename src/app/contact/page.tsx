"use client";
import { Button, Input, Textarea } from "@/components/";
import { FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const info = [
	{
		icon: <FaEnvelope />,
		title: "Email",
		description: "moldalievaaminat@gmail.com",
	},
	{
		icon: <FaMapMarkerAlt />,
		title: "Address",
		description: "Anywhere in the world 🌎",
	},
];

type FormErrors = {
	email?: string;
	[key: string]: string | undefined; // This allows other fields to be added dynamically
};

import { motion } from "framer-motion";
import React from "react";

const Contact = () => {
	const [submitted, setSubmitted] = React.useState(false);
	const [errors, setErrors] = React.useState<FormErrors>({});
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

		// Update form data
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		// Validate inputs in real-time
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

		// Check all required fields
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
			// Validate email format
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
			newErrors.email = "Message is required.";
		}

		setErrors(newErrors);

		// Prevent submission if form is invalid
		if (!formIsValid) {
			alert("Please fill in all required fields.");
			return;
		}

		fetch("/api/contact", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		}).then((res) => {
			console.log("Response received");
			if (res.status === 200) {
				console.log("Response succeeded!");
				setSubmitted(true);
				setFormData({
					firstName: "",
					lastName: "",
					email: "",
					phoneNumber: "",
					title: "",
					message: "",
				});
			}
		});
	};

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
			}}
			className="py-6">
			<div className="container mx-auto">
				<div className="flex flex-col xl:flex-row gap-[30px]">
					{/* form */}
					<div className="xl:w-[54%] order-2 xl:order-none">
						<form className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl">
							<h3 className="text-4xl text-accent">Let's work together</h3>
							<p className="text-white/60">
								I’m always open to new challenges and eager to contribute to
								projects that benefit humaity 🚀. Let’s work together to create
								something meaningful!
							</p>
							{/* input */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-primary">
								<div className="flex-col gap-2">
									<Input
										type="firstName"
										placeholder="Firstname"
										value={formData.firstName}
										onChange={handleChange}
										name="firstName"
									/>
									{errors.firstName && (
										<p className="text-red-500">{errors.firstName}</p>
									)}
								</div>
								<div className="flex-col gap-2">
									<Input
										type="lastName"
										placeholder="Lastname"
										value={formData.lastName}
										onChange={handleChange}
										name="lastName"
									/>
									{errors.lastName && (
										<p className="text-red-500">{errors.lastName}</p>
									)}
								</div>
							</div>
							{/* email */}
							<div className="flex-col gap-2">
								<Input
									type="email"
									placeholder="Email address"
									value={formData.email}
									onChange={handleChange}
									name="email"
									className="text-primary"
								/>

								{errors.email && <p className="text-red-500">{errors.email}</p>}
							</div>
							<div>
								<Input
									type="title"
									placeholder="Title"
									value={formData.title}
									onChange={handleChange}
									name="title"
									className="text-primary"
								/>
								{errors.title && <p className="text-red-500">{errors.title}</p>}
							</div>
							{/* textarea */}
							<div>
								<Textarea
									className="h-[150px] text-primary"
									placeholder="Type your message here."
									value={formData.message}
									onChange={handleChange}
									name="message"
								/>
								{errors.message && (
									<p className="text-red-500">{errors.message}</p>
								)}
							</div>
							{/* btn */}

							<Button
								size="md"
								className="max-w-40 self-center w-full"
								onClick={(e) => {
									handleSubmit(e);
								}}>
								Send message
							</Button>
						</form>
					</div>
					{/* info */}
					<div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
						<ul className="flex flex-col gap-10">
							{info.map((item, index) => {
								return (
									<li key={index} className="flex items-center gap-6">
										<div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
											<div className="text-[28px]">{item.icon}</div>
										</div>
										<div className="flex-1">
											<p className="text-white/60">{item.title}</p>
											<h3 className="text-xl">{item.description}</h3>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</motion.section>
	);
};

export default Contact;
