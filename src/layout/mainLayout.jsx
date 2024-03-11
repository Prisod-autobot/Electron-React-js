import PropTypes from "prop-types";
import SideBar from "../components/sideBar";

const MainLayout = ({ children }) => {
	return (
		<div className="flex h-screen bg-white">
			<SideBar />
			<div className="flex-1 p-4 ">
				<div className="p-4 bg-gray-50 h-full min-h-full rounded-xl overflow-y-scroll shadow-au-gold">
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
