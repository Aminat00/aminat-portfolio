import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

// components
import { Social, Photo } from "@/components";

const Home = () => {
	return (
		<section className="h-full">
			<div className="container mx-auto h-full">
				<div className="flex flex-col xl:flex-row items-center justify-between xl:py-7">
					{/* text */}
					<div className="text-center xl:text-left order-2 xl:order-none">
						<span className="text-xl">Full-Stack Mobile Engineer</span>
						<h1 className="h1 text-xl mb-3">
							Hello I&apos;m <br />
							<span className="text-accent">Aminat Moldalieva</span>
						</h1>
						<p className="max-w-[500px] mb-9 text-white/80">
							{`As a skilled full-stack mobile engineer with over 3.5 years of experience, 
							I am dedicated to delivering seamless and impactful user experiences. 
							My work focuses on optimizing performance and building intuitive, 
		scalable solutions with technologies such as `}
							<span className="text-accent">
								{`React, React Native, Next.js, NestJS, Node.js, and GitHub Actions`}
							</span>
							.
							{` Whether developing engaging mobile interfaces or managing backend processes, 
		I am committed to creating innovative products that make a real difference.`}
						</p>
						{/* btn and socials */}
						<div className="flex flex-col xl:flex-row items-center gap-8">
							<a href="/my-cv.pdf" download>
								<Button
									variant="outline"
									size="lg"
									className="uppercase flex items-center gap-2">
									<span>Download CV</span>
									<FiDownload className="text-xl" />
								</Button>
							</a>
							<div className="mb-8 xl:mb-0">
								<Social
									containerStyles="flex gap-6"
									iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
								/>
							</div>
						</div>
					</div>
					{/* photo */}
					<div className="order-1 xl:order-none mb-8 xl:mb-0">
						<Photo />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
