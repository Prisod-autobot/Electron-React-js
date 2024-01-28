import React from "react";
import { useReactTable } from "@tanstack/react-table";
import PropTypes from "prop-types";

const Table = ({ columns, data }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useReactTable({ columns, data });

	return (
		<table {...getTableProps()} id="bot-table">
			<thead>
				{headerGroups.map(headerGroup => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th {...column.getHeaderProps()}>
								{column.render("Header")}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map(row => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map(cell => {
								return (
									<td {...cell.getCellProps()}>
										{cell.render("Cell")}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

Table.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
};

export default Table;
