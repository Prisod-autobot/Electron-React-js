import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTable } from "react-table";

const { ipcRenderer } = window.require("electron");

function useFetchData(detail) {
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [tableView, setTableView] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

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

		fetchData();

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

	const clickDelete = useCallback(delete_name => {
		if (window.confirm("Are you sure you want to delete this bot?")) {
			ipcRenderer.send("delete-grid", { botName: delete_name });
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
		<div className="container mx-auto px-4 pb-8 pt-2 text-gray-800">
			<h1 className="text-xl md:text-2xl font-bold mb-4">Bot Details</h1>
			<div className="mt-5">
				{data ? (
					<div className="space-y-1">
						<p>ID: {data.dataValues.id}</p>
						<p>Type Bot: {data.dataValues.type_bot}</p>
						<p>Bot Name: {data.dataValues.bot_name}</p>
						<p>
							Status:{" "}
							{data.dataValues.status ? "Active" : "Inactive"}
						</p>
						<div className="flex gap-2">
							<button
								className={`border text-black p-2 ${
									data.dataValues.status
										? "border-gray-400 bg-red-200"
										: "border-gray-400 bg-green-200"
								}`}
								onClick={() =>
									clickUpdate(data.dataValues.bot_name)
								}>
								{data.dataValues.status ? "Stop" : "Start"}
							</button>
							<button
								className="border border-gray-400 bg-red-200 text-black p-2"
								onClick={() =>
									clickDelete(data.dataValues.bot_name)
								}>
								Delete
							</button>
						</div>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div className="overflow-x-auto">
				<div className="bg-white shadow overflow-hidden border-b border-gray-200 mt-5">
					<div className="max-h-[350px] min-h-[350px] p-1 bg-white">
						<table
							{...getTableProps()}
							className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-100 sticky top-0 z-10">
								{headerGroups.map(headerGroup => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(column => (
											<th
												{...column.getHeaderProps()}
												className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
									return (
										<tr {...row.getRowProps()}>
											{row.cells.map(cell => (
												<td
													{...cell.getCellProps()}
													className="px-4 py-2 whitespace-nowrap text-sm md:text-base">
													{cell.render("Cell")}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
						{tableView.length === 0 && (
							<p className="p-4">No data available</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BotDetailPage;
