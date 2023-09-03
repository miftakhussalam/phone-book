/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import ContactList from "../components/ContactList";
import Navbar from "../components/Navbar";
import ModalCreateUpdate from "../components/ModalCreateUpdate";

interface HomeProps {}

const HomePage: React.FC<HomeProps> = (props: HomeProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue])

  return (
    <div>
      <ModalCreateUpdate
        type="add"
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <Navbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        openModal={openModal}
        setOpenModal={setOpenModal}
        type="search"
      />
      <ContactList
        searchValue={searchValue}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
      />
    </div>
  );
};

export default HomePage;
