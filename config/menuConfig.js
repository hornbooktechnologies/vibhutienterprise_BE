const menuItems = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "LayoutDashboard",
    permission: "view_dashboard",
  },
  {
    title: "User Management",
    link: "/users",
    icon: "Users",
    permission: "manage_users",
  },
  {
    title: "Role Permissions",
    link: "/settings/permissions",
    icon: "ShieldAlert",
    permission: "manage_permissions",
  },
  {
    title: "Activity Logs",
    link: "/settings/logs",
    icon: "History",
    permission: "view_logs",
  },
  {
    title: "My Profile",
    link: "/profile",
    icon: "User",
    permission: "view_profile",
  }
];

module.exports = menuItems;
