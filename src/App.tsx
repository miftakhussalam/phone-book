import React, { useCallback, useEffect, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
  useQuery,
} from "@apollo/client";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { InMemoryCache } from "@apollo/client/core";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import HomePage from "./pages/Home";
import ContactDetailPage from "./pages/ContactDetail";

const App: React.FC = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [persistor, setPersistor] =
    useState<CachePersistor<NormalizedCacheObject>>();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      let newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        debug: true,
        trigger: "write",
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      setClient(
        new ApolloClient({
          uri: "https://wpe-hiring.tokopedia.net/graphql",
          cache,
          // defaultOptions: {
          //   watchQuery: {
          //     nextFetchPolicy: 'cache-only',
          //   },
          // },
        })
      );
    }

    init().catch(console.error);
  }, []);

  // const clearCache = useCallback(() => {
  //   if (!persistor) {
  //     return;
  //   }
  //   persistor.purge();
  // }, [persistor]);

  // const reload = useCallback(() => {
  //   window.location.reload();
  // }, []);

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact/:id" element={<ContactDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
