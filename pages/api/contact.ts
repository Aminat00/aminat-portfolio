import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const transporter = nodemailer.createTransport({
		port: 465,
		host: "smtp.gmail.com",
		auth: {
			user: "a67733060@gmail.com",
			pass: process.env.password,
		},
		secure: true,
	});
	console.log(req.body);

	const mailData = {
		from: "a67733060@gmail.com",
		to: "moldalievaaminat@gmail.com",
		subject: `Message From ${req.body.firstName} ${req.body.lastName}`,
		text: req.body.message + " | Sent from: " + req.body.email,
		html: `<div>${req.body.message}</div><p>Sent from:
        ${req.body.email}</p> <p>${req.body.phoneNumber}</p>`,
	};
	transporter.sendMail(mailData, function (err: any, info: any) {
		if (err) console.log(err);
		else console.log(info);
	});
	res.status(200);
}
