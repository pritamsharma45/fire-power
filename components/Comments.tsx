import React from "react";
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

const UPDATE_COMMENTS = gql`
  mutation AddComment($productId: Int!, $content: String!, $userId: String!) {
    addComment(productId: $productId, content: $content, userId: $userId) {
      content
    }
  }
`;

const GET_COMMENTS = gql`
  query Query($productId: Int!) {
    commentsByProductId(productId: $productId) {
      id
      content
      userId
      updatedAt
    }
  }
`;

export default function Comments({ prodId }) {
  const { data: session, status } = useSession();
  const [commentInput, setCommentInput] = useState("");
  const [updateComment, { data, loading, error }] =
    useMutation(UPDATE_COMMENTS);

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useQuery(GET_COMMENTS, {
    variables: {
      productId: prodId,
    },
  });

  console.log(comments);

  const handleCommentSubmit = () => {
    updateComment({
      variables: {
        content: commentInput,
        productId: prodId,
        userId: session.user.id,
      },
    }).then(() => {
      // Clear the comment input
      setCommentInput("");
    });
  };
  return (
    <div>
      <div className="text-lg mt-4 underline">Comments</div>
      <div className="mt-4 inline-flex w-full">
        <input
          className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
          type="text"
          name="comment"
          placeholder="Add comment.."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold mt-0 ml-2 py-1 px-3  w-40 h-10  rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="inline h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="inline ml-2 text-xs">Add</span>
        </button>
      </div>
      <ul>
        {comments?.commentsByProductId.map((comment) => (
          <li className="mt-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center">
                <div className="font-medium text-gray-800">John Doe</div>
                <div className="ml-2 text-sm text-gray-600">
                  {new Date(Number(comment.updatedAt)).toDateString()}
                </div>
              </div>
              <div className="text-gray-700 text-xs">{comment.content}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
