import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Example SVG icons for demonstration
const HomeIcon = () => (
	<svg
		className="mr-2 w-4 h-4"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		stroke="currentColor">
		<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
	</svg>
);
const ListIcon = () => (
	<svg
		className="mr-2 w-4 h-4"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		stroke="currentColor">
		<path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
	</svg>
);
const TutorialIcon = () => (
	<svg
		className="mr-2 w-4 h-4"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		stroke="currentColor">
		<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
	</svg>
);
const MailIcon = () => (
	<svg
		className="mr-2 w-4 h-4"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		stroke="currentColor">
		<path d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z"></path>
		<path d="M3 7l9 5.25L21 7"></path>
	</svg>
);

const SideBar = () => {
	const [selectedLink, setSelectedLink] = useState(null);

	const handleLinkClick = link => {
		setSelectedLink(link);
	};

	const sidebarItems = [
		{ name: "Home", to: "/", Icon: HomeIcon },
		{ name: "List Bot", to: "/list-bot", Icon: ListIcon },
		{ name: "Tutorial", to: "/tutorial-bot", Icon: TutorialIcon },
		{ name: "Mail", to: "/mail", Icon: MailIcon },
	];

	return (
		<div className="h-screen w-52 lg:w-64 bg-gray-50 p-5 border-r shadow-lg">
			<h2 className="text-lg font-semibold text-gray-900">Auto-Bot</h2>
			<div className="mt-10 flex flex-col gap-y-4">
				{sidebarItems.map(({ name, to, Icon }) => (
					<Link
						key={to}
						to={to}
						onClick={() => handleLinkClick(to)}
						className={`rounded-lg px-4 py-2 flex items-center justify-start text-sm font-medium transition-all duration-150 ease-in-out ${
							selectedLink === to
								? "bg-blue-400 text-white shadow-md"
								: "bg-white text-gray-800 hover:bg-blue-100"
						}`}>
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}>
							<Icon />
						</motion.div>
						{name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default SideBar;
