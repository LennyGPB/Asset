"use client";

import AdminHeader from "@/components/shared/admin/AdminHeader";
import { useEffect, useState } from "react";

export default function AdminTags() {
const [isModalOpen, setIsModalOpen] = useState(false);
const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; role: string }>>([]);
const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
const [stripeAccountLinkUrl, setStripeAccountLinkUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const openModal = (user: { id: number; name: string; email: string; role: string }) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmSellerRole = () => {
    try { 
      fetch(`/api/users/sellers/${selectedUser?.id}`, {
        method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        setStripeAccountLinkUrl(data.accountLinkUrl);
        console.log(data);
      });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  }

  return (
    <>
        <AdminHeader />
        <div className="flex justify-center flex-wrap gap-5 mt-8">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => openModal(user)}
              className="w-56 border-2 border-gray-300 text-white uppercase p-2 rounded-lg text-center tracking-widest hover:bg-white hover:text-black transition-all duration-500">
            {user.name}
            </button>
        ))}
      </div>

      {/* Modal -------------------------------------------------- */}
      {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
        <div className="relative bg-white w-[600px] border-2 border-black flex flex-col items-center p-5 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold tracking-widest uppercase">Donner le rôle "vendeur" à {selectedUser?.name}</h1>
          <button onClick={handleConfirmSellerRole} className="button bg-blue-500 text-white p-2 w-72 mt-3 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
            Confirmer
          </button>
          {stripeAccountLinkUrl && (
            <a href={stripeAccountLinkUrl} target="_blank" className="button bg-green-500 text-white p-2 w-72 mt-3 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
              Configurer le compte Stripe
            </a>
          )}
          <button
              type="button"
              onClick={() => setIsModalOpen(false)} // Ferme la modal
              className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl hover:scale-110 hover:rotate-180 transition duration-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 text-white bg-black rounded-full">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </button>
        </div>
      </div>
      )}
    </>
  );
}