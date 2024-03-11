import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const CombinedConfigPage = () => {
	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		apiKey: "",
		secretKey: "",
		amount: "",
		budget: "",
		exchangeName: "Bybit",
		zoneCalculator: "1",
		botName: "",
		upZone: "",
		lowZone: "",
		gridQuantity: "",
		gridStep: "",
		pair: "BTC/USDT",
	});

	const nextStep = () => setStep(step + 1);
	const prevStep = () => setStep(step - 1);

	useEffect(() => {
		const handleSaveDataSuccess = (event, message) => {
			navigate("/bot-detail", { state: formData.botName });
		};
		ipcRenderer.on("saveDataSuccess", handleSaveDataSuccess);
		return () => {
			ipcRenderer.removeListener(
				"saveDataSuccess",
				handleSaveDataSuccess
			);
		};
	}, [navigate, formData.botName]);

	const handleSubmit = async e => {
		e.preventDefault();
		if (step === 1) {
			formData.grid_id = "Grid";
			nextStep();
		} else if (step === 2) {
			ipcRenderer.send("form-data", formData);
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleKeyPress = e => {
		const nonCharacterKeys = [
			"Backspace",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			"Tab",
		];
		if (nonCharacterKeys.includes(e.key)) return;

		// Check if the key is not a number
		if (!/^\d$/.test(e.key) && e.key !== ".") {
			e.preventDefault();
			return;
		}

		// Check if the key is a decimal and whether the value already contains a decimal point
		if (e.key === "." && e.target.value.includes(".")) {
			e.preventDefault();
		}
	};

	const handlePaste = async field => {
		try {
			const text = await navigator.clipboard.readText();
			setFormData(prevFormData => ({ ...prevFormData, [field]: text }));
		} catch (error) {
			console.error("Failed to read clipboard contents: ", error);
		}
	};

	const [visibleTooltip, setVisibleTooltip] = useState("");
	const tooltips = {
		apiKey: "Your API key goes here.",
		secretKey: "Your secret key goes here.",
		amount: "Specify the amount.",
		budget: "Set your budget limit.",
		exchangeName: "exchangeName",
		zoneCalculator: "zoneCalculator",
		botName: "Your Bot Name",
		upZone: "Up zone",
		lowZone: "Low zone",
		gridQuantity: "QTY",
		gridStep: "Step",
		pair: "Pairs",
	};

	const pageVariants = {
		initial: { opacity: 0, x: "2vw" }, // Start from the right
		in: { opacity: 1, x: 0 }, // Move to the center
		out: { opacity: 0, x: "-2vw" }, // Exit to the left
	};
	const pageTransition = {
		type: "tween",
		ease: "linear",
		duration: 0.4,
	};

	const isFormIncomplete = () => {
		// Add or remove fields based on your form's requirements
		const requiredFields = ["apiKey", "secretKey", "amount", "budget"];
		return requiredFields.some(field => formData[field].trim() === "");
	};

	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Grid Config</h1>
			<AnimatePresence>
				{step === 1 && (
					<motion.div
						key="page1"
						initial="initial"
						animate="in"
						variants={pageVariants}
						transition={pageTransition}
						className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-hidden">
						{/* Page 1 content goes here */}
						<form onSubmit={handleSubmit}>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("apiKey")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="apiKey"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										API Key:
									</label>
									{visibleTooltip === "apiKey" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.apiKey}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="apiKey"
										name="apiKey"
										type="text"
										value={formData.apiKey}
										onChange={handleChange}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
									<button
										type="button"
										onClick={() => handlePaste("apiKey")}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-50 rounded text-sm">
										Paste
									</button>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("secretKey")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="secretKey"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Secret Key:
									</label>
									{visibleTooltip === "secretKey" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.secretKey}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="secretKey"
										name="secretKey"
										type="text"
										value={formData.secretKey}
										onChange={handleChange}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
									<button
										type="button"
										onClick={() => handlePaste("secretKey")}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-50 rounded text-sm">
										Paste
									</button>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("amount")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="amount"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Amount:
									</label>
									{visibleTooltip === "amount" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.amount}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="amount"
										name="amount"
										type="text"
										onKeyDown={handleKeyPress}
										value={formData.amount}
										onChange={handleChange}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
									<button
										type="button"
										onClick={() => handlePaste("amount")}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-50 rounded text-sm">
										Paste
									</button>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("budget")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="budget"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Budget:
									</label>
									{visibleTooltip === "budget" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.budget}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="budget"
										name="budget"
										type="text"
										onKeyDown={handleKeyPress}
										value={formData.budget}
										onChange={handleChange}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("exchangeName")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="exchangeName"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Exchange:
									</label>
									{visibleTooltip === "exchangeName" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.exchangeName}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<select
										id="exchangeName"
										name="exchangeName"
										value={formData.exchangeName}
										onChange={handleChange}
										className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
										<option value="Bybit">Bybit</option>
										<option value="Kraken">Kraken</option>
										<option value="Binance">Binance</option>
									</select>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("zoneCalculator")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="zoneCalculator"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Zone Calculator:
									</label>
									{visibleTooltip === "zoneCalculator" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.zoneCalculator}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<select
										id="zoneCalculator"
										name="zoneCalculator"
										value={formData.zoneCalculator}
										onChange={handleChange}
										className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
										<option value="1">1</option>
										<option value="2">2</option>
									</select>
								</div>
							</div>
							<button
								type="submit"
								disabled={isFormIncomplete()} // Disable button if any required field is empty
								className={`rounded px-4 py-2 mt-4 justify-end ${
									isFormIncomplete()
										? "bg-gray-500 text-white"
										: "bg-blue-500 text-white"
								}`}>
								Next
							</button>
						</form>
					</motion.div>
				)}
				{step === 2 && (
					<motion.div
						key="page2"
						initial="initial"
						animate="in"
						variants={pageVariants}
						transition={pageTransition}
						className="bg-white shadow rounded-lg p-6">
						{/* Page 2 content goes here */}
						<form onSubmit={handleSubmit}>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("botName")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="botName"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Bot Name:
									</label>
									{visibleTooltip === "botName" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.botName}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="botName"
										name="botName"
										type="text"
										value={formData.botName}
										onChange={handleChange}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("upZone")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="upZone"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Up Zone:
									</label>
									{visibleTooltip === "upZone" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.upZone}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="upZone"
										name="upZone"
										type="text"
										value={formData.upZone}
										onChange={handleChange}
										onKeyDown={handleKeyPress}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("lowZone")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="lowZone"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Low Zone:
									</label>
									{visibleTooltip === "lowZone" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.lowZone}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="lowZone"
										name="lowZone"
										type="text"
										value={formData.lowZone}
										onChange={handleChange}
										onKeyDown={handleKeyPress}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("gridQuantity")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="gridQuantity"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Grid Quantity:
									</label>
									{visibleTooltip === "gridQuantity" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.gridQuantity}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="gridQuantity"
										name="gridQuantity"
										type="text"
										value={formData.gridQuantity}
										onChange={handleChange}
										onKeyDown={handleKeyPress}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("gridStep")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="gridStep"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Grid Step:
									</label>
									{visibleTooltip === "gridStep" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.gridStep}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<input
										id="gridStep"
										name="gridStep"
										type="text"
										value={formData.gridStep}
										onChange={handleChange}
										onKeyDown={handleKeyPress}
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									/>
								</div>
							</div>
							<div className="mb-4 flex items-center">
								<div
									onMouseEnter={() =>
										setVisibleTooltip("pair")
									}
									onMouseLeave={() => setVisibleTooltip("")}
									className="relative">
									<label
										htmlFor="pair"
										className="block underline dotted underline-offset-2 w-[80px] text-gray-700 text-sm font-bold mr-3 capitalize cursor-help">
										Pair:
									</label>
									{visibleTooltip === "pair" && (
										<div className="absolute z-10 w-64 p-4 -mt-2 ml-12 bg-white border border-gray-200 shadow-lg rounded-lg">
											<p className="text-sm text-gray-700">
												{tooltips.pair}
											</p>
										</div>
									)}
								</div>
								<div className="relative flex-grow">
									<select
										id="pair"
										name="pair"
										value={formData.pair}
										onChange={handleChange}
										className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
										<option value="BTC/USDT">
											BTC/USDT
										</option>
										<option value="BTC/USDC">
											BTC/USDC
										</option>
										<option value="ETH/USDT">
											ETH/USDT
										</option>
										<option value="BTC/FDUSD">
											BTC/FDUSD
										</option>
										<option value="WLD/USDT">
											WLD/USDT
										</option>
										<option value="XRP/USDT">
											XRP/USDT
										</option>
									</select>
								</div>
							</div>
							<button
								type="button"
								onClick={prevStep}
								className="rounded bg-gray-500 text-white px-4 py-2 mt-4 mr-4">
								Go Back
							</button>
							<button
								type="submit"
								className="rounded bg-blue-500 text-white px-4 py-2 mt-4">
								Save
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CombinedConfigPage;
