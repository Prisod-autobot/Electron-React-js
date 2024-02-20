import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
	const [selectedLink, setSelectedLink] = useState(null);

	const handleLinkClick = link => {
		setSelectedLink(link);
	};

	return (
		<div className="h-screen w-52 lg:w-64 bg-gray-50 p-5 border-r shadow-lg">
			<h2 className="text-lg font-semibold text-gray-900">Sidebar</h2>
			<div className="mt-10 flex flex-col gap-y-4">
				{[
					{ name: "Home", to: "/" },
					{ name: "List Bot", to: "/list-bot" },
					{ name: "Tutorial", to: "/tutorial-bot" },
					{ name: "Mail", to: "/mail" },
				].map(item => (
					<Link
						key={item.to}
						className={`rounded-lg px-4 py-2 flex items-center justify-center text-sm font-medium transition-all duration-150 ease-in-out ${
							selectedLink === item.to
								? "bg-blue-400 text-white shadow-md"
								: "bg-white text-gray-800 hover:bg-blue-100"
						}`}
						to={item.to}
						onClick={() => handleLinkClick(item.to)}>
						{item.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default SideBar;
