-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 24, 2011 at 05:09 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `canvas`
--

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE IF NOT EXISTS `content` (
  `id` int(11) NOT NULL,
  `x` decimal(11,9) NOT NULL,
  `y` decimal(11,9) NOT NULL,
  `z` int(11) NOT NULL,
  `size` decimal(11,9) NOT NULL,
  `rotation` decimal(11,8) NOT NULL,
  `name` text NOT NULL,
  `type` int(11) NOT NULL,
  `link` text NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`id`, `x`, `y`, `z`, `size`, `rotation`, `name`, `type`, `link`, `sequence`) VALUES
(3, '0.501056134', '0.167974337', 100000714, '0.104376580', '-6.15833665', 'Vegetarian Zombies', 0, 'objects/zombies.jpg', 2530),
(6, '0.810016183', '0.725959230', 100000713, '0.234787837', '-38.95948887', 'Cars 2', 1, 'objects/cars2.webm', 2529),
(10, '0.331415917', '0.507944960', 100000710, '0.267320004', '-14.15809943', 'Upload', 0, '../canvas/php/files/canguru.png', 2525),
(14, '0.752232143', '0.270056876', 100000701, '0.104503029', '6.38799830', 'Upload', 0, '../canvas/php/files/Lighthouse.jpg', 2517),
(17, '0.106154957', '0.167335494', 100000712, '0.105856420', '-16.32687317', 'Upload', 0, '../canvas/php/files/WTplL.jpg', 2528),
(19, '0.511197918', '0.832733298', 100000708, '0.138332394', '-28.67329747', 'Upload', 0, '../canvas/php/files/Penguins.jpg', 2523),
(20, '0.644717262', '0.509526642', 100000709, '0.200000000', '18.00666249', 'Upload', 0, '../canvas/php/files/Chrysanthemum.jpg', 2524),
(21, '0.113690476', '0.788402848', 100000711, '0.200000000', '22.67768133', 'Upload', 0, '../canvas/php/files/Desert.jpg', 2526);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
