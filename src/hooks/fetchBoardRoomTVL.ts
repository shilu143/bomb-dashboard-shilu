import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import useRefresh from './useRefresh';

const useFetchBoardRoomTVL = () => {
  const [TVL, setTVL] = useState<number>(0);
  const bombFinance = useBombFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchBoardroomTVL() {
      try {
        setTVL(await bombFinance.getBoardroomTVL());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomTVL();
  }, [setTVL, bombFinance, slowRefresh]);

  return TVL;
};

export default useFetchBoardRoomTVL;
