import React from "react";

const TutorialPage = () => {
	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Tutorial</h1>
			<div className="mb-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Understanding API Keys and Secret Keys
				</h2>
				<p className="mt-2">
					API keys and secret keys are essential for secure
					communication between your application and the service
					provider. An <strong>API key</strong> acts as a unique
					identifier for your application, while a{" "}
					<strong>secret key</strong> is used to sign requests sent to
					the API to ensure they're secure and coming from an
					authenticated source.
				</p>
				<p className="mt-2">
					These keys are crucial for managing and allowing access to
					specific resources within your application securely. It's
					important to keep your secret key private to prevent
					unauthorized access to your application.
				</p>
			</div>
			<div>
				<h2 className="text-lg md:text-xl font-semibold">
					How to Obtain Your Keys
				</h2>
				<p className="mt-2">
					Generally, you can obtain these keys by creating an account
					on the service provider's platform and registering your
					application. Once registered, you'll be provided with these
					keys to use in your API requests.
				</p>
			</div>
			{/* Placeholder for the illustrative image */}
			<div className="mt-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Example Illustration
				</h2>
				<p className="mt-2">
					Below is an example illustration showing where you might
					find your API and secret keys on a typical service
					provider's dashboard:
				</p>
				<img
					src="/path-to-your-image.jpg"
					alt="Example illustration of API and Secret Keys location"
					className="mt-4 max-w-full h-auto"
				/>
			</div>
		</div>
	);
};

export default TutorialPage;
