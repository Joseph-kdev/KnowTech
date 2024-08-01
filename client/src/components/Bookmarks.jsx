import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../config/firebase-config";
import { useUserAuth } from "../config/UserAuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Nav } from "./Nav";
import { useNavigate } from "react-router-dom";
import { Flip, toast } from "react-toastify";
import { DotLoader } from "react-spinners";

const Piece = ({
  title,
  link,
  author,
  date,
  blogTitle,
  user,
  bookmarkId,
  OnRemove,
}) => {

  const queryClient = useQueryClient();

  if (author === "") {
    author = "Anonymous";
  }

  const removeBookmark = async () => {
    try {
      await deleteDoc(doc(db, `users/${user}/bookmarks`, bookmarkId));
      queryClient.invalidateQueries(['bookmarks', user]);
      OnRemove(bookmarkId); // Call the onRemove function to update the UI
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div className="bg-secondary m-1 md:w-[600px] p-3 md:my-3">
      <p className="text-xs text-primary mx-1 mb-1 hover:text-primary">
        {blogTitle}
      </p>
      <h2 className="m-1 hover:text-gray-600 ">
        <a href={link}>{title}</a>
      </h2>
      <p className="text-xs text-gray-700 mx-1 mb-1">
        Posted on {date} by {author}
      </p>
      <div>
        <div onClick={removeBookmark} className="cursor-pointer">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#070F2B"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-background mx-1 hover:text-gray-700"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
            </svg>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};
export const Bookmarks = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate()
  const queryClient = useQueryClient

  if (!user) {
    console.log("User not logged in");
    navigate("/login");
  }

  const getBookmarks = async (userId) => {
    const bookmarkCollection = collection(db, `users/${userId}/bookmarks`);
    const bookmarkSnapshot = await getDocs(bookmarkCollection);
    const bookmarks = bookmarkSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bookmarks;
  };

  const {
    data: bookmarks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(user.uid),
    initialData: [],
  });

  if (isLoading) {
    return <div className="h-screen">
      <DotLoader />
    </div>;
  }

  if (isError) {
    return <div className="h-screen">
      <img src="error.svg" alt="" className="h-[60vh]"/>
    </div>;
  }

  const handleRemove = (bookmarkId) => {
    queryClient.setQueryData(['bookmarks', user.uid], oldData => 
        oldData.filter(bookmark => bookmark.id !== bookmarkId)
    );
  }

  return (
    <>
      <Nav />
      <div>
        <h1 className="text-3xl text-text text-center my-3 font-heading">
          Bookmarks
        </h1>
        <ul className="md:flex md:flex-col md:items-center">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Piece
                title={bookmark.title}
                link={bookmark.link}
                date={bookmark.date}
                author={bookmark.author}
                blogTitle={bookmark.blogTitle}
                user={user.uid}
                bookmarkId={bookmark.id}
                OnRemove={handleRemove}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
