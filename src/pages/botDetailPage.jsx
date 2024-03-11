import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTable } from "react-table";

const { ipcRenderer } = window.require("electron");

function useFetchData(detail) {
	const [data, setData] = useState(null);
	const [tableView, setTableView] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const dataFromDatabase = await ipcRenderer.invoke(
					"get-one-data",
					detail
				);
				setData(dataFromDatabase);
				const dataTable = await ipcRenderer.invoke(
					"get-all-history-grid",
					detail
				);
				const tableGrid = dataTable.map(bot => ({ ...bot.dataValues }));
				setTableView(tableGrid);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData(); // Call fetchData once immediately

		const updateListener = (event, message) => fetchData();
		const deleteListener = () => navigate("/list-bot");

		ipcRenderer.on("updateDataSuccess", updateListener);
		ipcRenderer.on("deleteDataSuccess", deleteListener);

		return () => {
			ipcRenderer.removeListener("updateDataSuccess", updateListener);
			ipcRenderer.removeListener("deleteDataSuccess", deleteListener);
		};
	}, [detail]);

	return { data, tableView, isLoading, error };
}

const BotDetailPage = () => {
	const location = useLocation();
	const { data, tableView, isLoading } = useFetchData(location.state);

	const clickDelete = useCallback((delete_name, type_bot) => {
		switch (type_bot) {
			case "Grid":
				if (
					window.confirm("Are you sure you want to delete this bot?")
				) {
					ipcRenderer.send("delete-grid", { botName: delete_name });
				}
				break;
			case "Rebalance":
				if (
					window.confirm("Are you sure you want to delete this bot?")
				) {
					ipcRenderer.send("delete-reba", { botName: delete_name });
				}
				break;
			default:
				console.error("something went wrong");
		}
	}, []);

	const clickUpdate = useCallback(update_name => {
		ipcRenderer.send("update-grid", { botName: update_name });
	}, []);

	const columns = useMemo(
		() => [
			{ Header: "Amount", accessor: "amount" },
			{ Header: "Sell Price", accessor: "price_sell" },
			{ Header: "Buy Price", accessor: "price_buy" },
			{ Header: "Transaction ID", accessor: "id_transaction" },
			{ Header: "Sell ID", accessor: "id_sell" },
			{ Header: "Buy ID", accessor: "id_buy" },
		],
		[]
	);

	const tableInstance = useTable({ columns, data: tableView });

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		tableInstance;

	return (
		<div className="container mx-auto px-4 pb-8 pt-8 text-gray-800">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Bot Details</h1>
			<div className="mt-1">
				{data ? (
					<div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
						<p className="text-md">
							<span className="font-semibold">Type Bot:</span>
							{"   "}
							{data.dataValues.type_bot}
						</p>
						<p className="text-md">
							<span className="font-semibold">Bot Name:</span>
							{"   "}
							{data.dataValues.bot_name}
						</p>
						<p className="text-md">
							<span className="font-semibold">Status:</span>
							{data.dataValues.status
								? "   Active"
								: "   Inactive"}
						</p>
						<div className="flex gap-2 mt-1">
							<button
								className={`text-white font-bold py-2 px-4 rounded-lg transition-colors ${
									data.dataValues.status
										? "bg-red-500 hover:bg-red-600"
										: "bg-green-500 hover:bg-green-600"
								}`}
								onClick={() =>
									clickUpdate(data.dataValues.bot_name)
								}>
								{data.dataValues.status ? "Stop" : "Start"}
							</button>
							<button
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
								onClick={() =>
									clickDelete(
										data.dataValues.bot_name,
										data.dataValues.type_bot
									)
								}>
								Delete
							</button>
						</div>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div className="overflow-x-auto mt-1">
				<div className="bg-white shadow-md rounded-lg overflow-hidden">
					<div className="p-4">
						<table
							{...getTableProps()}
							className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								{headerGroups.map(headerGroup => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(column => (
											<th
												{...column.getHeaderProps()}
												className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
												{column.render("Header")}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody
								{...getTableBodyProps()}
								className="bg-white divide-y divide-gray-200">
								{rows.map(row => {
									prepareRow(row);
									const isIdSellEmpty =
										row.original.id_sell === null ||
										row.original.id_sell === "";
									return (
										<tr
											{...row.getRowProps({
												className: `${
													isIdSellEmpty
														? "bg-red-100"
														: "bg-white"
												}`,
											})}>
											{row.cells.map(cell => (
												<td
													{...cell.getCellProps()}
													className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{cell.render("Cell")}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
						{tableView.length === 0 && (
							<p className="text-center py-4 text-gray-500">
								No data available
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BotDetailPage;
