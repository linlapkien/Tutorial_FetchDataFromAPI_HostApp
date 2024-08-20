import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import style from '@/styles/FlexBox.module.css';

const CocktailContainer = dynamic(() => import('component_app/CocktailCard'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const SetQuantity = dynamic(() => import('component_app/SetQuantity'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

interface Props {
  key: String;
  strDrink: String;
  strDrinkThumb: String;
  idDrink: String;
}

async function fetchdetails() {
  const response = await fetch(
    'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail'
  );
  if (response.ok) {
    const responseBody = await response.json();
    // console.log(`data ${data}`);
    // setData(responseBody);
    console.log(`data: ${responseBody}`);
    return responseBody;
  }
}

export default function Home() {
  const [data, setData] = useState<Props[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const datas = fetchdetails();

  //---------------------------------------
  useEffect(() => {
    datas
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  datas.then((res) => {
    console.log(res.drinks);
  });

  //---------------------------------------
  const handleQtyIncrease = () => {
    setQuantity(quantity + 1);
  };

  //---------------------------------------
  const handleQtyDecrease = () => {
    setQuantity(quantity - 1);
  };

  //---------------------------------------
  return (
    <div>
      Bartender Shoppppp
      <div className={style.flex_container}>
        {data.drinks.map((item: Props) => (
          <div className={style.flex_item}>
            <CocktailContainer
              key={item.idDrink.toString()}
              strDrink={item.strDrink}
              strDrinkThumb={item.strDrinkThumb}
              idDrink={item.idDrink}
            />
            <SetQuantity
              quantity={quantity}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
