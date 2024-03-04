import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
const { ipcRenderer } = window.require("electron");

const HomePage = () => {
	const [data, setData] = useState([]);
	const [statusCounts, setStatusCounts] = useState({
		Grid: { true: 0, false: 0 },
		ReBalance: { true: 0, false: 0 },
	});

	const COLORS = ["#00C49F", "#FFBB28"];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataFromDatabase = await ipcRenderer.invoke(
					"get-all-data"
				);
				const formattedData = dataFromDatabase.map(bot => ({
					...bot.dataValues,
				}));
				setData(formattedData);

				// Process the data to count statuses
				const counts = {
					Grid: { true: 0, false: 0 },
					ReBalance: { true: 0, false: 0 },
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
		ReBalance: [
			{ name: "Active", value: statusCounts.ReBalance.true },
			{ name: "Sleep", value: statusCounts.ReBalance.false },
		],
	};

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
					</div>
					<div className="basis-1/5 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">Total Balance</p>
						<p className="font-mono text-2xl text-center mt-2">
							5,000
						</p>
					</div>
					<div className="basis-1/5 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">Daily Profit</p>
						<p className="font-mono text-2xl text-center mt-2 text-green-500">
							+5,000
						</p>
					</div>
				</div>
				<div className="flex flex-col w-1/2 gap-4">
					<div className="basis-1/2 w-full bg-gray-50 shadow-re-don rounded-sm p-3">
						<p className="font-mono text-lg">
							Total Grid Trading Status -{" "}
							{statusCounts.Grid.true + statusCounts.Grid.false}{" "}
							Robot
						</p>
						<div className="flex justify-center">
							<PieChart width={200} height={200}>
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
							{statusCounts.ReBalance.true +
								statusCounts.ReBalance.false}{" "}
							Robot
						</p>
						<div className="flex justify-center">
							<PieChart width={200} height={200}>
								<Pie
									data={pieData.ReBalance}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) =>
										`${name}: ${value}`
									}
									outerRadius={50}
									fill="#8884d8"
									dataKey="value">
									{pieData.ReBalance.map((entry, index) => (
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
