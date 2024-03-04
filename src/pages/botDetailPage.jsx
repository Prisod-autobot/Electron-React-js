import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const BotDetailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const detail = location.state;
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataFromDatabase = await ipcRenderer.invoke(
					"get-one-data",
					detail
				);
				console.log(detail);
				setData(dataFromDatabase);
			} catch (error) {
				console.error("Error fetching data from database:", error);
			}
		};

		fetchData();

		ipcRenderer.on("updateDataSuccess", (event, message) => {
			fetchData();
		});
		ipcRenderer.on("deleteDataSuccess", (event, message) => {
			navigate("/list-bot");
		});

		return () => {
			ipcRenderer.removeAllListeners("updateDataSuccess");
		};
	}, [detail, navigate]);

	const clickDelete = delete_name => {
		try {
			if (window.confirm("Are you sure you want to delete this bot?")) {
				ipcRenderer.send("delete-grid", { botName: delete_name });
			}
		} catch (error) {
			console.error("Error delete bot data:", error);
		}
	};

	const clickUpdate = async update_name => {
		try {
			ipcRenderer.send("update-grid", { botName: update_name });
		} catch (error) {
			console.error("Error updating bot data:", error);
		}
	};

	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Detail</h1>
			<Link to="/">home</Link>
			<div className="space-main">
				{data ? (
					<div>
						<p>ID: {data.dataValues.id}</p>
						<p>Type Bot: {data.dataValues.type_bot}</p>
						<p>Bot Name: {data.dataValues.bot_name}</p>
						<p>
							Status:{" "}
							{data.dataValues.status ? "Active" : "Inactive"}
						</p>
						<p>Pair: {data.dataValues.pair}</p>
						<p>Exchange Name: {data.dataValues.exchange_name}</p>
						<p>Budget: {data.dataValues.budget}</p>
						<button
							className={`border  text-black p-4 ${
								data.dataValues.status
									? "border-black bg-red-200"
									: "border-black bg-green-200"
							}`}
							onClick={() =>
								clickUpdate(data.dataValues.bot_name)
							}>
							{data.dataValues.status ? "Stop" : "Start"}
						</button>
						<button
							className="border border-clack bg-red-200 text-black p-4"
							onClick={() =>
								clickDelete(data.dataValues.bot_name)
							}>
							DELETE THIS
						</button>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	);
};

export default BotDetailPage;
