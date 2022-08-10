
import Layout from '../../components/Layout/Layout'
import styles from './Country.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v2/alpha/${id}`)
  const country = await res.json();

  return country;
}

const Country = ({ country }) => {
  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    if (!country.borders) {
      setBorders([])
    } else {
      const borders = await Promise.all(country.borders.map((border) => getCountry(border)))
      setBorders(borders);
    }
  }

  useEffect(() => {
    getBorders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  return <Layout title={country.name}>
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.overview_panel}>
          <picture>
            <img src={country.flag} alt={country.name} />
          </picture>
          <h1 className={styles.overview_name}>{country.name}</h1>
          <div className={styles.overview_region}>{country.region}</div>

          <div className={styles.overview_numbers}>
            <div className={styles.overview_population}>
              <div className={styles.overview_value}>{(country.population || 0).toLocaleString('pt-BR')}</div>
              <div className={styles.overview_label}>Population</div>
            </div>

            <div className={styles.overview_area}>
              <div className={styles.overview_value}>{(country.area || 0).toLocaleString('pt-BR')}</div>
              <div className={styles.overview_label}>Area(Km²)</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container_right}>
        <div className={styles.details_panel}>
          <h4 className={styles.details_panel_heading}>Details</h4>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Capital</div>
            <div className={styles.details_panel_value}>{country.capital || "- No capital -"}</div>
          </div>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Subregion</div>
            <div className={styles.details_panel_value}>{country.subregion || "No subregion"}</div>
          </div>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Language</div>
            <div className={styles.details_panel_value}>
              {country.languages.map(({ name }) => name).join(', ')}
            </div>
          </div>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Currencies</div>
            <div className={styles.details_panel_value}>
              {country.currencies ? country.currencies.map(({ name }) => name).join(', ') : "- No currencies -"}
            </div>
          </div>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Native name</div>
            <div className={styles.details_panel_value}>{country.nativeName}</div>
          </div>

          <div className={styles.details_panel_row}>
            <div className={styles.details_panel_label}>Gini</div>
            <div className={styles.details_panel_value}>{country.gini || 0} %</div>
          </div>

          <div className={styles.details_panel_borders}>
            <div className={styles.details_panel_borders_label}>
              Neighbouring Countries
            </div>

            <div className={styles.details_panel_borders_container}>
              {borders.length ? borders.map((country) => (
                <div
                  className={styles.details_panel_borders_country}
                  key={country.name}
                >
                  <Link href={`/country/${country.alpha3Code}`}>
                    <picture>
                      <img src={country.flag} alt={country.name} />
                    </picture>
                  </Link>
                  <div className={styles.details_panel_borders_name}>{country.name}</div>
                </div>
              )) : <div>{`No neighbouring countries!`}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
}

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();

  const paths = countries.map((country) => ({
    params: { id: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const country = await getCountry(params.id);

  return {
    props: { country }
  };
};
