"use client";

import { STATIC_HOST } from "@/constants";
import { CreateUser, User } from "@/models";
import axios from "axios";
import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data, error, isLoading } = useSWR<User[]>(
    `${STATIC_HOST}/users`,
    fetcher
  );
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [type, setType] = useState("create");
  const [id, setId] = useState<number>();

  const [form, setForm] = useState<CreateUser>({
    name: "",
    email: "",
  });
  if (isLoading) return "Loading...";
  if (error) return "Error";
  const handleCreate = async () => {
    try {
      // Send POST request to create user
      await axios.post(`${STATIC_HOST}/users`, form);
      // Refetch data after creating user
      mutate(`${STATIC_HOST}/users`);
      // Close the create form
      setOpenCreateForm(false);
      setForm({
        name: "",
        email: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const handleDelete = async (userId: number) => {
    try {
      // Send DELETE request to delete user
      await axios.delete(`${STATIC_HOST}/users/${userId}`);
      // Refetch data after deleting user
      mutate(`${STATIC_HOST}/users`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const formEditOpen = (data: User) => {
    const { id, ...prevData } = data;
    setForm(prevData);
    setId(id);
    setType("edit");
    setOpenCreateForm(true);
  };
  const handleEdit = async () => {
    try {
      await axios.put(`${STATIC_HOST}/users/${id}`, form);
      // Refetch data after deleting user
      mutate(`${STATIC_HOST}/users`);
      setForm({
        name: "",
        email: "",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  if (data)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        {openCreateForm && (
          <div className="w-screen h-screen z-10 top-0 fixed bg-[#000000a1] flex justify-center items-center">
            <div className="bg-white rounded-lg p-5 relative min-w-[300px] ">
              <span
                onClick={() => setOpenCreateForm(false)}
                className="cursor-pointer absolute right-2 top-2"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 15.5L15.5 8.5"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 15.5L8.5 8.5"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="space-y-4">
                <p className="text-xl font-semibold">
                  {type == "create"
                    ? "Tạo người dùng"
                    : type == "edit" && `Sửa người dùng ${id}`}
                </p>
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    Tên người dùng
                  </label>
                  <input
                    id="name"
                    className="border rounded-lg focus:ring-1 w-full px-3 py-2"
                    type="text"
                    value={form?.name}
                    placeholder="Nhập tên người dùng"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block font-medium">
                    Gmail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form?.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="border rounded-lg focus:ring-1 w-full px-3 py-2"
                    placeholder="Nhập gmail"
                  />
                </div>
                <button
                  onClick={() => {
                    if (type == "create") {
                      handleCreate();
                    }
                    if (type == "edit") {
                      handleEdit();
                    }
                  }}
                  type="submit"
                  className="rounded-md bg-black text-white w-full  py-2 px-4 mb-2"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setType("create");
            setOpenCreateForm(true);
          }}
          className="rounded-md bg-black text-white  py-2 px-4 mb-4"
        >
          Tạo người dùng
        </button>
        <div className="flex  flex-col gap-3">
          {data.map((item) => (
            <div key={item.id} className=" grid grid-cols-6 gap-4">
              <div className="rounded-md shadow-md border flex flex-row gap-3 px-4 py-3 col-span-4">
                <span>{item.id}</span>
                <span>{item.name}</span>
                <span>{item.email}</span>
              </div>
              <div className="flex gap-4 flex-row items-center col-span-2">
                <span
                  className="cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.81 2L5.19 5.63"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.19 2L18.81 5.63"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.76001 14V17.55"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.36 14V17.55"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => formEditOpen(item)}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.81 3.94012C20.27 7.78012 16.41 13.0001 13.18 15.5901L11.21 17.1701C10.96 17.3501 10.71 17.5101 10.43 17.6201C10.43 17.4401 10.42 17.2401 10.39 17.0501C10.28 16.2101 9.9 15.4301 9.23 14.7601C8.55 14.0801 7.72 13.6801 6.87 13.5701C6.67 13.5601 6.47 13.5401 6.27 13.5601C6.38 13.2501 6.55 12.9601 6.76 12.7201L8.32 10.7501C10.9 7.52012 16.14 3.64012 19.97 2.11012C20.56 1.89012 21.13 2.05012 21.49 2.42012C21.87 2.79012 22.05 3.36012 21.81 3.94012Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.43 17.6201C10.43 18.7201 10.01 19.77 9.22 20.57C8.61 21.18 7.78 21.6001 6.79 21.7301L4.33 22.0001C2.99 22.1501 1.84 21.01 2 19.65L2.27 17.1901C2.51 15.0001 4.34 13.6001 6.28 13.5601C6.48 13.5501 6.69 13.56 6.88 13.57C7.73 13.68 8.56 14.0701 9.24 14.7601C9.91 15.4301 10.29 16.21 10.4 17.05C10.41 17.24 10.43 17.4301 10.43 17.6201Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.24 14.47C14.24 11.86 12.12 9.73999 9.50999 9.73999"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
}
