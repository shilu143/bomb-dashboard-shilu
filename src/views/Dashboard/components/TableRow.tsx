import React from "react";
import styles from "../Dashboard.module.css";

interface StatProps {
	src1: string;
	crp: string;
	currentSupply: string;
	totalSupply: string;
	price1: string;
	price2: string;
	src2: string;
}

const TableRow: React.FunctionComponent<StatProps> = ({
	src1,
	crp,
	currentSupply,
	totalSupply,
	price1,
	price2,
	src2,
}) => {
	return (
		<tr>
			<td>
				<span>
					<img className={styles.tableIcons} src={src1} alt="" />
				</span>
			</td>
			<td>
				<div className={styles.icontextdiv}>
					<p>{crp}</p>
				</div>
			</td>
			<td>{currentSupply}</td>
			<td>{totalSupply}</td>
			<td>
				<section className={styles.priceColumn}>
					<span>${price2}</span>
					<span>{price1}</span>
				</section>
			</td>
			<td>
				<img className={styles.tableIcons} src={src2} alt="" />
			</td>
		</tr>
	);
};

export default TableRow;
