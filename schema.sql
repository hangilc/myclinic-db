-- MySQL dump 10.13  Distrib 5.7.5-m15, for Win32 (AMD64)
--
-- Host: localhost    Database: myclinic
-- ------------------------------------------------------
-- Server version	5.7.5-m15-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `callback_page`
--

DROP TABLE IF EXISTS `callback_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `callback_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crc32` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `document_root` varchar(255) DEFAULT NULL,
  `page_file` varchar(255) DEFAULT NULL,
  `value` longtext,
  `creation_datetime` datetime DEFAULT NULL,
  `access_datetime` datetime DEFAULT NULL,
  `access_count` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=sjis;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `containers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL DEFAULT '',
  `key` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `value` longtext,
  `creation_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modification_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=sjis;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disease`
--

DROP TABLE IF EXISTS `disease`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disease` (
  `disease_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  `shoubyoumeicode` int(11) NOT NULL DEFAULT '0',
  `start_date` date NOT NULL DEFAULT '0000-00-00',
  `end_date` date NOT NULL DEFAULT '0000-00-00',
  `end_reason` char(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40255 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disease_adj`
--

DROP TABLE IF EXISTS `disease_adj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disease_adj` (
  `disease_adj_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `disease_id` int(11) NOT NULL DEFAULT '0',
  `shuushokugocode` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`disease_adj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5821 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hoken_koukikourei`
--

DROP TABLE IF EXISTS `hoken_koukikourei`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoken_koukikourei` (
  `koukikourei_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL DEFAULT '0',
  `hokensha_bangou` varchar(255) NOT NULL DEFAULT '',
  `hihokensha_bangou` varchar(255) NOT NULL DEFAULT '',
  `futan_wari` tinyint(4) NOT NULL DEFAULT '0',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`koukikourei_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1030 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hoken_other`
--

DROP TABLE IF EXISTS `hoken_other`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoken_other` (
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hoken_roujin`
--

DROP TABLE IF EXISTS `hoken_roujin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoken_roujin` (
  `roujin_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `shichouson` int(10) unsigned NOT NULL DEFAULT '0',
  `jukyuusha` int(10) unsigned NOT NULL DEFAULT '0',
  `futan_wari` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`roujin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hoken_shahokokuho`
--

DROP TABLE IF EXISTS `hoken_shahokokuho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoken_shahokokuho` (
  `shahokokuho_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '0',
  `hokensha_bangou` int(10) unsigned NOT NULL DEFAULT '0',
  `hihokensha_kigou` varchar(255) NOT NULL DEFAULT '',
  `hihokensha_bangou` varchar(255) NOT NULL DEFAULT '',
  `honnin` tinyint(4) NOT NULL DEFAULT '1',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  `kourei` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`shahokokuho_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7873 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hotline`
--

DROP TABLE IF EXISTS `hotline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotline` (
  `hotline_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `sender` varchar(255) NOT NULL DEFAULT '',
  `recipient` varchar(255) NOT NULL DEFAULT '',
  `m_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`hotline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=136735 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iyakuhin_master`
--

DROP TABLE IF EXISTS `iyakuhin_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iyakuhin_master` (
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `yakkacode` varchar(12) NOT NULL DEFAULT '',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `yakka` varchar(10) NOT NULL DEFAULT '',
  `madoku` char(1) NOT NULL DEFAULT '',
  `kouhatsu` char(1) NOT NULL DEFAULT '',
  `zaikei` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`iyakuhincode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iyakuhin_master_200511`
--

DROP TABLE IF EXISTS `iyakuhin_master_200511`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iyakuhin_master_200511` (
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `yakkacode` varchar(12) NOT NULL DEFAULT '',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `yakka` varchar(10) NOT NULL DEFAULT '',
  `madoku` char(1) NOT NULL DEFAULT '',
  `kouhatsu` char(1) NOT NULL DEFAULT '',
  `zaikei` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`iyakuhincode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iyakuhin_master_arch`
--

DROP TABLE IF EXISTS `iyakuhin_master_arch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iyakuhin_master_arch` (
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `yakkacode` varchar(12) NOT NULL DEFAULT '',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `yakka` varchar(10) NOT NULL DEFAULT '',
  `madoku` char(1) NOT NULL DEFAULT '',
  `kouhatsu` char(1) NOT NULL DEFAULT '',
  `zaikei` char(1) NOT NULL DEFAULT '',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`iyakuhincode`,`valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iyakuhin_transition`
--

DROP TABLE IF EXISTS `iyakuhin_transition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iyakuhin_transition` (
  `iyakuhin_transition_id` int(11) NOT NULL AUTO_INCREMENT,
  `old_iyakuhincode` int(11) NOT NULL DEFAULT '0',
  `new_iyakuhincode` int(11) NOT NULL DEFAULT '0',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`iyakuhin_transition_id`),
  UNIQUE KEY `old_iyakuhincode` (`old_iyakuhincode`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kensa_master`
--

DROP TABLE IF EXISTS `kensa_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kensa_master` (
  `touitsu_code` char(5) NOT NULL DEFAULT '',
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  KEY `touitsu_code` (`touitsu_code`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kouhi`
--

DROP TABLE IF EXISTS `kouhi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kouhi` (
  `kouhi_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category` char(10) NOT NULL DEFAULT '',
  `futansha` int(10) unsigned NOT NULL DEFAULT '0',
  `jukyuusha` int(10) unsigned NOT NULL DEFAULT '0',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`kouhi_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1061 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `master_symbol_map`
--

DROP TABLE IF EXISTS `master_symbol_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master_symbol_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master` varchar(255) NOT NULL DEFAULT '',
  `symbol` varchar(255) NOT NULL DEFAULT '',
  `code` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `no_roujin_techou`
--

DROP TABLE IF EXISTS `no_roujin_techou`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `no_roujin_techou` (
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient` (
  `patient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `last_name` varchar(20) NOT NULL DEFAULT '',
  `first_name` varchar(20) NOT NULL DEFAULT '',
  `last_name_yomi` varchar(40) NOT NULL DEFAULT '',
  `first_name_yomi` varchar(40) NOT NULL DEFAULT '',
  `sex` char(1) NOT NULL DEFAULT '',
  `birth_day` date NOT NULL DEFAULT '0000-00-00',
  `address` varchar(80) NOT NULL DEFAULT '',
  `phone` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5629 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pharma_drug`
--

DROP TABLE IF EXISTS `pharma_drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharma_drug` (
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `description` text NOT NULL,
  `sideeffect` text NOT NULL,
  PRIMARY KEY (`iyakuhincode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pharma_queue`
--

DROP TABLE IF EXISTS `pharma_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharma_queue` (
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pharma_state` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `presc_example`
--

DROP TABLE IF EXISTS `presc_example`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `presc_example` (
  `presc_example_id` int(11) NOT NULL AUTO_INCREMENT,
  `m_iyakuhincode` int(11) NOT NULL DEFAULT '0',
  `m_master_valid_from` date NOT NULL DEFAULT '0000-00-00',
  `m_amount` varchar(10) NOT NULL DEFAULT '',
  `m_usage` varchar(255) NOT NULL DEFAULT '',
  `m_days` int(10) NOT NULL DEFAULT '0',
  `m_category` tinyint(4) NOT NULL DEFAULT '0',
  `m_group` varchar(255) NOT NULL DEFAULT '',
  `m_comment` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`presc_example_id`)
) ENGINE=InnoDB AUTO_INCREMENT=854 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shinryou_group`
--

DROP TABLE IF EXISTS `shinryou_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shinryou_group` (
  `shinryou_group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `pos` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`shinryou_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shinryou_item`
--

DROP TABLE IF EXISTS `shinryou_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shinryou_item` (
  `shinryou_item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shinryou_group_id` int(10) unsigned NOT NULL DEFAULT '0',
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  `pos` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`shinryou_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shinryoukoui_master`
--

DROP TABLE IF EXISTS `shinryoukoui_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shinryoukoui_master` (
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `tensuu` varchar(10) NOT NULL DEFAULT '',
  `tensuu_shikibetsu` char(1) NOT NULL DEFAULT '',
  `shuukeisaki` varchar(3) NOT NULL DEFAULT '',
  `houkatsukensa` varchar(2) NOT NULL DEFAULT '',
  `oushinkubun` char(1) NOT NULL DEFAULT '',
  `kensagroup` varchar(2) NOT NULL DEFAULT '',
  `roujintekiyou` char(1) NOT NULL DEFAULT '',
  `code_shou` char(1) NOT NULL DEFAULT '',
  `code_bu` varchar(2) NOT NULL DEFAULT '',
  `code_alpha` char(1) NOT NULL DEFAULT '',
  `code_kubun` varchar(3) NOT NULL DEFAULT '',
  PRIMARY KEY (`shinryoucode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shinryoukoui_master_200511`
--

DROP TABLE IF EXISTS `shinryoukoui_master_200511`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shinryoukoui_master_200511` (
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `tensuu` varchar(10) NOT NULL DEFAULT '',
  `tensuu_shikibetsu` char(1) NOT NULL DEFAULT '',
  `shuukeisaki` varchar(3) NOT NULL DEFAULT '',
  `houkatsukensa` varchar(2) NOT NULL DEFAULT '',
  `oushinkubun` char(1) NOT NULL DEFAULT '',
  `kensagroup` varchar(2) NOT NULL DEFAULT '',
  `roujintekiyou` char(1) NOT NULL DEFAULT '',
  `code_shou` char(1) NOT NULL DEFAULT '',
  `code_bu` varchar(2) NOT NULL DEFAULT '',
  `code_alpha` char(1) NOT NULL DEFAULT '',
  `code_kubun` varchar(3) NOT NULL DEFAULT '',
  PRIMARY KEY (`shinryoucode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shinryoukoui_master_arch`
--

DROP TABLE IF EXISTS `shinryoukoui_master_arch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shinryoukoui_master_arch` (
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `tensuu` varchar(10) NOT NULL DEFAULT '',
  `tensuu_shikibetsu` char(1) NOT NULL DEFAULT '',
  `shuukeisaki` varchar(3) NOT NULL DEFAULT '',
  `houkatsukensa` varchar(2) NOT NULL DEFAULT '',
  `oushinkubun` char(1) NOT NULL DEFAULT '',
  `kensagroup` varchar(2) NOT NULL DEFAULT '',
  `roujintekiyou` char(1) NOT NULL DEFAULT '',
  `code_shou` char(1) NOT NULL DEFAULT '',
  `code_bu` varchar(2) NOT NULL DEFAULT '',
  `code_alpha` char(1) NOT NULL DEFAULT '',
  `code_kubun` varchar(3) NOT NULL DEFAULT '',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`shinryoucode`,`valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoubyoumei_master`
--

DROP TABLE IF EXISTS `shoubyoumei_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoubyoumei_master` (
  `shoubyoumeicode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`shoubyoumeicode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoubyoumei_master_arch`
--

DROP TABLE IF EXISTS `shoubyoumei_master_arch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoubyoumei_master_arch` (
  `shoubyoumeicode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(60) NOT NULL DEFAULT '',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`shoubyoumeicode`,`valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shuushokugo_master`
--

DROP TABLE IF EXISTS `shuushokugo_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shuushokugo_master` (
  `shuushokugocode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`shuushokugocode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_drug`
--

DROP TABLE IF EXISTS `stock_drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_drug` (
  `stock_drug_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `m_iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `m_amount` varchar(10) NOT NULL DEFAULT '',
  `m_usage` varchar(255) NOT NULL DEFAULT '',
  `m_days` int(10) unsigned NOT NULL DEFAULT '0',
  `m_category` tinyint(4) NOT NULL DEFAULT '0',
  `m_comment` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`stock_drug_id`)
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_iyakuhin_master`
--

DROP TABLE IF EXISTS `temp_iyakuhin_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_iyakuhin_master` (
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `yakka` varchar(10) NOT NULL DEFAULT '',
  `madoku` char(1) NOT NULL DEFAULT '',
  `kouhatsu` char(1) NOT NULL DEFAULT '',
  `zaikei` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`iyakuhincode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokuteikizai_master`
--

DROP TABLE IF EXISTS `tokuteikizai_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokuteikizai_master` (
  `kizaicode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `kingaku` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`kizaicode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokuteikizai_master_200511`
--

DROP TABLE IF EXISTS `tokuteikizai_master_200511`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokuteikizai_master_200511` (
  `kizaicode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `kingaku` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`kizaicode`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokuteikizai_master_arch`
--

DROP TABLE IF EXISTS `tokuteikizai_master_arch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokuteikizai_master_arch` (
  `kizaicode` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `yomi` varchar(20) NOT NULL DEFAULT '',
  `unit` varchar(12) NOT NULL DEFAULT '',
  `kingaku` varchar(10) NOT NULL DEFAULT '',
  `valid_from` date NOT NULL DEFAULT '0000-00-00',
  `valid_upto` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`kizaicode`,`valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit`
--

DROP TABLE IF EXISTS `visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit` (
  `visit_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL DEFAULT '0',
  `v_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `shahokokuho_id` int(10) unsigned NOT NULL DEFAULT '0',
  `roujin_id` int(10) unsigned NOT NULL DEFAULT '0',
  `kouhi_1_id` int(10) unsigned NOT NULL DEFAULT '0',
  `kouhi_2_id` int(10) unsigned NOT NULL DEFAULT '0',
  `kouhi_3_id` int(10) unsigned NOT NULL DEFAULT '0',
  `jihi` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `koukikourei_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`visit_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65417 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_charge`
--

DROP TABLE IF EXISTS `visit_charge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_charge` (
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `charge` int(10) unsigned NOT NULL DEFAULT '0',
  `jindouteki_mishuu` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `inchou_kessai` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`visit_id`),
  KEY `visit_id` (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_conduct`
--

DROP TABLE IF EXISTS `visit_conduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_conduct` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `kind` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=991 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_conduct_drug`
--

DROP TABLE IF EXISTS `visit_conduct_drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_conduct_drug` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_conduct_id` int(10) unsigned NOT NULL DEFAULT '0',
  `iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `amount` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=433 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_conduct_kizai`
--

DROP TABLE IF EXISTS `visit_conduct_kizai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_conduct_kizai` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_conduct_id` int(10) unsigned NOT NULL DEFAULT '0',
  `kizaicode` int(10) unsigned NOT NULL DEFAULT '0',
  `amount` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=580 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_conduct_shinryou`
--

DROP TABLE IF EXISTS `visit_conduct_shinryou`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_conduct_shinryou` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_conduct_id` int(10) unsigned NOT NULL DEFAULT '0',
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1400 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_drug`
--

DROP TABLE IF EXISTS `visit_drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_drug` (
  `drug_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `d_iyakuhincode` int(10) unsigned NOT NULL DEFAULT '0',
  `d_amount` varchar(10) NOT NULL DEFAULT '',
  `d_usage` varchar(255) NOT NULL DEFAULT '',
  `d_days` int(10) unsigned NOT NULL DEFAULT '0',
  `d_category` tinyint(4) NOT NULL DEFAULT '0',
  `d_shuukeisaki` tinyint(4) NOT NULL DEFAULT '0',
  `d_pos` int(10) unsigned NOT NULL DEFAULT '0',
  `d_prescribed` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`drug_id`),
  KEY `visit_id` (`visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=123735 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_gazou_label`
--

DROP TABLE IF EXISTS `visit_gazou_label`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_gazou_label` (
  `visit_conduct_id` int(10) unsigned NOT NULL DEFAULT '0',
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`visit_conduct_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_payment`
--

DROP TABLE IF EXISTS `visit_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_payment` (
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `amount` int(10) unsigned DEFAULT NULL,
  `paytime` datetime DEFAULT NULL,
  KEY `visit_id` (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_shinryou`
--

DROP TABLE IF EXISTS `visit_shinryou`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_shinryou` (
  `shinryou_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `shinryoucode` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`shinryou_id`),
  KEY `visit_id` (`visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=405859 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visit_text`
--

DROP TABLE IF EXISTS `visit_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_text` (
  `text_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `visit_id` int(10) unsigned DEFAULT NULL,
  `content` text NOT NULL,
  `pos` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`text_id`),
  KEY `visit_id` (`visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79241 DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wqueue`
--

DROP TABLE IF EXISTS `wqueue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wqueue` (
  `visit_id` int(10) unsigned NOT NULL DEFAULT '0',
  `wait_state` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=cp932;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-19  9:45:04
