import React from "react";
import styles from "./FuncButton.module.css";

interface Prop {
	header: string;
	src: string;
	propWidth: string;
	onc : () => void;
}

const FuncButton: React.FunctionComponent<Prop> = ({
	header,
	src,
	propWidth,
	onc
}) => {
	return (
		<button className={styles.funcButton} style={{ width: propWidth }} onClick={onc}>
			<span className={styles.buttonHeader}>{header}</span>
			<span className={styles.buttonIcon}>
				<img src={src} alt="" />
			</span>
		</button>
	);
};

export default FuncButton;
