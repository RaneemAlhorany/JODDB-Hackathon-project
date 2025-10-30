-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 02:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `company_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `work_id` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` enum('production','tester','quality','supervisor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `work_id`, `password`, `level`) VALUES
(1, 'prod001', '$2y$10$jyQTkIWCkLtV5mn1PQNCKuGrx9PdwOkhtC93qHYVAKCmXIUHMztTW', 'production'),
(2, 'test001', '$2y$10$KSiLUNmTE1nJcX6U6u.O4OW2ocGuErvi3Dyo3uRAA.pwEGOh4z4YS', 'tester'),
(3, 'qual001', '$2y$10$vFBc6smwGylLMTj6B8t.c.FlbWwGvrBLaqy/z1n/LegNfr9Dm2wde', 'quality'),
(4, 'sup001', '$2y$10$kn3DRi/zW1a4oiDA6FIOouWqBiUJ4X9o.OINDMpnWzXwy1kz6BBKK', 'supervisor');

-- --------------------------------------------------------

--
-- Table structure for table `errors_log`
--

CREATE TABLE `errors_log` (
  `error_id` int(11) NOT NULL,
  `part_id` int(11) DEFAULT NULL,
  `operation_id` int(11) DEFAULT NULL,
  `worker_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `error_type` varchar(100) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `errors_log`
--

INSERT INTO `errors_log` (`error_id`, `part_id`, `operation_id`, `worker_id`, `project_id`, `error_type`, `timestamp`) VALUES
(1, 1, 1, 1, 1, 'Misalignment', '2025-10-29 16:09:31'),
(2, 2, 2, 2, 1, 'Wiring Error', '2025-10-29 16:09:31'),
(3, 3, 3, 3, 1, 'Packaging Tear', '2025-10-29 16:09:31'),
(4, 4, 4, 4, 2, 'Voltage Drop', '2025-10-29 16:09:31'),
(5, 5, 5, 5, 2, 'Sensor Misread', '2025-10-29 16:09:31'),
(6, 6, 6, 6, 3, 'Surface Crack', '2025-10-29 16:09:31'),
(7, 7, 7, 7, 3, 'Label Missing', '2025-10-29 16:09:31'),
(8, 8, 8, 8, 4, 'Paint Bubble', '2025-10-29 16:09:31'),
(9, 9, 9, 9, 5, 'Calibration Drift', '2025-10-29 16:09:31'),
(10, 10, 10, 10, 6, 'Transport Delay', '2025-10-29 16:09:31');

-- --------------------------------------------------------

--
-- Table structure for table `operations`
--

CREATE TABLE `operations` (
  `operation_id` int(11) NOT NULL,
  `operation_name` varchar(100) NOT NULL,
  `success_rate` float DEFAULT 0,
  `failed_attempts` int(11) DEFAULT 0,
  `estimated_time_per_part` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operations`
--

INSERT INTO `operations` (`operation_id`, `operation_name`, `success_rate`, `failed_attempts`, `estimated_time_per_part`) VALUES
(1, 'Assemblage I', 95.5, 3, 32),
(2, 'Assemblage II', 92, 5, 30),
(3, 'Assemblage II tubeless', 97.3, 2, 13),
(4, 'Final Touch - Cleaning&Packing', 90.5, 6, 10),
(5, 'Final Touch - Paint&Labeling', 89.4, 8, 15),
(6, 'Final Touch - Purge Vulve&Cleaning', 93.2, 4, 5),
(7, 'FocusA340', 99.1, 1, 20),
(8, 'FocusA360', 94.5, 3, 10),
(9, 'Lens Cleaning', 96.7, 2, 35),
(10, 'Objective and Doublet', 98.8, 1, 24);

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `serial_number` varchar(20) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `operation_id` int(11) DEFAULT NULL,
  `status` enum('not_started','in_progress','testing','packaging','finished') DEFAULT 'not_started',
  `assigned_worker` int(11) DEFAULT NULL,
  `stage` enum('manufacturing','testing','quality') DEFAULT 'manufacturing',
  `estimated_time` int(11) DEFAULT NULL,
  `real_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`serial_number`, `project_id`, `operation_id`, `status`, `assigned_worker`, `stage`, `estimated_time`, `real_time`) VALUES
('JO 2891', 1, 1, 'in_progress', 1, 'manufacturing', 50, 110),
('JO 2892', 1, 2, 'testing', 2, 'testing', 90, 100),
('JO 2893', 1, 3, 'packaging', 3, 'quality', 60, 55),
('JO 2894', 2, 4, 'packaging', 4, 'testing', 45, 42),
('JO 2895', 2, 5, 'in_progress', 5, 'manufacturing', 30, 32),
('JO 2896', 3, 6, 'in_progress', 6, 'quality', 50, 48),
('JO 2897', 3, 7, 'packaging', 7, 'manufacturing', 25, 26),
('JO 2898', 4, 8, 'finished', 8, 'quality', 40, 38),
('JO 2899', 5, 9, 'testing', 9, 'testing', 35, 37),
('JO 2900', 6, 10, 'in_progress', 10, 'manufacturing', 20, 19);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','completed','delayed') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `start_date`, `end_date`, `status`) VALUES
(1, 'Helium binoculars Tu1', '2025-10-01', '2025-11-15', 'active'),
(2, 'Helium binoculars Tu2', '2025-09-15', '2025-11-01', 'active'),
(3, 'Helium binoculars Tu3', '2025-09-20', '2025-12-10', 'active'),
(4, 'Helium binoculars Jo1', '2025-08-01', '2025-10-20', 'completed'),
(5, 'Helium binoculars Jo2', '2025-09-10', '2025-12-05', 'active'),
(6, 'Helium binoculars Jo3', '2025-07-01', '2025-09-30', 'completed'),
(7, 'Night vision binoculars Jo1', '2025-10-05', '2025-11-25', 'active'),
(8, 'Night vision binoculars Jo2', '2025-09-01', '2025-11-10', 'active'),
(9, 'Night vision binoculars Tu1', '2025-09-25', '2025-11-30', 'delayed'),
(10, 'Night vision binoculars Tu2', '2025-08-10', '2025-10-10', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `project_progress`
--

CREATE TABLE `project_progress` (
  `progress_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `operation_id` int(11) DEFAULT NULL,
  `total_parts` int(11) DEFAULT NULL,
  `completed_parts` int(11) DEFAULT NULL,
  `progress_percent` float GENERATED ALWAYS AS (`completed_parts` / `total_parts` * 100) STORED,
  `last_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_progress`
--

INSERT INTO `project_progress` (`progress_id`, `project_id`, `operation_id`, `total_parts`, `completed_parts`, `last_update`) VALUES
(1, 1, 1, 100, 70, '2025-10-29 16:09:31'),
(2, 1, 2, 100, 60, '2025-10-29 16:09:31'),
(3, 2, 3, 120, 90, '2025-10-29 16:09:31'),
(4, 2, 4, 120, 100, '2025-10-29 16:09:31'),
(5, 3, 5, 80, 40, '2025-10-29 16:09:31'),
(6, 3, 6, 80, 60, '2025-10-29 16:09:31'),
(7, 4, 7, 50, 50, '2025-10-29 16:09:31'),
(8, 5, 8, 200, 150, '2025-10-29 16:09:31'),
(9, 6, 9, 100, 80, '2025-10-29 16:09:31'),
(10, 7, 10, 60, 45, '2025-10-29 16:09:31');

-- --------------------------------------------------------

--
-- Table structure for table `summary`
--

CREATE TABLE `summary` (
  `id` int(100) NOT NULL,
  `total_project` int(100) NOT NULL,
  `completed_project` int(100) NOT NULL,
  `avg_progress_active_projects` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `summary`
--

INSERT INTO `summary` (`id`, `total_project`, `completed_project`, `avg_progress_active_projects`) VALUES
(0, 10, 3, 70);

-- --------------------------------------------------------

--
-- Table structure for table `timetracking`
--

CREATE TABLE `timetracking` (
  `track_id` int(11) NOT NULL,
  `part_id` varchar(20) DEFAULT NULL,
  `worker_id` int(11) DEFAULT NULL,
  `operation_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `total_minutes` int(11) GENERATED ALWAYS AS (timestampdiff(MINUTE,`start_time`,`end_time`)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timetracking`
--

INSERT INTO `timetracking` (`track_id`, `part_id`, `worker_id`, `operation_id`, `start_time`, `end_time`) VALUES
(1, '1', 1, 1, '2025-10-28 08:00:00', '2025-10-28 10:00:00'),
(2, '2', 2, 2, '2025-10-28 09:00:00', '2025-10-28 10:30:00'),
(3, '3', 3, 3, '2025-10-28 10:15:00', '2025-10-28 11:10:00'),
(4, '4', 4, 4, '2025-10-27 07:00:00', '2025-10-27 07:45:00'),
(5, '5', 5, 5, '2025-10-28 11:00:00', '2025-10-28 11:35:00'),
(6, '6', 6, 6, '2025-10-28 08:10:00', '2025-10-28 08:55:00'),
(7, '7', 7, 7, '2025-10-28 09:00:00', '2025-10-28 09:25:00'),
(8, '8', 8, 8, '2025-10-27 08:00:00', '2025-10-27 08:40:00'),
(9, '9', 9, 9, '2025-10-28 09:30:00', '2025-10-28 10:05:00'),
(10, '10', 10, 10, '2025-10-28 08:50:00', '2025-10-28 09:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

CREATE TABLE `workers` (
  `worker_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `worker_pass` varchar(100) DEFAULT NULL,
  `role` enum('Production','Test','Quality','Planner') DEFAULT NULL,
  `performance_rate` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`worker_id`, `full_name`, `worker_pass`, `role`, `performance_rate`) VALUES
(1, 'Ahmed Youssef', 'pass123', 'Test', 91.2),
(2, 'Laila Ali', 'pass234', 'Test', 87.5),
(3, 'Mahmoud Omar', 'pass345', 'Quality', 93.1),
(4, 'Sarah Khaled', 'pass456', 'Production', 89.4),
(5, 'Emad Nasser', 'pass567', 'Production', 85.7),
(6, 'Raed Awad', 'pass678', 'Quality', 92.3),
(7, 'Mona Hussein', 'pass789', 'Production', 88.9),
(8, 'Iyad Samir', 'pass890', 'Planner', 95.5),
(9, 'Hind Fouad', 'pass901', 'Quality', 90.2),
(10, 'Zaid Amer', 'pass012', 'Production', 86.6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `work_id` (`work_id`);

--
-- Indexes for table `errors_log`
--
ALTER TABLE `errors_log`
  ADD PRIMARY KEY (`error_id`),
  ADD KEY `part_id` (`part_id`),
  ADD KEY `operation_id` (`operation_id`),
  ADD KEY `worker_id` (`worker_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `operations`
--
ALTER TABLE `operations`
  ADD PRIMARY KEY (`operation_id`);

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`serial_number`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `operation_id` (`operation_id`),
  ADD KEY `assigned_worker` (`assigned_worker`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `project_progress`
--
ALTER TABLE `project_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `operation_id` (`operation_id`);

--
-- Indexes for table `summary`
--
ALTER TABLE `summary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timetracking`
--
ALTER TABLE `timetracking`
  ADD PRIMARY KEY (`track_id`),
  ADD KEY `worker_id` (`worker_id`),
  ADD KEY `operation_id` (`operation_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Indexes for table `workers`
--
ALTER TABLE `workers`
  ADD PRIMARY KEY (`worker_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `errors_log`
--
ALTER TABLE `errors_log`
  MODIFY `error_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `operations`
--
ALTER TABLE `operations`
  MODIFY `operation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `project_progress`
--
ALTER TABLE `project_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `timetracking`
--
ALTER TABLE `timetracking`
  MODIFY `track_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `workers`
--
ALTER TABLE `workers`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `errors_log`
--
ALTER TABLE `errors_log`
  ADD CONSTRAINT `errors_log_ibfk_2` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`operation_id`),
  ADD CONSTRAINT `errors_log_ibfk_3` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`worker_id`),
  ADD CONSTRAINT `errors_log_ibfk_4` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

--
-- Constraints for table `parts`
--
ALTER TABLE `parts`
  ADD CONSTRAINT `parts_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `parts_ibfk_2` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`operation_id`),
  ADD CONSTRAINT `parts_ibfk_3` FOREIGN KEY (`assigned_worker`) REFERENCES `workers` (`worker_id`);

--
-- Constraints for table `project_progress`
--
ALTER TABLE `project_progress`
  ADD CONSTRAINT `project_progress_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `project_progress_ibfk_2` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`operation_id`);

--
-- Constraints for table `timetracking`
--
ALTER TABLE `timetracking`
  ADD CONSTRAINT `timetracking_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`worker_id`),
  ADD CONSTRAINT `timetracking_ibfk_3` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`operation_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
