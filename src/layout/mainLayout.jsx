import PropTypes from "prop-types";
import SideBar from "../components/sideBar";

const MainLayout = ({ children }) => {
	return (
		<div className="flex h-screen">
			<SideBar />
			<div className="flex-1 p-4">
				<div className="p-4 bg-blue-300 h-full rounded-xl border border-black">
					{children}
				</div>
			</div>
		</div>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default MainLayout;
