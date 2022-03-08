-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 04. Nov 2021 um 10:39
-- Server-Version: 10.1.48-MariaDB-0ubuntu0.18.04.1
-- PHP-Version: 7.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `arasco`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Article`
--

CREATE TABLE `Article` (
  `SessionID` int(11) NOT NULL,
  `ArticleID` varchar(255) NOT NULL,
  `UserUUID` varchar(255) NOT NULL,
  `CountKolli` float DEFAULT NULL,
  `Datum` varchar(255) NOT NULL,
  `CountSingle` int(11) DEFAULT NULL,
  `CountInKolli` int(11) DEFAULT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `Article`
--

INSERT INTO `Article` (`SessionID`, `ArticleID`, `UserUUID`, `CountKolli`, `Datum`, `CountSingle`, `CountInKolli`, `ID`) VALUES
(26, '40536', '5df4f74f-0515-4f08-ab21-60af78537e18', NULL, '12.10.2021 18:11:51', 10, 1, 1),
(26, '40536', '965d3463-623a-4a5e-8ad3-147f6b4623ae', NULL, '12.10.2021 18:14:28', 5, 1, 2),
(26, '10100', '5df4f74f-0515-4f08-ab21-60af78537e18', 16, '12.10.2021 22:44:10', 33, 10, 3),
(28, '10100', '5df4f74f-0515-4f08-ab21-60af78537e18', NULL, '12.10.2021 22:57:53', 68, 10, 4),
(28, '10300', '5df4f74f-0515-4f08-ab21-60af78537e18', 49, '13.10.2021 13:36:59', 27, 16, 5),
(28, '10690', '5df4f74f-0515-4f08-ab21-60af78537e18', 51, '13.10.2021 13:37:33', NULL, 1, 6),
(28, '10805', '5df4f74f-0515-4f08-ab21-60af78537e18', 15, '13.10.2021 13:37:49', NULL, 12, 7),
(30, '10300', '5df4f74f-0515-4f08-ab21-60af78537e18', 15, '13.10.2021 13:49:15', 12, 16, 8),
(30, '10690', '5df4f74f-0515-4f08-ab21-60af78537e18', 2, '13.10.2021 13:49:24', NULL, 1, 9),
(30, '10805', '5df4f74f-0515-4f08-ab21-60af78537e18', 6, '13.10.2021 13:49:34', NULL, 12, 10);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ID`
--

CREATE TABLE `ID` (
  `ID` int(11) NOT NULL,
  `ArtNr` varchar(255) NOT NULL,
  `Description1` varchar(255) NOT NULL,
  `Description2` varchar(255) NOT NULL,
  `Manufacturer` varchar(255) NOT NULL,
  `Note` varchar(255) NOT NULL,
  `QuantityShould` int(11) NOT NULL,
  `QuantityIs` int(11) NOT NULL,
  `QuantityFactor` int(11) NOT NULL,
  `QuantityFactorBez` int(11) NOT NULL,
  `Content` int(11) NOT NULL,
  `Weight` int(11) NOT NULL,
  `IsAcvtive` tinyint(1) NOT NULL,
  `Location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Session`
--

CREATE TABLE `Session` (
  `ID` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `StartUserID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `Session`
--

INSERT INTO `Session` (`ID`, `Name`, `StartDate`, `EndDate`, `StartUserID`) VALUES
(13, 'kemal', '2021-08-29 15:11:39', '2021-08-29 15:11:46', '794f7263-6944-46b2-927d-34bcaf86e095'),
(14, 'kemal', '2021-08-29 15:22:51', '2021-08-29 15:22:52', '794f7263-6944-46b2-927d-34bcaf86e095'),
(15, 'kemal', '2021-08-29 15:22:54', '2021-08-29 15:22:58', '794f7263-6944-46b2-927d-34bcaf86e095'),
(16, 'kemal', '2021-08-29 15:22:59', '2021-08-29 15:23:00', '794f7263-6944-46b2-927d-34bcaf86e095'),
(17, 'kemal', '2021-08-29 20:03:10', '2021-08-29 20:03:12', '794f7263-6944-46b2-927d-34bcaf86e095'),
(18, 'kemal', '2021-08-29 20:21:41', '2021-08-29 20:40:33', '794f7263-6944-46b2-927d-34bcaf86e095'),
(19, 'kemal', '2021-08-29 20:41:12', '2021-08-29 20:41:28', '794f7263-6944-46b2-927d-34bcaf86e095'),
(20, 'kemal', '2021-08-29 20:42:07', '2021-08-29 20:42:34', '794f7263-6944-46b2-927d-34bcaf86e095'),
(21, 'kemal', '2021-08-29 20:42:50', '2021-08-29 20:50:46', '794f7263-6944-46b2-927d-34bcaf86e095'),
(22, 'kemal', '2021-08-29 20:45:16', '2021-08-29 20:45:24', '794f7263-6944-46b2-927d-34bcaf86e095'),
(23, 'kemal', '2021-08-29 20:49:56', '2021-08-29 20:50:48', '794f7263-6944-46b2-927d-34bcaf86e095'),
(24, 'kemal', '2021-09-07 18:19:21', '2021-09-19 00:13:02', '794f7263-6944-46b2-927d-34bcaf86e095'),
(25, 'kemal', '2021-09-19 16:20:00', '2021-09-24 17:57:56', '5df4f74f-0515-4f08-ab21-60af78537e18'),
(26, 'TestSession', '2021-09-24 17:58:15', '2021-10-12 22:50:25', '5df4f74f-0515-4f08-ab21-60af78537e18'),
(27, 'kemal', '2021-10-12 22:51:11', '2021-10-12 22:51:19', '5df4f74f-0515-4f08-ab21-60af78537e18'),
(28, 'kemal', '2021-10-12 22:51:23', '2021-10-13 13:41:36', '5df4f74f-0515-4f08-ab21-60af78537e18'),
(29, 'kemal', '2021-10-13 13:43:13', '2021-10-13 13:48:27', '5df4f74f-0515-4f08-ab21-60af78537e18'),
(30, 'kemal', '2021-10-13 13:48:49', NULL, '5df4f74f-0515-4f08-ab21-60af78537e18');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `User`
--

CREATE TABLE `User` (
  `uuid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Role` varchar(255) NOT NULL,
  `Kurzname` varchar(255) NOT NULL,
  `Kurzzeichen` varchar(255) NOT NULL,
  `salt` int(11) NOT NULL,
  `SessionToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `User`
--

INSERT INTO `User` (`uuid`, `username`, `password`, `Role`, `Kurzname`, `Kurzzeichen`, `salt`, `SessionToken`) VALUES
('5df4f74f-0515-4f08-ab21-60af78537e18', 'kemal', 'e59e981d9b6c071996f5259a13fcd2bf', 'ADMIN', 'Kemal', 'Test', 3314, '33f5674eb9fa5df55b69b1da0ffedf891c4fec7fc9b5dd9b25996ea5cc49bd8c4dbf81eb5ba967c7f994f53a7af5392b'),
('965d3463-623a-4a5e-8ad3-147f6b4623ae', 'test', '1d349cb1ac29ceedf6bd02f408ff2218', 'USER', 'H', 'Test', 4647, 'ba0746de71b05c06261d3ccdb7980840d7dd2d364f014e11ab77ada4e2141c593d4cdd4cbdc608698bc2d31e408152df');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Article`
--
ALTER TABLE `Article`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `ID`
--
ALTER TABLE `ID`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`uuid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `Article`
--
ALTER TABLE `Article`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `ID`
--
ALTER TABLE `ID`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Session`
--
ALTER TABLE `Session`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
