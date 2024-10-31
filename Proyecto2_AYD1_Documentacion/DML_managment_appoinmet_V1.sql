--insert roles
INSERT INTO role (name, description) VALUES
('ADMIN', 'es el administrador encargado de realizar todo tipo de operacion administrativa, de gestion o configuracion en el sistema.'),
('CLIENTE', 'usuario cliente, tendra las opciones de agendar cita, cancelar, editar asi mismo ver sus historiles, ver opciones de servicios.'),
('EMPLEADO', 'es el empleado que podra tener los mismo permisos que el administrador si y solo si son asignados los permisos requeridos, sus acciones se limitan a los permisos.');


--insert permissions 
INSERT INTO permission (name, description) VALUES
('DASHBOARD', 'permiso para ver el inicio del programa'),
('CITAS', 'permiso para poder ver y editar las citas'),
('REPORTES', 'permiso para poder todos los reportes'),
('SERVICIOS', 'permiso para poder ver los servicios'),
('EMPLEADOS', 'permiso para poder editar a los empleados o su informacion'),
('ELIMINAR SERVICIO', 'permiso para eliminar un servicio'),
('CREAR SERVICIO', 'permiso para crear servicios'),
('EMPRESA', 'permiso para configurar los datos de la empresa'),
('ACTUALIZAR', 'permiso para actualizar los datos de la empresa');

--insert admin
INSERT INTO user(name, cui, password, nit, email, phone, role_id, created_at, image_url) VALUES
('Administrador', '1234567890123', '$2a$10$koJa48Wdp0BOpvMWzjQmVuLbZGlx4MCUbVmLmuAd7Pr7O76QwN7GO', '1234567890123', 'admin@gmail.com', '555-1234', 3, NOW(), 'https://example.com/images/juan.jpg');


--revisar
INSERT INTO user (name, cui, password, nit, email, phone, role_id, created_at, image_url)
VALUES
('Juan Pérez', '12345690123', '$2a$10$koJa48Wdp0BOpvMWzjQmVuLbZGlx4MCUbVmLmuAd7Pr7O76QwN7GO', '14567890123', 'juan.perez@gmail.com', '555-2234', 3, NOW(), 'https://example.com/images/juan.jpg');

INSERT INTO user (name, cui, password, nit, email, phone, role_id, created_at, image_url)
VALUES
('Ana López', '9876543210123', '$2a$10$koJa48Wdp0BOpvMWzjQmVuLbZGlx4MCUbVmLmuAd7Pr7O76QwN7GO', '9876543210123', 'ana.lopez@gmail.com', '555-5678', 3, NOW(), 'https://example.com/images/ana.jpg');

INSERT INTO user (name, cui, password, nit, email, phone, role_id, created_at, image_url)
VALUES
('Carlos Martínez', '1234987654321', '$2a$10$koJa48Wdp0BOpvMWzjQmVuLbZGlx4MCUbVmLmuAd7Pr7O76QwN7GO', '1234987654321', 'carlos.martinez@gmail.com', '555-4321', 3, NOW(), 'https://example.com/images/carlos.jpg');

INSERT INTO user (name, cui, password, nit, email, phone, role_id, created_at, image_url)
VALUES
('Lucía Gómez', '5678901234567', '$2a$10$koJa48Wdp0BOpvMWzjQmVuLbZGlx4MCUbVmLmuAd7Pr7O76QwN7GO', '5678901234567', 'lucia.gomez@gmail.com', '555-6789', 3, NOW(), 'https://example.com/images/lucia.jpg');


