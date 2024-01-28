import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
const { ipcRenderer } = window.require("electron");

const ListBotPage = () => {
	const [data, setData] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataFromDatabase = await ipcRenderer.invoke(
					"get-all-data"
				);
				setData(dataFromDatabase);
			} catch (error) {
				console.error("Error fetching data from database:", error);
			}
		};

		fetchData();

		return () => {
			// Cleanup
		};
	}, []);

	const clickDetail = bot_name => {
		navigate("/bot-detail", { state: bot_name });
	};

	return (
		<div>
			<h1>List Bot</h1>
			<Link className="border-2 border-black bg-white p-2" to="/mode-bot">
				Create Bot
			</Link>
			<table>
				<thead>
					<tr>
						<th>Bot ID</th>
						<th>Type Bot</th>
						<th>Bot Name</th>
						<th>Status</th>
						<th>Pair</th>
						<th>Exchange Name</th>
						<th>Budget</th>
						<th>DETAILS</th>
					</tr>
				</thead>
				<tbody>
					{data.map(bot => (
						<tr key={bot.dataValues.id}>
							<td>{bot.dataValues.id}</td>
							<td>{bot.dataValues.type_bot}</td>
							<td>{bot.dataValues.bot_name}</td>
							<td>
								{bot.dataValues.status ? "Active" : "Inactive"}
							</td>
							<td>{bot.dataValues.pair}</td>
							<td>{bot.dataValues.exchange_name}</td>
							<td>{bot.dataValues.budget}</td>
							<td>
								<button
									onClick={() =>
										clickDetail(bot.dataValues.bot_name)
									}>
									Check
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ListBotPage;
