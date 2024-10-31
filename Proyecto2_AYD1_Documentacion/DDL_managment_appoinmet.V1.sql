CREATE DATABASE appointment_DB;

USE appointment_DB;

CREATE TABLE user (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	name VARCHAR(255) NOT NULL,
	cui VARCHAR(15) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	nit VARCHAR(13) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(15) NOT NULL UNIQUE,
	google_auth_key VARCHAR(255),
	role_id INTEGER NOT NULL,
	created_at DATETIME NOT NULL,
	image_url VARCHAR(255),
	PRIMARY KEY(id)
);

CREATE TABLE role (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE permission (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE user_permission (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	user_id INTEGER NOT NULL,
	permission_id INTEGER NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE business_configuration (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	name VARCHAR(255) NOT NULL,
	logo_url VARCHAR(255) NOT NULL,
	admin_id INTEGER NOT NULL,
	created_at DATETIME NOT NULL,
	description TEXT(65535) NOT NULL,
	bussiness_type ENUM('SERVICES', 'RENTALS') NOT NULL,
	max_days_cancellation INTEGER NOT NULL,
	max_hours_cancellation INTEGER NOT NULL,
	cancellation_surcharge DECIMAL(15,2) NOT NULL,
	max_days_update INTEGER NOT NULL,
	max_hours_update DECIMAL(15,2) NOT NULL,
	employee_election BIT NOT NUL DEFAULT 0,
	PRIMARY KEY(id)
);

CREATE TABLE service (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	name VARCHAR(255) NOT NULL,
	price DECIMAL(15,2) NOT NULL,
	duration TIME NOT NULL,
	description VARCHAR(255) NOT NULL,
	people_reaches INTEGER,
	location VARCHAR(255),
	image_url VARCHAR(255),
	status ENUM('AVAILABLE', 'UNAVAILABLE', 'DELETED') NOT NULL DEFAULT 'AVAILABLE',
	PRIMARY KEY(id)
);

CREATE TABLE business_hours (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	business_id INTEGER NOT NULL,
	day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
	specific_date DATE,
	opening_time TIME NOT NULL,
	closing_time TIME NOT NULL,
	created_at DATETIME NOT NULL,
	status ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL COMMENT 'para los registros indisponibles, son para las fechas casuales que no se atiende, ejemplo, cerrado por feria...',
	available_workers INTEGER NOT NULL,
	available_areas INTEGER NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE employee_availability (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	employee_id INTEGER NOT NULL,
	day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	created_at DATETIME NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE appointment (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	customer_id INTEGER NOT NULL,
	service_id INTEGER NOT NULL,
	employee_id INTEGER NOT NULL,
	start_date DATETIME NOT NULL,
	end_date DATETIME NOT NULL,
	status ENUM('RESERVED','COMPLETED','CANCELED') NOT NULL DEFAULT 'RESERVED',
	payment_method ENUM ('CASH','CARD') NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE invoice (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	appointment_id INTEGER NOT NULL,
	total_amount DECIMAL(15,2) NOT NULL,
	date_generation DATETIME NOT NULL,
	customer_id INTEGER NOT NULL,
	cancellation_surcharge_id INTEGER,
	PRIMARY KEY(id)
);

CREATE TABLE cancellation_surcharge (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	appointment_id INTEGER NOT NULL,
	date DATETIME NOT NULL,
	customer_id INTEGER NOT NULL,
	status ENUM('PENDING', 'COLLECTED') NOT NULL DEFAULT 'PENDING',
	PRIMARY KEY(id)
);

CREATE TABLE interest_schedule (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	appointment_id INTEGER NOT NULL,
	customer_interest_id INTEGER NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE notification (
	id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	customer_id INTEGER NOT NULL,
	description TEXT(65535) NOT NULL,
	created_at DATETIME NOT NULL,
	status ENUM ('READ','UNREAD') NOT NULL DEFAULT 'UNREAD',
	PRIMARY KEY(id)
);


ALTER TABLE user ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE user_permission ADD FOREIGN KEY (permission_id) REFERENCES permission (id);

ALTER TABLE user_permission ADD FOREIGN KEY (user_id) REFERENCES user (id);

ALTER TABLE business_hours ADD FOREIGN KEY (business_id) REFERENCES business_configuration (id);

ALTER TABLE business_configuration ADD FOREIGN KEY (admin_id) REFERENCES user (id);

ALTER TABLE appointment ADD FOREIGN KEY (customer_id) REFERENCES user (id);

ALTER TABLE appointment ADD FOREIGN KEY (employee_id) REFERENCES user (id);

ALTER TABLE appointment ADD FOREIGN KEY (service_id) REFERENCES service (id);

ALTER TABLE interest_schedule ADD FOREIGN KEY (customer_interest_id) REFERENCES user (id);

ALTER TABLE interest_schedule ADD FOREIGN KEY (appointment_id) REFERENCES appointment (id);

ALTER TABLE cancellation_surcharge ADD FOREIGN KEY (appointment_id) REFERENCES appointment (id);

ALTER TABLE cancellation_surcharge ADD FOREIGN KEY (customer_id) REFERENCES user (id);

ALTER TABLE invoice ADD FOREIGN KEY (cancellation_surcharge_id) REFERENCES cancellation_surcharge (id);

ALTER TABLE invoice ADD FOREIGN KEY (appointment_id) REFERENCES appointment (id);

ALTER TABLE invoice ADD FOREIGN KEY (customer_id) REFERENCES user (id);

ALTER TABLE notification ADD FOREIGN KEY (customer_id) REFERENCES user (id);

ALTER TABLE employee_availability ADD FOREIGN KEY (employee_id) REFERENCES user (id);
