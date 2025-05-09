-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 16, 2024 at 02:05 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flapicms7`
--

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adonis_schema`
--

INSERT INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, 'database/migrations/1731646515960_create_user_roles_table', 1, '2024-11-18 05:56:36'),
(2, 'database/migrations/1731646515961_create_users_table', 1, '2024-11-18 05:56:37'),
(3, 'database/migrations/1731646516076_create_access_tokens_table', 1, '2024-11-18 05:56:38'),
(4, 'database/migrations/1731908242798_create_subscriptions_table', 1, '2024-11-18 05:56:38'),
(5, 'database/migrations/1731945723700_create_user_subscriptions_table', 2, '2024-11-18 16:49:56'),
(6, 'database/migrations/1732351940139_create_payments_table', 3, '2024-12-13 08:03:42'),
(7, 'database/migrations/1734074544172_create_password_resets_table', 3, '2024-12-13 08:03:42'),
(12, 'database/migrations/1734111461641_create_profiles_table', 4, '2024-12-16 07:58:22');

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema_versions`
--

CREATE TABLE `adonis_schema_versions` (
  `version` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adonis_schema_versions`
--

INSERT INTO `adonis_schema_versions` (`version`) VALUES
(2);

-- --------------------------------------------------------

--
-- Table structure for table `auth_access_tokens`
--

