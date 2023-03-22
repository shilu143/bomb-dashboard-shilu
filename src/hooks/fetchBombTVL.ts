import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import useRefresh from './useRefresh';

const useFetchBombTVL = () => {
  const [TVL, setTVL] = useState<number>(0);
  const bombFinance = useBombFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchBombTVL() {
      try {
        setTVL(await bombFinance.getBoardroomTVL());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBombTVL();
  }, [setTVL, bombFinance, slowRefresh]);

  return TVL;
};

export default useFetchBombTVL;
