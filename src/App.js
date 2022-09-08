import React from 'react';
import './index.scss';
import Collection from "./components/collection";
import {categories} from "./constants";

function App() {
  const [categoryId, setCategoryId] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [collections, setCollections] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const categoryParams = categoryId ? `&category=${categoryId}` : '';
      try {
        setIsLoading(true);
        const response = await fetch(`https://631621e75b85ba9b11f0a175.mockapi.io/photo-collections?page=${currentPage}&limit=3${categoryParams}`);
        const responseData = await response.json();
        setCollections(responseData);
      } catch (e) {
        console.log('Ошбика при получении!')
      } finally {
        setIsLoading(false);
      }
    })()
  },[categoryId, currentPage])

  const onFilterCollections = ({name}) => {
    return name.toLowerCase().includes(searchValue.toLowerCase());
  }

  const getActiveClassCollections = (categoryId, currentId) => {
    return categoryId === currentId ? 'active' : '';
  }

  const onSelectCategory = (categoryId) => () => {
    setCategoryId(categoryId);
  }

  const onChangeSearchValue = (event) => {
    setSearchValue(event.target.value);
  }

  const getActiveClassPage = (selectPage, currentPage) => {
    return selectPage === currentPage ? 'active' : '';
  }

  const renderLoadingAndCollections = () => {
    return isLoading ? <h2>Идет загрузка ...</h2> :
      collections.filter(onFilterCollections).map((collections,index) => (
        <Collection
          key={index}
          name={collections.name}
          images={collections.photos}
        />
      ))
  }

  const onClickPage = (currentPage) => () => {
    setCurrentPage(currentPage);
  }

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category,index) => (
            <li key={index} className={getActiveClassCollections(categoryId, index)} onClick={onSelectCategory(index)}>{category.name}</li>
          ))}
        </ul>
        <input className="search-input" placeholder="Поиск по названию" onChange={onChangeSearchValue} value={searchValue}/>
      </div>
      <div className="content">
        { renderLoadingAndCollections() }
      </div>
      <ul className="pagination">
        {[... Array(5)].map((_,index) => {
          const page = index + 1;
          return (
            <li key={index} onClick={onClickPage(page)} className={getActiveClassPage(currentPage, page)}>{page}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
