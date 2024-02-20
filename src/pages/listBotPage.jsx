import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTable } from "react-table";
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
				const formattedData = dataFromDatabase.map(bot => ({
					...bot.dataValues,
					details: bot.dataValues.bot_name, // Preparing for the details button
				}));
				setData(formattedData);
			} catch (error) {
				console.error("Error fetching data from database:", error);
			}
		};

		fetchData();
	}, []);

	const columns = React.useMemo(
		() => [
			{
				Header: "Bot ID",
				accessor: "id",
			},
			{
				Header: "Type Bot",
				accessor: "type_bot",
			},
			{
				Header: "Bot Name",
				accessor: "bot_name",
			},
			{
				Header: "Status",
				accessor: "status",
				Cell: ({ value }) => (
					<div
						className={`text-center ${
							value ? "bg-green-300 p-2" : "bg-red-300 p-2"
						}`}>
						{value ? "Active" : "Inactive"}
					</div>
				),
			},
			{
				Header: "Pair",
				accessor: "pair",
			},
			{
				Header: "Exchange Name",
				accessor: "exchange_name",
			},
			{
				Header: "Budget",
				accessor: "budget",
			},
			{
				Header: "DETAILS",
				accessor: "details",
				Cell: ({ value }) => (
					<button
						onClick={() =>
							navigate("/bot-detail", { state: value })
						}
						className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 md:py-2 md:px-4 rounded transition ease-in-out duration-150">
						Check
					</button>
				),
			},
		],
		[navigate]
	);

	const tableInstance = useTable({ columns, data });

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		tableInstance;

	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">List Bot</h1>
			<Link
				className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
				to="/mode-bot">
				Create Bot
			</Link>
			<div className="overflow-x-auto">
				<div className="max-h-[480px] overflow-y-auto">
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
										{row.cells.map(cell => {
											return (
												<td
													{...cell.getCellProps()}
													className="px-4 py-2 whitespace-nowrap text-sm md:text-base">
													{cell.render("Cell")}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ListBotPage;
