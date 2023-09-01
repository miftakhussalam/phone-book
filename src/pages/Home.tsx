/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import ContactList from "../components/ContactList";
import Navbar from "../components/Navbar";
import ModalCreateUpdate from "../components/ModalCreateUpdate";

interface HomeProps {}

const HomePage: React.FC<HomeProps> = (props: HomeProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div>
      <ModalCreateUpdate openModal={openModal} setOpenModal={setOpenModal} />
      <Navbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        openModal={openModal}
        setOpenModal={setOpenModal}
        type="search"
      />
      <ContactList searchValue={searchValue} />
    </div>
  );
};

export default HomePage;
