import Link from 'next/link';
import { HelpOutline, HelpOutlined, KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@material-ui/icons';
import { useState } from 'react';
import styles from './CountriesTable.module.css'
import { Button, Tooltip } from '@material-ui/core';

const orderBy = (countries, value, direction) => {
  if (direction === "asc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? 1 : -1));
  }

  if (direction === "desc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? -1 : 1));
  }

  return countries;
}

const SortArrow = ({ direction }) => {
  if (!direction) {
    return <></>;
  }

  if (direction === "desc") {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowDownRounded color="inherit" />
      </div>
    );
  } else {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowUpRounded color="inherit" />
      </div>
    );
  };
};

const CountriesTable = ({ countries }) => {
  const [direction, setDirection] = useState('');
  const [value, setValue] = useState('');

  const orderedCountries = orderBy(countries, value, direction);

  const setValueAndDirection = (value) => {
    if (!direction) {
      setDirection("desc");
    } else if (direction === "desc") {
      setDirection("asc");
    } else {
      setDirection(null);
    }
    setValue(value)
  }

  return (
    <div>
      <div className={styles.heading}>
        <div className={styles.heading_flag}></div>
        <button
          className={styles.heading_name}
          onClick={() => setValueAndDirection('name')}
        >
          <div>Name</div>
          {value === "name" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_population}
          onClick={() => setValueAndDirection('population')}
        >
          <div>Population</div>
          {value === "population" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_area}
          onClick={() => setValueAndDirection('area')}
        >
          <div>Area (km<sup style={{ fontSize: '0.5rem' }}>2</sup>)</div>
          {value === "area" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_gini}
          onClick={() => setValueAndDirection('gini')}
        >
          <div>Gini</div>

          {value === "gini" && <SortArrow direction={direction} />}

          <Tooltip title="The Gini Index, created by Italian mathematician Conrado Gini, is an instrument to measure the degree of income concentration in a given group/country. It points out the difference between the incomes of the poorest and the richest."
          style={{ fontSize: '1rem', marginLeft: '5px' }}
          disableInteractive>
            <HelpOutlined />
          </Tooltip>

        </button>
      </div>

      {orderedCountries.map((country) => (
        <Link href={`/country/${country.alpha3Code}`} key={country.name} >
          <div className={styles.row}>
            <div className={styles.flag}>
              <picture>
                <img src={country.flag} alt={country.name} />
              </picture>
            </div>
            <div className={styles.name}>{country.name}</div>
            <div className={styles.population}>{(country.population || 0).toLocaleString('pt-BR')}</div>
            <div className={styles.area}>
              {(country.area = country.area === undefined ? 0 : country.area).toLocaleString('pt-BR')}
            </div>
            <div className={styles.gini}>
              {country.gini = country.gini === undefined ? 0 : country.gini || 0} %
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CountriesTable;
