import React from 'react';

import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import bg1 from '../../assets/img/bg1.svg';
import bg2 from '../../assets/img/bg2.svg';
import styles from './Dashboard.module.css';
import SummaryCard from './components/SummaryCard';
import BondCard from './components/BondCard';
import BombFarmCard from './components/BombFarmCard';
import BoardRoomCard from './components/BoardRoomCard';

const BackgroundImage = createGlobalStyle`
  body {
    background-image: url(${bg1}), url(${bg2});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
const TITLE = 'bomb.money | Dashboard';

const Dashboard: React.FC = () => {
  return (
    // <Switch>
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className={styles.outerContainer}>
        <SummaryCard />
        <div className={styles.secondSection}>
          <div className={styles.middleLeftSection}>
            <div className={styles.readInvestment}>
              <a href="https://docs.bomb.money/strategies/general-quick-roi-strategy">Read Investment Strategy </a>
            </div>
            <div className={styles.investment}>
              <button type="button" className={styles.investButton}>
                Invest Now
              </button>
            </div>
            <div className={styles.connectSection}>
              <button type="button" onClick={() => (window.location.href = 'http://discord.bomb.money/')}>
                <span>
                  <img src="./discord.png" alt="" />
                </span>
                Chat on Discord
              </button>
              <button type="button" onClick={() => (window.location.href = 'https://docs.bomb.money/')}>
                <span>
                  <img src="./docs.png" alt="" />
                </span>
                Read Docs
              </button>
            </div>
            <BoardRoomCard />
          </div>
          <div className={styles.newsSection}>
            <p className={styles.newsTitle}>Latest News</p>
          </div>
        </div>
        <BombFarmCard />
        <BondCard />
      </div>
    </Page>
    // </Switch>
  );
};

export default Dashboard;
