import React from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export function LeftMostNavigate({
  data,
  setSearchParams,

  size = "20px",
}) {
  return (
    data?.page > 1 && (
      <button
        onClick={() => {
          setSearchParams((e) => {
            e.set("page", 1);
            return e;
          });
        }}
        className="text-white btn border-0 outline-0"
      >
        <FaAngleDoubleLeft size={size} />
      </button>
    )
  );
}
export function RightMostNavigate({
  data,
  setSearchParams,

  size = "20px",
}) {
  return (
    data?.page < data?.totalPages && (
      <button
        onClick={() => {
          setSearchParams((e) => {
            e.set("page", data?.totalPages);
            return e;
          });
        }}
        className="text-white btn border-0 outline-0"
      >
        <FaAngleDoubleRight size={size} />
      </button>
    )
  );
}
export function RightNavigate({
  data,
  setSearchParams,

  size = "50px",
}) {
  return (
    data?.page < data?.totalPages && (
      <button
        onClick={() => {
          setSearchParams((e) => {
            e.set("page", Number(data?.page) + 1);
            return e;
          });
        }}
        className="text-white btn border-0 outline-0"
      >
        <FaAngleRight size={size} />
      </button>
    )
  );
}

export function LeftNavigate({
  data,
  setSearchParams,

  size = "50px",
}) {
  return (
    data?.page > 1 && (
      <button
        onClick={() => {
          setSearchParams((e) => {
            e.set("page", Number(data?.page) - 1);
            return e;
          });
        }}
        className="text-white btn border-0 outline-0"
      >
        <FaAngleLeft size={size} />
      </button>
    )
  );
}
