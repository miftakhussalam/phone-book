/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import ContactList from "../components/ContactList";
import Navbar from "../components/Navbar";
import ModalCreateUpdate from "../components/ModalCreateUpdate";
import useSearch from "../hooks/useSearch";

interface HomeProps {}

const HomePage: React.FC<HomeProps> = (props: HomeProps) => {
  const { searchValue } = useSearch();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <div>
      <ModalCreateUpdate type="add" />
      <Navbar type="search" />
      <ContactList
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
      />
    </div>
  );
};

export default HomePage;
