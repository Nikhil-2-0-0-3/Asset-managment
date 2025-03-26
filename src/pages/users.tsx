import React from 'react';

const UserTable = () => {
  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Manager", status: "Active" }
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  };

  const thStyle = {
    backgroundColor: "#f2f2f2",
    color: "#333",
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "12px",
    border: "1px solid #ddd"
  };

  const rowHoverStyle = {
    backgroundColor: "#f1f1f1"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Management</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} style={index % 2 === 0 ? rowHoverStyle : {}}>
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
