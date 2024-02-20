import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const SetGridConfigPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dataFromPage1 = location.state;

	const [formData, setFormData] = useState({
		botName: "",
		upZone: "",
		lowZone: "",
		gridQuantity: "",
		gridStep: "",
		pair: "BTC/USDT",
	});

	useEffect(() => {
		const handleSaveDataSuccess = (event, message) => {
			navigate("/bot-detail");
		};

		ipcRenderer.on("saveDataSuccess", handleSaveDataSuccess);

		return () => {
			ipcRenderer.removeListener(
				"saveDataSuccess",
				handleSaveDataSuccess
			);
		};
	}, [navigate]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const combinedData = { ...dataFromPage1, ...formData };
		ipcRenderer.send("form-data", combinedData);
	};

	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">
				Grid Configuration
			</h1>
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow rounded-lg p-6">
				{Object.entries(formData).map(([key, value]) => (
					<div key={key} className="mb-4">
						<label
							htmlFor={key}
							className="block text-gray-700 font-medium mb-2 capitalize">
							{key.replace(/([A-Z])/g, " $1").trim()}{" "}
							{/* Adding space before capital letters */}
						</label>
						{key === "pair" ? (
							<select
								id={key}
								name={key}
								value={value}
								onChange={handleChange}
								className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline">
								<option value="BTC/USDT">BTC/USDT</option>
								<option value="BTC/USDC">BTC/USDC</option>
								<option value="ETH/USDT">ETH/USDT</option>
								<option value="BTC/FDUSD">BTC/FDUSD</option>
							</select>
						) : (
							<input
								id={key}
								name={key}
								type="text"
								value={value}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						)}
					</div>
				))}
				<button
					type="submit"
					className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
					Save
				</button>
			</form>
		</div>
	);
};

export default SetGridConfigPage;
