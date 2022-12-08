import { useState, useEffect } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    let cancel;
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks([
          ...new Set([...books, ...res.data.docs.map((b) => b.title)]),
        ]);
        setLoading(false);
        setHasMore(res.data.docs.length > 0);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber, query]);
  return { books, loading, error, hasMore };
}
