import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTable, usePagination } from "react-table";
import { motion } from "framer-motion";
const { ipcRenderer } = window.require("electron");

const fetchDataFromDatabase = async () => {
	try {
		const dataFromDatabase = await ipcRenderer.invoke("get-all-data");
		return dataFromDatabase.map(bot => ({
			...bot.dataValues,
			details: bot.dataValues.bot_name,
		}));
	} catch (error) {
		console.error("Error fetching data from database:", error);
		return [];
	}
};

const StatusCell = ({ value }) => (
	<div className={`text-center ${value ? "bg-green-300" : "bg-red-300"} p-2`}>
		{value ? "Active" : "Inactive"}
	</div>
);

const DetailsButton = ({ value }) => {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate("/bot-detail", { state: value })}
			className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 md:py-2 md:px-4 rounded transition ease-in-out duration-150">
			Check
		</button>
	);
};

const ListBotPage = () => {
	const [data, setData] = useState([]);
	useEffect(() => {
		fetchDataFromDatabase().then(setData);
	}, []);

	const columns = React.useMemo(
		() => [
			{ Header: "Bot ID", accessor: "id" },
			{ Header: "Type Bot", accessor: "type_bot" },
			{ Header: "Bot Name", accessor: "bot_name" },
			{ Header: "Status", accessor: "status", Cell: StatusCell },
			{ Header: "Pair", accessor: "pair" },
			{ Header: "Exchange Name", accessor: "exchange_name" },
			{ Header: "Budget", accessor: "budget" },
			{ Header: "DETAILS", accessor: "details", Cell: DetailsButton },
		],
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		nextPage,
		previousPage,
	} = useTable(
		{ columns, data, initialState: { pageSize: 7 } },
		usePagination
	);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2 }}
			className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">List Bot</h1>
			<Link
				to="/mode-bot"
				className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
				Create Bot
			</Link>
			<div className="overflow-x-auto">
				<div className="max-h-[480px] min-h-[480px] p-1 bg-white">
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
							{page.map(row => {
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
					<div className="flex items-center justify-end mr-8 space-x-2 mt-1">
						<PaginationButton
							action={previousPage}
							disabled={!canPreviousPage}
							icon="&#x2190;"
						/>
						<PaginationButton
							action={nextPage}
							disabled={!canNextPage}
							icon="&#x2192;"
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const PaginationButton = ({ action, disabled, icon }) => (
	<button
		onClick={action}
		disabled={disabled}
		className={`text-white text-lg p-1 ${
			disabled ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
		} font-bold py-1 px-2 rounded`}>
		{icon}
	</button>
);

export default ListBotPage;
