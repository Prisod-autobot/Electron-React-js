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
		ipcRenderer.on("saveDataSuccess", (event, message) => {
			navigate("/bot-detail");
		});

		return () => {
			ipcRenderer.removeAllListeners("saveDataSuccess");
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
		<div>
			<p>Grid config</p>
			<form onSubmit={handleSubmit} className="bg-white p-4">
				<div className="mb-2">
					<label
						htmlFor="botName"
						className="block font-bold text-gray-700 mb-2">
						Bot name
					</label>

					<input
						id="botName"
						name="botName"
						type="text"
						value={formData.botName}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="upZone"
						className="block font-bold text-gray-700 mb-2">
						Up zone
					</label>

					<input
						id="upZone"
						name="upZone"
						type="text"
						value={formData.upZone}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="lowZone"
						className="block font-bold text-gray-700 mb-2">
						Low zone
					</label>

					<input
						id="lowZone"
						name="lowZone"
						type="text"
						value={formData.lowZone}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="gridQuantity"
						className="block font-bold text-gray-700 mb-2">
						Grid Quantity
					</label>

					<input
						id="gridQuantity"
						name="gridQuantity"
						type="text"
						value={formData.gridQuantity}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="gridStep"
						className="block font-bold text-gray-700 mb-2">
						Grid step
					</label>

					<input
						id="gridStep"
						name="gridStep"
						type="text"
						value={formData.gridStep}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="pair"
						className="block font-bold text-gray-700 mb-2">
						Pair
					</label>

					<select
						name="pair"
						id="pair"
						value={formData.pair}
						onChange={handleChange}
						className="border p-2 w-full">
						<option value="BTC/USDT">BTC/USDT</option>
						<option value="BTC/USDC">BTC/USDC</option>
						<option value="ETH/USDT">ETH/USDT</option>
						<option value="BTC/FDUSD">BTC/FDUSD</option>
					</select>
				</div>

				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded font-medium">
					Save
				</button>
			</form>
		</div>
	);
};

export default SetGridConfigPage;
