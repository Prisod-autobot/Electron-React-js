import { Link } from "react-router-dom";

const ModePage = () => {
	return (
		<div className="container mx-auto px-4 pb-8 pt-2 h-full">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Mode</h1>
			<div className="flex justify-center items-center gap-8 w-full h-full">
				<div className="bg-white w-2/6 h-3/4 p-4">
					<p className="text-center">Grid</p>
					<div className="h-5/6 bg-red-500">
						<p>content</p>
					</div>
					<div className="mt-4 text-center">
						<Link to="/api" className="p-2 bg-purple-400">
							This one!
						</Link>
					</div>
				</div>
				<div className="bg-white w-2/6 h-3/4 p-4">
					<p className="text-center">Re-Balance</p>
					<div className="h-5/6 bg-red-500">
						<p>content</p>
					</div>
					<div className="mt-4 text-center">
						<Link className="p-2 bg-purple-400">This one!</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModePage;
