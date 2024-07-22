import React, { useState } from "react";
import Modal from "react-modal";
import { useUserAuth } from "../config/UserAuthContext";
import { addRSSFeed } from "../services/articles"


export const LinkAdd = ({ open, setOpen, links }) => {
    const { user } = useUserAuth()
  const closeModal = () => setOpen(false);
  
  const addLink = async(link, name) => {
    console.log(`${link} ${name}`);
    console.log(user.uid);

    const urlDetails = {
        user: user.uid,
        rssUrl: link,
        rssUrlKey: name
    }

    try {
        await addRSSFeed(urlDetails);
        console.log("RSS Feed added successfully");
        closeModal();
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="">
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        constentLabel="Add RSS Feed"
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
        }}
        className="link-modal"
      >
        <ul className="m-6">
            {links.map((link, index) => (
                <li key={index + 1} className="my-2">
                    <button  onClick={() => addLink(link.link, link.name)} className="bg-gray-300 p-2 rounded-md">
                        {link.name}
                    </button>
                </li>
            ))}
        </ul>
      </Modal>
    </div>
  );
};
