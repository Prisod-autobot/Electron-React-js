import React, { useEffect, useState } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Legend,
	Tooltip,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const { ipcRenderer } = window.require("electron");

const HomePage = () => {
	const [data, setData] = useState([]);
	const [totalBalance, setTotalBalance] = useState(0);
	const [statusCounts, setStatusCounts] = useState({
		Grid: { true: 0, false: 0 },
		Rebalance: { true: 0, false: 0 },
	});
	const [dailyProfits, setDailyProfits] = useState({}); // New state for daily profits

	const COLORS = ["#00C49F", "#FFBB28"];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataFromDatabase = await ipcRenderer.invoke(
					"get-all-data"
				);
				const profitGridDaily = await ipcRenderer.invoke(
					"get-history-money"
				);
				const profitReDaily = await ipcRenderer.invoke(
					"get-re-history-money"
				);

				// Merge profitGridDaily and profitReDaily
				const profitDaily = [...profitGridDaily, ...profitReDaily];

				// Process profitDaily to calculate daily profits
				const dailySums = profitDaily.reduce((acc, curr) => {
					const date = new Date(
						curr.dataValues.updatedAt
					).toDateString(); // Convert to date string format "Mon Mar 11 2024"
					if (!acc[date]) {
						acc[date] = 0;
					}
					// Check if price_sell is null or undefined and use 0 if so
					const priceSell =
						curr.dataValues.price_sell == null
							? 0
							: curr.dataValues.price_sell;
					acc[date] += priceSell;
					return acc;
				}, {});

				setDailyProfits(dailySums); // Update daily profits state

				console.log(dailyProfits);

				const formattedData = dataFromDatabase.map(bot => ({
					...bot.dataValues,
				}));

				// Calculate total balance
				const total = formattedData.reduce(
					(acc, curr) => acc + (curr.budget || 0),
					0
				);

				setTotalBalance(total); // Update total balance state
				setData(formattedData);

				// Process the data to count statuses
				const counts = {
					Grid: { true: 0, false: 0 },
					Rebalance: { true: 0, false: 0 },
				};

				formattedData.forEach(bot => {
					if (counts[bot.type_bot]) {
						counts[bot.type_bot][bot.status] += 1;
					}
				});

				setStatusCounts(counts);
			} catch (error) {
				console.error("Error fetching data from database:", error);
			}
		};

		fetchData();
	}, []);

	// Convert statusCounts to an array format suitable for Recharts
	const pieData = {
		Grid: [
			{ name: "Active", value: statusCounts.Grid.true },
			{ name: "Sleep", value: statusCounts.Grid.false },
		],
		Rebalance: [
			{ name: "Active", value: statusCounts.Rebalance.true },
			{ name: "Sleep", value: statusCounts.Rebalance.false },
		],
	};

	const lineChartData = Object.entries(dailyProfits).map(
		([date, profit]) => ({
			date,
			profit,
		})
	);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="container mx-auto px-4 pb-8 pt-2">
			<div className="flex gap-4 min-h-[580px]">
				<div className="flex flex-col w-1/2 gap-4">
					<div className="basis-3/5 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">-Monthly Report-</p>
						<LineChart
							width={500}
							height={300}
							data={lineChartData}
							margin={{
								top: 5,
								right: 5,
								left: 5,
								bottom: 5,
							}}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="profit"
								stroke="#8884d8"
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</div>
					<div className="basis-1/5 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">Total Balance</p>
						<p className="font-mono text-2xl text-center mt-2">
							{totalBalance.toLocaleString()} $
						</p>
					</div>
					<div className="basis-1/5 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">Daily Profit</p>
						{/* Check if dailyProfits is not empty and then map over its entries */}
						{Object.keys(dailyProfits).length > 0 ? (
							Object.entries(dailyProfits).map(
								([date, profit]) => (
									<p
										key={date}
										className="font-mono text-xl text-center mt-2 text-green-500">
										{profit.toLocaleString()} $
									</p>
								)
							)
						) : (
							<p className="font-mono text-2xl text-center mt-2 text-green-500">
								0
							</p>
						)}
					</div>
				</div>
				<div className="flex flex-col w-1/2 gap-4">
					<div className="basis-1/2 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">
							Total Grid Trading Status -{" "}
							{statusCounts.Grid.true + statusCounts.Grid.false}{" "}
							Robot
						</p>
						<div className="flex justify-center max-w-full">
							<PieChart width={500} height={250}>
								<Pie
									data={pieData.Grid}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) =>
										`${name}: ${value}`
									}
									outerRadius={50}
									fill="#8884d8"
									dataKey="value">
									{pieData.Grid.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Legend />
							</PieChart>
						</div>
					</div>
					<div className="basis-1/2 w-full bg-gray-50 shadow-re-don rounded-sm p-3 ">
						<p className="font-mono text-lg">
							Total Re-Balance Trading Status -{" "}
							{statusCounts.Rebalance.true +
								statusCounts.Rebalance.false}{" "}
							Robot
						</p>
						<div className="flex justify-center">
							<PieChart width={500} height={250}>
								<Pie
									data={pieData.Rebalance}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) =>
										`${name}: ${value}`
									}
									outerRadius={50}
									fill="#8884d8"
									dataKey="value">
									{pieData.Rebalance.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Legend />
							</PieChart>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default HomePage;
