import React from "react";

const MailPage = () => {
	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Contact</h1>
			<div className="flex flex-col md:flex-row justify-center items-center gap-8">
				{/* Facebook Contact */}
				<a
					href="https://www.facebook.com/yourPage"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out">
					<svg
						className="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 24 24">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.648c0-3.007 1.779-4.668 4.507-4.668 1.312 0 2.686 0.235 2.686 0.235v2.953h-1.511c-1.491 0-1.956 0.923-1.956 1.874v2.254h3.328l-0.532 3.469h-2.796v8.385c5.737-0.9 10.125-5.864 10.125-11.854z" />
					</svg>
					<span>Facebook</span>
				</a>
				{/* Gmail Contact */}
				<a
					href="mailto:yourEmail@gmail.com"
					className="flex items-center justify-center gap-2 bg-red-600 text-white p-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 ease-in-out">
					<svg
						className="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 24 24">
						<path d="M12 12.713l11.985-9.713h-23.97l11.985 9.713zm11.985 1.661l-4.408-3.562-2.252 1.821-5.325-4.303-5.325 4.303-2.252-1.821-4.408 3.562v6.626h24v-6.626z" />
					</svg>
					<span>Gmail</span>
				</a>
			</div>
		</div>
	);
};

export default MailPage;
