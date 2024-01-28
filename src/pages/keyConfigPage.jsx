import { useState } from "react";
import { useNavigate } from "react-router-dom";

const KeyConfigPage = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		apiKey: "",
		secretKey: "",
		amount: "",
		budget: "",
		exchangeName: "Bybit",
		zoneCalculator: "1",
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleKeyPress = e => {
		const charCode = e.which ? e.which : e.keyCode;
		if (
			(charCode !== 46 || e.target.value.indexOf(".") !== -1) && // Check if decimal point exists
			(charCode < 48 || charCode > 57) &&
			charCode !== 8
		) {
			e.preventDefault();
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		navigate("/grid-config", { state: formData });
	};

	// Check if any of the form fields are empty
	const isDisabled = Object.values(formData).some(value => value === "");

	return (
		<div>
			<p>Hi heldra</p>
			<form onSubmit={handleSubmit} className="bg-white p-4">
				<div className="mb-2">
					<label
						htmlFor="apiKey"
						className="block text-gray-700 font-bold mb-1">
						API Key
					</label>
					<input
						id="apiKey"
						name="apiKey"
						type="text"
						value={formData.apiKey}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="secretKey"
						className="block text-gray-700 font-bold mb-1">
						Secret Key
					</label>
					<input
						id="secretKey"
						name="secretKey"
						type="text"
						value={formData.secretKey}
						onChange={handleChange}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="amount"
						className="block text-gray-700 font-bold mb-1">
						Amount coin
					</label>
					<input
						id="amount"
						name="amount"
						type="text"
						value={formData.amount}
						onChange={handleChange}
						onKeyDown={handleKeyPress}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="budget"
						className="block text-gray-700 font-bold mb-1">
						Budget
					</label>
					<input
						id="budget"
						name="budget"
						type="text"
						value={formData.budget}
						onChange={handleChange}
						onKeyDown={handleKeyPress}
						className="border p-2 w-full"
					/>
				</div>

				<div className="mb-2">
					<label
						htmlFor="exchangeName"
						className="block text-gray-700 font-bold mb-1">
						Exchange name
					</label>
					<select
						name="exchangeName"
						id="exchangeName"
						value={formData.exchangeName}
						onChange={handleChange}
						className="border p-2 w-full">
						<option value="Bybit">Bybit</option>
						<option value="Kraken">Kraken</option>
						<option value="Binance">Binance</option>
					</select>
				</div>

				<div className="mb-2">
					<label
						htmlFor="zoneCalculator"
						className="block text-gray-700 font-bold mb-1">
						Zone calculator
					</label>
					<select
						name="zoneCalculator"
						id="zoneCalculator"
						value={formData.zoneCalculator}
						onChange={handleChange}
						className="border p-2 w-full">
						<option value="1">1</option>
						<option value="2">2</option>
					</select>
				</div>

				<button
					type="submit"
					disabled={isDisabled}
					className="bg-blue-500 text-white px-4 py-2 rounded font-medium">
					Save
				</button>
			</form>
		</div>
	);
};

export default KeyConfigPage;
