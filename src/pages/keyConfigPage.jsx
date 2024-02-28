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
		if (
			!/[0-9.]/.test(e.key) ||
			(e.key === "." && e.target.value.includes("."))
		) {
			e.preventDefault();
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		navigate("/grid-config", { state: formData });
	};

	const isDisabled = Object.values(formData).some(value => value === "");

	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">
				API/Secret Configuration
			</h1>
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-hidden">
				{Object.entries(formData).map(([key, value]) =>
					key !== "exchangeName" && key !== "zoneCalculator" ? (
						<div
							key={key}
							className="mb-4 flex items-center justify-between">
							<label
								htmlFor={key}
								className="block text-right w-[80px] text-gray-700 text-sm font-bold mr-2 capitalize flex-none">
								{key.replace(/([A-Z])/g, " $1").trim()}:
							</label>
							<input
								id={key}
								name={key}
								type="text"
								value={value}
								onChange={handleChange}
								onKeyDown={
									["amount", "budget"].includes(key)
										? handleKeyPress
										: undefined
								}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
					) : (
						<div
							key={key}
							className="mb-4 flex items-center justify-between">
							<label
								htmlFor={key}
								className="block text-right text-gray-700 text-sm font-bold mr-2 capitalize flex-none">
								{key.replace(/([A-Z])/g, " $1").trim()}:
							</label>
							<select
								id={key}
								name={key}
								value={value}
								onChange={handleChange}
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
								{key === "exchangeName"
									? ["Bybit", "Kraken", "Binance"].map(
											option => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											)
									  )
									: ["1", "2"].map(option => (
											<option key={option} value={option}>
												{option}
											</option>
									  ))}
							</select>
						</div>
					)
				)}
				<button
					type="submit"
					disabled={isDisabled}
					className={`w-full mt-4 py-2 px-4 rounded focus:outline-none text-white font-bold ${
						isDisabled
							? "bg-gray-400"
							: "bg-blue-500 hover:bg-blue-700"
					}`}>
					Save
				</button>
			</form>
		</div>
	);
};

export default KeyConfigPage;
