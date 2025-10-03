-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Oct 03, 2025 at 08:13 PM
-- Server version: 8.4.6
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `concert_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int NOT NULL,
  `admin_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `admin_name`, `email`, `password`) VALUES
(1, 'Akbar Admin', 'admin@example.com', '25d55ad283aa400af464c76d713c07ad');

-- --------------------------------------------------------

--
-- Table structure for table `akses_token`
--

CREATE TABLE `akses_token` (
  `id` int NOT NULL,
  `id_admin` int DEFAULT NULL,
  `id_organization` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `token` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akses_token`
--

INSERT INTO `akses_token` (`id`, `id_admin`, `id_organization`, `id_user`, `ip_address`, `token`) VALUES
(1, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MTE2NTQ4LCJleHAiOjE4MTYxMTY1NDd9.cI0izoquIxAq13kKuJ_cgj3Zm1xzGGgd2RirvEdDs9I'),
(2, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjAwMDAxLCJleHAiOjE4MTYyMDAwMDB9.vo6bSTUu6p_xGpcIH1RD6ru64lSExWWgjjmxjg1lRdc'),
(3, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjE5MTY2LCJleHAiOjE4MTYyMTkxNjV9.aFMphVxXUiSdIpMk1XiKtZIw4dUUwwkqL3ZXwShmAto'),
(4, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjE5NTY3LCJleHAiOjE4MTYyMTk1NjZ9.WkHwnJLmzQWb1ZRdGvqCAf3g3hm9UHzWlgfWyt2G33g'),
(5, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjE5NTc0LCJleHAiOjE4MTYyMTk1NzN9.MpoF0BHudYvwNf3J-vBrngZyr8qoMLmrBccqm0AHNII'),
(6, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjE5NjIwLCJleHAiOjE4MTYyMTk2MTl9.XsjsiUzU8oZ4jTsP8TwepLtAilSPYQz3cBfBaDZcWKA'),
(7, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MjIxMjE2LCJleHAiOjE4MTYyMjEyMTV9.y2koeh_hqIZ-HErVvn__c2hVEyxIPTbo_G2ZHyuYcFg'),
(8, NULL, 1, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjF9XSwiaWF0IjoxNzE2MzE1MzcxLCJleHAiOjE4MTYzMTUzNzB9.pQ_0dxPzX0MtmCx6VsoLhcoALldjKGxVAL7KUCfkE4A'),
(9, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NjQ0MDAsImV4cCI6MTcxNjU2NTg0MH0.0BvufrkIqLmUP8fvnm5fr3sYfmlZpIYt_H7JWeS9sd0'),
(10, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NjU4NjQsImV4cCI6MTcxNjU2NzMwNH0.UD3uDOTPimJRL0rOkm-04Z0WBZ62ke9as8i5HdV6cp0'),
(11, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NjYyMjYsImV4cCI6MTcxNjU2NzY2Nn0.wXOjJzlggZShfcuFyr2j4DOEY1rF83cI_gb-65w4uJ8'),
(12, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NjczMjcsImV4cCI6MTcxNjU2ODc2N30.c6f1ax3-o8Hf1lBkzdQHyhhBHNKkBTYFHDOAbP5RYXs'),
(13, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1Njg5NTMsImV4cCI6MTcxNjU3MDM5M30.fgMeP53GZH3PQkORrlp0gtB3Gbb6wsP1BYHXKO6naVw'),
(14, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzA1MDIsImV4cCI6MTcxNjU3MTk0Mn0.mehY7TUNGAByJHTnuG86CLsCurpzI-UsLhHzYmXb0Mg'),
(15, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzA1MDIsImV4cCI6MTcxNjU3MTk0Mn0.mehY7TUNGAByJHTnuG86CLsCurpzI-UsLhHzYmXb0Mg'),
(16, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzA5ODEsImV4cCI6MTcxNjU3MjQyMX0.67-rw5gR5Vnzzj3EhRG_0lTqpxKPEaVogXUAKGOmuN0'),
(17, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzIwMTUsImV4cCI6MTcxNjU3MzQ1NX0._lBw1d9Y49SYCPJfDAjAxsFOsb2SEd5HSYDzIZPgeKg'),
(18, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzI1OTMsImV4cCI6MTcxNjU3NDAzM30.rHT4bgr7IouAYe3ibDp1-Ox4gLem5alQoTecbaf-eqI'),
(19, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzM0ODgsImV4cCI6MTcxNjU3NDkyOH0.vWLCoybK7vWDYf7Mc14sCLvvqIuDbCpGRDgeFnPG62Y'),
(20, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzQzNzcsImV4cCI6MTcxNjU3NTgxN30.eKug6OK0qwqzbWb5T9SqTQSu_Ko59gE-rMKW3SHcC5s'),
(21, 1, NULL, NULL, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3MTY1NzU4NjMsImV4cCI6MTcxNjU3NzMwM30.kS_XqRiC0e8cTqaY7o3wzS4pYV7tqYCj9JrMc2YoK7A'),
(22, NULL, NULL, 5, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo1LCJpYXQiOjE3MTY2NTM2NzYsImV4cCI6MTcxNjY1OTQzNn0.eACpAe4wuc_wiLI0979m2uZzkkZHhAqEgEm-Hy0qmpo'),
(23, NULL, NULL, 4, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo0LCJpYXQiOjE3MTY2NTM2ODIsImV4cCI6MTcxNjY1OTQ0Mn0.0hNoPcMk2zqNYJ6d0cMkpiy6K1ZBocvWpzgsXlruGxw'),
(24, NULL, NULL, 4, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo0LCJpYXQiOjE3MTY2NTM4NTMsImV4cCI6MTcxNjY1OTYxM30.mfyPjnyOkWfYsvLzWL6_vDtip43wkU0XWg_0X6Fulp8'),
(25, NULL, NULL, 4, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo0LCJpYXQiOjE3MTY2NTQ0NjYsImV4cCI6MTcxNjY2MDIyNn0.ShAkOhhHNkrV3UhFGtini8AJxEWOYVI1CVmEMV4i3pg'),
(26, NULL, NULL, 4, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo0LCJpYXQiOjE3MTY2NTk2NTUsImV4cCI6MTcxNjY2NTQxNX0.09Afhyvz44uHJgab290kip78xiH3rBYCZpap_tjfmYg'),
(27, NULL, NULL, 4, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo0LCJpYXQiOjE3MTY2Njc1MDEsImV4cCI6MTcxNjY3MzI2MX0.pMeuxXVcFTkRjbAnIw0v_ath8M50DgQnE9TQxD5YhcU'),
(28, NULL, NULL, 1, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3MTY2NzAwNzAsImV4cCI6MTcxNjY3NTgzMH0.AuuS_hyTeQrjpJbKf-h5hBqCbIzmIaU-aqH3NaBaH3A'),
(29, NULL, NULL, 1, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3MTY3MDc3MzcsImV4cCI6MTcxNjcxMzQ5N30.g_T5oRghmvS0_dMaV7Qy79i7mmC39UldjTfSXNprJDo'),
(30, NULL, NULL, 1, '192.168.56.1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3MTY3MTM2MjIsImV4cCI6MTcxNjcxOTM4Mn0.OLsQlJCWh65E2y-KRi2SSzV-lPoZi6U2_OIasxGGGXY'),
(31, NULL, NULL, 6, '192.168.1.21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NDg1MTAwMDIsImV4cCI6MTc0ODUxNTc2Mn0.Fhl9rB-Uiy2TuZ_zjkI9Q1ZA3Lmm8SQFLzMgiwi7CDY'),
(32, 1, NULL, NULL, '192.168.1.21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDg1MTAyODksImV4cCI6MTc0ODUxMTcyOX0.lamH_KzZbxRFxZL_vHsOZmL5tAcy_SrRWJ7CqouuCAA'),
(33, NULL, 11, NULL, '192.168.1.21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjExfV0sImlhdCI6MTc0ODUxMDQxMywiZXhwIjoxODQ4NTEwNDEyfQ.2nbNiBnp-BrR8Es7V3K3eN9AI-6nLA8sOOt4-TVxF3U'),
(34, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDkxMTI3MTgsImV4cCI6MTc0OTExNDE1OH0.ctaEqcfILJfh5ilWWk0LTP9agmR3Wq6gOjY6-ei5pCI'),
(35, NULL, 11, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjExfV0sImlhdCI6MTc0OTExMjcyMywiZXhwIjoxODQ5MTEyNzIyfQ.Ec-dHKq_-EcfAA0L0JLDGs5SVnWhvL3J6Es4xxyBbqo'),
(36, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NDkxMTMwMzUsImV4cCI6MTc0OTExODc5NX0.rIrQmiYYsyuCCOynaU0lDzGNYJcx-t-GD3WAEtSBmYU'),
(37, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDkxMTUwNzQsImV4cCI6MTc0OTExNjUxNH0.PC0ycMp2kPsoKBWiPSg6ajw7vNQjpT4ziqBbpALZ2cc'),
(38, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NDk3OTgxNjksImV4cCI6MTc0OTgwMzkyOX0.FE-8cjuFDfaTHbaVREZT1ZG5wkFt0CerPVSmd6elTzs'),
(39, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDk3OTg0MzIsImV4cCI6MTc0OTc5OTg3Mn0.6o5RkfeoO0EhAOl129MszYj6Nk1r_wMQkJQFGs_v064'),
(40, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDk4MDA4OTIsImV4cCI6MTc0OTgwMjMzMn0.fJ9QxxBmE2AqNwxQ027erd4fOvUQ7_MYvvHRaNMDwCk'),
(41, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDk4MDI3NTMsImV4cCI6MTc0OTgwNDE5M30.HMHHLSJyyKxRE_7Fx1jYWt0waw9nqez88RxExte5e-I'),
(42, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NDk4MDQxMzMsImV4cCI6MTc0OTgwOTg5M30.UValkyPBQLMXhNcVidvFkImCxAr9oAdapStBJfo6H7I'),
(43, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NDk4MDQzNDMsImV4cCI6MTc0OTgwNTc4M30.o7JtlrpTeoTCgfJ5Sr8_CtESIL_xQwhg0NqpGdHK7OY'),
(44, 1, NULL, NULL, '192.168.1.22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTAxNDU3MjMsImV4cCI6MTc1MDE0NzE2M30.jlE_NFZ17CaD1zmO2u3g9EhvjTs2Sxk9B3_m3ooucsU'),
(45, NULL, NULL, 6, '192.168.1.22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTAxNDYxNTMsImV4cCI6MTc1MDE1MTkxM30.Ddng2gHkds9nf7-p5lVOyhwSWLsJS6j3g4uI_gSVJb0'),
(46, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTAyMzQ1NTgsImV4cCI6MTc1MDI0MDMxOH0.UKkCDZq4tc7aH11wMXFbv3ObfFM6yg2swW7Ud1n0VZE'),
(47, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTAyMzQ2MTUsImV4cCI6MTc1MDIzNjA1NX0.xoZohVV0pjPqu-r0X9HS2wWHXQ__Y9-aYOTS-86fdws'),
(48, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTAyMzY2NDgsImV4cCI6MTc1MDIzODA4OH0.Vamsfqe-zyaFJX7mHDBYgitZRvboqt9vng795ezZkFc'),
(49, NULL, NULL, 6, '192.168.1.18', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTAyNDkwMTEsImV4cCI6MTc1MDI1NDc3MX0.yrBQwQrJPDg65TULfzfjGP8-C_Z6Tdsbl3DA0aXDbtw'),
(50, NULL, 11, NULL, '192.168.1.18', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjExfV0sImlhdCI6MTc1MDI0OTQzOSwiZXhwIjoxODUwMjQ5NDM4fQ.06Vq7BUlo8GVvL7A6ZlFJrFgcWwPQL95xdiGtEeJP0U'),
(51, 1, NULL, NULL, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTAzMTY4MDYsImV4cCI6MTc1MDMxODI0Nn0.0kCrFYtSM66FITUXbl5EFGuU-STwaT-_oVBTozXYw78'),
(52, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTA0MDA5MTYsImV4cCI6MTc1MDQwNjY3Nn0.Zi5hbLA7dXjpUyEx9I6wNPEHHrI8Wfi9aU2ldsaTbg8'),
(53, NULL, NULL, 6, '172.20.10.19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTA0MDU2MDcsImV4cCI6MTc1MDQxMTM2N30.2O9GILJ40qkekL8jTPy0nTyj5P4-_FOScqUPp_LDKio'),
(54, 1, NULL, NULL, '172.20.10.19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTA0MDYxNDcsImV4cCI6MTc1MDQwNzU4N30.HatTj_y8eVnpXRUC0UP1QwBGWWEAgIaMUUPWrEWqYvs'),
(55, NULL, NULL, 6, '172.20.10.2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTE2MzQ1MjMsImV4cCI6MTc1MTY0MDI4M30.OtSnou3jvdFesTeBau3w7Z6DDd7WkGgeCVCFGirUT8s'),
(56, 1, NULL, NULL, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTk0OTg0MTksImV4cCI6MTc1OTQ5OTg1OX0.rd7rbs1L762IXLLmmrIsjWWDcgVJ5ypbrB2IIIiFmwI'),
(57, NULL, 11, NULL, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjExfV0sImlhdCI6MTc1OTQ5ODU0MywiZXhwIjoxODU5NDk4NTQyfQ.-AJ_feGyFC0aBCtLWh5GKdVW5PhfnFicf4zAugsrunk'),
(58, 1, NULL, NULL, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTk1MDQzODYsImV4cCI6MTc1OTUwNTgyNn0.XtlVsvY9fvru5OrG4H1joNbw2aOQLd2sbjC96HPStyY'),
(59, NULL, 11, NULL, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9vcmdhbml6YXRpb24iOjExfV0sImlhdCI6MTc1OTUwNDUxMCwiZXhwIjoxODU5NTA0NTA5fQ.efOvPslpbNBrhjRw2xzylF_-ReYjDwCyFQ0D6tzAB-g'),
(60, NULL, NULL, 6, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo2LCJpYXQiOjE3NTk1MDYxNDgsImV4cCI6MTc1OTUxMTkwOH0.fUPTaJU8VrQmiIBNJ5QPVY5i3hA1_QpwBwo77XJDJjM'),
(61, 1, NULL, NULL, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hZG1pbiI6MX1dLCJpYXQiOjE3NTk1MDc5MzEsImV4cCI6MTc1OTUwOTM3MX0.uDevCNJuOPVkjB9q6UjoBJk374ltxXL1FJQLEs3eVl4'),
(62, NULL, NULL, 7, '192.168.1.10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo3LCJpYXQiOjE3NTk1MDg5ODAsImV4cCI6MTc1OTUxNDc0MH0.SuoZDW27pg_bBB9eEYf6ULZQQnTO-3xJSVwkd-V2zLg'),
(63, NULL, NULL, 7, '10.35.53.163', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo3LCJpYXQiOjE3NTk1MTgwODMsImV4cCI6MTc1OTUyMzg0M30.JK7WiqY-W5wcyqNqg1CEBrrGPKqvjznhC2YotgR7XDI'),
(64, NULL, NULL, 7, '10.35.53.163', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo3LCJpYXQiOjE3NTk1MjEwNzQsImV4cCI6MTc1OTUyNjgzNH0.EQGc0sIWWiTtl4cr2O41EDP4RGCr_NvzNKlTcN53lDI');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id_event` int NOT NULL,
  `id_organization` int DEFAULT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `event_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `site_plan_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `event_start` date DEFAULT NULL,
  `event_end` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id_event`, `id_organization`, `event_name`, `description`, `location`, `event_image`, `site_plan_image`, `type`, `status`, `event_start`, `event_end`, `created_at`) VALUES
(24, 11, 'RIGRIOTS ARENA', '????️ Got your ticket yet?\r\n???? Presale only IDR 55K\r\n\r\n???? 25 July 2025\r\n???? istora senayan, jakarta\r\n\r\nDon’t be the one who watches from your phone.', 'Jakarta Istora Senayan, Jl Istora Senayan, Jakarta, Jakarta Pusat, Jakarta', 'Screenshot 2025-06-17 141206_fb3f8c.png', 'Screenshot 2025-06-17 141206_c88b75.png', 'Rock', 2, '2025-07-25', '2025-07-26', '2025-06-17 14:18:06'),
(25, 11, 'unreran cup prestifal', 'Sabtu, 13 September 2025\r\n jakarta pusat', 'Jakarta Istora Senayan, Jl Istora Senayan, Jakarta, Jakarta Pusat, Jakarta', 'Screenshot 2025-06-17 141903_354e08.png', 'Screenshot 2025-06-17 141903_f38d05.png', 'Rock', 2, '2025-09-13', '2025-09-14', '2025-06-17 14:22:39'),
(26, 11, 'BARLEY HOPS', 'The full RENAISSANCE 2025 lineup is finally out! Get ready for a night of noise, lights, and unforgettable energy.\r\n\r\n???? jakarta pusar\r\n????️ June 14, 2025\r\n????️ Tickets available at yesplis.com', 'Jakarta Istora Senayan, Jl Istora Senayan, Jakarta, Jakarta Pusat, Jakarta', 'Screenshot 2025-06-17 143017_105cba.png', 'Screenshot 2025-06-17 143017_c53433.png', 'Rock', 2, '2025-06-28', '2025-06-29', '2025-06-17 14:31:55'),
(27, 11, 'DERDSOUAD', '???? July 14, 2025\r\n???? Jakarta pusat\r\n???? OFFICIAL ONLINE TICKET:', 'Jakarta Istora Senayan, Jl Istora Senayan, Jakarta, Jakarta Pusat, Jakarta', 'Screenshot 2025-06-17 142931_908934.png', 'Screenshot 2025-06-17 142931_5f1048.png', 'Rock', 2, '2025-07-14', '2025-07-15', '2025-06-17 14:34:51'),
(28, 11, 'xx', 'asdf', 'Jakarta Istora Senayan, Jl Istora Senayan, Jakarta, Jakarta Pusat, Jakarta', 'Screenshot 2025-06-18 154714_f57a59.png', 'Screenshot 2025-06-18 154714_9c0261.png', 'Rock', 2, '2025-07-18', '2025-07-19', '2025-06-18 15:59:22'),
(29, 11, 'Event Terbaru', 'Ini Event Terbaru', 'GOR Sudirman, Krombangan, Mertoyudan, Magelang, Jawa Tengah', 'bg-login_993336.jpg', 'ChatGPT Image Sep 20, 2025, 06_34_10 AM_57356a.png', 'Rock', 2, '2025-10-04', '2025-10-18', '2025-10-03 22:19:05');

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

CREATE TABLE `histories` (
  `id_history` int NOT NULL,
  `id_organization` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type_ticket` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `unique_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid` int NOT NULL DEFAULT '0',
  `used` int NOT NULL DEFAULT '0',
  `datetime` datetime DEFAULT NULL,
  `id_ticket` int DEFAULT NULL,
  `midtrans_order_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `midtrans_snap_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `midtrans_redirect_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `histories`
--

INSERT INTO `histories` (`id_history`, `id_organization`, `id_user`, `event_name`, `type_ticket`, `price`, `amount`, `total`, `unique_code`, `paid`, `used`, `datetime`, `id_ticket`, `midtrans_order_id`, `midtrans_snap_token`, `midtrans_redirect_url`) VALUES
(50, 11, 7, 'Event Terbaru', 'Show', 100000.00, 1, 100004.00, '50/7/11/34/34/1/2025-10-03', 4, 0, '2025-10-04 02:27:11', 34, 'trx-7-34-100004', '6f291f2c-8340-42d3-a0bb-d0c7cb6f1825', 'https://app.sandbox.midtrans.com/snap/v4/redirection/6f291f2c-8340-42d3-a0bb-d0c7cb6f1825'),
(55, 11, 7, 'Event Terbaru', 'Show', 100000.00, 1, 100086.00, '55/7/11/29/34/1/2025-10-03', 4, 0, '2025-10-04 03:01:52', 34, 'trx-7-34-100086', '0423166a-2970-40de-8b06-40f5399b475b', 'https://app.sandbox.midtrans.com/snap/v4/redirection/0423166a-2970-40de-8b06-40f5399b475b'),
(57, 11, 7, 'Event Terbaru', 'Show', 100000.00, 1, 100077.00, '57/7/11/29/34/1/2025-10-03', 4, 0, '2025-10-04 03:04:13', 34, 'trx-7-34-100077', '6518d0c4-6827-4396-8244-40623e8881d1', 'https://app.sandbox.midtrans.com/snap/v4/redirection/6518d0c4-6827-4396-8244-40623e8881d1'),
(58, 11, 7, 'Event Terbaru', 'Show', 100000.00, 1, 100065.00, NULL, 1, 0, '2025-10-04 03:05:34', 34, 'trx-7-34-100065', 'c91cd7b7-4031-44f0-98c8-f4467bc3d89e', 'https://app.sandbox.midtrans.com/snap/v4/redirection/c91cd7b7-4031-44f0-98c8-f4467bc3d89e'),
(59, 11, 7, 'Event Terbaru', 'Show', 100000.00, 1, 100003.00, NULL, 0, 0, '2025-10-04 02:07:30', 34, 'trx-7-34-100003', '91ccda91-65c7-4540-8b65-f7ae27f926d4', 'https://app.sandbox.midtrans.com/snap/v4/redirection/91ccda91-65c7-4540-8b65-f7ae27f926d4');

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id_organization` int NOT NULL,
  `organization_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ktp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legality_letter` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id_organization`, `organization_name`, `email`, `phone`, `password`, `logo`, `ktp`, `legality_letter`, `status`) VALUES
(11, 'The Organisasi', 'organisasi@example.com', '62812345678', '25d55ad283aa400af464c76d713c07ad', 'ChatGPT Image Sep 20, 2025, 06_34_10 AM_572381.png', 'Screenshot 2025-03-16 014448_1f9613.png', 'Screenshot 2025-03-16 014540_479f59.png', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id_ticket` int NOT NULL,
  `id_event` int DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `sold` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id_ticket`, `id_event`, `type`, `amount`, `sold`, `price`, `date_start`, `date_end`) VALUES
(30, 24, 'VIP', 1000, 0, 100000.00, '2025-07-24 18:17:00', '2025-07-25 16:17:00'),
(31, 25, 'VIP', 1000, 12, 100000.00, '2025-09-12 18:40:00', '2025-09-13 16:41:00'),
(32, 28, 'VIP', 10000, 0, 100000.00, '2025-07-17 18:06:00', '2025-07-18 16:06:00'),
(33, 26, 'VIP', 1000, 0, 100000.00, '2025-06-27 18:00:00', '2025-06-28 16:00:00'),
(34, 29, 'Show', 40, 14, 100000.00, '2025-10-04 22:20:00', '2025-10-13 22:20:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `fullname`, `email`, `phone`, `password`) VALUES
(7, 'Akbar', 'akbar@gmail.com', '08512345678', '25d55ad283aa400af464c76d713c07ad');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `akses_token`
--
ALTER TABLE `akses_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`),
  ADD KEY `id_organization` (`id_organization`);

--
-- Indexes for table `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id_history`),
  ADD KEY `id_organization` (`id_organization`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id_organization`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_event` (`id_event`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `akses_token`
--
ALTER TABLE `akses_token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id_event` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `histories`
--
ALTER TABLE `histories`
  MODIFY `id_history` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id_organization` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_ticket` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`id_organization`) REFERENCES `organizations` (`id_organization`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `histories`
--
ALTER TABLE `histories`
  ADD CONSTRAINT `histories_ibfk_1` FOREIGN KEY (`id_organization`) REFERENCES `organizations` (`id_organization`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `histories_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_event`) REFERENCES `events` (`id_event`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
