import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Users.module.css";
import { FaEllipsisV } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaSpinner } from "react-icons/fa";
import AdminNav from "../AdminNav/AdminNav";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [roleFilter, setRoleFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState("all");

  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const [activeMenu, setActiveMenu] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [roleFilter, verifyFilter, users]);

  const filterUsers = () => {
    let filtered = [...users];

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (verifyFilter !== "all") {
      filtered = filtered.filter(
        (user) =>
          (verifyFilter === "verified" && user.isVerified) ||
          (verifyFilter === "not" && !user.isVerified),
      );
    }

    setFilteredUsers(filtered);
    setPage(1);
  };

const handleDelete = async (id) => {
  // Optimistically remove the user from UI
  const originalUsers = [...users];
  const originalFiltered = [...filteredUsers];
  setUsers(users.filter((user) => user.id !== id));
  setFilteredUsers(filteredUsers.filter((user) => user.id !== id));

  try {
    const res = await axios.delete(`http://localhost:3000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    toast.success(res.data.message || "User removed successfully");
  } catch (error) {
    // If API fails, revert back to original users
    setUsers(originalUsers);
    setFilteredUsers(originalFiltered);

    toast.error(
      error.response?.data?.message || "Failed to delete user"
    );
  }
};

  // For spinner icon

  // In your Users component
  const [loadingUsers, setLoadingUsers] = useState({}); // Track loading per user

  const handleVerifyToggle = async (user) => {
    const userId = user.id;
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isVerified: !u.isVerified } : u,
      ),
    );
    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/users/verify/${userId}`,
        { isVerified: !user.isVerified },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      toast.success(res.data.message);
    } catch (error) {
      // Revert the optimistic update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isVerified: user.isVerified } : u,
        ),
      );
      toast.error(
        error.response?.data?.message || "Failed to update verification",
      );
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Pagination
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className={styles.container}>
      <AdminNav />
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>All Users</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="freelancer">Freelancer</option>
          <option value="customer">Customer</option>
        </select>

        <select
          value={verifyFilter}
          onChange={(e) => setVerifyFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="verified">Verified</option>
          <option value="not">Not Verified</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading users...</td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td className={styles.role}>{user.role}</td>
                  <td>{user.category || "-"}</td>
                  <td>
                    {user.isVerified ? (
                      <span className={styles.verified}>Verified</span>
                    ) : (
                      <span className={styles.notVerified}>Not Verified</span>
                    )}
                  </td>
                  <td className={styles.menuCell}>
                    <FaEllipsisV
                      onClick={() =>
                        setActiveMenu(activeMenu === user.id ? null : user.id)
                      }
                    />
                    {activeMenu === user.id && (
                      <div className={styles.menu}>
                        <button
                          disabled={loading}
                          onClick={() => toast.info("Edit user page")}
                        >
                          Edit
                        </button>
                        <button
                          disabled={loading}
                          onClick={() => handleDelete(user.id)}
                        >
                          Remove
                        </button>
                        <button
                          disabled={loadingUsers[user.id]}
                          onClick={() => handleVerifyToggle(user)}
                        >
                          {loadingUsers[user.id] ? (
                            <FaSpinner className="spin" /> // Add CSS for spinning
                          ) : user.isVerified ? (
                            "Unverify"
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;
