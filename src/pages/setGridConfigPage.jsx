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
		pair: "BTC/USDT", // This field has a default value, so it's always considered filled.
	});
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const handleSaveDataSuccess = (event, message) => {
			navigate("/bot-detail");
		};

		ipcRenderer.on("saveDataSuccess", handleSaveDataSuccess);

		// Check if all required fields are filled (excluding 'pair' field)
		const checkFormValidity = () => {
			const isEveryFieldFilled = Object.entries(formData).every(
				([key, value]) => key === "pair" || value.trim() !== ""
			);
			setIsFormValid(isEveryFieldFilled);
		};

		checkFormValidity();

		return () => {
			ipcRenderer.removeListener(
				"saveDataSuccess",
				handleSaveDataSuccess
			);
		};
	}, [navigate, formData]); // Add formData to the dependency array

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
					<div key={key} className="mb-4 flex items-center">
						<label
							htmlFor={key}
							className="block text-right w-[80px] text-gray-700 text-sm font-bold mr-2 capitalize flex-none">
							{key.replace(/([A-Z])/g, " $1").trim()}:
						</label>
						{key === "pair" ? (
							<select
								id={key}
								name={key}
								value={value}
								onChange={handleChange}
								className="shadow border rounded flex-auto py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline">
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
								className="shadow appearance-none border rounded flex-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						)}
					</div>
				))}
				<button
					type="submit"
					disabled={!isFormValid}
					className={`w-full mt-4 py-2 px-4 rounded focus:outline-none text-white font-bold ${
						isFormValid
							? "bg-blue-600 hover:bg-blue-700"
							: "bg-gray-400"
					}`}>
					Save
				</button>
			</form>
		</div>
	);
};

export default SetGridConfigPage;
