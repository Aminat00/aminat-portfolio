import Link from "next/link";

import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";

const socials = [
	{ icon: <FaGithub />, path: "https://github.com/Aminat00" },
	{
		icon: <FaLinkedinIn />,
		path: "https://www.linkedin.com/in/aminatmoldalieva/",
	},
];

export const Social = ({
	containerStyles,
	iconStyles,
}: {
	containerStyles?: string;
	iconStyles?: string;
}) => {
	return (
		<div className={containerStyles}>
			{socials.map((item, index) => {
				return (
					<Link
						key={index}
						href={item.path}
						className={iconStyles}
						passHref
						legacyBehavior>
						<a target="_blank" rel="noopener noreferrer" className={iconStyles}>
							{item.icon}
						</a>
					</Link>
				);
			})}
		</div>
	);
};
