import { Link } from "react-router-dom";

const ModePage = () => {
	return (
		<div className="container mx-auto px-4 pb-8 pt-2 h-full">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Mode</h1>
			<div className="flex justify-center items-stretch gap-8 w-full">
				<div className="bg-white shadow-lg rounded-lg w-full min-h-[300px] md:w-2/4 lg:w-2/4 p-6 flex flex-col justify-between">
					<div>
						<p className="text-center text-2xl font-semibold mb-4">
							Grid
						</p>
						<ul className="text-gray-600">
							<li className="mb-2">
								• Profit from market volatility.
							</li>
							<li className="mb-2">
								• Automated strategy reduces need for constant
								market monitoring.
							</li>
							<li className="mb-2">
								• Flexible configuration for advanced users.
							</li>
						</ul>
					</div>
					<div className="mt-4 text-center">
						<Link
							to="/grid-config-comb"
							className="inline-block py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">
							This one!
						</Link>
					</div>
				</div>
				<div className="bg-white shadow-lg rounded-lg w-full md:w-2/4 lg:w-2/4 p-6 flex flex-col justify-between">
					<div>
						<p className="text-center text-2xl font-semibold mb-4">
							Re-Balance
						</p>
						<ul className="text-gray-600">
							<li className="mb-2">
								• Maintains a balanced portfolio for
								diversification.
							</li>
							<li className="mb-2">
								• Automatically rebalances to manage risk.
							</li>
							<li className="mb-2">
								• Simpler configuration, suitable for beginners.
							</li>
						</ul>
					</div>
					<div className="mt-4 text-center">
						<Link
							to="/re-config-comb"
							className="inline-block py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">
							This one!
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModePage;
