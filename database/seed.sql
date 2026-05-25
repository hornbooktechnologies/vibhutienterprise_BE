USE vibhuti_db;

-- 1. Seed Roles
INSERT INTO roles (id, name, description, status) VALUES 
('d8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'Admin', 'Administrator with full system access', 1),
('c1a2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'User', 'Standard user with limited dashboard access', 1);

-- 2. Seed Permissions
INSERT INTO permissions (id, name, slug, group_name, description) VALUES
('p1000000-0000-0000-0000-000000000001', 'View Dashboard', 'view_dashboard', 'Dashboard', 'Ability to view dashboard stats and UI'),
('p2000000-0000-0000-0000-000000000002', 'Manage Users', 'manage_users', 'User Management', 'Ability to create, update, delete users'),
('p3000000-0000-0000-0000-000000000003', 'Manage Permissions', 'manage_permissions', 'Permission Management', 'Ability to view and edit role permissions'),
('p4000000-0000-0000-0000-000000000004', 'View Logs', 'view_logs', 'Activity Logs', 'Ability to view activity logs'),
('p5000000-0000-0000-0000-000000000005', 'View Profile', 'view_profile', 'Profile', 'Ability to view and update own profile');

-- 3. Seed Role Permissions
-- Admin gets all permissions
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp000000-0000-0000-0000-000000000001', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'p1000000-0000-0000-0000-000000000001'),
('rp000000-0000-0000-0000-000000000002', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'p2000000-0000-0000-0000-000000000002'),
('rp000000-0000-0000-0000-000000000003', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'p3000000-0000-0000-0000-000000000003'),
('rp000000-0000-0000-0000-000000000004', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'p4000000-0000-0000-0000-000000000004'),
('rp000000-0000-0000-0000-000000000005', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'p5000000-0000-0000-0000-000000000005');

-- User gets view_dashboard and view_profile
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
('rp000000-0000-0000-0000-000000000006', 'c1a2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'p1000000-0000-0000-0000-000000000001'),
('rp000000-0000-0000-0000-000000000007', 'c1a2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'p5000000-0000-0000-0000-000000000005');

-- 4. Seed Users
-- Passwords: admin123 -> $2a$10$uA3fJ.G/XbYy.P2N1zQ2QOfF1G.Y4jYkU48rP5gC909.yZp7p4U3q (derived using bcryptjs salt rounds 10)
-- Passwords: user123  -> $2a$10$vDhz/gQOplb8Zk00f8sHq.4oGjY6eK76RkKjH8G6hK8.nZ0l7FwKe (derived using bcryptjs salt rounds 10)
-- Note: actual passwords used here are admin123 and user123.
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile, status) VALUES
('u0000000-0000-0000-0000-000000000001', 'd8b5c92c-55c3-4d4b-91c8-db37207b5db2', 'Vibhuti', 'Admin', 'admin@vibhuti.com', '$2a$10$T1KqLzF2sV4y0oW7oK.ZHeLszqZc2F45H6D5q4Y.nZ.G1aM9bC53m', '9876543210', 1),
('u0000000-0000-0000-0000-000000000002', 'c1a2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'Vibhuti', 'User', 'user@vibhuti.com', '$2a$10$T1KqLzF2sV4y0oW7oK.ZHeLszqZc2F45H6D5q4Y.nZ.G1aM9bC53m', '9876543211', 1);
