-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: ACMEFood
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AccountClient`
--

DROP TABLE IF EXISTS `AccountClient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountClient` (
  `ClientId` int NOT NULL,
  `AccountId` int NOT NULL,
  KEY `ClientId_for_Accounts_idx` (`ClientId`),
  KEY `AccountId_for_Client_idx` (`AccountId`),
  CONSTRAINT `AccountId_for_Client` FOREIGN KEY (`AccountId`) REFERENCES `Accounts` (`AccountId`),
  CONSTRAINT `ClientId_for_Accounts` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`ClientId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccountClient`
--

LOCK TABLES `AccountClient` WRITE;
/*!40000 ALTER TABLE `AccountClient` DISABLE KEYS */;
INSERT INTO `AccountClient` VALUES (90,34);
/*!40000 ALTER TABLE `AccountClient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AccountSession`
--

DROP TABLE IF EXISTS `AccountSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountSession` (
  `SessionId` int NOT NULL AUTO_INCREMENT,
  `AccountId` int NOT NULL,
  `SessionToken` varchar(512) NOT NULL,
  `MadeOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SessionId`),
  UNIQUE KEY `SessionToken_UNIQUE` (`SessionToken`(255)),
  KEY `AccountId_idx` (`AccountId`),
  CONSTRAINT `AccountId` FOREIGN KEY (`AccountId`) REFERENCES `Accounts` (`AccountId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccountSession`
--

LOCK TABLES `AccountSession` WRITE;
/*!40000 ALTER TABLE `AccountSession` DISABLE KEYS */;
INSERT INTO `AccountSession` VALUES (1,34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYi5hbGVjLnJ1aXpAZ21haWwuY29tIiwiaWF0IjoxNjQ5Njg4NjQwLCJleHAiOjE2NDk3NzUwNDB9.i6dy89q-yPfZeIXSFRZoClO0L6dtjY7NWWRbFonIoW8','2022-04-11 10:50:40');
/*!40000 ALTER TABLE `AccountSession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accounts` (
  `AccountId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `MadeOn` datetime DEFAULT NULL,
  PRIMARY KEY (`AccountId`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES (34,'rob.alec.ruiz@gmail.com','$2b$10$r.Xiq7w0I9fxJMuOEIO4Y.wjK0M/6gUwWLFppF59IOef.ry/i3DP6',NULL),(37,'trliseS@hawaii.com','$2b$10$IOdY8pRVXcSNIcQIu3E8V.tsAk1./CncDqgJqKK01vcbZzEuYmFTi',NULL),(38,'roberto.ruiz@yahoo.com','$2b$10$fgwFLV/slqApFnoORm8rM.CZeVhkb8br/Ax5bQd3u1ffmz3mmF/Pm',NULL),(39,'tulior@gmail.com','$2b$10$LkPSCWF7tQbgvpAzlJScqul3hNc0iMK4ljK5WBPo9vgPzhKH17v2a',NULL),(40,'test@gmail.com','$2b$10$FpK7PMNMuP4y5KyFhfMeM.1N8vCnB0Esw.EIgoPNYZWwKQnLIapJe',NULL);
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `AddrId` int NOT NULL AUTO_INCREMENT,
  `StreetNo` varchar(45) NOT NULL,
  `StreetName` varchar(45) NOT NULL,
  `Apt` varchar(45) DEFAULT NULL,
  `ZipCode` varchar(45) NOT NULL,
  `City` varchar(45) NOT NULL,
  `State` varchar(2) NOT NULL,
  `Notes` varchar(360) DEFAULT NULL,
  PRIMARY KEY (`AddrId`),
  UNIQUE KEY `AddrId_UNIQUE` (`AddrId`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (84,'349','W 23 St','','33010','Hialeah','FL',NULL),(85,'30','W 19 St ','','33010','Hialeah','FL','Ahi que tomar medidas.'),(86,'67','W 19 St','','33010','Hialeah','FL',NULL),(87,'7795','W Flagler St','','33144','Miami','FL',NULL),(88,'3400','SW 105th Ave','','33165','Miami','FL',NULL),(89,'200','SE 15th Rd','','33129','Miami','FL',NULL),(90,'8452','SW 82nd Terr','','33143','Miami','FL',NULL),(91,'2101','NE 39th Terr','','33033','Homestead','FL',NULL),(92,'12151','SW 126 Terr','','33186','','FL','8440 SW 8th St apt 405  Miami  Cod: #405. Elevador directo 6736'),(93,'8440','SW 8th St','405','','','FL',NULL),(94,'8717','SW 214 St','','33189','Cutler Bay','FL',NULL),(95,'8717','SW 214 St','','33189','Cutler Bay','FL',NULL),(96,'83','W 19 St','','33010','Hialeah','FL',NULL),(97,'2927','NW 74 Ave','','','','FL',NULL),(98,'4630 ','SW 99 Ave','','33165','Miami','FL',NULL),(99,'15023','SW 149th Ct','','33196','Miami','FL',NULL),(100,'8405','Hammocks Blvd','4302','33193','Miami','FL','Cod: 1993'),(101,'15482','SW 11th Terr ','','33194','Miami','FL',NULL),(102,'3321','SW 98 Ave','','33165','33165','FL','En la rejita de la derecha'),(103,'6542','NW 171 st','','33015','Hialeah','FL',NULL),(104,'6524','Lakes Dr E','','','Miami Lakes','FL',NULL),(105,'14109','SW 121st Pl','','33186','Miami','FL',NULL),(106,'14850','Dade Pine Ave','','33014','Miami','FL',NULL),(107,'14850','Dade Pine Ave','','33014','Miami','FL',NULL),(108,'14850','Dade Pine Ave','','33014','Miami','FL',NULL),(109,'14850','Dade Pine Ave','','33014','Miami','FL',NULL),(110,'17945','SW 97 Ave','432','33157','Palmetto Bay ','FL',NULL),(111,'1651','Hammond Dr','','33166','Miami Spring','FL',NULL),(112,'13767','SW 149th Circle ln','Unit 2','33186','Miami','FL',NULL),(113,'9760','SW 155 Ave','','','Miami','FL',NULL),(114,'2450','SW 137 Ave ','203','33175','Miami','FL',NULL),(115,'14820','Dade Pine Ave','','','Miami Lakes','FL',NULL),(116,'22201','SW 88th Pat','','33190','Cutler Bay','FL',NULL),(117,'2846','SW 177 Terr','','33029','33029','FL',NULL),(118,'2846','SW 177 Terr ','','33029','Miramar','FL',NULL),(119,'288 ','Laurel way','','33166','Miami Spring','FL',NULL),(120,'9617 ','NW 8 th Circle','','33324','','FL',NULL),(121,'790 ','E 9 st','','33010','','FL',NULL),(122,'13420 ','SW 8 Ln','','33184','Miami ','FL',NULL),(123,'2927 ','NW 74 Ave ','','','Catalina Business','FL',NULL),(124,'3282 ','W 99th Pl ','','','Hialeah Bonterra','FL',NULL),(125,'1111 ','Brickel Bay Drive ','1607','33131','Miami ','FL',NULL),(126,'3251 ','SW 23 Terr ','','33145','Miami ','FL',NULL),(127,'10061 ','SW 166th Ave ','','33196','Miami ','FL',NULL),(128,'300','E 4 st ','103','33010','Hialeah ','FL',NULL),(129,'7870 ','NW 161 Terr ','','33016','Miami Lakes','FL',NULL),(130,'2221 ','SW 98th Ct ','','33165','Miami','FL',NULL),(131,'16431','SW 75 St','Miami','33193','','FL',NULL),(132,'16550','SW 68 ter','','33193','Lake Avila','FL',NULL),(133,'17501 ','NW 85th Ave ','','','Hialeah','FL',NULL),(134,'1061',' SW 27 Ave','','33135','Miami','FL',NULL),(135,'1351','SW 154 Ct','','33194','Miami ','FL',' / Dom-Casa: '),(136,'502 ','NW 87 Ave ','306','','','FL',NULL),(137,'16460','SW 99th Ln ','','33196','Miami','FL',NULL),(138,' 4880','NW 7th St','','33136','Miami ','FL',NULL),(139,'14825','SW 111th Terr','','33196','Miami ','FL',NULL),(140,'3231','S lake drive','','33155','Miami ','FL',NULL),(141,'3231 ','S lake drive','','33155','Miami ','FL',NULL),(142,'19501',' W Oakmont dr ','','33015','Miami Lakes','FL',NULL),(143,'10400 ','NW 129th St ','','33018','Hialeah ','FL',NULL),(144,'8971 ','NW 171 St','','33018','Hialeah ','FL',NULL),(145,'8971 ','NW 171 St ','','33018','Hialeah ','FL',NULL),(146,'2006 ','NW 139 Terr','','','Pembroke Pines','FL',NULL),(147,'9950','Jamaica dr ','','','Cutler Bay','FL',NULL),(148,'2528 ','SW 18 St','','33145','Miami ','FL',NULL),(149,'93 ','SW 79 Ct ','','','Miami	','FL',NULL),(150,'1221 ','Quail Ave ','','','Miami Spring ','FL',NULL),(151,'3720 ','SW 108 Ct ','','33165','Miami','FL',NULL),(152,'168 ','NW 33th St ','','33127','Miami ','FL',NULL),(153,'5705 ','W 20Th Ave','307','33012','Hialeah ','FL',NULL),(154,'3751','NW 12th St ','','33126','Miami ','FL',NULL),(155,'10815 ','NW 50th St ','205','33178','Miami ','FL',NULL),(156,'6601 ','Coconut Dr ','','33023','Miramar ','FL',NULL),(157,'9431','NW 20 St','','','Pembroke Pines','FL',NULL),(158,'18277','SW 138 Ct','','33177','Miami','FL',NULL),(159,'21931 ','SW 98 Ave ','','33190','Cutler Bay','FL',NULL),(160,'21931 ','SW 98 Ave','','33190','Cutler Bay','FL',NULL),(161,'18390 ','NW 91 Th Ct ','','','hialeah		','FL',NULL),(162,'9058','SW 148 Ct ','','33196','Miami','FL',NULL),(163,'16080 ',' SW 153rd Courd','','','Miami   ','FL',NULL),(164,'13135 ','SW 26 St','','33175','Miami ','FL',NULL),(165,'700 ','NE 63 St','D PH 5','33138','Miami','FL',NULL),(166,'693 ','West 63rd Drive','','33012','Hialeah ','FL',NULL),(167,'220 ','W 68 St','209 ','33014','Hialeah ','FL',NULL),(168,'13202 ','SW 142 Terr','','','','FL',NULL),(169,'11700 ','SW 182 Terr ','','','Miami','FL',NULL),(170,'15440',' SW 144th Ave','','33177','Miami','FL',NULL),(171,'15440','SW 144th Ave','','33177','Miami ','FL',NULL),(172,'14803 ','NW 87 Pl ','','33018','Hialeah ','FL',NULL),(173,'6911 ','Main Street','114 ','33014','Miami Lakes','FL',NULL),(174,'14173 ','SW 158 Ct ','','','Miami','FL',NULL),(175,'14173','SW 158 Ct ','','','Miami','FL',NULL),(176,'9352 ','SW 221 ST ','','','Cutler Bay','FL',NULL),(177,'30362 ','SW 163rd Ave','','33033','','FL',NULL),(178,'1135 ','NW 33 Ave ','LF','33125','Miami ','FL',NULL),(179,'465 ','W 11 St','5','33010','Hialeah ','FL',NULL),(180,'4620 ','SW 4th St','','33134','Coral gables ','FL',NULL),(181,'419 ','W 49 St','212','33012','Hialeah ','FL',NULL),(182,'9919','W Okeechobee Rd ','531D','33016','Hialeah ','FL',NULL),(183,'419','W 49 St','212','33012','Hialeah ','FL',NULL),(184,'6821 ','SW 154 Ct','','33193','Miami ','FL',NULL),(185,'6821 ','SW 154 Ct ','','33193','Miami ','FL',NULL),(186,'353 ','NE 37th Ave ','','33033','Homestead ','FL',NULL),(187,'3940 ','NW 79th Ave ','335			','33166','Doral ','FL',NULL),(188,'3940 ','NW 79th Ave ','335		','33166','Doral ','FL',NULL),(189,'16581 ','NW 84 Ave','','',' miami lakes','FL',NULL),(190,'9490 ','NW 41 st ','625 ','','Doral ','FL','Ir al garage 2 ir al elevadorcerca del contenedor de basura. Buscar a Elizabeth Alarcon en el IPAD	'),(191,'1000 ','NW 7th St','1202  ','33136','','FL',NULL),(192,'145 ','SW 13th St','332 ','33130','','FL',NULL),(193,'3108 ','SW 25th St','','','','FL',NULL),(194,'4515 ','SW 94 Ct','','','','FL',NULL),(195,'911 ','Granada Blv ','','','Coral Gables','FL',NULL),(196,'9920 ','SW 22nd St ','','','Miami','FL',NULL),(197,'850 ','Lugo Avenue ','','33156','Coral Gables','FL',NULL),(198,'8120 ','SW 13th Terr','','33144','Miami ','FL',NULL),(199,'1309 ','SW 154th Ct ','','33194','Miami','FL',NULL),(200,'8977 ','SW 123 Ct','103 ','33186','Miami ','FL',NULL),(201,'4278 ','SW 9th St','','33134','Miami ','FL',NULL),(202,'12','Yo','Quiero','Salir','de','FL','Mis algoritmos son lentos y tengo que hacer las cosas con hashes y caches'),(203,'Yo ','quiero','salir','de','esto','FL','Tomar medidas en cuanto el asunto de lo que es la vision para el futuro de a que lugar y como se va a mandar esto.'),(204,'349','W 23 St','','33010','Hialeah','FL',''),(205,'30','W 19 St','','33010','Hialeah','FL',''),(206,'30','W 19 St','','33010','Hialeah','FL',''),(207,'9251 ','W 34th Court ','','33018','Hialeah Gardens','FL',''),(208,'10934 ','SW 159terr','','','','FL',''),(209,'4811 ','NW 4th St','','','Miami','FL',''),(210,'4811 ','NW 4th St','','','Miami','FL',''),(211,'9251 ','W 34th Court ','','33018','Hialeah Gardens','FL',''),(212,'9251 ','W 34th Court','','33018','Hialeah Gardens','FL',''),(213,'17312 ','NW 66th place ','','33015','Miami Lakes','FL',''),(214,'3325 ','NW 79th Ave','','33122','Miami ','FL','Trabajo'),(215,'18640 ','SW 97th Pl','','','Cutler Bay','FL',''),(216,'13535 ','SW 114 Pl ','','33176','Miami ','FL',''),(217,'6475 ','SW 129 Place','403 ','33183','Miami ','FL',''),(218,'7801 ','NW 200 terr ','','33015','Miami ','FL',''),(219,'4880 ','NW 7th St','33136	','','Miami ','FL','Trabajo'),(220,'14825 ',' SW 111th Terr ','','33196','Miami','FL','Domingos'),(221,'2701 ','NW 107 Ave ','','33172','miami ','FL',''),(222,'13891 ','SW 102 terr ','','33186','Miami ','FL','Casa Cod:0474'),(223,'13891 ','SW 102 terr ','','33186','Miami ','FL','casa: cod: 0474	'),(224,'2701 ','NW 107 Ave','','33172','Miami ','FL',''),(225,'7508 ','NW 107 Pl ','','33178','Doral ','FL','( Juan Vazquez Dueño de la casa)  Codigo: 7508 J Vazquez	'),(226,'14939 ','SW 11th Lane ','','33194','','FL',''),(227,'145 ','SW 12th St ','330  ','33130','Miami ','FL',''),(228,'1651 ','Hammond Dr','','33166',' Miami Spring','FL',''),(229,'11125 ','NW 29 St','','33172','Miami ','FL',''),(230,'20180 ','SW 188 St ','','33187','Miami ','FL','Domingo: entrar x 201'),(231,'8401 ','SW 107 th Ave','112E ','33173','Miami ','FL',''),(232,'8401 ','SW 107 th Ave ','112E ','33173','Miami','FL',''),(233,'460 ','NW 86 Pl ','1','33126','Miami ','FL',''),(234,'460 ','NW 86 Pl ','1','33126','Miami ','FL',''),(235,'962 ','Plover Ave','','33166','Miami Springs ','FL',''),(236,'962 ','Plover Ave ','','33166','Miami Springs','FL',''),(237,'459 ','SW 20rd','','33129','Miami ','FL',''),(238,'5120 ','SW 98th Ave rd','','33165','Miami ','FL',''),(239,'671 ','Wren Ave','','33166',' Miami Springs','FL',''),(240,'671 ','Wren Ave Miami Springs ','','33166','','FL',''),(241,'1475 ','W Flagler St','206 ','33135','Miami ','FL',''),(242,'6860 ','SW 45 Ln ','8','','Gables Point ','FL',''),(243,'700 ','NE 63 St','D406','33138','Miami ','FL',''),(244,'7561 ','NW 176 Terr','','33015','Hialeah ','FL','Lilandia Estates	'),(245,'15815 ','SW 88 Ct','','33157','Palmetto Bay ','FL',''),(246,'15815 ','SW 88 Ct','','33157','Palmetto Bay ','FL',''),(247,'13833 ','SW 84th St','','33183','Miami ','FL',''),(248,'10822 ','SW 89 Terr','','33176','Miami ','FL','Cod: *4384 1er complejo a mano derecha	'),(249,'3535 ','SW 152 Pass','','33185','Miami ','FL',''),(250,'3535 ','SW 152 Pass','','33185','Miami ','FL',''),(251,'16431 ','SW 75 St','','33193','Miami ','FL',''),(252,'12','Trelise','','33421','Hialeah','FL',NULL),(253,'12','W 23rd St','','33212','Hialeah','FL',NULL),(254,'45','tHIRr','','32142','Hialeah','FL',''),(255,'22','Yurt St','11','39423','Hialeah','FL',''),(256,'15369','SW 71st Terr','','33193','Miami','FL','gate code 024 / West wind lakes townhomes'),(257,'23','Lenford Ave','','33212','Hialeah','FL',NULL),(258,'32','I Thirty Second St','','32331','Hialeah','FL',NULL),(259,'45','W End St','1','33322','Hialeah','FL','Bring it to the backdoor, please and thank you'),(260,'56','Trelise Rnd','1','23231','Hialeah','FL',''),(261,'56','Trelise Rnd','1','23231','Hialeah','FL',''),(262,'12','Gah','','23919','Cuit','FL',NULL),(263,'12','Yus','12','OIJ92','Cuit','FL',''),(264,'54','HOg','2399','wriji','3993399333','FL',''),(265,'','','','','','FL',''),(266,'','','','','','FL',''),(267,'','','','','','FL',''),(268,'Cuando','me tengo ','que','ba','','FL',''),(269,'Cuando','me tengo ','que','ba','','FL',''),(270,'28','Trae Rd','12','33145','Hialeah','FL',''),(271,'Guapo','Muah','Si si','','','FL',''),(272,'Encyclopedia','Reader','Pushi','de','homeschool','FL',''),(273,'','','','','','FL',''),(274,'Guapo','Muah','Si si','','','FL',''),(275,'Encyclopedia','Reader','Pushi','de','homeschool','FL',''),(276,'B ahamian','','','','','FL',''),(277,'B ahamian','','','','','FL',''),(278,'B ahamian','Mon','','','','FL',''),(279,'Boooob','my','timbers','','','FL',''),(280,'Ske','','','','','FL',''),(281,'Ske','','','','','FL',''),(282,'You','live ','in ','my ','dreams','FL',''),(283,'You','live ','in ','my ','dreams','FL',''),(284,'Ske','sss','','','','FL',''),(285,'You','live ','in ','my ','dreams','FL',''),(286,'Ske','','','','','FL',''),(287,'Ske','','','','','FL',''),(288,'You','live ','in ','my ','dreams','FL',''),(289,'','','','','','FL','');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClientAddress`
--

DROP TABLE IF EXISTS `ClientAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClientAddress` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClientId` int NOT NULL,
  `AddrId` int NOT NULL,
  `IsPrimary` tinyint(1) NOT NULL,
  `Details` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `ClientId_idx` (`ClientId`),
  KEY `AddrId_idx` (`AddrId`),
  CONSTRAINT `AddrId` FOREIGN KEY (`AddrId`) REFERENCES `Address` (`AddrId`),
  CONSTRAINT `ClientId` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`ClientId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClientAddress`
--

LOCK TABLES `ClientAddress` WRITE;
/*!40000 ALTER TABLE `ClientAddress` DISABLE KEYS */;
INSERT INTO `ClientAddress` VALUES (254,90,270,1,NULL);
/*!40000 ALTER TABLE `ClientAddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Clients`
--

DROP TABLE IF EXISTS `Clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Clients` (
  `ClientId` int NOT NULL AUTO_INCREMENT,
  `FistName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Phone1` varchar(45) NOT NULL,
  `Phone2` varchar(45) DEFAULT NULL,
  `Active` tinyint(1) NOT NULL,
  `Restrictions` tinyint(1) NOT NULL,
  `DietId` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SpcInst` tinyint(1) NOT NULL,
  `WeeklyMeal` varchar(50) NOT NULL,
  PRIMARY KEY (`ClientId`),
  UNIQUE KEY `ClientId_UNIQUE` (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Clients`
--

LOCK TABLES `Clients` WRITE;
/*!40000 ALTER TABLE `Clients` DISABLE KEYS */;
INSERT INTO `Clients` VALUES (90,'Test','Client Example','(000) 000-0000','(344) 343-4343',1,0,'REG',0,'00220313223130131301313013130100000');
/*!40000 ALTER TABLE `Clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Diet`
--

DROP TABLE IF EXISTS `Diet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Diet` (
  `DietId` varchar(3) NOT NULL,
  PRIMARY KEY (`DietId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Diet`
--

LOCK TABLES `Diet` WRITE;
/*!40000 ALTER TABLE `Diet` DISABLE KEYS */;
INSERT INTO `Diet` VALUES ('ATL'),('KTO'),('PSC'),('REG'),('TRD'),('VEG');
/*!40000 ALTER TABLE `Diet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dish`
--

DROP TABLE IF EXISTS `Dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dish` (
  `DishId` int NOT NULL AUTO_INCREMENT,
  `DietId` varchar(3) NOT NULL,
  `DishDescription` varchar(128) DEFAULT NULL,
  `Calories` int DEFAULT NULL,
  `Proteins` int DEFAULT NULL,
  `Carbohydrates` int DEFAULT NULL,
  `Fats` int DEFAULT NULL,
  PRIMARY KEY (`DishId`),
  KEY `DietId_idx` (`DietId`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dish`
--

LOCK TABLES `Dish` WRITE;
/*!40000 ALTER TABLE `Dish` DISABLE KEYS */;
INSERT INTO `Dish` VALUES (85,'ATL','Protein Shake',300,30,10,2),(86,'ATL','Bacon Burrito',270,20,5,30),(87,'ATL','Whey Protein Shake',270,30,2,0),(88,'REG','Meat and Potatoes',200,10,40,10),(89,'REG','Nutty Oatmeal',300,30,20,17),(90,'REG','Protein Pancakes with Acai Superberry Compote',210,20,4,0),(91,'REG','Scrambled Eggs with Cheese',220,30,0,24),(92,'REG','Mixed Fruit Protein Pancakes',223,21,0,10),(93,'REG','Veggies Eggs Muffins',210,22,2,0),(94,'REG','Sheet Pan Jambalaya Chicken and Andouille Sausage',330,23,0,12),(95,'REG','The Best Swedish Meatballs',120,30,5,0),(96,'REG','Spinach and Cheese Ravioli with Francaise Sauce',370,25,0,2),(97,'REG','Tex-Mex Pork Fajitas with Peppers and Onions',350,30,10,0),(98,'REG','Garlic Lover Peppers Steak Stir-Fry',550,28,0,16),(99,'REG','Atlantic Salmon with Broccoli',310,36,0,14),(100,'REG','Beef and Couscous Bowl',392,36,0,14),(101,'REG','Canned Tuna Tacos with Scallion Crema',375,30,0,24),(102,'REG','Rib Eye Steak Panini',220,14,0,2),(103,'REG','Magnolian Pork Chops',275,20,0,10),(104,'REG','Chipotle Shrimp Bowl',410,21,0,1),(105,'REG','Chicken Broccoli Casserole',239,21,0,10),(106,'REG','Sesame Crusted Fish',270,28,0,5),(107,'REG','Crock Pot Salsa Chicken Bowl',290,25,6,0),(108,'REG','One Pot Lemon Herb Chicken and Rice',210,20,5,0),(109,'REG','Extra Bake Tortollini with Meat Sauce',385,22,12,0),(110,'REG','Ground Turkey Lasagna',450,27,4,1),(111,'REG','Elsi Garlic White Fish with Vegetables',210,27,4,1),(112,'REG','Chicken with Rice Spanish Style',250,10,6,3),(113,'REG','Greek-Style Stuffed Pepper',210,25,3,6),(114,'KTO','Baked Egg Skillet with Avocado',125,19,2,0),(115,'KTO','Keto Chicken with Sauce Jambalaya',230,32,6,0),(116,'KTO','The Best Swedish Meatballs',120,30,5,0),(117,'KTO','Keto Garlic Lover Peppers Steak-Fry',215,22,6,0),(118,'KTO','Scrambled Eggs with Cheese and Bacon',130,22,3,0),(119,'KTO','Tomato Spinach Chicken Salad',225,25,10,0),(120,'KTO','Salad with Almond Eggs and Spinach',175,22,5,0),(121,'KTO','Chipotle Shrimp Bowl',180,19,8,0),(122,'KTO','Crispy Chickpeas Cob Salad',210,30,11,0),(123,'KTO','Spring Vegetable Egg Muffin',120,20,1,0),(124,'KTO','Keto Sweet and Spice Pork ',220,30,4,0),(125,'KTO','Shredded Chicken Chili Bowl',150,30,5,0),(126,'KTO','Fritata with Tomatoes and Cheese',135,20,3,0),(127,'KTO','Elsi Garlic White Fish with Vegetables',215,32,8,0),(128,'KTO','Tex-Mex Ground Turkey Taco',185,28,8,0),(129,'PSC','Vegan Chocolate Pancake',220,18,4,0),(130,'PSC','Lemon Red Snapper with Herbed Butter',180,25,4,0),(131,'PSC','Atlantic Salmon',150,32,5,0),(132,'PSC','Scrambled Egg with Spinach',120,20,2,0),(133,'PSC','Cilantro Lime Fish',135,32,5,0),(134,'PSC','White Fish and Vegetables',130,28,4,0),(135,'PSC','Scrambled Egg on Toast with Tomatoes',125,28,2,0),(136,'PSC','Creamy Parmesan Shrimp',250,28,10,0),(137,'PSC','BBQ Grouper and Warm Pineapple Salad',125,28,6,0),(138,'PSC','Protein Pancakes',235,18,4,6),(139,'PSC','Roasted Cod with Cherry Tomatoes',150,30,4,0),(140,'PSC','Jamaican Steamed Fish',125,28,3,4),(141,'PSC','The Best Egg Salad',135,20,3,5),(142,'PSC','Mediterranean Tuna Salad',150,21,4,6),(143,'PSC','Fish Taco Salad',125,28,4,0),(144,'VEG','Vegan Chocolate Pancake',220,18,4,0),(145,'VEG','Quinoa and Smoked Tofu',145,22,5,0),(146,'VEG','Macro Bowl Yams and Cramberries',125,18,8,0),(147,'VEG','Scrambled Egg with Spinach',120,20,2,0),(148,'VEG','Fajita Veggie Burger Bowls',210,18,5,0),(149,'VEG','Sugar Snap Pea and Carrot Soba Noodles',150,20,8,0),(150,'VEG','Scrambled Egg on Toast with Tomatoes',125,20,2,0),(151,'VEG','Black Bean and Avocado Burrito Bowl',210,16,6,0),(152,'VEG','Creamy Butternut Squash Linguine w Fried Sage',255,16,8,0),(153,'VEG','Protein Pancakes',235,18,4,6),(154,'VEG','Sweet Potato and Black Bean Veggie Burger',130,20,8,0),(155,'VEG','Vegetable Paella',210,18,5,0),(156,'VEG','The Best Egg Salad',135,20,3,5),(157,'VEG','Spicy Peanut Sauce W Sweet Potato',125,22,5,0),(158,'VEG','Bake Cheese Tortellini',130,18,5,0),(159,'REG','Salad dressed in truffle oil',223,3,1,2),(160,'REG','The Best French Meatballs',200,42,20,2),(161,'REG','The Best Spanish Meatballs',200,21,21,21),(162,'REG','Irish Porridge',200,23,21,2),(163,'REG','Irish Oatmeal',200,20,21,2),(164,'REG','Sheet Pan of Doom',123,123,123,132);
/*!40000 ALTER TABLE `Dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Menus`
--

DROP TABLE IF EXISTS `Menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Menus` (
  `MenuDate` date NOT NULL,
  `DietId` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `BFast01` varchar(8) DEFAULT NULL,
  `BFast02` varchar(8) DEFAULT NULL,
  `Lunch` varchar(8) DEFAULT NULL,
  `Dinner` varchar(8) DEFAULT NULL,
  `Extra1` varchar(8) DEFAULT NULL,
  `Extra2` varchar(8) DEFAULT NULL,
  `Extra3` varchar(8) DEFAULT NULL,
  `Snack` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Menus`
--

LOCK TABLES `Menus` WRITE;
/*!40000 ALTER TABLE `Menus` DISABLE KEYS */;
INSERT INTO `Menus` VALUES ('2022-01-18','REG','',NULL,'','','','',NULL,''),('2022-01-16','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-17','REG','89',NULL,'','','88','89',NULL,''),('2022-01-16','REG','89',NULL,'','','88','89',NULL,''),('2022-01-18','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-19','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-20','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-21','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-22','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-19','REG','',NULL,'','','','',NULL,''),('2022-01-20','REG','',NULL,'','','','',NULL,''),('2022-01-22','REG','',NULL,'','','','',NULL,''),('2022-01-17','KTO','',NULL,'','','',NULL,NULL,''),('2022-01-21','REG','',NULL,'','','','',NULL,''),('2022-01-16','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-18','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-17','ATL','87',NULL,'87','','',NULL,NULL,''),('2022-01-21','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-20','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-19','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-22','ATL','',NULL,'','','',NULL,NULL,''),('2022-01-18','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-17','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-16','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-19','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-20','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-22','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-21','VEG','',NULL,'','','',NULL,NULL,''),('2022-01-02','REG','',NULL,'','','','',NULL,''),('2022-01-03','REG','90',NULL,'94','98','99','100',NULL,''),('2022-01-04','REG','91',NULL,'95','101','102','103',NULL,''),('2022-01-02','KTO','',NULL,'','','','',NULL,''),('2022-01-06','KTO','',NULL,'','','','',NULL,''),('2022-01-04','KTO','',NULL,'','','','',NULL,''),('2022-01-05','KTO','',NULL,'','','','',NULL,''),('2022-01-07','KTO','',NULL,'','','','',NULL,''),('2022-01-08','KTO','',NULL,'','','','',NULL,''),('2022-01-06','REG','93',NULL,'97','107','108','109',NULL,''),('2022-01-08','REG','',NULL,'','','','',NULL,''),('2022-01-05','REG','92',NULL,'96','104','105','106',NULL,''),('2022-01-03','KTO','114',NULL,'115','95','','',NULL,''),('2022-01-07','REG','92',NULL,'110','111','112','113',NULL,''),('2022-01-09','REG','',NULL,'','','','',NULL,''),('2022-01-10','REG','90',NULL,'94','98','99','100',NULL,''),('2022-01-12','REG','92',NULL,'96','104','105','106',NULL,''),('2022-01-13','REG','93',NULL,'97','107','108','109',NULL,''),('2022-01-14','REG','92',NULL,'110','111','112','113',NULL,''),('2022-01-15','REG','',NULL,'','','','',NULL,''),('2022-01-11','REG','91',NULL,'95','101','102','103',NULL,''),('2022-01-09','KTO','',NULL,'','','','',NULL,''),('2022-01-10','KTO','114',NULL,'115','117','','',NULL,''),('2022-01-11','KTO','118',NULL,'119','116','','',NULL,''),('2022-01-12','KTO','120',NULL,'104','122','','',NULL,''),('2022-01-13','KTO','123',NULL,'124','125','','',NULL,''),('2022-01-14','KTO','126',NULL,'111','128','','',NULL,''),('2022-01-15','KTO','',NULL,'','','','',NULL,''),('2022-01-09','PSC','',NULL,'','','','',NULL,''),('2022-01-10','PSC','129',NULL,'130','131','','',NULL,''),('2022-01-11','PSC','132',NULL,'133','134','','',NULL,''),('2022-01-12','PSC','135',NULL,'136','137','','',NULL,''),('2022-01-13','PSC','138',NULL,'139','140','','',NULL,''),('2022-01-14','PSC','141',NULL,'142','143','','',NULL,''),('2022-01-15','PSC','',NULL,'','','','',NULL,''),('2022-01-09','VEG','',NULL,'','','','',NULL,''),('2022-01-10','VEG','129',NULL,'145','146','','',NULL,''),('2022-01-11','VEG','132',NULL,'148','149','','',NULL,''),('2022-01-12','VEG','135',NULL,'151','152','','',NULL,''),('2022-01-13','VEG','138',NULL,'154','155','','',NULL,''),('2022-01-14','VEG','141',NULL,'157','158','','',NULL,''),('2022-01-15','VEG','',NULL,'','','','',NULL,''),('2022-01-09','ATL','',NULL,'','','','',NULL,''),('2022-01-10','ATL','',NULL,'','','','',NULL,''),('2022-01-11','ATL','',NULL,'','','','',NULL,''),('2022-01-12','ATL','',NULL,'','','','',NULL,''),('2022-01-13','ATL','',NULL,'','','','',NULL,''),('2022-01-14','ATL','',NULL,'','','','',NULL,''),('2022-01-15','ATL','',NULL,'','','','',NULL,''),('2022-01-23','KTO','',NULL,'','','','',NULL,''),('2022-01-24','KTO','',NULL,'','','','',NULL,''),('2022-01-26','KTO','',NULL,'','','','',NULL,''),('2022-01-23','REG','',NULL,'','','','',NULL,''),('2022-01-25','KTO','',NULL,'','','','',NULL,''),('2022-01-27','REG','89',NULL,'163','98','94','',NULL,'90'),('2022-01-28','REG','91',NULL,'108','96','100','',NULL,'96'),('2022-01-26','REG','90',NULL,'95','102','97','',NULL,'101'),('2022-01-25','REG','91',NULL,'93','95','','',NULL,'94'),('2022-01-29','REG','',NULL,'','','','',NULL,''),('2022-01-27','KTO','',NULL,'','','','',NULL,''),('2022-01-29','KTO','',NULL,'','','','',NULL,''),('2022-01-28','KTO','',NULL,'','','','',NULL,''),('2022-01-24','REG','90',NULL,'88','94','','',NULL,'89'),('2022-02-27','REG','',NULL,'','','','',NULL,''),('2022-02-28','KTO','',NULL,'','','','',NULL,''),('2022-02-27','KTO','',NULL,'','','','',NULL,''),('2022-02-28','REG','89',NULL,'90','88','94','',NULL,'100'),('2022-03-01','KTO','',NULL,'','','','',NULL,''),('2022-03-03','KTO','',NULL,'','','','',NULL,''),('2022-03-02','KTO','',NULL,'','','','',NULL,''),('2022-03-04','KTO','',NULL,'','','','',NULL,''),('2022-03-05','KTO','',NULL,'','','','',NULL,''),('2022-03-05','REG','',NULL,'','','','',NULL,''),('2022-03-03','REG','99',NULL,'102','97','94','',NULL,'90'),('2022-02-27','PSC','',NULL,'','','','',NULL,''),('2022-03-04','REG','91',NULL,'93','91','91','',NULL,'90'),('2022-02-28','PSC','',NULL,'','','','',NULL,''),('2022-03-01','REG','90',NULL,'92','93','95','',NULL,'89'),('2022-03-02','REG','110',NULL,'102','101','93','',NULL,'91'),('2022-03-04','PSC','',NULL,'','','','',NULL,''),('2022-03-02','PSC','',NULL,'','','','',NULL,''),('2022-03-05','PSC','',NULL,'','','','',NULL,''),('2022-03-03','PSC','',NULL,'','','','',NULL,''),('2022-03-01','PSC','',NULL,'','','','',NULL,''),('2022-04-04','REG','89',NULL,'88','89','164','112',NULL,'96'),('2022-04-03','KTO','114',NULL,'115','128','115','119',NULL,'115'),('2022-04-05','REG','',NULL,'','','','',NULL,''),('2022-04-03','REG','89',NULL,'88','89','94','100',NULL,'100'),('2022-04-09','REG','',NULL,'','','','',NULL,''),('2022-04-06','REG','',NULL,'','','','',NULL,''),('2022-04-07','REG','',NULL,'','','','',NULL,''),('2022-04-08','REG','',NULL,'','','','',NULL,''),('2022-04-05','KTO','',NULL,'','','','',NULL,''),('2022-04-09','KTO','',NULL,'','','','',NULL,''),('2022-04-08','KTO','',NULL,'','','','',NULL,''),('2022-04-07','KTO','',NULL,'','','','',NULL,''),('2022-04-06','KTO','',NULL,'','','','',NULL,''),('2022-04-04','KTO','',NULL,'','','','',NULL,'');
/*!40000 ALTER TABLE `Menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prices`
--

DROP TABLE IF EXISTS `Prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prices` (
  `idPrices` int NOT NULL AUTO_INCREMENT,
  `MealType` varchar(9) NOT NULL,
  `DietId` varchar(3) NOT NULL,
  `Cost` decimal(6,2) NOT NULL,
  PRIMARY KEY (`idPrices`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prices`
--

LOCK TABLES `Prices` WRITE;
/*!40000 ALTER TABLE `Prices` DISABLE KEYS */;
INSERT INTO `Prices` VALUES (1,'BFast','REG',10.10),(2,'Lunch','REG',15.10),(3,'Dinner','REG',15.90),(4,'Extra','REG',17.90),(5,'Snack','REG',8.05),(6,'BFast','KTO',10.10),(7,'Lunch','KTO',15.10),(8,'Dinner','KTO',15.90),(9,'Extra','KTO',17.90),(10,'Snack','KTO',8.05),(11,'BFast','ATL',12.10),(12,'Lunch','ATL',17.10),(13,'Dinner','ATL',17.90),(14,'Extra','ATL',20.90),(15,'Snack','ATL',10.05),(16,'BFast','PSC',10.10),(17,'Lunch','PSC',15.10),(18,'Dinner','PSC',15.90),(19,'Extra','PSC',17.90),(20,'Snack','PSC',8.05),(21,'BFast','TRD',10.10),(22,'Lunch','TRD',15.10),(23,'Dinner','TRD',15.90),(24,'Extra','TRD',17.90),(25,'Snack','TRD',8.05),(26,'BFast','VEG',10.10),(27,'Lunch','VEG',15.10),(28,'Dinner','VEG',15.90),(29,'Extra','VEG',17.90),(30,'Snack','VEG',8.05);
/*!40000 ALTER TABLE `Prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RestClient`
--

DROP TABLE IF EXISTS `RestClient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RestClient` (
  `RestId` int NOT NULL,
  `ClientId` int NOT NULL,
  `CreatedOn` date NOT NULL,
  `ExpiredOn` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RestClient`
--

LOCK TABLES `RestClient` WRITE;
/*!40000 ALTER TABLE `RestClient` DISABLE KEYS */;
INSERT INTO `RestClient` VALUES (69,94,'2022-01-16',NULL),(70,96,'2022-01-16',NULL),(71,96,'2022-01-16',NULL),(76,96,'2022-01-16',NULL),(75,96,'2022-01-16',NULL),(70,98,'2022-01-16',NULL),(77,98,'2022-01-16',NULL),(78,98,'2022-01-16',NULL),(79,99,'2022-01-16',NULL),(80,100,'2022-01-16',NULL),(81,100,'2022-01-16',NULL),(82,106,'2022-01-16',NULL),(83,106,'2022-01-16',NULL),(84,107,'2022-01-16',NULL),(80,107,'2022-01-16',NULL),(71,112,'2022-01-16',NULL),(70,112,'2022-01-16',NULL),(85,112,'2022-01-16',NULL),(77,118,'2022-01-17',NULL),(86,119,'2022-01-17',NULL),(77,119,'2022-01-17',NULL),(78,119,'2022-01-17',NULL),(80,119,'2022-01-17',NULL),(70,122,'2022-01-17',NULL),(71,122,'2022-01-17',NULL),(87,122,'2022-01-17',NULL),(76,125,'2022-01-17',NULL),(84,128,'2022-01-17',NULL),(82,128,'2022-01-17',NULL),(88,132,'2022-01-17',NULL),(76,132,'2022-01-17',NULL),(80,135,'2022-01-17',NULL),(76,135,'2022-01-17',NULL),(89,139,'2022-01-17',NULL),(90,139,'2022-01-17',NULL),(70,139,'2022-01-17',NULL),(91,139,'2022-01-17',NULL),(71,139,'2022-01-17',NULL),(87,141,'2022-01-17',NULL),(80,141,'2022-01-17',NULL),(72,141,'2022-01-17',NULL),(92,143,'2022-01-17',NULL),(72,144,'2022-01-17',NULL),(92,144,'2022-01-17',NULL),(93,145,'2022-01-17',NULL),(70,145,'2022-01-17',NULL),(98,145,'2022-01-17',NULL),(96,145,'2022-01-17',NULL),(95,145,'2022-01-17',NULL),(94,145,'2022-01-17',NULL),(80,145,'2022-01-17',NULL),(97,145,'2022-01-17',NULL),(99,146,'2022-01-17',NULL),(71,147,'2022-01-17',NULL),(100,147,'2022-01-17',NULL),(90,151,'2022-01-17',NULL),(101,151,'2022-01-17',NULL),(72,152,'2022-01-17',NULL),(71,153,'2022-01-17',NULL),(84,154,'2022-01-17',NULL),(102,155,'2022-01-17',NULL),(85,158,'2022-01-17',NULL),(70,158,'2022-01-17',NULL),(71,158,'2022-01-17',NULL),(70,158,'2022-01-17',NULL),(85,158,'2022-01-17',NULL),(71,158,'2022-01-17',NULL),(71,158,'2022-01-17',NULL),(70,158,'2022-01-17',NULL),(85,158,'2022-01-17',NULL),(85,161,'2022-01-17',NULL),(71,161,'2022-01-17',NULL),(85,162,'2022-01-17',NULL),(71,162,'2022-01-17',NULL),(84,162,'2022-01-17',NULL),(80,163,'2022-01-17',NULL),(90,164,'2022-01-17',NULL),(104,164,'2022-01-17',NULL),(105,164,'2022-01-17',NULL),(103,164,'2022-01-17',NULL),(84,166,'2022-01-17',NULL),(78,170,'2022-01-17',NULL),(84,171,'2022-01-17',NULL),(70,172,'2022-01-17',NULL),(71,172,'2022-01-17',NULL),(106,172,'2022-01-17',NULL),(76,174,'2022-01-17',NULL),(107,174,'2022-01-17',NULL),(71,178,'2022-01-17',NULL),(93,179,'2022-01-17',NULL),(90,180,'2022-01-17',NULL),(75,181,'2022-01-17',NULL),(72,181,'2022-01-17',NULL),(108,181,'2022-01-17',NULL),(75,183,'2022-01-17',NULL),(90,184,'2022-01-17',NULL),(90,185,'2022-01-17',NULL),(109,189,'2022-01-17',NULL),(101,190,'2022-01-17',NULL),(106,190,'2022-01-17',NULL),(90,191,'2022-01-17',NULL),(84,191,'2022-01-17',NULL),(110,192,'2022-01-17',NULL),(77,193,'2022-01-17',NULL),(80,197,'2022-01-17',NULL),(84,197,'2022-01-17',NULL),(106,198,'2022-01-17',NULL),(106,198,'2022-01-17',NULL),(71,199,'2022-01-17',NULL),(78,200,'2022-01-17',NULL),(111,201,'2022-01-17',NULL),(71,201,'2022-01-17',NULL),(112,202,'2022-01-17',NULL),(104,202,'2022-01-17',NULL),(113,204,'2022-01-17',NULL),(114,204,'2022-01-17',NULL),(78,204,'2022-01-17',NULL),(71,205,'2022-01-17',NULL),(71,206,'2022-01-17',NULL),(96,207,'2022-01-17',NULL),(78,209,'2022-01-17',NULL),(115,211,'2022-01-17',NULL),(116,215,'2022-01-17',NULL),(85,215,'2022-01-17',NULL),(115,215,'2022-01-17',NULL),(117,215,'2022-01-17',NULL),(119,215,'2022-01-17',NULL),(118,215,'2022-01-17',NULL),(69,242,'2022-01-21',NULL),(111,242,'2022-01-21','2022-01-21'),(123,242,'2022-01-21','2022-01-21'),(79,242,'2022-01-21',NULL),(83,242,'2022-01-21',NULL),(98,244,'2022-01-21',NULL),(83,243,'2022-01-21','2022-01-21'),(106,96,'2022-01-24',NULL),(69,247,'2022-01-24',NULL),(69,247,'2022-01-24',NULL);
/*!40000 ALTER TABLE `RestClient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RestDish`
--

DROP TABLE IF EXISTS `RestDish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RestDish` (
  `RestId` int NOT NULL,
  `DishId` int NOT NULL,
  KEY `RestId_idx` (`RestId`),
  KEY `DishId_idx` (`DishId`),
  CONSTRAINT `DishId` FOREIGN KEY (`DishId`) REFERENCES `Dish` (`DishId`),
  CONSTRAINT `RestId` FOREIGN KEY (`RestId`) REFERENCES `Restriction` (`RestId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RestDish`
--

LOCK TABLES `RestDish` WRITE;
/*!40000 ALTER TABLE `RestDish` DISABLE KEYS */;
INSERT INTO `RestDish` VALUES (120,85),(88,85),(121,86),(122,86),(120,87),(105,88),(69,89),(80,90),(76,91),(122,91),(100,92),(80,92),(122,93),(77,94),(93,95),(76,96),(101,97),(119,97),(85,97),(82,99),(71,99),(89,99),(93,100),(110,101),(78,103),(84,104),(89,105),(77,105),(71,106),(106,106),(77,107),(77,108),(71,111),(106,111),(77,112),(85,113),(99,114),(122,114),(77,115),(93,95),(85,117),(122,118),(96,118),(76,118),(121,118),(77,119),(118,119),(96,119),(122,120),(96,120),(84,104),(122,123),(78,124),(77,125),(87,125),(118,126),(76,126),(71,111),(106,111),(101,128),(80,129),(107,129),(71,130),(106,130),(71,131),(106,131),(122,132),(96,132),(71,133),(106,133),(106,134),(71,134),(122,135),(118,135),(79,136),(70,136),(106,136),(71,137),(106,137),(80,138),(71,139),(106,139),(118,139),(71,140),(122,141),(71,142),(110,142),(71,143),(80,129),(86,145),(96,132),(122,132),(102,149),(118,135),(122,135),(99,151),(95,151),(104,152),(80,138),(105,154),(95,154),(122,141),(111,157),(105,157),(101,157),(76,158),(106,99),(69,99),(96,96),(78,97),(93,102),(77,160),(93,161),(78,161),(71,162),(69,162),(71,163),(69,163),(70,164);
/*!40000 ALTER TABLE `RestDish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Restriction`
--

DROP TABLE IF EXISTS `Restriction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Restriction` (
  `RestId` int NOT NULL AUTO_INCREMENT,
  `RestDescription` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`RestId`),
  UNIQUE KEY `RestId_UNIQUE` (`RestId`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Restriction`
--

LOCK TABLES `Restriction` WRITE;
/*!40000 ALTER TABLE `Restriction` DISABLE KEYS */;
INSERT INTO `Restriction` VALUES (69,' High Carbs'),(70,' Shellfish / Mariscos'),(71,' Fish / Pescado'),(72,' Eggs'),(73,' Huevo Frito'),(74,' Cheese'),(75,' Huevo Frito / Fried Eggs'),(76,' Queso / Cheese'),(77,' Pollo / Chicken'),(78,' Puerco / Pork'),(79,' Camaron / Shrimp'),(80,' Pancakes'),(81,' Waffles'),(82,' Salmon'),(83,' Cereal'),(84,' Camarones / Shrimp'),(85,' Aji / Peppers'),(86,' Quinoa'),(87,' Chili'),(88,' Lacteos / Lacteous'),(89,' Broccoli'),(90,' Hongos / Mushrooms'),(91,' Esparragos / Asparagus'),(92,' Semillas / Seeds'),(93,' Res / Beef'),(94,' Fresa / Strawberry'),(95,' Frijoles / Beans'),(96,' Espinaca / Spinach'),(97,' Blueberry'),(98,' Sirope / Syrup'),(99,' Aguacate / Avocado'),(100,' Frutas / Fruits'),(101,' Picante / Spicy'),(102,' Peas'),(103,' Piña / Pinneaple'),(104,' Calabaza / Squash / Pumpkin'),(105,' Boniato / Sweet Potatoes'),(106,' Del Mar / Seafood'),(107,' Chocolate'),(108,' Huevo Hervidos / Boiled Eggs'),(109,' Blueberry Muffin'),(110,' Atun / Tuna'),(111,' Mani / Peanuts'),(112,' Calabacin / Zuchini'),(113,' Maiz / Corn'),(114,' Sal / Salt'),(115,' Remolacha / Beets'),(116,' Mayonesa / Mayonnaise'),(117,' Vinagre / Vinager'),(118,' Tomate / Tomato'),(119,' Cebolla / Onions'),(120,' Whey / Suero de Leche'),(121,' Bacon / Tocino'),(122,' Eggs / Huevos');
/*!40000 ALTER TABLE `Restriction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schedule` (
  `Date` date NOT NULL,
  `ClientId` int NOT NULL,
  `BFast` varchar(8) DEFAULT NULL,
  `Lunch` varchar(8) DEFAULT NULL,
  `Dinner` varchar(8) DEFAULT NULL,
  `Extra` varchar(8) DEFAULT NULL,
  `Snack` varchar(8) DEFAULT NULL,
  `AddrId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule`
--

LOCK TABLES `Schedule` WRITE;
/*!40000 ALTER TABLE `Schedule` DISABLE KEYS */;
INSERT INTO `Schedule` VALUES ('2022-02-27',90,'','','','','',284),('2022-02-27',90,'','','','','',284),('2022-02-28',90,'89','90','88','94','100',284),('2022-02-28',90,'89','','88','94','100',284),('2022-02-28',90,'89','','88','','',284),('2022-03-01',90,'90','92','93','','89',284),('2022-03-01',90,'90','','93','','',284),('2022-03-01',90,'90','','93','','',284),('2022-03-02',90,'110','102','101','','91',284),('2022-03-02',90,'110','','101','','',284),('2022-03-02',90,'110','','101','','',284),('2022-03-03',90,'99','102','97','','90',284),('2022-03-03',90,'99','','97','','',284),('2022-03-03',90,'99','','97','','',284),('2022-03-04',90,'91','','91','','',284),('2022-03-04',90,'91','','91','','',284),('2022-03-04',90,'91','93','91','','90',284),('2022-04-03',90,'','','89','94','',284),('2022-04-03',90,'','','89','94','',284),('2022-04-04',90,'89','','89','','',284),('2022-04-05',90,'','','','','',284),('2022-04-06',90,'','','','','',284),('2022-04-04',90,'89','','89','','',284),('2022-04-07',90,'','','','','',284),('2022-04-04',90,'89','','89','','',284),('2022-04-05',90,'','','','','',284),('2022-04-05',90,'','','','','',284),('2022-04-06',90,'','','','','',284),('2022-04-07',90,'','','','','',284),('2022-04-08',90,'','','','','',284),('2022-04-08',90,'','','','','',284),('2022-04-07',90,'','','','','',284),('2022-04-06',90,'','','','','',284),('2022-04-08',90,'','','','','',284);
/*!40000 ALTER TABLE `Schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SpcInstr`
--

DROP TABLE IF EXISTS `SpcInstr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SpcInstr` (
  `ClientID` int NOT NULL,
  `SpcInstDescr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreateOn` date NOT NULL,
  `ExpiredOn` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SpcInstr`
--

LOCK TABLES `SpcInstr` WRITE;
/*!40000 ALTER TABLE `SpcInstr` DISABLE KEYS */;
INSERT INTO `SpcInstr` VALUES (91,'Leave on back porch','2022-01-09',NULL),(92,'Dejar en la puerta trasera','2022-01-09',NULL),(93,'Leave with Alex\'s','2022-01-09',NULL),(94,'Bajo en Carbohidratos','2022-01-16',NULL),(96,'Alergica\n','2022-01-16',NULL),(97,'Cotsco','2022-01-16',NULL),(98,'Policia - Lobby\nSiempre Pancakes\nPollo solo come pechuga blanca que no sabe a nada','2022-01-16',NULL),(99,'Alergica al Camaron','2022-01-16',NULL),(100,'Waterstone Floridian Bay Estates Gate: HUICI\nComentario: Creo que es la misma Cossette. Le quite la direccion y puse la que me mandaron \n','2022-01-23',NULL),(101,'Comentario: ','2022-01-23',NULL),(102,'Low calorie','2022-01-16',NULL),(103,'Low calorie','2022-01-16',NULL),(104,'Catalina Business / Trab / Diabetico','2022-01-16',NULL),(105,'Yaisel Barrero','2022-01-16',NULL),(107,'Cod: 1993','2022-01-16',NULL),(109,'\n/ Richard Reyes','2022-01-23',NULL),(112,'( Alexis Villegas Me dijo lilly)  r/r/0','2022-01-16',NULL),(113,'-Armando Bernal- Cyany Bernal-ArmandoJr  k/k/k','2022-01-16',NULL),(114,' ( Nancy Gomez)  r/r/r','2022-01-16',NULL),(117,' ( Annet Diaz)  Lunes a jueves','2022-01-16',NULL),(118,'/ Brittany Sandoval creo que es hermana','2022-01-16',NULL),(119,'Come pollo una vez por semana','2022-01-16',NULL),(120,' ( juan Garcia)','2022-01-16',NULL),(122,'Nada de Mar','2022-01-16',NULL),(123,'/ Danay Gonzalez','2022-01-16',NULL),(124,'( Hiram Cabeza)   r/r/r/e1  s','2022-01-16',NULL),(125,'																																									\n','2022-01-16',NULL),(126,'	Gat:111																																																																																																																																														\n','2022-01-16',NULL),(127,'1    Jenny 																																																																																																																										','2022-01-16',NULL),(128,'Ln y Vn Pescariano Mt, Mc y Jv Reg																																			\n','2022-01-16',NULL),(129,' / Dennis Polo   r/r/r																																																																																																																																																									\n','2022-01-16',NULL),(130,' (Tel: Kille Hastink)','2022-01-16',NULL),(133,'																																																	\n','2022-01-16',NULL),(135,'No pancake de chocolate, No queso','2022-01-16',NULL),(136,'/ Erenio Reyes papa\nEn un menu puso no fish a un pescado que habia donde marco, pero no lo tiene como restricciones																																																																																																																																										\n','2022-01-16',NULL),(138,'																																																																																																																																											\n','2022-01-16',NULL),(139,' / Dom-Casa:  1351 SW','2022-01-16',NULL),(141,'No Pancake todo los dias','2022-01-16',NULL),(142,'/ Lena Martinez	Dom: 14825 SW																																																																																																																																																									\n','2022-01-16',NULL),(143,'(Peyno)   / Jose Fernandez 	\n\n','2022-01-16',NULL),(144,'																													\n','2022-01-16',NULL),(145,'Un dia darle pollo y otro picadillo de pavo\nQuiere , Pollo, pavo, pescados																																\n','2022-01-16',NULL),(146,' /  Luis Betancourt	','2022-01-16',NULL),(148,'Mama de Melanie Bermudez																																																																																																																																												\n','2022-01-16',NULL),(149,'																																																																																																																																																									\n','2022-01-16',NULL),(151,' / Arturo Dominguez','2022-01-16',NULL),(152,'/ Wilmer Garcia		\nSolo Huevo de desayuno																																																																														','2022-01-16',NULL),(153,'Sheryll Kumm										\n','2022-01-16',NULL),(156,'( PATO)																																																																																																																																											\n','2022-01-16',NULL),(160,'/ Ashey Williams	','2022-01-16',NULL),(161,' / RJM SKIM\n','2022-01-16',NULL),(162,' /  Johannah de los Santos  Marido','2022-01-16',NULL),(163,'( Denis) Oficial  / Viviana Lopez','2022-01-16',NULL),(165,'Casa:  16080 //   Hasta las 4 PM oficina	13135																																																																																																							\n','2022-01-17',NULL),(166,' / Roberto Diaz Esposo','2022-01-17',NULL),(167,'																																																																																																																																																			\n','2022-01-17',NULL),(168,' (Rey Fumigador)																																																																																																																				\n','2022-01-17',NULL),(169,'gat:028																																																																																																											\n','2022-01-17',NULL),(170,'																																						\n','2022-01-17',NULL),(171,' / Kyrel Vizcaino	Come Pescado 3 x semana	','2022-01-17',NULL),(172,' / Cynthia Vega Rodriguez	- Nada del Mar','2022-01-17',NULL),(174,'  / Leonardo y Mercedes	','2022-01-17',NULL),(175,' / Pedro Villalonga		','2022-01-17',NULL),(176,'  / Karla Villalonga	','2022-01-17',NULL),(177,'  / Cristian Ramirez	','2022-01-17',NULL),(178,'  / Medelin Cruz','2022-01-17',NULL),(179,'(mama)/ Diana Benito	','2022-01-17',NULL),(180,'																																																														\n','2022-01-17',NULL),(182,' / Hilda Batista	CASA/  																																																																						\n','2022-01-17',NULL),(183,' / Alcides Salina	','2022-01-17',NULL),(184,'/ Mariset Suarez																																																								\n','2022-01-17',NULL),(185,'/ Angel Mercado','2022-01-17',NULL),(186,'  / Jenna Sadler	','2022-01-17',NULL),(187,'   / Jeffrey Escobar	','2022-01-17',NULL),(188,'/ Alexandra Viera	Mt a Vn  																																																																																																																		\n','2022-01-17',NULL),(190,' Doral  Sanctuary Ir al garage 2 ir al elevadorcerca del contenedor de basura. Buscar a Elizabeth Alarcon en el IPAD	','2022-01-17',NULL),(191,' Reflections Rentals	','2022-01-17',NULL),(192,'SOMI BRICKELL','2022-01-17',NULL),(193,'	','2022-01-17',NULL),(194,'Ln a Jv ????		','2022-01-17',NULL),(195,'/ Sofia Fernandez		','2022-01-17',NULL),(197,'graceescalona7@gmail.com			\n','2022-01-17',NULL),(198,'Ln a Jv	Nada del Mar	','2022-01-17',NULL),(201,'/ Stephanie Avelar / Sal Avelar','2022-01-17',NULL),(202,'Snack semana del 17-21 Enero por error','2022-01-17',NULL),(203,'  / Ema Garlobo	','2022-01-17',NULL),(204,' / Barby Garlobo','2022-01-17',NULL),(205,' / Stephanie Avelar / Sandra Avelar','2022-01-17',NULL),(206,'sandra Avelar	','2022-01-17',NULL),(208,'	','2022-01-17',NULL),(210,' / Lukas Santana	','2022-01-17',NULL),(212,' / Yandry Rodriguez 	','2022-01-17',NULL),(213,'  /  Ray Urra																																																																																																																\n','2022-01-17',NULL),(214,'Taylim Urra	','2022-01-17',NULL),(215,'No Tomate Crudo o Cebolla Cruda','2022-01-17',NULL),(217,'  (tiene Migelangelo)	','2022-01-17',NULL),(218,' / Eradis Inda	','2022-01-17',NULL),(220,'/ Kelly Villar																																																																																																																																			\n','2022-01-17',NULL),(221,'	/ Jonathan Garcia	','2022-01-17',NULL),(222,'	/  Yailet Gonzalez	Ln a Jv	','2022-01-17',NULL),(223,'	/ Rodolfo Claro	','2022-01-17',NULL),(224,'  / Melissa Roses-Rodriguez','2022-01-17',NULL),(225,'/ Jorge Rodriguez	','2022-01-17',NULL),(226,'	','2022-01-17',NULL),(228,'	 / Ricardo Roses	','2022-01-17',NULL),(229,'  / Ana Roses	','2022-01-17',NULL),(230,' / Mama de Yailet Gonzalez																																																																																																																				\n','2022-01-17',NULL),(232,'/ Alex Diaz	','2022-01-17',NULL),(236,'	   / Josie Vera tia	','2022-01-17',NULL),(237,'   / Josie Vera papa	','2022-01-17',NULL),(238,' / Chris Thompson	','2022-01-17',NULL),(239,'  / Debbie Thompson	','2022-01-17',NULL),(240,'	 / Padre de Eric Delara	','2022-01-17',NULL),(90,'Guey','2022-02-01',NULL);
/*!40000 ALTER TABLE `SpcInstr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `sess` json NOT NULL,
  `expired` datetime NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `sessions_expired_index` (`expired`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-11 11:03:40
