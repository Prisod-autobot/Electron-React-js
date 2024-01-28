import { Link } from "react-router-dom";

const SideBar = () => {
	return (
		<div className="h-screen w-52 lg:w-64 bg-white p-4 border-r-2">
			<h2>Sidebar</h2>
			<div className="text-center text-lg font-mono mt-12 flex flex-col gap-y-4">
				<Link
					className="rounded-lg h-8 hover:bg-red-300 focus:bg-red-300"
					to="/">
					Home
				</Link>
				<Link
					className="rounded-lg h-8 hover:bg-red-300 focus:bg-red-300"
					to="/list-bot">
					List Bot
				</Link>
				<Link
					className="rounded-lg h-8 hover:bg-red-300 focus:bg-red-300"
					to="/tutorial-bot">
					Tutorial
				</Link>
				<Link
					className="rounded-lg h-8 hover:bg-red-300 focus:bg-red-300"
					to="/mail">
					Mail
				</Link>
			</div>
		</div>
	);
};

export default SideBar;