CREATE TABLE `auth_access_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `tokenable_id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `abilities` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_access_tokens`
--

INSERT INTO `auth_access_tokens` (`id`, `tokenable_id`, `type`, `name`, `hash`, `abilities`, `created_at`, `updated_at`, `last_used_at`, `expires_at`) VALUES
(1, 1, 'auth_token', NULL, '88d6300fc1762854ef4dea8fdba23ac146ebdc589d9483e803a30773f35d203e', '[\"*\"]', '2024-11-18 07:04:49', '2024-11-18 00:59:17', '2024-11-18 01:04:49', NULL),
(2, 1, 'auth_token', NULL, 'f1d88ec34c0495b522a1198d0d00b06365a22521ced19a43ba8d52f3e53fa5dc', '[\"*\"]', '2024-11-18 07:12:14', '2024-11-18 01:05:06', '2024-11-18 01:12:14', NULL),
(3, 1, 'auth_token', NULL, '8ccb4d8e58021a476201e280edf2c9ede4672cad268215235798acc580b99f27', '[\"*\"]', '2024-11-18 07:14:44', '2024-11-18 01:12:59', '2024-11-18 01:14:44', NULL),
(4, 2, 'auth_token', NULL, 'c023bcc4ce09c637476d4cd9d509d625c77307af6aa23b475417da1f2f9ec640', '[\"*\"]', '2024-11-18 07:15:04', '2024-11-18 01:14:58', '2024-11-18 01:15:04', NULL),
(5, 1, 'auth_token', NULL, '944b1d9f75452c5adf06fe1c7d8960879ef2740771ede2e054acc2cb4d635d76', '[\"*\"]', '2024-11-18 09:22:57', '2024-11-18 01:15:57', '2024-11-18 03:22:57', NULL),
(6, 2, 'auth_token', NULL, '0650fe0612529ada9d950063d6799c4149879aa5d270fd96b5113b356a5fa218', '[\"*\"]', '2024-11-18 09:33:32', '2024-11-18 03:23:22', '2024-11-18 03:33:32', NULL),
(7, 2, 'auth_token', NULL, '5ae0d0e42aedda94017c84b88d89d16f12978ea50d53a63426502c35c677b0dc', '[\"*\"]', '2024-11-18 09:38:54', '2024-11-18 03:38:42', '2024-11-18 03:38:54', NULL),
(8, 2, 'auth_token', NULL, '2e48369672c16d93eae69362c6ed7460d942c53ac1d80da841b589eac30a07dc', '[\"*\"]', '2024-11-18 09:39:25', '2024-11-18 03:39:25', '2024-11-18 03:39:25', NULL),
(9, 2, 'auth_token', NULL, 'e9f40324c9f802eda950a377b3db75706fc57747992df10b6a17887cd5892631', '[\"*\"]', '2024-11-18 09:39:52', '2024-11-18 03:39:51', '2024-11-18 03:39:52', NULL),
(10, 2, 'auth_token', NULL, '119265b6788acde9015c40cebe94e7df6528b385f1d81cf0bb1aafe885501182', '[\"*\"]', '2024-11-18 09:40:46', '2024-11-18 03:40:45', '2024-11-18 03:40:46', NULL),
(11, 1, 'auth_token', NULL, 'f2b6957dc1ffcb2cf8a003b3c738c4205cfed49200db125bbdca29e5e8c77ecf', '[\"*\"]', '2024-11-18 09:42:29', '2024-11-18 03:41:50', '2024-11-18 03:42:29', NULL),
(12, 2, 'auth_token', NULL, 'f71f3dc8652ddcefd9c00df787e3832e9df25b75d11ff8730a667563109af005', '[\"*\"]', '2024-11-18 09:44:49', '2024-11-18 03:44:49', '2024-11-18 03:44:49', NULL),
(13, 2, 'auth_token', NULL, 'a0b18cbab44e38cbf4d1dd3d93eeb719b358fbe5c7e2a41e4fb2d2c53dd11e88', '[\"*\"]', '2024-11-18 15:40:52', '2024-11-18 03:45:05', '2024-11-18 09:40:52', NULL),
(14, 1, 'auth_token', NULL, '669194e5b205c7bfe0a0ff8d83d282d60a9709ab9dd3edd55f4e3c991491988d', '[\"*\"]', '2024-11-19 04:34:10', '2024-11-18 09:41:07', '2024-11-18 22:34:09', NULL),
(15, 2, 'auth_token', NULL, '1e65e71384abd6d2115373f66bddbb5d0015a7fc2ad271e34a384ba642978051', '[\"*\"]', '2024-11-19 04:26:53', '2024-11-18 22:26:52', '2024-11-18 22:26:53', NULL),
(16, 2, 'auth_token', NULL, '0c90c457b5c659c2f8601bef44bf701488c4fbf4cce0328358ba89a2ef5b015f', '[\"*\"]', '2024-11-19 07:17:01', '2024-11-18 22:26:52', '2024-11-19 01:17:01', NULL),
(17, 2, 'auth_token', NULL, 'e7caa58a4b231d39c57c66e6fef1c9e631a1641be8f2a358303e9f5a0d743549', '[\"*\"]', '2024-11-19 08:37:02', '2024-11-19 01:17:11', '2024-11-19 02:37:02', NULL),
(18, 1, 'auth_token', NULL, '601705903656ffb84c1424985c47e27caab8684df30f3d959e1a03ca6f841df3', '[\"*\"]', '2024-11-19 08:40:51', '2024-11-19 02:37:20', '2024-11-19 02:40:51', NULL),
(19, 3, 'auth_token', NULL, 'd9cb1b12f40fc6a38f8c58747a3df0911eb71c5cde8c9639f94505076ec82f69', '[\"*\"]', '2024-11-19 08:48:36', '2024-11-19 02:41:39', '2024-11-19 02:48:36', NULL),
(20, 1, 'auth_token', NULL, '03eb1563bed7af980ee8971ad2f7d9a0ba13783ecdcb6501db675d9c3b94f5bc', '[\"*\"]', '2024-12-04 09:14:56', '2024-11-19 02:50:07', '2024-12-04 03:14:56', NULL),
(21, 2, 'auth_token', NULL, '7cf761192a13a75e9119e74fb6b28bdd4e18876fa6bf3ad31357d1d6683e7909', '[\"*\"]', '2024-12-04 09:51:19', '2024-12-04 03:46:13', '2024-12-04 03:51:19', NULL),
(22, 2, 'auth_token', NULL, '9d1caaf8c6522e24ddafef854d17c31e168488ba482c90be9fbe7b89a97a5b73', '[\"*\"]', '2024-12-04 09:48:44', '2024-12-04 03:48:44', '2024-12-04 03:48:44', NULL),
(23, 2, 'auth_token', NULL, '3e6e2294a4b450af381a325e8adfb282cfc58373fc3c6b7cabe59007152d9f55', '[\"*\"]', '2024-12-04 09:51:18', '2024-12-04 03:51:18', '2024-12-04 03:51:18', NULL),
(24, 2, 'auth_token', NULL, '09c4fcd7fb5ecb57ba5be351eac196ce690a963108e1bc227d78ac5d61adb8a5', '[\"*\"]', '2024-12-04 09:53:00', '2024-12-04 03:52:59', '2024-12-04 03:53:00', NULL),
(25, 2, 'auth_token', NULL, 'be83b045d20d9d3b9cbd8f0606ab0aaf98c9d0a5e49b8ed5ab09d40eda882456', '[\"*\"]', '2024-12-04 09:55:15', '2024-12-04 03:55:14', '2024-12-04 03:55:15', NULL),
(26, 2, 'auth_token', NULL, '01590e00b88562c1348c2c7c021cfc386ab85e0a679c58b64a82399b14c77ec3', '[\"*\"]', '2024-12-04 09:55:33', '2024-12-04 03:55:32', '2024-12-04 03:55:33', NULL),
(27, 2, 'auth_token', NULL, 'd74c588dcc7c860eb890f65b08d94f2b731cdf16fd550ca77dd60ac2e335040b', '[\"*\"]', '2024-12-04 09:55:57', '2024-12-04 03:55:46', '2024-12-04 03:55:57', NULL),
(28, 2, 'auth_token', NULL, 'a9b77a54eec7a7150b5c0c58ea3d923f411230222338f678322f76b66058e2fc', '[\"*\"]', '2024-12-04 09:55:59', '2024-12-04 03:55:59', '2024-12-04 03:55:59', NULL),
(29, 2, 'auth_token', NULL, '21948c4087e02697a750ad07f14b39ca7803e93cd159fe6e6aece557478088df', '[\"*\"]', '2024-12-04 09:59:10', '2024-12-04 03:59:03', '2024-12-04 03:59:10', NULL),
(30, 2, 'auth_token', NULL, '251fdc15057e47bddc9fdef965a7e0a65d8661b58d3bd57cb98c968ed9f6c2f3', '[\"*\"]', '2024-12-04 10:03:10', '2024-12-04 03:59:10', '2024-12-04 04:03:10', NULL),
(31, 2, 'auth_token', NULL, 'a957e6743b3a76b945b0f2d7eb58d847b308ac7ab5536992f131d627d537a5b4', '[\"*\"]', '2024-12-04 10:03:11', '2024-12-04 04:03:10', '2024-12-04 04:03:11', NULL),
(32, 3, 'auth_token', NULL, '916690637b1ac51224edc38f5d7276ea79e10d09f91504f36a7d53f04af8b995', '[\"*\"]', '2024-12-04 10:05:03', '2024-12-04 04:03:43', '2024-12-04 04:05:03', NULL),
(33, 1, 'auth_token', NULL, '0782367c92e1e54e30e0e87264ef8b0ed97f2f845a9b31e6771cb67e4385c49c', '[\"*\"]', '2024-12-04 10:05:18', '2024-12-04 04:05:03', '2024-12-04 04:05:18', NULL),
(34, 1, 'auth_token', NULL, '4d26e4b60923c4c60f18773bdb90f43cb2a839941455db6527a4897b536a36b1', '[\"*\"]', '2024-12-04 04:05:18', '2024-12-04 04:05:18', NULL, NULL),
(35, 2, 'auth_token', NULL, 'd66c85f2d56626c77e84fafa192386e27097127f2f9e9130493fd7a38e3f33e0', '[\"*\"]', '2024-12-04 10:07:05', '2024-12-04 04:07:01', '2024-12-04 04:07:05', NULL),
(36, 2, 'auth_token', NULL, '7d6b13ccf9614044e62ba138c79a4da8dd7f7d5c905cf7f65c89c6a672767898', '[\"*\"]', '2024-12-04 10:07:05', '2024-12-04 04:07:04', '2024-12-04 04:07:05', NULL),
(37, 2, 'auth_token', NULL, 'c8adff8fda3a9ff457f253495a6fd276df4e8a4137900a9251e09fbf8b5eae2c', '[\"*\"]', '2024-12-04 10:07:23', '2024-12-04 04:07:20', '2024-12-04 04:07:23', NULL),
(38, 2, 'auth_token', NULL, '2d416416c1cc0830de17b5023c6ff09e537f8f46fa0b194a8a7523fda12844b9', '[\"*\"]', '2024-12-04 12:50:39', '2024-12-04 04:07:23', '2024-12-04 06:50:39', NULL),
(39, 2, 'auth_token', NULL, 'c59d8bfc6c276e85431a1b66724aa1724b5d6b6c35c05ae07158c7fb2da4e5eb', '[\"*\"]', '2024-12-04 12:50:40', '2024-12-04 06:50:38', '2024-12-04 06:50:40', NULL),
(40, 2, 'auth_token', NULL, 'fda5053e6406bd831fe1cdf21cebafb174ada9f307531e006667102919028df1', '[\"*\"]', '2024-12-04 06:51:13', '2024-12-04 06:51:13', NULL, NULL),
(41, 2, 'auth_token', NULL, 'ce80e90a01a9c479f283b0fc1914b7456a087eb7b8540f4e222e48118968e343', '[\"*\"]', '2024-12-04 12:52:49', '2024-12-04 06:52:48', '2024-12-04 06:52:49', NULL),
(42, 2, 'auth_token', NULL, 'a2bcbd5d3d64bdfb4b45938602b9bf05e0721baaa28745b7b8cecb2d0415b971', '[\"*\"]', '2024-12-04 12:55:34', '2024-12-04 06:53:23', '2024-12-04 06:55:34', NULL),
(43, 2, 'auth_token', NULL, '5e61c75899249d25f0caa041b0e6d5585a03f8ff30cc02de1f30fe1a1f45c13f', '[\"*\"]', '2024-12-04 12:55:43', '2024-12-04 06:55:42', '2024-12-04 06:55:43', NULL),
(44, 2, 'auth_token', NULL, '8c696b368d2eeae07745f89a8859d66be49717e058cfcdca2e3ad194e10543db', '[\"*\"]', '2024-12-04 13:01:01', '2024-12-04 06:56:05', '2024-12-04 07:01:01', NULL),
(45, 2, 'auth_token', NULL, '3d9a4f3d9af383032a2c0fe0755178ec03440274396b96383a16f333d0b26669', '[\"*\"]', '2024-12-04 07:01:00', '2024-12-04 07:01:00', NULL, NULL),
(46, 2, 'auth_token', NULL, 'b90adfc9856aa7e97697732a753b8ecd20cf616d3386f1eeed3ee1990f7a6cf2', '[\"*\"]', '2024-12-04 07:01:21', '2024-12-04 07:01:21', NULL, NULL),
(47, 2, 'auth_token', NULL, 'a2152ea3717f0c6cb6104f60e658416cd87f2c72d1425d2ee1dccd883e3495ee', '[\"*\"]', '2024-12-04 07:01:29', '2024-12-04 07:01:29', NULL, NULL),
(48, 2, 'auth_token', NULL, '5e2e3fa59c4084e9e9193fbd94297630b03ab057445614113f9050de9c9086b9', '[\"*\"]', '2024-12-04 07:06:45', '2024-12-04 07:06:45', NULL, NULL),
(49, 2, 'auth_token', NULL, 'abb2415fbf46417e7b781260eec94576a8e7c718378f98f71ed0f69b0cfbe8a6', '[\"*\"]', '2024-12-04 13:07:14', '2024-12-04 07:06:48', '2024-12-04 07:07:14', NULL),
(50, 2, 'auth_token', NULL, 'c6bfbb8b1e0c3a0932661902d88305bb3abd4ad35576f6a217adf5b17a5f6d4c', '[\"*\"]', '2024-12-04 07:07:13', '2024-12-04 07:07:13', NULL, NULL),
(51, 2, 'auth_token', NULL, '9e5bb53ef182e348c9429d840f544e3fdd9fdda73de92f686e06d7cb46ca16b1', '[\"*\"]', '2024-12-04 13:13:02', '2024-12-04 07:07:40', '2024-12-04 07:13:02', NULL),
(52, 2, 'auth_token', NULL, '494dd5c33d1aa384fb982c303a9df888aa655566779996b2c3a64856448cb926', '[\"*\"]', '2024-12-04 13:13:08', '2024-12-04 07:13:05', '2024-12-04 07:13:08', NULL),
(53, 2, 'auth_token', NULL, 'fa4426d6dfa993f2323ffb0370e340565bf2bc9b5954d15df6e26828913ad45a', '[\"*\"]', '2024-12-04 13:19:11', '2024-12-04 07:13:39', '2024-12-04 07:19:11', NULL),
(54, 2, 'auth_token', NULL, '52dde0a0968cb69841f03bd106ad32644e1850c6bdd15de0ff108c983077f00b', '[\"*\"]', '2024-12-04 13:28:18', '2024-12-04 07:27:45', '2024-12-04 07:28:18', NULL),
(55, 2, 'auth_token', NULL, '9dd2c870cfc36702bb1e93d32c4ecd346999cc1e59c4d329089ac79a732ac064', '[\"*\"]', '2024-12-04 13:32:11', '2024-12-04 07:28:53', '2024-12-04 07:32:11', NULL),
(56, 2, 'auth_token', NULL, '73b477e46d5ad5002bd3b3fcba421dbb5af7f670445278633028b6262dca5f4f', '[\"*\"]', '2024-12-04 13:32:11', '2024-12-04 07:32:11', '2024-12-04 07:32:11', NULL),
(57, 2, 'auth_token', NULL, 'd603c969e25b1e192d60082b0aac43953e309de12dc918016d6ef2ade0f7bbd4', '[\"*\"]', '2024-12-04 13:32:49', '2024-12-04 07:32:43', '2024-12-04 07:32:49', NULL),
(58, 2, 'auth_token', NULL, '62964179e7d5140ce93028ae16aa33b386eca5d9c8943f623342c4242d59beff', '[\"*\"]', '2024-12-04 13:32:56', '2024-12-04 07:32:49', '2024-12-04 07:32:56', NULL),
(59, 2, 'auth_token', NULL, '461b9b914359778e0ba021ceb5f7ccbe0353f59ce1ae800f7cbef44a2fa54192', '[\"*\"]', '2024-12-04 13:33:56', '2024-12-04 07:32:56', '2024-12-04 07:33:56', NULL),
(60, 2, 'auth_token', NULL, '4e78aebca1ae4f7969feb46e27d7e2e349c5216feb7ed4228f4142e3c84a75d8', '[\"*\"]', '2024-12-04 13:33:56', '2024-12-04 07:33:55', '2024-12-04 07:33:56', NULL),
(61, 2, 'auth_token', NULL, 'dd8b0b640a76c1b534d7d80b63b34c25440a37b9e78e53ad0990c59aa765f965', '[\"*\"]', '2024-12-04 13:34:19', '2024-12-04 07:34:16', '2024-12-04 07:34:19', NULL),
(62, 2, 'auth_token', NULL, '112e8a3e2806ef0f09131cfcd31a4848cbfd15b1827abefe3308dbc0bd6eb4ca', '[\"*\"]', '2024-12-04 13:34:30', '2024-12-04 07:34:19', '2024-12-04 07:34:30', NULL),
(63, 2, 'auth_token', NULL, '75c5a18b4a1661fedd1d497e352e8acfc52e1ae4b5d12e5f47223662db1c67ce', '[\"*\"]', '2024-12-04 13:35:10', '2024-12-04 07:34:30', '2024-12-04 07:35:10', NULL),
(64, 2, 'auth_token', NULL, 'dc5a25a57544a5a3f65cca985fa4328a13082a787b287ea81301a447c8bd2c7b', '[\"*\"]', '2024-12-04 13:35:11', '2024-12-04 07:35:09', '2024-12-04 07:35:11', NULL),
(65, 2, 'auth_token', NULL, '0b116b8213e09856f6735d9a23b7e7cfc571c22a05fff8bc730352455eb0e4d1', '[\"*\"]', '2024-12-04 13:35:34', '2024-12-04 07:35:31', '2024-12-04 07:35:34', NULL),
(66, 2, 'auth_token', NULL, '6a3a368625b8d5af6ff8114d51aa011381ecfe0291618a5c7307c1b97f8687ee', '[\"*\"]', '2024-12-04 13:39:57', '2024-12-04 07:35:34', '2024-12-04 07:39:57', NULL),
(67, 2, 'auth_token', NULL, '3d8188cd4de439839329ed307e3ea48eb826f951a836709e8671b3977cfedac6', '[\"*\"]', '2024-12-04 13:39:58', '2024-12-04 07:39:57', '2024-12-04 07:39:58', NULL),
(68, 2, 'auth_token', NULL, '775498a564a838e8c31372f702472fdec176832dc9861980e9763bf1915483d9', '[\"*\"]', '2024-12-04 13:40:43', '2024-12-04 07:40:36', '2024-12-04 07:40:43', NULL),
(69, 2, 'auth_token', NULL, '2bd1ce0dc873e14b1d02c38d4530d58446d35b9fcfd4c350d296f394fdcd9ce9', '[\"*\"]', '2024-12-04 13:42:17', '2024-12-04 07:40:43', '2024-12-04 07:42:17', NULL),
(70, 2, 'auth_token', NULL, '58ae74427203fb97d9a2e0531d0ce6dc38bf46e18fe910425409fca02ec586a3', '[\"*\"]', '2024-12-04 07:42:16', '2024-12-04 07:42:16', NULL, NULL),
(71, 2, 'auth_token', NULL, '73367470bfda68f40865812ec8f2dbc347b3f2d8a1e0c2e461d4e7bce97c14e7', '[\"*\"]', '2024-12-04 07:42:35', '2024-12-04 07:42:35', NULL, NULL),
(72, 2, 'auth_token', NULL, '5906a85827128939e16942fa9bdc8c71996371c33c2d98ac42b6e3cf20b8bf60', '[\"*\"]', '2024-12-04 07:42:38', '2024-12-04 07:42:38', NULL, NULL),
(73, 2, 'auth_token', NULL, '3a37ce6babefc90e47049504da9bae91fa55ac6470d598c62ae45ba941ef2450', '[\"*\"]', '2024-12-04 13:43:49', '2024-12-04 07:42:41', '2024-12-04 07:43:49', NULL),
(74, 2, 'auth_token', NULL, '9459beaff7445779485090bdaef484f7e1c7bbd5d54cb4ee5064f126eab9839b', '[\"*\"]', '2024-12-04 07:43:49', '2024-12-04 07:43:49', NULL, NULL),
(75, 2, 'auth_token', NULL, '56a27ec320bcc594d5f9cab50a1c65a93b5b11f384c29029b2281e3c8f7f1867', '[\"*\"]', '2024-12-04 07:48:35', '2024-12-04 07:48:35', NULL, NULL),
(76, 2, 'auth_token', NULL, 'aacd584bee60cb4bbf637b7d5fe0eb756e2e2374f1bf3a70253efda1000bf5c9', '[\"*\"]', '2024-12-04 07:48:38', '2024-12-04 07:48:38', NULL, NULL),
(77, 2, 'auth_token', NULL, '26800b81088aa29bd0ce1c11c83b4092c8c78197e64cdf91f95f23ce0185a14e', '[\"*\"]', '2024-12-04 13:49:13', '2024-12-04 07:48:40', '2024-12-04 07:49:13', NULL),
(78, 2, 'auth_token', NULL, '29693d92b80d3eebcdbb9eb491b1b7b1a096b5f4738f2696b19ac40243dc3edd', '[\"*\"]', '2024-12-04 13:49:22', '2024-12-04 07:49:13', '2024-12-04 07:49:22', NULL),
(79, 2, 'auth_token', NULL, 'b2927c672a35d9581b965acad97eedf55857b6a864533aa8eb4322668a6b753c', '[\"*\"]', '2024-12-04 13:49:43', '2024-12-04 07:49:40', '2024-12-04 07:49:43', NULL),
(80, 2, 'auth_token', NULL, '07c9c6c6a73688fce89c20a2594bbb07a235da308eb6d786b8ca2004b9567c91', '[\"*\"]', '2024-12-04 13:49:52', '2024-12-04 07:49:43', '2024-12-04 07:49:52', NULL),
(81, 2, 'auth_token', NULL, '698c3192e9dfcd9812c7a3b0371eb96db2ffc6dca458dfa58d32422d94174cf6', '[\"*\"]', '2024-12-04 13:50:22', '2024-12-04 07:50:20', '2024-12-04 07:50:22', NULL),
(82, 2, 'auth_token', NULL, '362527820a0523a25d46432caa4edfde791a2a43ceee6fe2ad51a6644e1991ed', '[\"*\"]', '2024-12-04 13:50:28', '2024-12-04 07:50:22', '2024-12-04 07:50:28', NULL),
(83, 2, 'auth_token', NULL, 'f08296d7573756d5c3176e5d9d56e775193e6db8d1044a9ebd40159a5294054f', '[\"*\"]', '2024-12-04 13:53:59', '2024-12-04 07:53:58', '2024-12-04 07:53:59', NULL),
(84, 2, 'auth_token', NULL, '3a3ce76d15a4c31b8de7d31e6ad327f168a15ed722f730cbabcbd80ae5610300', '[\"*\"]', '2024-12-04 13:54:09', '2024-12-04 07:53:58', '2024-12-04 07:54:09', NULL),
(85, 2, 'auth_token', NULL, 'ea142d3aacff0a0b926b91a5665d64293290234ce4bedda6530327be8766c4ec', '[\"*\"]', '2024-12-04 13:54:41', '2024-12-04 07:54:40', '2024-12-04 07:54:41', NULL),
(86, 2, 'auth_token', NULL, '11adfabd1c73bc8c30b2dc0838227050c9387b61a0e64b3628f946d38edb9ae0', '[\"*\"]', '2024-12-04 13:54:49', '2024-12-04 07:54:41', '2024-12-04 07:54:49', NULL),
(87, 2, 'auth_token', NULL, '9db401d466ebf995c924741a30b3a7ce23eba721e3aae65c12e90ce6e1eb45e9', '[\"*\"]', '2024-12-04 13:55:10', '2024-12-04 07:55:09', '2024-12-04 07:55:10', NULL),
(88, 2, 'auth_token', NULL, '87fe7669224dc913fe705db194c6df7973dd878859672672b9946dd86acf4fd5', '[\"*\"]', '2024-12-04 13:55:36', '2024-12-04 07:55:09', '2024-12-04 07:55:36', NULL),
(89, 3, 'auth_token', NULL, '1b5928cc41795947aade8f965ad98f6dc1792e819d1839959444699bc2eec86e', '[\"*\"]', '2024-12-04 13:57:52', '2024-12-04 07:57:51', '2024-12-04 07:57:52', NULL),
(90, 3, 'auth_token', NULL, '057cf9e772d6fd845d6c4bb522c8a98ce4fd73d0e921a147c1413c7de69164bd', '[\"*\"]', '2024-12-04 13:58:02', '2024-12-04 07:57:52', '2024-12-04 07:58:02', NULL),
(91, 2, 'auth_token', NULL, 'bcaaad735324f4a6a3f3f32cae2bf0f4789a671b8ca3d763d3a7c6c8a99af9f9', '[\"*\"]', '2024-12-04 13:58:17', '2024-12-04 07:58:17', '2024-12-04 07:58:17', NULL),
(92, 2, 'auth_token', NULL, '5f9978e222797d328db1c537445b4a9fa5810990fa829f34f69c016045fc14d2', '[\"*\"]', '2024-12-04 13:58:39', '2024-12-04 07:58:17', '2024-12-04 07:58:39', NULL),
(93, 3, 'auth_token', NULL, '9d442f2f8af2fbc5b2654c409e082b88aa0c61e7c1b805228381d6ac3d5890ab', '[\"*\"]', '2024-12-04 13:59:13', '2024-12-04 07:59:12', '2024-12-04 07:59:13', NULL),
(94, 3, 'auth_token', NULL, '6d368dfd27b45eb60a465f8d2300fa523c1a17e8e4de079f114070931502603f', '[\"*\"]', '2024-12-04 13:59:43', '2024-12-04 07:59:13', '2024-12-04 07:59:43', NULL),
(95, 9, 'auth_token', NULL, '372cfe3dbfb5d7d1dcc7b925062c919a6d0a18853675245b642ba581c2231ced', '[\"*\"]', '2024-12-04 14:00:28', '2024-12-04 08:00:27', '2024-12-04 08:00:28', NULL),
(96, 9, 'auth_token', NULL, '1edc822f4e9eb55b7f61d6ec26bd55cddbb2e15a9ee697debd8a8c3b828612d0', '[\"*\"]', '2024-12-04 14:01:08', '2024-12-04 08:00:27', '2024-12-04 08:01:08', NULL),
(97, 1, 'auth_token', NULL, 'c77bcd4cbc6ebcc8426b90a9b38d57b4cdb1db6e783086c3b8470cddab5a4884', '[\"*\"]', '2024-12-04 14:14:32', '2024-12-04 08:14:31', '2024-12-04 08:14:32', NULL),
(98, 1, 'auth_token', NULL, '23a4c7a6cb15274aafd89d9d72098b0c6232dd28f7f640975638e7e70b850c7c', '[\"*\"]', '2024-12-04 14:16:45', '2024-12-04 08:14:32', '2024-12-04 08:16:45', NULL),
(99, 2, 'auth_token', NULL, 'a947d03dbb4e49cb5e0cb8e08a57fb410ac34dc466e9f458ab39a38d07f7f906', '[\"*\"]', '2024-12-04 14:23:56', '2024-12-04 08:23:56', '2024-12-04 08:23:56', NULL),
(100, 2, 'auth_token', NULL, '50395a71804429d650d29161c997cbf14ce2ac824ae091a037f51c3cf1febacc', '[\"*\"]', '2024-12-04 14:24:26', '2024-12-04 08:23:56', '2024-12-04 08:24:26', NULL),
(101, 9, 'auth_token', NULL, '4e50f7a5dc9ed19161d049bfcd71f85f8db683c9f43160979124890a75a05b2b', '[\"*\"]', '2024-12-04 14:25:40', '2024-12-04 08:25:40', '2024-12-04 08:25:40', NULL),
(102, 9, 'auth_token', NULL, 'b8e6f98281b732717960e5ec2d369cb86c304c6682ef65e7ecc60b80a1e20516', '[\"*\"]', '2024-12-04 14:25:47', '2024-12-04 08:25:40', '2024-12-04 08:25:47', NULL),
(103, 2, 'auth_token', NULL, '1a539505378d4fb3d5bfd044678200185c003d27dfb5c95e3cb59148b387770c', '[\"*\"]', '2024-12-04 14:25:56', '2024-12-04 08:25:56', '2024-12-04 08:25:56', NULL),
(104, 2, 'auth_token', NULL, '0a16a675743c351651c7f7a1394d680376a5527d4dc93700d6814156b3ae0173', '[\"*\"]', '2024-12-04 14:26:01', '2024-12-04 08:25:56', '2024-12-04 08:26:01', NULL),
(105, 9, 'auth_token', NULL, '98c6f850da6a371d9dbbf526ad282401e870847ff6dba51d9c3945391588c2f4', '[\"*\"]', '2024-12-04 14:26:20', '2024-12-04 08:26:19', '2024-12-04 08:26:20', NULL),
(106, 9, 'auth_token', NULL, '67396b27ff3c3fe133bd61b44485a72ce6cc2133a0bf5b0f9734db02e2dfc026', '[\"*\"]', '2024-12-04 15:46:56', '2024-12-04 08:26:20', '2024-12-04 09:46:56', NULL),
(107, 9, 'auth_token', NULL, '386c82de6770a9d908adbd6d682dee76fb2e06d5fb6556d8d2cd3a6444f63f67', '[\"*\"]', '2024-12-04 15:47:21', '2024-12-04 09:47:20', '2024-12-04 09:47:21', NULL),
(108, 9, 'auth_token', NULL, '85d927396567f98475e7f9229003c3c587ac44de6202424f3cbc653585f00e5f', '[\"*\"]', '2024-12-05 06:21:14', '2024-12-04 09:47:21', '2024-12-05 00:21:14', NULL),
(109, 2, 'auth_token', NULL, 'cd34e032df84585e4d332d9a9461ca72938916b4b2a74a76443f0b83673aa7e2', '[\"*\"]', '2024-12-05 09:28:07', '2024-12-05 03:28:07', '2024-12-05 03:28:07', NULL),
(110, 2, 'auth_token', NULL, '974af0906a939a45e9b726d9df3b8521d5165ec03bdd11491ed62ecdf8111564', '[\"*\"]', '2024-12-05 09:34:02', '2024-12-05 03:28:07', '2024-12-05 03:34:02', NULL),
(111, 2, 'auth_token', NULL, '50ea1ac0dd28f0353757f51cdb175e1f85c8cc1c56f771e911bb461db664397f', '[\"*\"]', '2024-12-05 09:40:44', '2024-12-05 03:40:44', '2024-12-05 03:40:44', NULL),
(112, 2, 'auth_token', NULL, 'ab60c62754413bc9c5c7544908d118237671e750dc1137e37ded1848e16c1e1a', '[\"*\"]', '2024-12-05 09:53:23', '2024-12-05 03:40:44', '2024-12-05 03:53:23', NULL),
(113, 2, 'auth_token', NULL, '247d8c8948b1183826da2dc97f9b6393224b54ad23d21944345f2d759fe108e7', '[\"*\"]', '2024-12-05 10:03:01', '2024-12-05 04:03:00', '2024-12-05 04:03:01', NULL),
(114, 2, 'auth_token', NULL, '8a4a1769b0a39894627747495b3f01c31907bbfbdb25c4ac5e1b79b1a883af70', '[\"*\"]', '2024-12-05 10:03:05', '2024-12-05 04:03:01', '2024-12-05 04:03:05', NULL),
(115, 2, 'auth_token', NULL, '9e9a4fdb3ed938dc99c36438c43808a813cf12f9c6ef798366da8ae22f9014f4', '[\"*\"]', '2024-12-05 10:06:44', '2024-12-05 04:06:43', '2024-12-05 04:06:44', NULL),
(116, 2, 'auth_token', NULL, 'd85623b067a2ba959f7cf6c4425b804434f956c6af0a50ab2489feb3c06d043a', '[\"*\"]', '2024-12-05 10:06:48', '2024-12-05 04:06:44', '2024-12-05 04:06:48', NULL),
(117, 2, 'auth_token', NULL, '49f5fc5706be8097691fbfcc07d8933213f4ddc069fb1d21297002128321dc03', '[\"*\"]', '2024-12-05 10:10:14', '2024-12-05 04:10:13', '2024-12-05 04:10:14', NULL),
(118, 2, 'auth_token', NULL, 'fbdee7f410b2bfd4d2ba650fbd4b23d9ad52957c1802e366596288e27d3e82c7', '[\"*\"]', '2024-12-05 10:13:30', '2024-12-05 04:10:14', '2024-12-05 04:13:30', NULL),
(119, 2, 'auth_token', NULL, '5f4540a9dde7ea6fdb8f48a004b3cb0d4d01b75b6f15bf83b8bd15773c249949', '[\"*\"]', '2024-12-05 10:14:49', '2024-12-05 04:14:48', '2024-12-05 04:14:49', NULL),
(120, 2, 'auth_token', NULL, 'eef3095dc0b3fd208069d633d6de1158e7230058380e097dac8eae59da618c1a', '[\"*\"]', '2024-12-05 10:14:53', '2024-12-05 04:14:49', '2024-12-05 04:14:53', NULL),
(121, 2, 'auth_token', NULL, '45ca8e57a6ff7fba69bb770e7c48ed22a6927d7ccc9a80a37a718023c18f7ff5', '[\"*\"]', '2024-12-05 10:17:41', '2024-12-05 04:17:40', '2024-12-05 04:17:41', NULL),
(122, 2, 'auth_token', NULL, 'b637a28a984b4fac643de040292913c6aec3a9fb6dd809146fbdd52aa1a5c670', '[\"*\"]', '2024-12-05 10:17:57', '2024-12-05 04:17:41', '2024-12-05 04:17:57', NULL),
(123, 2, 'auth_token', NULL, 'c4c411e858fd355d748ff4b1992cbf1154cde14e65f9f3f96cf7a889e43b4d98', '[\"*\"]', '2024-12-05 10:30:53', '2024-12-05 04:30:52', '2024-12-05 04:30:53', NULL),
(124, 2, 'auth_token', NULL, '23f4a8d245a09a68fae67e40453acb69f38b9de480eaf1aa060010971a7ea440', '[\"*\"]', '2024-12-05 10:31:17', '2024-12-05 04:30:53', '2024-12-05 04:31:17', NULL),
(125, 2, 'auth_token', NULL, '51a7c17a326a9eb06fc7182a62b7eb84ff2047f59d20155ace861efb360754bb', '[\"*\"]', '2024-12-05 10:31:52', '2024-12-05 04:31:51', '2024-12-05 04:31:52', NULL),
(126, 2, 'auth_token', NULL, '583952bfddbca4901a8f65324a71d5cd810cc76e708bd65df2f581780f3cc2b3', '[\"*\"]', '2024-12-05 10:34:45', '2024-12-05 04:31:51', '2024-12-05 04:34:45', NULL),
(127, 2, 'auth_token', NULL, '99b3a18dbf15a382e3eb7532f239e1020ae5bd3b343b54eb099e32a792043195', '[\"*\"]', '2024-12-05 10:34:56', '2024-12-05 04:34:56', '2024-12-05 04:34:56', NULL),
(128, 2, 'auth_token', NULL, '5e1557fdcf90adfe4d4cea77c67b27899d06721fb7fe6d6fdc0908bb761fb56e', '[\"*\"]', '2024-12-05 10:35:00', '2024-12-05 04:34:56', '2024-12-05 04:35:00', NULL),
(129, 2, 'auth_token', NULL, '1ef768c404df0b6f9d411a6fcd2b4519fa4b6e027703080f01493c69817c44f5', '[\"*\"]', '2024-12-05 10:37:42', '2024-12-05 04:37:42', '2024-12-05 04:37:42', NULL),
(130, 2, 'auth_token', NULL, '36f4e3cb0420f881ab4ee3637d859d597c68d53b34e893b61296b3b2a0ecacfd', '[\"*\"]', '2024-12-05 10:42:33', '2024-12-05 04:37:42', '2024-12-05 04:42:33', NULL),
(131, 3, 'auth_token', NULL, '527f90a82f447d550b1880d068eec56e937b8c0fa1d664a2d989898a131b1761', '[\"*\"]', '2024-12-05 10:44:20', '2024-12-05 04:44:19', '2024-12-05 04:44:20', NULL),
(132, 3, 'auth_token', NULL, '7b27c710744fcf5c5d711e7bfbcc400ff0ea97ae7ec781ff6e535e01645ad5cf', '[\"*\"]', '2024-12-05 10:54:46', '2024-12-05 04:44:20', '2024-12-05 04:54:46', NULL),
(133, 2, 'auth_token', NULL, '854eb88804fcb5505c5bd30b117133a9f8c7a05680971eb8457a31a1840a41e2', '[\"*\"]', '2024-12-05 10:55:41', '2024-12-05 04:55:41', '2024-12-05 04:55:41', NULL),
(134, 2, 'auth_token', NULL, 'df33551625141ca4ce73e49c280990f55f788cd44e03552f1d279b8d504b65d8', '[\"*\"]', '2024-12-05 11:02:12', '2024-12-05 04:55:41', '2024-12-05 05:02:12', NULL),
(135, 2, 'auth_token', NULL, 'fc447b8ef357af79a3594b0c9b8d0fcefc55fe8e32e563f9b7e79f56be81e8b8', '[\"*\"]', '2024-12-05 11:10:35', '2024-12-05 05:10:35', '2024-12-05 05:10:35', NULL),
(136, 2, 'auth_token', NULL, '4f816c19842313067f36e66bb512c13b750fab001d51e389e8a5db21d66e6264', '[\"*\"]', '2024-12-05 11:11:59', '2024-12-05 05:10:35', '2024-12-05 05:11:59', NULL),
(137, 2, 'auth_token', NULL, '245fb43a29b533cceadfb11aa9d5af4ce950eeebe46b609f7d6deb668da19340', '[\"*\"]', '2024-12-05 11:12:03', '2024-12-05 05:12:03', '2024-12-05 05:12:03', NULL),
(138, 2, 'auth_token', NULL, '74c2544940313bc994b3c671ddea312c9996ab7180f0fcf2b7acb400a302ccf4', '[\"*\"]', '2024-12-05 11:16:05', '2024-12-05 05:12:03', '2024-12-05 05:16:05', NULL),
(139, 2, 'auth_token', NULL, '222e3ce8949f61b240880d056ce07de7f2ed83798aee51d45acabff8c0ff40cd', '[\"*\"]', '2024-12-05 11:16:25', '2024-12-05 05:16:25', '2024-12-05 05:16:25', NULL),
(140, 2, 'auth_token', NULL, '15b89cc91e2eef0f902bf0484559f1d6f52738f95875f10598c104b2e7f70f46', '[\"*\"]', '2024-12-05 11:18:31', '2024-12-05 05:16:25', '2024-12-05 05:18:31', NULL),
(141, 2, 'auth_token', NULL, '9dc62d8aa9c336e9903720e45342550a311552cb774259ae9a8854080ed9b093', '[\"*\"]', '2024-12-05 11:31:05', '2024-12-05 05:31:04', '2024-12-05 05:31:05', NULL),
(142, 2, 'auth_token', NULL, 'f0690f34e98225f21b0f6be1c2c6375568488e1543282f9b8341c8e0fcc1a890', '[\"*\"]', '2024-12-05 13:10:26', '2024-12-05 05:31:05', '2024-12-05 07:10:26', NULL),
(143, 2, 'auth_token', NULL, '9d487fd06daf7cca32d5269520dcbecb823278c52663e7c743477fd7af771fa8', '[\"*\"]', '2024-12-05 13:10:44', '2024-12-05 07:10:44', '2024-12-05 07:10:44', NULL),
(144, 2, 'auth_token', NULL, '0f815c1326271d381c516891dfc77179124c3bfa3a9ada522ad1f5b35836fa6b', '[\"*\"]', '2024-12-13 06:24:05', '2024-12-05 07:10:44', '2024-12-13 00:24:05', NULL),
(145, 2, 'auth_token', NULL, 'eea589b30afe8eeabc70caa428c9e5e6d0ae877e88d91bcc128df179a42cb479', '[\"*\"]', '2024-12-13 06:37:34', '2024-12-13 00:37:33', '2024-12-13 00:37:34', NULL),
(146, 2, 'auth_token', NULL, 'f1efcaf1792f6b21d70fd22539eeab6b431a4a295b451325937fbce96495684c', '[\"*\"]', '2024-12-13 06:38:54', '2024-12-13 00:37:33', '2024-12-13 00:38:54', NULL),
(147, 15, 'auth_token', NULL, '4c0f19d6b305e90dab29f129f9d6131c1ef4bf96f8b4d28a5f47cee322192038', '[\"*\"]', '2024-12-13 13:59:15', '2024-12-13 07:59:12', '2024-12-13 07:59:15', NULL),
(148, 15, 'auth_token', NULL, '301fb28cabfca15b1c6e1b5e2b49cf1b8f3b8524123fdbe48b1d2e4b70958bbe', '[\"*\"]', '2024-12-13 15:27:37', '2024-12-13 07:59:13', '2024-12-13 09:27:37', NULL),
(149, 2, 'auth_token', NULL, 'd129df15524f8ae882ac55cd131500d8797a52cc64e77c3d5ebc7e304c00e0e6', '[\"*\"]', '2024-12-13 15:28:11', '2024-12-13 09:28:10', '2024-12-13 09:28:11', NULL),
(150, 2, 'auth_token', NULL, 'c0d24d97e2b22fdac051e24f5a40964f3c8b1af547dd7c39a1c506d4643647a1', '[\"*\"]', '2024-12-13 15:42:44', '2024-12-13 09:28:10', '2024-12-13 09:42:44', NULL),
(151, 15, 'auth_token', NULL, 'b8ed9caba2e74934c0458ccd1679260a777e1982f623ab8ae48cf65549db5006', '[\"*\"]', '2024-12-13 15:45:38', '2024-12-13 09:45:38', '2024-12-13 09:45:38', NULL),
(152, 15, 'auth_token', NULL, '0ea28209b9fdd3989d3504d81580d51b6521cfa4239a924c8115c9f6c3c4cf09', '[\"*\"]', '2024-12-14 06:10:01', '2024-12-13 09:45:38', '2024-12-14 00:10:01', NULL),
(153, 2, 'auth_token', NULL, '7b9df4766687ab3df9b71c879108f37719a02ba6ce896e5d2eea13fa53a8231b', '[\"*\"]', '2024-12-14 14:23:48', '2024-12-14 08:23:48', '2024-12-14 08:23:48', NULL),
(154, 2, 'auth_token', NULL, 'eb6780c24e2284ca81b6bfe5d51c5a2d400f1c0e83ffe69df2222e23c0475917', '[\"*\"]', '2024-12-14 18:08:52', '2024-12-14 08:23:48', '2024-12-14 12:08:52', NULL),
(155, 2, 'auth_token', NULL, '27b21f1efbc511cc5635b358ab6804f626de5ac4f4860933aef159af1ab2016a', '[\"*\"]', '2024-12-14 18:11:23', '2024-12-14 12:11:22', '2024-12-14 12:11:23', NULL),
(156, 2, 'auth_token', NULL, 'd1860c44cfe0804a7979a3ae8b6091efc751e7485a1772a3e58b032f31557b24', '[\"*\"]', '2024-12-14 18:21:16', '2024-12-14 12:11:22', '2024-12-14 12:21:16', NULL),
(157, 2, 'auth_token', NULL, '28cbb5928e21ef96d615b80bc59520a90829d3524967788814351eaaa5931d04', '[\"*\"]', '2024-12-14 18:21:36', '2024-12-14 12:21:36', '2024-12-14 12:21:36', NULL),
(158, 2, 'auth_token', NULL, '20258e7b47c9b0a9da4408879beaa75b6e4d87d7a683feca7d986166ebc73402', '[\"*\"]', '2024-12-15 05:23:02', '2024-12-14 12:21:36', '2024-12-14 23:23:02', NULL),
(159, 2, 'auth_token', NULL, 'f55f6bcb815e20df4ab09af532dd38a97cc1730801e621a15ec91cbe011dfba4', '[\"*\"]', '2024-12-15 05:25:28', '2024-12-14 23:25:27', '2024-12-14 23:25:28', NULL),
(161, 2, 'auth_token', NULL, 'af0a14cd56d874bf54cc866e4c3f9fdb5cca872d731ed1852e93ea9fa9c17c28', '[\"*\"]', '2024-12-15 05:39:52', '2024-12-14 23:39:51', '2024-12-14 23:39:52', NULL),
(162, 2, 'auth_token', NULL, 'f8ceb63c7d219fd2d46b9e2df43710f52f0a6a105b73915888b392923af7b5b7', '[\"*\"]', '2024-12-15 05:39:59', '2024-12-14 23:39:52', '2024-12-14 23:39:59', NULL),
(163, 2, 'auth_token', NULL, '1e5564577c4538683a03ab66b83ea594dba7426a36152273675aa7ced0b4e5f2', '[\"*\"]', '2024-12-15 05:40:16', '2024-12-14 23:40:16', '2024-12-14 23:40:16', NULL),
(165, 2, 'auth_token', NULL, '1b117c727024640b01bc7a7959e2667a27fcd9aeddda085f2ea4a3275725fc3f', '[\"*\"]', '2024-12-15 05:43:36', '2024-12-14 23:43:35', '2024-12-14 23:43:36', NULL),
(167, 2, 'auth_token', NULL, '17ca616050562ec2d427806aca53a994f3a2ca48a0f8d612fbe7a8638ded464a', '[\"*\"]', '2024-12-15 05:44:11', '2024-12-14 23:44:11', '2024-12-14 23:44:11', NULL),
(169, 3, 'auth_token', NULL, '0931b4a48dd20db8049e1afb2a774a121d5d206d8c9979ecc636f844e9970e52', '[\"*\"]', '2024-12-15 05:45:55', '2024-12-14 23:45:55', '2024-12-14 23:45:55', NULL),
(170, 3, 'auth_token', NULL, '8511ff6ce850c4db6bd2577bce084c17ef5b9eef88c3db23ae033a8782001b65', '[\"*\"]', '2024-12-15 05:46:39', '2024-12-14 23:45:55', '2024-12-14 23:46:39', NULL),
(171, 2, 'auth_token', NULL, 'c08210c63826647a6e16c5d301d9297ea8fd4dc4fe42df42a79c57f2195a1925', '[\"*\"]', '2024-12-15 05:46:52', '2024-12-14 23:46:52', '2024-12-14 23:46:52', NULL),
(173, 2, 'auth_token', NULL, 'f8d54bd6819b61f2067d116ebe76d0130977202ff9b743f3427df96fe4d64455', '[\"*\"]', '2024-12-15 05:48:09', '2024-12-14 23:48:08', '2024-12-14 23:48:09', NULL),
(174, 2, 'auth_token', NULL, 'dd644191ba6cbbd4cc311f82be65a0b4ca39e308da599a421154d75e2d08ef00', '[\"*\"]', '2024-12-15 05:48:11', '2024-12-14 23:48:09', '2024-12-14 23:48:11', NULL),
(175, 3, 'auth_token', NULL, 'e78b2a58559942c53d68db7ba7a845558534f2185a79607485bc0290ef9f68c7', '[\"*\"]', '2024-12-15 05:49:25', '2024-12-14 23:49:25', '2024-12-14 23:49:25', NULL),
(176, 3, 'auth_token', NULL, '8a10f2f5ed5cbfb92e88736fcb8abeb2749ad54d71495a5bfd486ba24f493752', '[\"*\"]', '2024-12-15 05:49:42', '2024-12-14 23:49:25', '2024-12-14 23:49:42', NULL),
(177, 15, 'auth_token', NULL, '7289424d3c56d704278454a9a161affb3ac2332756b726192a8ae18107bb3a08', '[\"*\"]', '2024-12-15 05:52:09', '2024-12-14 23:52:09', '2024-12-14 23:52:09', NULL),
(179, 2, 'auth_token', NULL, '891ccac575d5b0d29c3f7b99b587477ff49bcabd43982d9edb1e2ff3de54684f', '[\"*\"]', '2024-12-16 09:35:13', '2024-12-16 03:35:12', '2024-12-16 03:35:13', NULL),
(181, 16, 'auth_token', NULL, '23eace12d8d94f147ef611d5987dc3054eb153f13e6969912bc6a120fa9ab581', '[\"*\"]', '2024-12-16 13:00:29', '2024-12-16 07:00:28', '2024-12-16 07:00:29', NULL),
(182, 16, 'auth_token', NULL, '0a1d2505a3533329fa68ce079a6a6534795f85f9839619fe997ead812c0755fa', '[\"*\"]', '2024-12-16 13:01:47', '2024-12-16 07:00:29', '2024-12-16 07:01:47', NULL),
(183, 2, 'auth_token', NULL, '0becb8ac25ab8fb28bbf06bb20c72712ca6a056b9b340d552cac6eafb7fd4959', '[\"*\"]', '2024-12-16 13:02:19', '2024-12-16 07:02:18', '2024-12-16 07:02:19', NULL),
(185, 2, 'auth_token', NULL, '5b995538127ad443a69c2f64321c2376bd239a711764426f25b4ed9e699c68a2', '[\"*\"]', '2024-12-16 13:03:02', '2024-12-16 07:03:01', '2024-12-16 07:03:02', NULL),
(187, 2, 'auth_token', NULL, 'fc8b14fa939d2d3a2a1e1168ad469e1cbb5d1669bd6286fb7505633989a2a96d', '[\"*\"]', '2024-12-16 13:03:34', '2024-12-16 07:03:33', '2024-12-16 07:03:34', NULL),
(188, 2, 'auth_token', NULL, 'e04468a1b6d3888fd441704657a905b47d9f5e5a6feed33d2ab12a1d1d7615b5', '[\"*\"]', '2024-12-16 13:04:46', '2024-12-16 07:03:34', '2024-12-16 07:04:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `p_pic` varchar(255) DEFAULT 'default.jpg',
  `role` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `name`, `p_pic`, `role`, `about`, `created_at`, `updated_at`) VALUES
(2, 15, 'Joy', 'fc58777c176015ae8c0528dfc8c0f7cd54a43409350a6084c1220ed050c0bc7a.png', 'SW2', 'jds \nsdlf sl sdmf', '2024-12-16 09:34:19', '2024-12-16 03:34:19'),
(3, 2, 'hj', '5c43febbc99f4496bcf105e93b72cacc6d1726fc9cce3d54161cba16c29868db.png', 'njcx', 'nndsm n jlfdm jdfn m', '2024-12-16 13:04:13', '2024-12-16 07:04:13'),
(4, 16, 'xyz', '39eedaf56abd0d3239a7d6b6731c97322581645512cc33cf6eace2b6e0cc308c.png', 'RX', 'zjxzj', '2024-12-16 13:01:18', '2024-12-16 07:01:18');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `name`, `price`, `description`, `created_at`, `updated_at`) VALUES
(3, 'Forfait Intermédiaire', 50.00, 'Support et infrastructure dédiés à votre entreprise.', '2024-12-03 08:37:26', '2024-11-19 02:40:22'),
(5, 'Forfait Premium', 120.00, 'Support et infrastructure dédiés à votre entreprise avec service premium.', '2024-12-03 08:37:43', '2024-11-19 02:39:46'),
(6, 'Forfait Gratuit', 0.00, 'Le forfait parfait pour démarrer avec notre produit.', '2024-12-03 08:34:44', '2024-11-19 02:39:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin@example.com', '$scrypt$n=16384,r=8,p=1$a0aSAu4WuPeqtKGmXikehw$1uZjZWs2Kak6yvJ2QHWnJuHZDyCMNQrwXNJl6Q2Rhm71iWCDlGwOu9Fo19JRpFkhhuWoRHhAaOlwg6dWYqtc/Q', '2024-11-17 23:56:48', '2024-11-17 23:56:48'),
(2, 1, 'admin@gmail.com', '$scrypt$n=16384,r=8,p=1$G9oZ4qo4VmFAyFdmSpNEPw$mAmeLebvvI+Th9VVyuBDOz4mgTB/ma0vsU/Kc7IGVxcBgJ9NYO/4Eqfezl7tYuymwB4IIlz4iJqvOiX+DwulLw', '2024-12-15 05:41:13', '2024-12-14 23:41:13'),
(3, 2, 'joy@gmail.com', '$scrypt$n=16384,r=8,p=1$2bwz/dcrA/DpVufRMttXEQ$VyKPSWURmQ8DYtuYjafL8FpYE0r3J1G0TPWI3RzT9Sugw3zp6MY1TiCnNpOs9Uk99d9ENogvFXtyXO92pGDLYg', '2024-11-19 02:40:51', '2024-11-19 02:40:51'),
(6, 2, 'admin2@gmail.com', '$scrypt$n=16384,r=8,p=1$UUsZ8tAi9AIv+XRdtpHe/Q$4B2X4HTHVHjc6Q9vMGSp+vzymJm2tnORo18IpyBoKF2CvvCsrj1MDOT+cPpuUVeGSZS5gbx0jW+muLozKOpA2w', '2024-12-04 01:12:39', '2024-12-04 01:12:39'),
(8, 2, 'admin4@gmail.com', '$scrypt$n=16384,r=8,p=1$CJsyKbJJhhN7yPfVuiU4Vw$3tePtisOuH8jZx7V//Xr6LdvXPNxCFF/bii3QA8TlOXq9A0nKAL/yyrr5XsZ1dZg+dXdf/dxyiBMD9++Nxy9wA', '2024-12-04 01:13:07', '2024-12-04 01:13:07'),
(9, 1, 'admin5@gmail.com', '$scrypt$n=16384,r=8,p=1$SI9bQOIQLvYgv8gyjGqwlA$/NFd3oTHgTwzdNBACNeKoVuB9fs1mklykHXvcxzJdTafDpUXuKr1Y7Ft9PAkEwblHHvgq+NBeEcssX1ru1p8mQ', '2024-12-04 01:23:16', '2024-12-04 01:23:16'),
(10, 1, 'admin22@gmail.com', '$scrypt$n=16384,r=8,p=1$31tCxCSK4xKn79gEAd42kw$IHJLXuO33pfThn4SYmW93pwLwYaYAAYa45dm4cXZglbQFPkaZN4XX6mSEvSx1QESwUxYYbdigoBtQNgW+F54aQ', '2024-12-05 04:10:42', '2024-12-05 04:10:42'),
(11, 2, 'admixxn@gmail.com', '$scrypt$n=16384,r=8,p=1$uY9yotquOlNnHgiKCjyA/w$8vGvb+8sP76fqHzAulAG3wlNAFcb2ntWLUVBQkMOqpmQ/vbJ3QxaVHoMscSzRzLFjrptXT1/d6P9kKbcDA/HvQ', '2024-12-05 04:32:23', '2024-12-05 04:32:23'),
(12, 2, 'adminddd@gmail.com', '$scrypt$n=16384,r=8,p=1$l49cvYxreqT++4AaUqbDhA$IT+XYRMQsVoZEIrOuKtgSSRu3++0O9GBEJI9isqB0/j3heAvT+/0Ruz+OyIiQeh7a7Ky4EGF4NGi4+9Jrd0k8g', '2024-12-05 10:38:35', '2024-12-05 04:38:35'),
(14, 2, 'admin77@gmail.com', '$scrypt$n=16384,r=8,p=1$bE0ePBkzw3t09aqfHtmDgg$qepbm+9sKHM/JsC5L+Wnj+PY9MkYtLj/x2cda/I3QsOaYyz8nl2CVW3/CV4RKFrGrWU4ufdGv+JMb6BaB3tfFw', '2024-12-05 04:56:11', '2024-12-05 04:56:11'),
(16, 2, 'xyz@gma.com', '$scrypt$n=16384,r=8,p=1$nY0TVXzpnYXQKZVPzXA0GA$qWJuXA2K8u3faxE+7j6DgEyTgPxgzpaTKAJt+BYSUN05xgu1OQTLePNxLHD+Q6tRZnJSUxmzJTjVhkZ+nyu+cQ', '2024-12-16 06:54:30', '2024-12-16 06:54:30');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', '2024-11-17 23:56:48', '2024-11-17 23:56:48'),
(2, 'User', '2024-11-17 23:56:48', '2024-11-17 23:56:48');

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `subscription_id` int(10) UNSIGNED DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(255) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `subscription_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(20, 1, 6, '2024-11-21', '2024-12-21', 'inactive', '2024-11-21 03:40:07', '2024-11-20 21:40:07'),
(21, 1, 5, '2024-11-21', '2025-11-21', 'inactive', '2024-12-03 14:19:33', '2024-12-03 08:19:33'),
(22, 3, 6, '2024-11-21', '2025-11-21', 'inactive', '2024-11-21 05:40:33', '2024-11-20 23:40:33'),
(23, 3, 5, '2024-11-21', '2025-11-21', 'inactive', '2024-11-21 05:41:37', '2024-11-20 23:41:37'),
(24, 3, 3, '2024-11-21', '2025-11-21', 'inactive', '2024-11-21 05:55:05', '2024-11-20 23:55:05'),
(25, 3, 5, '2024-11-21', '2024-12-21', 'inactive', '2024-11-21 07:17:44', '2024-11-21 01:17:44'),
(26, 3, 5, '2024-11-21', '2025-11-21', 'inactive', '2024-11-21 07:18:29', '2024-11-21 01:18:29'),
(27, 3, 3, '2024-11-21', '2025-11-21', 'inactive', '2024-12-04 08:00:04', '2024-12-04 02:00:04'),
(28, 1, 6, '2024-12-03', '2025-01-02', 'inactive', '2024-12-03 14:19:59', '2024-12-03 08:19:59'),
(29, 1, 3, '2024-12-03', '2025-12-03', 'inactive', '2024-12-03 15:21:53', '2024-12-03 09:21:53'),
(30, 1, 5, '2024-12-03', '2025-01-02', 'inactive', '2024-12-04 09:13:07', '2024-12-04 03:13:07'),
(31, 3, 5, '2024-12-04', '2025-01-03', 'inactive', '2024-12-05 10:51:47', '2024-12-05 04:51:47'),
(32, 2, 5, '2024-12-04', '2025-01-03', 'inactive', '2024-12-05 09:52:54', '2024-12-05 03:52:54'),
(33, 1, 5, '2024-12-04', '2025-12-04', 'inactive', '2024-12-04 09:14:47', '2024-12-04 03:14:47'),
(34, 1, 3, '2024-12-04', '2025-01-03', 'inactive', '2024-12-06 05:20:58', '2024-12-05 23:20:58'),
(35, 9, 5, '2024-12-04', '2025-12-04', 'active', '2024-12-04 08:15:24', '2024-12-04 08:15:24'),
(36, 2, 3, '2024-12-05', '2025-12-05', 'inactive', '2024-12-06 04:08:30', '2024-12-05 22:08:30'),
(37, 3, 5, '2024-12-05', '2025-12-05', 'active', '2024-12-05 04:51:47', '2024-12-05 04:51:47'),
(38, 2, 6, '2024-12-06', '2025-12-06', 'inactive', '2024-12-06 04:13:04', '2024-12-05 22:13:04'),
(39, 2, 5, '2024-12-06', '2025-12-06', 'inactive', '2024-12-06 04:13:16', '2024-12-05 22:13:16'),
(40, 2, 3, '2024-12-06', '2025-12-06', 'inactive', '2024-12-06 05:20:07', '2024-12-05 23:20:07'),
(41, 2, 5, '2024-12-06', '2025-12-06', 'active', '2024-12-05 23:20:08', '2024-12-05 23:20:08'),
(42, 1, 5, '2024-12-06', '2025-01-05', 'active', '2024-12-05 23:20:58', '2024-12-05 23:20:58'),
(43, 15, 5, '2024-12-13', '2025-12-13', 'active', '2024-12-13 09:46:34', '2024-12-13 09:46:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adonis_schema_versions`
--
ALTER TABLE `adonis_schema_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_access_tokens_tokenable_id_foreign` (`tokenable_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profiles_user_id_foreign` (`user_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_roles_role_name_unique` (`role_name`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_subscriptions_user_id_foreign` (`user_id`),
  ADD KEY `user_subscriptions_subscription_id_foreign` (`subscription_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
