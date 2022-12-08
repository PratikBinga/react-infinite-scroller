import logo from "./logo.svg";
import { useState, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const { books, loading, hasMore, error } = useBookSearch(query, page);
  const observer = useRef();

  // this method will be triggered whenever the last element is found when the div with ref lastBookElementRef
  const lastBookElementRef = useCallback(
    (lastElement) => {
      debugger;
      console.log(lastElement, "last element");
      if (loading) return;
      console.log(observer?.current, "observer value outside");
      if (observer.current) {
        console.log(observer?.current, "observer value inside");
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        console.log(entries, "entries");
        if (entries[0].isIntersecting) {
          console.log("Found...");
          setPage((prev) => prev + 1);
        }
        console.log(observer?.current, "observer value outside2");
      });
      console.log(observer?.current, "observer value outside3");
      if (lastElement) {
        debugger;
        observer.current.observe(lastElement);
        console.log(observer?.current, "observer value outside4");
      }
    },
    [hasMore, loading]
  );
  console.log(observer, "observer value outside5");
  function handleSearch(e) {
    setQuery(e.target.value);
  }

  return (
    <div className="App">
      <h2>Infinite Scroller </h2>
      Search:
      <input type="text" value={query} onChange={handleSearch} />
      {books?.map((book, idx) => {
        if (books.length === idx + 1) {
          return (
            <div ref={lastBookElementRef} key={idx}>
              {book}
            </div>
          );
        } else return <div key={idx}>{book}</div>;
      })}
      <div>
        <h2>{loading && "Loading...."}</h2>
      </div>
      <div>{error && "Error!"}</div>
    </div>
  );
}

export default App;
