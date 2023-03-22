import React from "react";
import styles from "./ContentHeader.module.css";

interface Props {
	src: string;
	header: string;
	TVL: string;
};

const ContentHeader: React.FunctionComponent<Props> = ({src, header, TVL}) => {
	return (
		<div className={styles.Header}>
			<span className={styles.Logo}>
				<img src={src} alt="" />
			</span>
			<div className={styles.HeaderChild}>
				<div className={styles.HeaderChild_1}>
					<p className={styles.Title}>{header}</p>

					<p className={styles.recommendedTag}>Recommended</p>
				</div>
				<div className={styles.HeaderChild_2}>
					<p className={styles.TVL}>
						TVL: <span className={styles.TVLValue}>${TVL}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ContentHeader;
