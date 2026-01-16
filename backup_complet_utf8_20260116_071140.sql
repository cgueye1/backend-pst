--
-- PostgreSQL database dump
--

\restrict bAu1Wlu0yJuTfQufzt3np7FXydtIAYd6oC6hsHJKUCfthauAFQsctHM2hQwObGc

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.schools VALUES (4, 'test2', 'poiuytrew', '08:00:00', '18:00:00', '/uploads/schools/school_4_1766484387817.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (3, 'test1', 'wertyuio', '08:00:00', '18:00:00', '/uploads/schools/school_3_1766484364902.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (7, 'loiuytr', 'xcdf', '08:00:00', '18:00:00', NULL, 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (6, 'test3', 'lmnbvcxs', '08:00:00', '18:00:00', '/uploads/schools/school_6_1766484407071.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (5, 'test4', 'asdfjk', '08:00:00', '18:00:00', '/uploads/schools/school_5_1766484419641.png', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (1, 'wertyui', 'rtyuiouu', '08:00:00', '18:00:00', '/uploads/schools/school_1_1766484433890.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (2, 'jkkkk', 'ikujjiokk', '08:00:00', '18:00:00', '/uploads/schools/school_1765685205053.png', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "16:00"}, {"day": "Vendredi", "open": false, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (21, 'testrapidee', 'eeeeeeeeeeeee', '08:00:00', '18:00:00', '/uploads/schools/school_1767557919606.jfif', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2026-01-04 20:18:39.667565');
INSERT INTO public.schools VALUES (11, 'aaaaa', 'aaaaaa', '08:00:00', '18:00:00', '/uploads/schools/school_11_1766418557460.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 09:59:57.697478');
INSERT INTO public.schools VALUES (19, 'wwwwww', 'ww', '08:00:00', '18:00:00', '/uploads/schools/school_19_1766484452463.png', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 10:04:50.410899');
INSERT INTO public.schools VALUES (20, 'abymed', 'yeumbeul', '08:00:00', '18:00:00', '/uploads/schools/school_1766485219157.jpeg', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2025-12-23 10:20:19.221208');
INSERT INTO public.schools VALUES (22, 'mmmmmmm', 'm', '08:00:00', '18:00:00', '/uploads/schools/school_1768348958825.png', 'Actif', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Mercredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Jeudi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Vendredi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]', '2026-01-14 00:02:39.004695');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (9, 'Chauffeur 1', 'driver1@test.com', 'password', 'driver', '770000001', 'active', '2025-12-15 16:22:51.495003', NULL, NULL);
INSERT INTO public.users VALUES (10, 'Chauffeur 2', 'driver2@test.com', 'password', 'driver', '770000002', 'active', '2025-12-15 16:22:51.495003', NULL, NULL);
INSERT INTO public.users VALUES (11, 'Chauffeur 3', 'driver3@test.com', 'password', 'driver', '770000003', 'active', '2025-12-15 16:22:51.495003', NULL, NULL);
INSERT INTO public.users VALUES (14, 'Aminata Diop', 'aminata.diop@gmail.com', '$2a$12$pcu.zgGftR1yYVpou.eLbeeAV7RBVqORol.Dspzuc7tzPUUjy84ua', 'parent', '770000001', 'active', '2025-12-16 10:15:10.700493', 'Dakar - Parcelles', NULL);
INSERT INTO public.users VALUES (15, 'Moussa Fall', 'moussa.fall@gmail.com', '$2a$12$pcu.zgGftR1yYVpou.eLbeeAV7RBVqORol.Dspzuc7tzPUUjy84ua', 'parent', '770000002', 'active', '2025-12-16 10:15:10.700493', 'Dakar - Liberté', NULL);
INSERT INTO public.users VALUES (16, 'Fatou Ndiaye', 'fatou.ndiaye@gmail.com', '$2a$12$pcu.zgGftR1yYVpou.eLbeeAV7RBVqORol.Dspzuc7tzPUUjy84ua', 'parent', '770000003', 'active', '2025-12-16 10:15:10.700493', 'Pikine', NULL);
INSERT INTO public.users VALUES (17, 'testparent parent', 'parent123@example.com', '$2b$10$.7dJSs69P44Zg7ylsBjRouu5JzRih62h4lIPbFUjGeFytFeN/cGPO', 'parent', '777777777', 'active', '2025-12-16 11:07:56.558585', 'qwertyu', NULL);
INSERT INTO public.users VALUES (25, 'Jean Dupont', 'jean.dupont.driver@test.com', '$2b$10$X7Z8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3', 'driver', '+33612345678', 'active', '2026-01-10 19:23:22.463716', NULL, NULL);
INSERT INTO public.users VALUES (26, 'Marie Martin', 'marie.martin.parent@test.com', '$2b$10$X7Z8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3', 'parent', '+33687654321', 'active', '2026-01-10 19:23:22.463716', NULL, NULL);
INSERT INTO public.users VALUES (27, 'Mame Aby Drame', 'madrame@groupeisi.com', '$2b$10$FMLi29SkjBRGcIBwgWGOtuozC/gR.mdOMIQGpWbDzhJPK2sqrOnjq', 'parent', '+221 774947443', 'active', '2026-01-14 00:03:50.290086', 'lkjhjk', NULL);
INSERT INTO public.users VALUES (18, 'Smatflow Testcli', 'mameabydrame3@gmail.com', '$2b$10$CGfL0/IUIndXww2f5dil2uhzXCEONPdlDifpZ28N/lOiVWXkFYsCm', 'admin', '779949093', 'active', '2025-12-29 10:16:44.724494', 'ouakam,Cite Asecna', NULL);
INSERT INTO public.users VALUES (19, 'Modou FALL', 'm.fall@email.com', '$2b$10$w6cilXON3CxPbKN.ZGpdFe.kgM6kZEIHIPalrAVTH5A.ja/MhaqHy', 'driver', '+221778888888', 'active', '2025-12-31 11:28:43.727618', 'Zone Industrielle, Dakar SN', NULL);
INSERT INTO public.users VALUES (12, 'Chauffeur 4', 'driver4@test.com', 'password', 'driver', '770000004', 'inactive', '2025-12-15 16:22:51.495003', NULL, NULL);
INSERT INTO public.users VALUES (29, 'kiuy mmmmmmm', 'marie.martoin.parent@test.com', '$2b$10$snzmQ6HBQAzU3AjMFbjgueZwepFucVf/RPcqwvQdMzOmhL2kdUW8q', 'parent', '+33687654765', 'active', '2026-01-14 12:07:07.217896', 'ouakam,Cite Asecna', NULL);
INSERT INTO public.users VALUES (13, 'Chauffeur llllllllll', 'driver5@test.com', 'password', 'driver', '770000005', 'active', '2025-12-15 16:22:51.495003', '', NULL);
INSERT INTO public.users VALUES (8, 'Moussa Ndiaye', 'driver@example.com', '$2a$12$J/vkEkFA1cTjg39k5lSulODNLfOVfOV143JlV9Zx7lCBTvrbZ8jUe', 'driver', '+221770000016', 'active', '2025-12-13 22:02:29.618956', 'Pikine, Senegal', NULL);
INSERT INTO public.users VALUES (7, 'MaAby SOW', 'admin@example.com', '$2b$10$0GIk/0zsrtonT3BBsJaC..MF1v0R6RubG3lVqpJPu7yGQhx6J7UrO', 'admin', '+221779947443', 'active', '2025-12-13 22:02:29.618956', 'Dakar, Senegal', NULL);


--
-- Data for Name: carpool_groups; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carpool_groups VALUES (1, 'Covoiturage École Victor Hugo - Matin', 'Groupe de covoiturage pour les trajets du matin vers l''école Victor Hugo', 4, 14, 'active', '2026-01-12 01:11:56.726751', '2026-01-12 01:11:56.726751');


--
-- Data for Name: carpool_calendar; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carpool_calendar VALUES (1, 1, '2026-01-13', 14, 'Place de la République', 'École Primaire Victor Hugo', '08:00:00', '16:30:00', 4, NULL, 'scheduled', '2026-01-12 01:11:56.726751', '2026-01-12 01:11:56.726751');


--
-- Data for Name: carpool_exchanges; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: carpool_group_members; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carpool_group_members VALUES (1, 1, 14, 'accepted', '2026-01-12 01:11:56.726751', '2026-01-12 01:11:56.726751');


--
-- Data for Name: children; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.children VALUES (1, 14, 'Awa Diop', 1, 'Dakar - Parcelles', '2025-12-16 10:16:41.212422', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (2, 14, 'Mamadou Diop', 1, 'Dakar - Parcelles', '2025-12-16 10:16:41.212422', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (3, 15, 'Cheikh Fall', 2, 'Dakar - Liberté', '2025-12-16 10:16:41.212422', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (4, 16, 'Sokhna Ndiaye', 1, 'Pikine', '2025-12-16 10:16:41.212422', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (5, 16, 'Ibrahima Ndiaye', 3, 'Pikine', '2025-12-16 10:16:41.212422', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (7, 14, 'Aissatou Fall', 20, 'Parcelles Assainies, Dakar', '2025-12-30 09:22:17.716902', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (8, 14, 'Aissatou Fall', 20, 'Parcelles Assainies, Dakar', '2025-12-30 09:22:24.929918', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (13, 26, 'Emma Martin', NULL, NULL, '2026-01-10 19:23:22.463716', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');
INSERT INTO public.children VALUES (14, 26, 'Noah Martin', NULL, NULL, '2026-01-10 19:23:22.463716', '[{"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"}, {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"}, {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}]');


--
-- Data for Name: child_schedules; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.drivers VALUES (3, 8, 'Toyota Hilux', 'Blanc', 'DK-1234-XY', 'https://drive.google.com/file/d/1pdL_3DIqfRsK_1-PQ5FBpJLOgvRztJMR/view?usp=drive_link', 'https://drive.google.com/file/d/1VyKEDyaC8U_3ivJ84b3V-sPepmU8BR0H/view?usp=drive_link', 'https://drive.google.com/file/d/1gP-wKsaFweeNJ021O7IlPI4IKhOW42XM/view?usp=drive_link', '2025-12-13 22:02:57.886617', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (5, 9, 'Toyota Hilux', 'Blanc', 'DK-1884-XY', 'https://drive.google.com/file/d/license1', 'https://drive.google.com/file/d/id1', 'https://drive.google.com/file/d/vehicle1', '2025-12-15 16:33:23.425361', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (6, 10, 'Ford Ranger', 'Noir', 'DK-5678-ZY', 'https://drive.google.com/file/d/license2', 'https://drive.google.com/file/d/id2', 'https://drive.google.com/file/d/vehicle2', '2025-12-15 16:33:23.425361', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (7, 11, 'Nissan Navara', 'Bleu', 'DK-9012-AB', 'https://drive.google.com/file/d/license3', 'https://drive.google.com/file/d/id3', 'https://drive.google.com/file/d/vehicle3', '2025-12-15 16:33:23.425361', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (8, 12, 'Isuzu D-Max', 'Gris', 'DK-3456-CD', 'https://drive.google.com/file/d/license4', 'https://drive.google.com/file/d/id4', 'https://drive.google.com/file/d/vehicle4', '2025-12-15 16:33:23.425361', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (9, 13, 'PRADO', 'Vert', 'DK-3056-CD', 'https://drive.google.com/file/d/license4', 'https://drive.google.com/file/d/id4', 'https://drive.google.com/file/d/vehicle4', '2025-12-15 16:34:10.665709', 'Approuvé', 4, NULL);
INSERT INTO public.drivers VALUES (11, 19, 'TOYOTA', 'BLEUE', 'DK-0000-AB', '/uploads/drivers/1767180523740_', '/uploads/drivers/1767180523742_', '/uploads/drivers/1767180523743_', '2025-12-31 11:28:43.746196', 'Approuvé', NULL, NULL);
INSERT INTO public.drivers VALUES (36, 25, 'Renault Scenic', 'Bleu', 'AB-123-CD', NULL, NULL, NULL, '2026-01-10 19:23:22.463716', 'Approuvé', 4, NULL);


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.trips VALUES (4, NULL, 7, 'pending', false, '2025-12-15 11:17:18.209633', 'Ouakam', 'Medina', '2025-12-15 13:17:00', 70, NULL, NULL);
INSERT INTO public.trips VALUES (2, 3, 6, 'completed', true, '2025-12-15 09:41:40.794757', 'Diourbel', 'Dakar', '2025-12-15 12:40:00', 30, NULL, NULL);
INSERT INTO public.trips VALUES (3, 3, 4, 'canceled', true, '2025-12-15 10:03:14.034861', 'Ouakam', 'Fass', '2025-12-15 11:02:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (10, 5, 1, 'pending', false, '2025-12-15 08:00:00', 'Ouakam', 'Centenaire', '2025-12-15 08:30:00', 30, NULL, NULL);
INSERT INTO public.trips VALUES (12, 7, 3, 'canceled', false, '2025-12-15 10:00:00', 'Fass', 'Ouakam', '2025-12-15 10:30:00', 20, NULL, NULL);
INSERT INTO public.trips VALUES (13, 8, 4, 'pending', true, '2025-12-15 11:00:00', 'Medina', 'Thiaroye', '2025-12-15 11:30:00', 35, NULL, NULL);
INSERT INTO public.trips VALUES (14, 9, 5, 'canceled', false, '2025-12-15 12:00:00', 'Thiaroye', 'Dakar', '2025-12-15 12:30:00', 40, NULL, NULL);
INSERT INTO public.trips VALUES (15, 5, 11, 'pending', false, '2025-12-17 11:58:31.904141', 'test1', 'test2', '2025-12-17 12:57:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (11, 9, 2, 'completed', true, '2025-12-15 09:00:00', 'Dakar', 'Kaolack', '2025-12-15 09:30:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (16, 9, 3, 'pending', true, '2025-12-23 11:06:12.184168', 'test1', 'test2', '2026-01-15 11:04:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (18, 6, 4, 'pending', false, '2025-12-23 11:35:22.322183', 'Ouakam', 'Diourbel', '2026-07-02 11:34:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (19, 7, 6, 'pending', false, '2025-12-23 11:36:25.720022', 'Ouakam', 'Diourbel', '2027-07-01 11:35:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (20, 7, 6, 'pending', false, '2025-12-23 11:37:15.5878', 'Ouakam', 'Diourbel', '2026-07-01 11:36:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (21, 7, 3, 'pending', false, '2025-12-23 11:38:27.809453', 'Ouakam', 'Diourbel', '2026-07-01 11:38:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (22, 7, 4, 'pending', false, '2025-12-23 11:42:37.39468', 'Ouakam', 'DIOURBEL', '2026-07-01 11:38:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (26, 8, 2, 'pending', false, '2025-12-29 16:32:33.361022', 'Parcelles', 'Almadies', '2025-01-20 07:30:00', 10, NULL, NULL);
INSERT INTO public.trips VALUES (1, 3, 1, 'in_progress', false, '2025-12-14 03:41:17.631216', 'Ouakam', 'Medina', '2025-12-14 08:41:00', 30, NULL, NULL);
INSERT INTO public.trips VALUES (17, 3, 4, 'in_progress', true, '2025-12-23 11:11:18.78723', 'Ouakam', 'Diourbel', '2026-01-15 11:09:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (29, 3, 20, 'completed', false, '2025-12-30 09:27:45.379766', 'Plateau, Dakar', 'École Primaire Les Cocotiers', '2026-01-02 07:00:00', 4, NULL, NULL);
INSERT INTO public.trips VALUES (36, 36, NULL, 'pending', false, '2026-01-10 19:23:22.463716', 'Place de la République, Paris', 'École Primaire Victor Hugo', '2026-01-11 08:00:00', 4, NULL, NULL);
INSERT INTO public.trips VALUES (37, 36, NULL, 'pending', false, '2026-01-10 19:23:22.463716', 'Gare de Lyon, Paris', 'École Primaire Victor Hugo', '2026-01-12 08:00:00', 4, NULL, NULL);
INSERT INTO public.trips VALUES (38, 36, NULL, 'pending', false, '2026-01-10 19:23:22.463716', 'Quartier Latin, Paris', 'École Primaire Victor Hugo', '2026-01-13 08:00:00', 4, NULL, NULL);
INSERT INTO public.trips VALUES (39, 11, 20, 'pending', false, '2026-01-12 12:10:36.384341', 'Ouakam', 'Ngor', '2026-01-12 16:10:00', 35, 5888.80, 2944);
INSERT INTO public.trips VALUES (41, 11, 20, 'pending', true, '2026-01-14 00:25:45.249732', 'yoff', 'ouakam', '2026-01-23 08:24:00', 9, 8636.20, 3886);
INSERT INTO public.trips VALUES (23, 5, 7, 'pending', false, '2025-12-23 11:53:23.060852', 'Ouakam', 'DIOURBEL', '2027-07-04 11:53:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (40, 7, 4, 'pending', true, '2026-01-14 00:21:43.922435', 'Ouakam', 'comico', '2026-01-22 08:21:00', 8, NULL, NULL);
INSERT INTO public.trips VALUES (25, 36, 6, 'pending', false, '2025-12-23 12:01:29.316944', 'Ouakam', 'DIOURBEL', '2026-07-02 12:01:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (24, 5, 4, 'pending', false, '2025-12-23 11:53:52.81789', 'Ouakam', 'DIOURBEL', '2026-07-12 11:53:00', 25, NULL, NULL);
INSERT INTO public.trips VALUES (42, 36, 11, 'pending', true, '2026-01-14 10:37:21.950744', 'A', 'B', '2026-03-20 15:37:00', 8, 3764.43, 1693996);
INSERT INTO public.trips VALUES (43, 3, 6, 'pending', true, '2026-01-14 12:39:53.871674', 'C', 'D', '2026-02-08 12:39:00', 6, 1437.79, 647006);


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.conversations VALUES (4, 'direct', NULL, NULL, 8, '2026-01-08 11:49:14.05229', '2026-01-08 12:16:49.138367', '2026-01-08 12:16:49.138367', false);
INSERT INTO public.conversations VALUES (7, 'direct', NULL, NULL, 14, '2026-01-08 23:29:00.202198', '2026-01-08 23:29:00.233856', '2026-01-08 23:29:00.233856', false);


--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.conversation_participants VALUES (5, 4, 9, 'member', '2026-01-08 11:49:14.05229', NULL, false, '2026-01-08 11:49:14.05229', 1);
INSERT INTO public.conversation_participants VALUES (4, 4, 8, 'member', '2026-01-08 11:49:14.05229', NULL, false, '2026-01-08 12:16:49.198445', 0);
INSERT INTO public.conversation_participants VALUES (8, 7, 14, 'member', '2026-01-08 23:29:00.202198', NULL, false, '2026-01-08 23:29:00.202198', 0);
INSERT INTO public.conversation_participants VALUES (9, 7, 8, 'member', '2026-01-08 23:29:00.202198', NULL, false, '2026-01-08 23:29:00.202198', 1);


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.evaluations VALUES (1, 29, 14, 3, 5, 'Excellent chauffeur, très ponctuel et sympathique !', '2026-01-10 21:05:55.415469');


--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.incidents VALUES (5, 'Incident', 'Description de test pour vérifier laffichage.', 'En cours', '[]', '2025-12-25 02:01:55.634928+00', '2025-12-25 02:01:55.634928+00', 7);
INSERT INTO public.incidents VALUES (7, 'Incident', 'asedf sdfedc sdfdwdwsff asdweewewewew qwqeweeasa qwqwdwe wewedasqsqs eweee wdwpoiuyt asdfjkl  ertyjk,', 'En cours', '[{"name": "document_architecture_front_admin.pdf", "size": 4266, "type": "application/pdf"}]', '2025-12-25 22:58:22.047338+00', '2025-12-25 22:58:22.047338+00', 7);
INSERT INTO public.incidents VALUES (8, 'Incident', 'oiuytr dftyu tyui oiuytrertyu sdrftyuioiuytre ertyuiopoiuytr fdcftrfdcff plploo plolko okokok pokolkkm plolok dddc sxsxsx okjikj oikjnkjnb okikjn oikjkjn ', 'En cours', '[{"name": "CV_MADRAME1.pdf", "size": 847810, "type": "application/pdf"}]', '2025-12-25 23:14:24.169213+00', '2025-12-25 23:14:24.169213+00', 7);
INSERT INTO public.incidents VALUES (9, 'Litige', 'oiuytr sdftyf drfd drtdxdr xdtrdx xdft dzsdtyu sdtyu dsdftyui xcf ytdfioiuyt sdyuioiuyt dfioliiudsertyu sdfoiuytrrtyuidrtf dtf dftf drdt xddxd ', 'En cours', '[{"name": "Architecture Document - Private School Transport.pdf", "size": 2262286, "type": "application/pdf"}]', '2025-12-25 23:23:05.648115+00', '2025-12-25 23:23:05.648115+00', 7);
INSERT INTO public.incidents VALUES (10, 'Litige', 'xxxxxxxxcs sfws wewe erfd dfd asdfdf sdfrf efdf erfe fe cvfbvv ', 'En cours', '[{"name": "CNI.pdf", "size": 47177, "type": "application/pdf"}, {"name": "guide-utilisateur-complet (Récupéré).pdf", "size": 1265086, "type": "application/pdf"}, {"name": "innov4africa-MAD.pdf", "size": 682195, "type": "application/pdf"}]', '2025-12-26 00:06:21.214055+00', '2025-12-26 00:06:21.214055+00', 7);
INSERT INTO public.incidents VALUES (11, 'Incident', 'dfefef', 'En cours', '[{"name": "Screenshot-2023-03-05-at-09.08.58.png", "size": 542989, "type": "image/png"}]', '2025-12-29 12:22:57.788643+00', '2025-12-29 12:22:57.788643+00', 7);
INSERT INTO public.incidents VALUES (12, 'Litige', 'ee', 'En cours', '[{"name": "fruitsle.png", "size": 46107, "type": "image/png"}]', '2025-12-29 12:23:22.389648+00', '2025-12-29 12:23:22.389648+00', 7);
INSERT INTO public.incidents VALUES (13, 'Incident', 'testons', 'En cours', '[{"name": "Sans titre.png", "size": 11211, "type": "image/png"}]', '2026-01-07 14:06:35.993808+00', '2026-01-07 14:06:35.993808+00', 7);
INSERT INTO public.incidents VALUES (14, 'Incident', ',kjytfdxcvjm', 'En cours', '[{"url": "/uploads/incidents/incident_1767797577737_0.png", "name": "fruitsle.png", "size": 46107, "type": "image/png"}]', '2026-01-07 14:52:57.749352+00', '2026-01-07 14:52:57.749352+00', 18);
INSERT INTO public.incidents VALUES (15, 'Litige', 'sssssssss', 'En cours', '[{"url": "/uploads/incidents/incident_1768394012940_0.png", "name": "Gemini_Generated_Image_dqfbbdqfbbdqfbbd.png", "size": 1840944, "type": "image/png"}]', '2026-01-14 12:33:32.951479+00', '2026-01-14 12:33:32.951479+00', 7);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.messages VALUES (1, 4, 8, NULL, 'Salut ! Comment ça va ?', 'text', '[]', '{}', false, false, NULL, '2026-01-08 12:16:49.138367', '2026-01-08 12:16:49.138367');
INSERT INTO public.messages VALUES (2, 7, 14, NULL, 'Bonjour chauffeur, je voulais confirmer l''heure du départ.', 'text', '[]', '{}', false, false, NULL, '2026-01-08 23:29:00.233856', '2026-01-08 23:29:00.233856');


--
-- Data for Name: message_read_status; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.message_read_status VALUES (1, 1, 8, '2026-01-08 12:16:49.198445');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notifications VALUES (1, 'vxxxxxxxxxxxxxxxx', 'info', 'xv xv xv xv ', '/uploads/1766765859412-leumes.png', 7, '2025-12-26 16:17:39.693206+00', 'active');
INSERT INTO public.notifications VALUES (2, 'qwerty', 'warning', 'zsertyuikl,mnbvcxcvbnyf cdc ', '/uploads/1767002495353-Sans titre.png', 7, '2025-12-29 10:01:35.470819+00', 'active');
INSERT INTO public.notifications VALUES (3, 'test', 'urgent', 'zsxdc  xcv cv ', NULL, 7, '2025-12-29 10:12:49.994536+00', 'active');
INSERT INTO public.notifications VALUES (4, 'sc dsd ', 'maintenance', 'sdcs scdvdv ', '/uploads/1767003549659-ae585900-694b-11e9-90a2-7c8f58f068b4.jfif', 18, '2025-12-29 10:19:09.780835+00', 'active');
INSERT INTO public.notifications VALUES (5, 'mmmmmmmmmm', 'warning', 'mmmm ml', NULL, 18, '2025-12-29 12:02:51.584943+00', 'active');
INSERT INTO public.notifications VALUES (6, 'testmauntaaaaaaaaaanvc', 'maintenance', ' asdf', NULL, 18, '2025-12-29 12:08:00.096289+00', 'active');
INSERT INTO public.notifications VALUES (7, 'ujyt', 'info', 'cvbn', NULL, 18, '2025-12-29 12:09:55.037066+00', 'active');
INSERT INTO public.notifications VALUES (8, 'kiuytrd', 'warning', 'sdf', NULL, 18, '2025-12-29 12:11:46.018789+00', 'active');
INSERT INTO public.notifications VALUES (9, 'kllllll', 'warning', 'lkkk', NULL, 18, '2025-12-29 12:12:19.46609+00', 'active');
INSERT INTO public.notifications VALUES (10, ',,,,,,,,,,,,', 'info', ';;;;;;;;;;;', NULL, 18, '2025-12-29 12:14:23.614314+00', 'active');
INSERT INTO public.notifications VALUES (11, ';lkm,nl', 'info', ';lm,', NULL, 18, '2025-12-29 12:14:37.237618+00', 'active');
INSERT INTO public.notifications VALUES (14, 'Nouvelle réservation', 'booking_created', 'Un parent a réservé votre trajet', NULL, 7, '2025-12-30 09:28:54.664841+00', 'active');
INSERT INTO public.notifications VALUES (16, 'Trajet démarré', 'trip_started', 'Le trajet de Awa Diop a démarré', NULL, 8, '2025-12-30 14:13:43.159943+00', 'active');
INSERT INTO public.notifications VALUES (17, 'Trajet démarré', 'trip_started', 'Le trajet de ${parent.child_name} a démarré', NULL, 8, '2025-12-30 14:33:08.480542+00', 'active');
INSERT INTO public.notifications VALUES (18, 'Trajet démarré', 'trip_started', 'Le trajet de Awa Diop a démarré', NULL, 8, '2025-12-30 14:37:39.329873+00', 'active');
INSERT INTO public.notifications VALUES (19, 'Trajet démarré', 'trip_started', 'Le trajet de Awa Diop a démarré', NULL, 8, '2025-12-30 14:51:59.706151+00', 'active');
INSERT INTO public.notifications VALUES (20, 'Trajet démarré', 'trip_started', 'Le trajet de Awa Diop, Mamadou Diop et Aissatou Fall a démarré', NULL, 8, '2025-12-30 14:56:23.006133+00', 'active');
INSERT INTO public.notifications VALUES (21, 'Trajet démarré', 'trip_started', 'Le trajet de Awa Diop, Mamadou Diop et Aissatou Fall a démarré', NULL, 8, '2025-12-30 15:00:20.160489+00', 'active');
INSERT INTO public.notifications VALUES (22, 'Trajet terminé', 'trip_completed', 'Le trajet de Awa Diop, Mamadou Diop et Aissatou Fall est terminé. Merci d''évaluer le chauffeur.', NULL, 8, '2025-12-30 15:02:46.908418+00', 'active');
INSERT INTO public.notifications VALUES (23, 'Trajet annulé', 'trip_canceled', 'Le trajet de Awa Diop, Mamadou Diop et Aissatou Fall est annulé.', NULL, 8, '2025-12-30 16:23:38.308758+00', 'active');
INSERT INTO public.notifications VALUES (24, 'Abonnement activé', 'subscription_activated', 'Votre abonnement Chauffeur Mensuel a été activé avec succès', NULL, 8, '2025-12-31 15:59:11.155557+00', 'active');
INSERT INTO public.notifications VALUES (25, 'Abonnement activé', 'subscription_activated', 'Votre abonnement Chauffeur Mensuel a été activé avec succès', NULL, 8, '2025-12-31 16:24:07.547431+00', 'active');
INSERT INTO public.notifications VALUES (26, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 15, '2026-01-05 11:02:58.53266+00', 'active');
INSERT INTO public.notifications VALUES (27, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.545716+00', 'active');
INSERT INTO public.notifications VALUES (28, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 9, '2026-01-05 11:02:58.549065+00', 'active');
INSERT INTO public.notifications VALUES (29, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 11, '2026-01-05 11:02:58.551665+00', 'active');
INSERT INTO public.notifications VALUES (30, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.553824+00', 'active');
INSERT INTO public.notifications VALUES (31, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Annuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 15, '2026-01-05 11:02:58.555937+00', 'active');
INSERT INTO public.notifications VALUES (32, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.558812+00', 'active');
INSERT INTO public.notifications VALUES (33, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 10, '2026-01-05 11:02:58.560695+00', 'active');
INSERT INTO public.notifications VALUES (34, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.563006+00', 'active');
INSERT INTO public.notifications VALUES (35, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 9, '2026-01-05 11:02:58.565505+00', 'active');
INSERT INTO public.notifications VALUES (36, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.568123+00', 'active');
INSERT INTO public.notifications VALUES (37, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.570074+00', 'active');
INSERT INTO public.notifications VALUES (38, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.571921+00', 'active');
INSERT INTO public.notifications VALUES (39, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.573948+00', 'active');
INSERT INTO public.notifications VALUES (40, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.575729+00', 'active');
INSERT INTO public.notifications VALUES (41, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 15, '2026-01-05 11:02:58.57751+00', 'active');
INSERT INTO public.notifications VALUES (42, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.579605+00', 'active');
INSERT INTO public.notifications VALUES (43, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.582256+00', 'active');
INSERT INTO public.notifications VALUES (44, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.584698+00', 'active');
INSERT INTO public.notifications VALUES (45, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.586893+00', 'active');
INSERT INTO public.notifications VALUES (46, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 11, '2026-01-05 11:02:58.58886+00', 'active');
INSERT INTO public.notifications VALUES (47, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.590704+00', 'active');
INSERT INTO public.notifications VALUES (48, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 9, '2026-01-05 11:02:58.592492+00', 'active');
INSERT INTO public.notifications VALUES (49, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.594452+00', 'active');
INSERT INTO public.notifications VALUES (50, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.596925+00', 'active');
INSERT INTO public.notifications VALUES (51, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.599619+00', 'active');
INSERT INTO public.notifications VALUES (52, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.601752+00', 'active');
INSERT INTO public.notifications VALUES (53, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.603583+00', 'active');
INSERT INTO public.notifications VALUES (54, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 11, '2026-01-05 11:02:58.607324+00', 'active');
INSERT INTO public.notifications VALUES (55, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.609279+00', 'active');
INSERT INTO public.notifications VALUES (56, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.611158+00', 'active');
INSERT INTO public.notifications VALUES (57, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.613583+00', 'active');
INSERT INTO public.notifications VALUES (58, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 9, '2026-01-05 11:02:58.615867+00', 'active');
INSERT INTO public.notifications VALUES (59, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 11, '2026-01-05 11:02:58.618103+00', 'active');
INSERT INTO public.notifications VALUES (60, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.620172+00', 'active');
INSERT INTO public.notifications VALUES (61, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.622635+00', 'active');
INSERT INTO public.notifications VALUES (62, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.625016+00', 'active');
INSERT INTO public.notifications VALUES (63, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.627009+00', 'active');
INSERT INTO public.notifications VALUES (64, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 10, '2026-01-05 11:02:58.629157+00', 'active');
INSERT INTO public.notifications VALUES (65, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.632126+00', 'active');
INSERT INTO public.notifications VALUES (66, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 14, '2026-01-05 11:02:58.634432+00', 'active');
INSERT INTO public.notifications VALUES (67, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 12, '2026-01-05 11:02:58.636629+00', 'active');
INSERT INTO public.notifications VALUES (68, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Trimestriel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 10, '2026-01-05 11:02:58.638512+00', 'active');
INSERT INTO public.notifications VALUES (69, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 13, '2026-01-05 11:02:58.640257+00', 'active');
INSERT INTO public.notifications VALUES (70, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.642019+00', 'active');
INSERT INTO public.notifications VALUES (71, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 9, '2026-01-05 11:02:58.643988+00', 'active');
INSERT INTO public.notifications VALUES (72, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 15, '2026-01-05 11:02:58.646696+00', 'active');
INSERT INTO public.notifications VALUES (73, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.649119+00', 'active');
INSERT INTO public.notifications VALUES (74, 'Abonnement expiré', 'subscription_expired', 'Votre abonnement Mensuel a expiré. Renouvelez-le pour retrouver l''accès à vos services.', NULL, 7, '2026-01-05 11:02:58.651452+00', 'active');
INSERT INTO public.notifications VALUES (75, 'Trajet démarré', 'trip_started', 'Le conducteur a commencé le trajet vers Plateau, Dakar', NULL, 8, '2026-01-09 11:59:27.991576+00', 'active');
INSERT INTO public.notifications VALUES (108, 'Trajet terminé', 'trip_completed', 'Votre enfant est arrive a destination en toute securite', NULL, 8, '2026-01-09 12:10:39.794214+00', 'active');
INSERT INTO public.notifications VALUES (109, 'sa', 'info', 'x', '/uploads/1768394084419-Gemini_Generated_Image_dqfbbdqfbbdqfbbd.png', 7, '2026-01-14 12:34:44.698042+00', 'active');


--
-- Data for Name: notification_destinataires; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notification_destinataires VALUES (1, 1, NULL, false, '2025-12-26 16:17:39.693206+00');
INSERT INTO public.notification_destinataires VALUES (2, 2, NULL, false, '2025-12-29 10:01:35.470819+00');
INSERT INTO public.notification_destinataires VALUES (3, 3, NULL, false, '2025-12-29 10:12:49.994536+00');
INSERT INTO public.notification_destinataires VALUES (4, 4, NULL, false, '2025-12-29 10:19:09.780835+00');
INSERT INTO public.notification_destinataires VALUES (5, 5, NULL, false, '2025-12-29 12:02:51.584943+00');
INSERT INTO public.notification_destinataires VALUES (6, 6, NULL, false, '2025-12-29 12:08:00.096289+00');
INSERT INTO public.notification_destinataires VALUES (7, 7, 17, false, '2025-12-29 12:09:55.037066+00');
INSERT INTO public.notification_destinataires VALUES (8, 7, 16, false, '2025-12-29 12:09:55.037066+00');
INSERT INTO public.notification_destinataires VALUES (9, 8, 7, false, '2025-12-29 12:11:46.018789+00');
INSERT INTO public.notification_destinataires VALUES (10, 9, NULL, false, '2025-12-29 12:12:19.46609+00');
INSERT INTO public.notification_destinataires VALUES (11, 10, NULL, false, '2025-12-29 12:14:23.614314+00');
INSERT INTO public.notification_destinataires VALUES (12, 11, NULL, false, '2025-12-29 12:14:37.237618+00');
INSERT INTO public.notification_destinataires VALUES (16, 14, 9, false, '2025-12-30 09:30:32.764202+00');
INSERT INTO public.notification_destinataires VALUES (17, 16, 14, false, '2025-12-30 14:13:43.166527+00');
INSERT INTO public.notification_destinataires VALUES (18, 17, NULL, false, '2025-12-30 14:33:08.485777+00');
INSERT INTO public.notification_destinataires VALUES (19, 18, 14, false, '2025-12-30 14:37:39.335153+00');
INSERT INTO public.notification_destinataires VALUES (20, 19, 14, false, '2025-12-30 14:51:59.710882+00');
INSERT INTO public.notification_destinataires VALUES (21, 20, 14, false, '2025-12-30 14:56:23.009461+00');
INSERT INTO public.notification_destinataires VALUES (22, 21, 14, false, '2025-12-30 15:00:20.169545+00');
INSERT INTO public.notification_destinataires VALUES (23, 22, 14, false, '2025-12-30 15:02:46.933394+00');
INSERT INTO public.notification_destinataires VALUES (24, 23, 14, false, '2025-12-30 16:23:38.312531+00');
INSERT INTO public.notification_destinataires VALUES (25, 24, 8, false, '2025-12-31 15:59:11.160285+00');
INSERT INTO public.notification_destinataires VALUES (26, 25, 8, false, '2025-12-31 16:24:07.549425+00');
INSERT INTO public.notification_destinataires VALUES (27, 26, 15, false, '2026-01-05 11:02:58.542087+00');
INSERT INTO public.notification_destinataires VALUES (28, 27, 12, false, '2026-01-05 11:02:58.547028+00');
INSERT INTO public.notification_destinataires VALUES (29, 28, 9, false, '2026-01-05 11:02:58.550191+00');
INSERT INTO public.notification_destinataires VALUES (30, 29, 11, false, '2026-01-05 11:02:58.552539+00');
INSERT INTO public.notification_destinataires VALUES (31, 30, 13, false, '2026-01-05 11:02:58.554594+00');
INSERT INTO public.notification_destinataires VALUES (32, 31, 15, false, '2026-01-05 11:02:58.55673+00');
INSERT INTO public.notification_destinataires VALUES (33, 32, 7, false, '2026-01-05 11:02:58.559568+00');
INSERT INTO public.notification_destinataires VALUES (34, 33, 10, false, '2026-01-05 11:02:58.5614+00');
INSERT INTO public.notification_destinataires VALUES (35, 34, 13, false, '2026-01-05 11:02:58.56397+00');
INSERT INTO public.notification_destinataires VALUES (36, 35, 9, false, '2026-01-05 11:02:58.56691+00');
INSERT INTO public.notification_destinataires VALUES (37, 36, 12, false, '2026-01-05 11:02:58.568905+00');
INSERT INTO public.notification_destinataires VALUES (38, 37, 13, false, '2026-01-05 11:02:58.570778+00');
INSERT INTO public.notification_destinataires VALUES (39, 38, 12, false, '2026-01-05 11:02:58.57274+00');
INSERT INTO public.notification_destinataires VALUES (40, 39, 13, false, '2026-01-05 11:02:58.574643+00');
INSERT INTO public.notification_destinataires VALUES (41, 40, 12, false, '2026-01-05 11:02:58.576445+00');
INSERT INTO public.notification_destinataires VALUES (42, 41, 15, false, '2026-01-05 11:02:58.57821+00');
INSERT INTO public.notification_destinataires VALUES (43, 42, 7, false, '2026-01-05 11:02:58.580605+00');
INSERT INTO public.notification_destinataires VALUES (44, 43, 7, false, '2026-01-05 11:02:58.583245+00');
INSERT INTO public.notification_destinataires VALUES (45, 44, 14, false, '2026-01-05 11:02:58.58557+00');
INSERT INTO public.notification_destinataires VALUES (46, 45, 13, false, '2026-01-05 11:02:58.587712+00');
INSERT INTO public.notification_destinataires VALUES (47, 46, 11, false, '2026-01-05 11:02:58.589575+00');
INSERT INTO public.notification_destinataires VALUES (48, 47, 7, false, '2026-01-05 11:02:58.59138+00');
INSERT INTO public.notification_destinataires VALUES (49, 48, 9, false, '2026-01-05 11:02:58.593268+00');
INSERT INTO public.notification_destinataires VALUES (50, 49, 14, false, '2026-01-05 11:02:58.595232+00');
INSERT INTO public.notification_destinataires VALUES (51, 50, 14, false, '2026-01-05 11:02:58.598033+00');
INSERT INTO public.notification_destinataires VALUES (52, 51, 13, false, '2026-01-05 11:02:58.60052+00');
INSERT INTO public.notification_destinataires VALUES (53, 52, 14, false, '2026-01-05 11:02:58.602455+00');
INSERT INTO public.notification_destinataires VALUES (54, 53, 12, false, '2026-01-05 11:02:58.606097+00');
INSERT INTO public.notification_destinataires VALUES (55, 54, 11, false, '2026-01-05 11:02:58.608022+00');
INSERT INTO public.notification_destinataires VALUES (56, 55, 13, false, '2026-01-05 11:02:58.609968+00');
INSERT INTO public.notification_destinataires VALUES (57, 56, 13, false, '2026-01-05 11:02:58.611875+00');
INSERT INTO public.notification_destinataires VALUES (58, 57, 14, false, '2026-01-05 11:02:58.614554+00');
INSERT INTO public.notification_destinataires VALUES (59, 58, 9, false, '2026-01-05 11:02:58.616786+00');
INSERT INTO public.notification_destinataires VALUES (60, 59, 11, false, '2026-01-05 11:02:58.61886+00');
INSERT INTO public.notification_destinataires VALUES (61, 60, 12, false, '2026-01-05 11:02:58.621057+00');
INSERT INTO public.notification_destinataires VALUES (62, 61, 7, false, '2026-01-05 11:02:58.623567+00');
INSERT INTO public.notification_destinataires VALUES (63, 62, 14, false, '2026-01-05 11:02:58.625801+00');
INSERT INTO public.notification_destinataires VALUES (64, 63, 13, false, '2026-01-05 11:02:58.627726+00');
INSERT INTO public.notification_destinataires VALUES (65, 64, 10, false, '2026-01-05 11:02:58.630334+00');
INSERT INTO public.notification_destinataires VALUES (66, 65, 13, false, '2026-01-05 11:02:58.632953+00');
INSERT INTO public.notification_destinataires VALUES (67, 66, 14, false, '2026-01-05 11:02:58.635265+00');
INSERT INTO public.notification_destinataires VALUES (68, 67, 12, false, '2026-01-05 11:02:58.637375+00');
INSERT INTO public.notification_destinataires VALUES (69, 68, 10, false, '2026-01-05 11:02:58.639191+00');
INSERT INTO public.notification_destinataires VALUES (70, 69, 13, false, '2026-01-05 11:02:58.640941+00');
INSERT INTO public.notification_destinataires VALUES (71, 70, 7, false, '2026-01-05 11:02:58.642701+00');
INSERT INTO public.notification_destinataires VALUES (72, 71, 9, false, '2026-01-05 11:02:58.644988+00');
INSERT INTO public.notification_destinataires VALUES (73, 72, 15, false, '2026-01-05 11:02:58.647625+00');
INSERT INTO public.notification_destinataires VALUES (74, 73, 7, false, '2026-01-05 11:02:58.650093+00');
INSERT INTO public.notification_destinataires VALUES (75, 74, 7, false, '2026-01-05 11:02:58.652321+00');
INSERT INTO public.notification_destinataires VALUES (76, 75, 14, false, '2026-01-09 11:59:28.005979+00');
INSERT INTO public.notification_destinataires VALUES (109, 108, 14, false, '2026-01-09 12:10:39.807809+00');
INSERT INTO public.notification_destinataires VALUES (110, 109, NULL, false, '2026-01-14 12:34:44.698042+00');


--
-- Data for Name: password_resets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.password_resets VALUES (2, 7, '9039', '2026-01-12 21:32:34.127', '2026-01-12 21:17:34.128507');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES (3, 8, 7220.28, 'pending', 'Kay Pay', '0d0cde39de3cbd7d30f5cd700349c678', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (4, 9, 47878.00, 'pending', 'Kay Pay', '5a6491427e30b22d32da77ae846a272f', '2025-01-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (5, 15, 34820.44, 'paid', 'Wave', 'd4dd0855b45fe72095928b99401fd70d', '2025-01-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (6, 11, 25014.81, 'paid', 'Wave', '500866021237dc5a8b11b64e69dd42fd', '2025-01-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (7, 16, 14198.81, 'paid', 'Kay Pay', '15fded850e19eb864ee4518f6a1d2293', '2025-01-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (8, 16, 30430.47, 'paid', 'Carte Bancaire', '9ed614879e93f9e178488bf7e24ea983', '2025-01-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (9, 11, 20689.83, 'paid', 'Orange Money', '87aefd40db60d0e280f9790a85c20297', '2025-01-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (10, 7, 19247.92, 'paid', 'Yas Money', 'e342e30aede65b75a1bfc1e12178c471', '2025-01-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (11, 15, 30646.76, 'paid', 'Yas Money', '4e94afcb2e080f4055048cd573e3aa56', '2025-01-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (12, 15, 49027.30, 'paid', 'Yas Money', 'ae8f4d46d14d4f0567e709aa9cc2b071', '2025-01-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (13, 12, 38493.96, 'paid', 'Yas Money', '6a2cc7f4d3520ab53a1137c5c8a5499c', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (14, 10, 16461.46, 'paid', 'Yas Money', '0254260dd3b2dc183dac9f3b3710d10f', '2025-01-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (15, 13, 24923.69, 'paid', 'Kay Pay', '3b8929d5a03938227275791a4e446dc2', '2025-01-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (16, 14, 28092.40, 'paid', 'Yas Money', '44fd974c9b86c916e554886bb9779d08', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (17, 7, 21737.25, 'paid', 'Yas Money', '315d1aefc166259219bce0bd123c6d64', '2025-01-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (18, 13, 24873.84, 'paid', 'Kay Pay', 'eb2fab48abd014949879baa17ef3697c', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (19, 8, 32034.05, 'paid', 'Carte Bancaire', '5369e191c829ecec215e48281bd50044', '2025-01-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (20, 7, 35470.60, 'paid', 'Orange Money', 'f8c52e23cdc71a117dd74873734d0ab0', '2025-01-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (21, 9, 11348.38, 'paid', 'Orange Money', '6aa57b4e571af5c34120027cbcca98be', '2025-01-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (22, 16, 49024.62, 'paid', 'Wave', 'feacb3b56a73f48b29c2e302520b2fbb', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (23, 7, 38424.69, 'paid', 'Carte Bancaire', '63c596a944dee4d1045ae9e22d5607a3', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (24, 13, 39524.04, 'paid', 'Carte Bancaire', '8a78fc9b23f46b7ab0ba90a0be2a0053', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (25, 9, 7556.86, 'paid', 'Kay Pay', '7ca5d92b777e0c52e4fbe04ada70a8d7', '2025-01-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (26, 8, 28036.70, 'paid', 'Orange Money', 'c321e1643f9aca42f8526b95c7e6e011', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (27, 11, 41749.73, 'paid', 'Orange Money', '18b25d479320ed1a61263951bc2c7fd7', '2025-01-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (28, 9, 38108.75, 'paid', 'Kay Pay', '2f024a477ae8559671141805c2168b2b', '2025-01-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (29, 10, 43626.70, 'paid', 'Orange Money', '6c7877c4c601f050108335e4d1bcf24e', '2025-01-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (30, 13, 43508.99, 'paid', 'Orange Money', '388468bee1a16503c98d1213a4a1662e', '2025-01-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (31, 8, 53053.32, 'paid', 'Orange Money', 'ff0b6c8a6fe3d3577224f9f7d961f893', '2025-01-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (32, 15, 39578.00, 'paid', 'Kay Pay', '1a1d5897d7d973c58f75868131dccec0', '2025-01-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (33, 14, 31800.21, 'paid', 'Carte Bancaire', 'cf83cf74058328073f7c62bb8090cf50', '2025-01-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (34, 15, 30544.45, 'paid', 'Kay Pay', 'a6c075e175cd09fb11fc8b2d8ca31cb3', '2025-01-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (35, 12, 50227.23, 'paid', 'Orange Money', 'a2c89c4696340fd68c850828450d689e', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (36, 14, 15626.03, 'paid', 'Yas Money', 'c20c35e1f3a490963eedb9f5a8e5c2be', '2025-01-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (37, 15, 49137.49, 'paid', 'Wave', '2a0c687007f786a3505047570113cb5a', '2025-01-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (38, 16, 51559.73, 'paid', 'Carte Bancaire', '6d19b6ef78c0f80c09b94a7035ffb841', '2025-01-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (39, 7, 49307.43, 'paid', 'Wave', 'e15be647f36032952b75e72af742f582', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (40, 8, 12775.46, 'paid', 'Kay Pay', 'e43599cd3375bae30d21a8b4e8a7acb1', '2025-01-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (41, 15, 10148.97, 'paid', 'Kay Pay', 'fdb9ea025ca111db55af4c39923fa0a7', '2025-01-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (42, 12, 28748.74, 'paid', 'Orange Money', '8ca3570daa7be09184f588b5bf9aa307', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (43, 10, 25152.13, 'paid', 'Yas Money', '35d62bae6dc26ce7481ad891550dc5e3', '2025-01-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (44, 16, 28990.35, 'paid', 'Yas Money', 'c1b6c3d482922a14e8d1fdeb560304f3', '2025-01-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (45, 12, 28971.37, 'paid', 'Wave', 'a652d1b91b3aeb55f3f7aef3bc55dff3', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (46, 8, 42740.25, 'paid', 'Kay Pay', '295899b3dda5ea5434ecf3918c5dc8a7', '2025-01-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (47, 15, 31265.18, 'paid', 'Kay Pay', 'c7bec87ff77e2fe55ba91d675824b624', '2025-01-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (48, 10, 27320.28, 'paid', 'Orange Money', '0faab886b2342d4e1873df36028a9bf9', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (49, 13, 12145.69, 'paid', 'Wave', 'e8753a9465eaeaaa2b4304257d54115a', '2025-01-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (50, 14, 9560.36, 'paid', 'Carte Bancaire', '10e11a18945374ebbdaa3914a61b958f', '2025-01-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (51, 8, 31606.95, 'paid', 'Wave', '961c3702c7b81d8c212941c0413df751', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (52, 10, 34164.08, 'paid', 'Orange Money', 'ef1e957337491d4a7d678a57ccd34c5d', '2025-01-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (53, 8, 19592.74, 'paid', 'Carte Bancaire', '03d29f704670550a3f088f7558754b50', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (54, 12, 29288.89, 'paid', 'Carte Bancaire', '3d795c6fe42aeb12f7139cc2376dcc1f', '2025-01-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (55, 11, 47816.48, 'paid', 'Yas Money', '0bcb12cbd81d260456b68c6be9f73cdb', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (56, 15, 12443.66, 'paid', 'Yas Money', '6518fbeed1c226e1428ab9c0a7b5440c', '2025-01-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (57, 12, 31014.40, 'paid', 'Carte Bancaire', '34d7bd2f647f5c7d6fdf6afbe0b53b1e', '2025-01-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (58, 14, 40559.58, 'paid', 'Orange Money', '5f77dabdfebf3fe439db67a114ea31cf', '2025-01-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (59, 7, 54389.04, 'paid', 'Carte Bancaire', '476446dbbdda44fa6f481de5e3a0ff52', '2025-01-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (60, 15, 41089.28, 'paid', 'Yas Money', '488a75f063288346eed8dc44008795db', '2025-01-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (61, 9, 40306.84, 'paid', 'Carte Bancaire', 'c391b4c43e4b8747017b8e6bfc0628bd', '2025-01-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (62, 12, 37298.58, 'paid', 'Orange Money', '0aad064044b42b37baeeacd83c7212d3', '2025-01-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (63, 9, 7574.12, 'paid', 'Wave', 'd5906e1fdb0d420c05eb4b24e1f6ffcb', '2025-01-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (64, 15, 25971.67, 'paid', 'Orange Money', '9d664ee2135f1f6bba7fbf9adb67a96f', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (65, 16, 13909.50, 'paid', 'Yas Money', '649daf2cde240ced4a00598f891fc865', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (66, 11, 39113.64, 'paid', 'Orange Money', '746c60eb49d6e0e621dafcd766993ced', '2025-01-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (67, 16, 21519.19, 'paid', 'Wave', '58aaa2d98a503de4209ebec1a0b91741', '2025-01-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (68, 12, 37290.23, 'paid', 'Yas Money', '5b645d54390c3d1cd81255e0c4920861', '2025-01-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (69, 11, 5490.89, 'paid', 'Wave', 'f5715c9f582e1e350da3bac6964b8a08', '2025-01-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (70, 15, 46093.46, 'paid', 'Wave', '8d865c70670ed9fe4a0c30d9b80130fc', '2025-01-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (71, 10, 6462.26, 'paid', 'Yas Money', '82b56e6fe4b85f8b186a4aa744a2f3a2', '2025-01-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (72, 7, 23707.18, 'paid', 'Carte Bancaire', 'e9e61640b54a25802eb5c73f3ae943b6', '2025-01-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (73, 9, 12032.40, 'paid', 'Orange Money', 'cb3c2a07f75c8159ce575e690121b49a', '2025-01-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (74, 8, 5820.71, 'paid', 'Wave', 'a831e4e3f8938a0e3a183d8d775bd96e', '2025-01-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (75, 9, 43619.31, 'paid', 'Orange Money', '08f6f1b29c735ae59f65174dfde20c24', '2025-01-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (76, 10, 41464.79, 'paid', 'Carte Bancaire', 'c8aa84613d355bee620c4e21775cd3de', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (77, 8, 32799.21, 'paid', 'Yas Money', 'cdb4af49cfc8581b531c27f1a39bbd47', '2025-01-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (78, 13, 25066.89, 'paid', 'Wave', '177472edd062c46ef1d2e2a4d5693e0b', '2025-01-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (79, 16, 27970.09, 'paid', 'Yas Money', '378d5556d6bfd0e2a174c78414ed45d4', '2025-01-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (80, 11, 52222.73, 'paid', 'Kay Pay', '4b144a8dc4a8b5276ff89ff7b1ddf4ce', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (81, 10, 27397.50, 'paid', 'Carte Bancaire', 'cbba0a7d29c4e75abb78d6fecd33fd84', '2025-01-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (82, 10, 52508.47, 'paid', 'Wave', '90ffd00cbf88ab7a7cc8fc14d40d8420', '2025-01-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (83, 16, 5161.65, 'paid', 'Yas Money', '7f4ee9498903e58f2125a4cbfb471192', '2025-01-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (84, 13, 18470.18, 'paid', 'Orange Money', '752e45f00ff222f72ce7124b6630e7a3', '2025-01-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (85, 10, 28424.66, 'paid', 'Orange Money', 'c8df652482d575d165f099b7cdb3cb6d', '2025-01-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (86, 8, 43068.32, 'paid', 'Carte Bancaire', '39a792de0cdc5b9cf3e6542b3ff3ff77', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (87, 15, 14106.05, 'paid', 'Kay Pay', '65de9ddf928724ddd0778c7106404fbd', '2025-01-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (88, 12, 54870.14, 'paid', 'Wave', 'a3f2dff008bace97dbb16f8876114f10', '2025-01-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (89, 11, 24059.56, 'paid', 'Kay Pay', '3cc0a2585ed82ce8e987139015fd5224', '2025-01-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (90, 16, 19391.15, 'paid', 'Carte Bancaire', '0aa9573500c8640ac2d5b8c10fd66ce1', '2025-01-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (91, 14, 36693.38, 'paid', 'Kay Pay', 'b7b9e1422384461d1c889eb70c6b1aa8', '2025-01-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (92, 7, 39195.11, 'paid', 'Wave', 'efc1133ffb2c2a9a35ef6c86454125f8', '2025-01-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (93, 15, 37898.82, 'paid', 'Carte Bancaire', '4729627257221f54a23b5bf1b70bd64f', '2025-01-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (94, 16, 10902.90, 'paid', 'Wave', '02bf79e509bc8a891c7a2699a47faee1', '2025-01-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (95, 8, 45728.98, 'paid', 'Yas Money', 'd9cf7eba93bc4687a52259cdbbb9f0e6', '2025-01-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (96, 15, 26732.78, 'paid', 'Kay Pay', 'ca9a26a16869e724dd43dd755a924dcb', '2025-01-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (97, 14, 42852.01, 'paid', 'Kay Pay', 'f83fa0bfa8569ffef41578f0dedbad25', '2025-01-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (98, 7, 51999.06, 'paid', 'Kay Pay', '289d6dfcc1cc75da021e74a73be5f8f0', '2025-01-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (99, 7, 31030.73, 'paid', 'Carte Bancaire', '2b6fcfaa75cc6fa740d5707ec5f6966e', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (100, 8, 41968.04, 'paid', 'Carte Bancaire', '47486ac4a00107f8d9da3eeb90eee00d', '2025-01-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (101, 13, 15589.11, 'paid', 'Yas Money', 'c40153050dbbc7cc30253a6037b2f59b', '2025-01-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (102, 12, 15243.81, 'paid', 'Kay Pay', '3da0400f8b5665b1c0e3dbdcd9547d17', '2025-01-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (103, 13, 25498.37, 'paid', 'Yas Money', 'bf76aea4316c97d5c3e4380ff867ecec', '2025-02-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (104, 16, 23295.66, 'paid', 'Wave', '37162e487827163d5222473859e64e3e', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (105, 15, 39284.74, 'paid', 'Orange Money', '40b1af0cff8fcbe5392abc361a48fe44', '2025-02-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (106, 13, 53654.17, 'paid', 'Yas Money', 'bb25d5d49352a65beca1c7aae280bcd1', '2025-02-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (107, 7, 32427.16, 'paid', 'Wave', '543f04603c7abb97a086077c3a2769f1', '2025-02-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (108, 10, 40149.02, 'paid', 'Wave', '0107c9c2ea863fc4db328bde200f5c7a', '2025-02-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (109, 11, 13739.41, 'paid', 'Carte Bancaire', '1c859b13ca5fdbb8049a702382bae63f', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (110, 15, 43284.17, 'paid', 'Carte Bancaire', '75f47dd56805a4ff2adede624a1d88a6', '2025-02-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (111, 9, 7610.08, 'paid', 'Kay Pay', 'd7787d2596046eb2a24da4f206305640', '2025-02-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (112, 12, 54022.88, 'paid', 'Kay Pay', '2d5adf44349236d034bcfa479158aa0f', '2025-02-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (113, 16, 27485.82, 'paid', 'Yas Money', '862a37fd76e4b526a5e7a7cd33ae807d', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (114, 8, 19417.30, 'paid', 'Wave', 'fb2d787066ae8e9d31b7f61abd9ce536', '2025-02-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (115, 13, 35725.20, 'paid', 'Yas Money', 'db8dcc504167115d769d6fb0604e0aea', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (116, 12, 42458.28, 'paid', 'Kay Pay', '1e1b8f7adf5bf224120b2b417e89247c', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (117, 9, 29102.73, 'paid', 'Orange Money', 'e6246ab13c1b4ee87fa78c8e304d0846', '2025-02-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (118, 8, 6102.10, 'paid', 'Wave', '1946d254bd7be85be2926cd3c43fa070', '2025-02-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (119, 13, 5983.31, 'paid', 'Kay Pay', 'd4dd6a954afc3698065856ef1d314706', '2025-02-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (120, 13, 27093.45, 'paid', 'Wave', '9abe938b07aadd632589917ae987278b', '2025-02-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (121, 12, 19167.56, 'paid', 'Orange Money', '7561749bb1901f71cd40272c9c93483e', '2025-02-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (122, 16, 30371.07, 'paid', 'Wave', '0141711141f502b6bd8091a59e307d0a', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (123, 7, 14454.51, 'paid', 'Kay Pay', '4b9526b13eaebc3444cbaad1d91f182a', '2025-02-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (124, 12, 33003.50, 'paid', 'Kay Pay', 'df9522d0645681cb0bc424dd1b6c5fab', '2025-02-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (125, 8, 45774.29, 'paid', 'Orange Money', 'b7de66f6e3e79500e3d3e79d7d89c9e5', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (126, 12, 31426.77, 'paid', 'Orange Money', 'fb5a5611ca02fe36e81f1bd412f769cd', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (127, 15, 19422.40, 'paid', 'Yas Money', '25bd4e2aacd60840cf9ae54e0f049ef3', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (128, 15, 54443.16, 'paid', 'Kay Pay', 'de8ee4a4a1b169ff01e064c611154a1f', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (129, 9, 44711.31, 'paid', 'Wave', '903b1774266cd7f6ec7e29439abe44b2', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (130, 13, 32875.40, 'paid', 'Orange Money', '1010ec6e5ae7515c38cd108074d9e768', '2025-02-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (131, 16, 19945.98, 'paid', 'Orange Money', 'ad607565c4538541849717337c430e88', '2025-02-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (132, 14, 21648.51, 'paid', 'Orange Money', 'f7d3ef9300410d40a57a03b6ab133d94', '2025-02-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (133, 9, 16840.57, 'paid', 'Kay Pay', '98fcbab584a89de85b6798a996b473ba', '2025-02-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (134, 7, 25479.31, 'paid', 'Kay Pay', 'c45c7d18bbcc9685aaf88d10a09ba3b8', '2025-02-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (135, 10, 22220.44, 'paid', 'Kay Pay', '6e79b5ae57c9c99f28c7aeb59e5e2907', '2025-02-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (136, 7, 46232.71, 'paid', 'Orange Money', 'c035a1ada0a3fbff1f068e1504c13bf8', '2025-02-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (137, 8, 22933.58, 'paid', 'Orange Money', '85611108f48c4c16e32cea4ca0e8e478', '2025-02-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (138, 16, 9751.84, 'paid', 'Carte Bancaire', 'f642422deed0143da9dc0e483805c95c', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (139, 13, 49004.64, 'paid', 'Carte Bancaire', '42743eeac7691725b3b87cc1639ac03c', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (140, 9, 47539.29, 'paid', 'Wave', '3ee88d50a0d667017dbaa8eb42e08b40', '2025-02-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (141, 15, 9179.95, 'paid', 'Carte Bancaire', '255a4f09b673a58c040b43bec16727b7', '2025-02-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (142, 7, 41338.24, 'paid', 'Kay Pay', '6d94fa5542cb0c07a9941277f1dd8637', '2025-02-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (143, 16, 31415.72, 'paid', 'Orange Money', 'dfc367bfab73254d373e8b16f6c50dfd', '2025-02-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (144, 8, 29219.00, 'paid', 'Carte Bancaire', '991d439aa8395f758f8a49c7b13759ef', '2025-02-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (145, 11, 14735.38, 'paid', 'Kay Pay', '5e3b3f510e20fa8b1b9857aaf473f1cc', '2025-02-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (146, 7, 38379.12, 'paid', 'Orange Money', '7963bc2b13b70f8c9e3ada424c1e435e', '2025-02-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (147, 8, 10853.93, 'paid', 'Orange Money', '42061e9dd070cef1bbc8eb2e45b028ac', '2025-02-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (148, 13, 14057.95, 'paid', 'Kay Pay', '6d4e2cfad7f2a973ed8c71c9bf82c78f', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (149, 8, 54458.26, 'paid', 'Yas Money', 'e0b26b26f1656ab0b8a8e40d6b42e943', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (150, 8, 16625.93, 'paid', 'Wave', 'bc4a785311954ae328eb9ca413e67775', '2025-02-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (151, 10, 42861.90, 'paid', 'Yas Money', 'eddbd5eeb6b0eaa961ca2eee6be84b3a', '2025-02-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (152, 8, 19350.39, 'paid', 'Wave', '5fed60151075a67bbe0d8aa7d5682ae2', '2025-02-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (153, 12, 5932.39, 'paid', 'Carte Bancaire', '04ab96f3bda4a19ef115ea899c004af6', '2025-02-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (154, 14, 13617.39, 'paid', 'Yas Money', '0469125e4929e38de35320d2f785b4d3', '2025-02-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (155, 9, 27595.59, 'paid', 'Wave', '432c87e655ab04b9a1605d51af159543', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (156, 9, 44896.22, 'paid', 'Wave', 'be0d3c6620a1714b8de517e1937a425b', '2025-02-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (157, 7, 11488.70, 'paid', 'Carte Bancaire', 'ed2ffabc2dc46cc00297474c45fdffd1', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (158, 8, 16863.76, 'paid', 'Carte Bancaire', '8094aa06e5c5f68601323ca1e5bc0f8e', '2025-02-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (159, 13, 7398.20, 'paid', 'Orange Money', 'cf36d48b6ad991659caffaab6378ac7c', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (160, 12, 15777.08, 'paid', 'Orange Money', 'd8a84aa0e5fe7a0d5042a15a0771c157', '2025-02-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (161, 15, 33846.71, 'paid', 'Carte Bancaire', '9ba8a745f0affd105f623def5fd525e0', '2025-02-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (162, 10, 35246.27, 'paid', 'Orange Money', '69746e8a0afdc15ec76ccc424369b1df', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (163, 15, 36833.14, 'paid', 'Wave', 'c22536d328823832776bc1bade89da55', '2025-02-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (164, 14, 10246.45, 'paid', 'Kay Pay', 'faa2799e1a983085f343fd005acaacd9', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (165, 14, 21009.48, 'paid', 'Kay Pay', '3d9878e7ae849ec2786fddd36a41e30b', '2025-02-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (166, 8, 7226.36, 'paid', 'Kay Pay', '9fc97edef50f44c9730908b0895c1b6e', '2025-02-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (167, 16, 52301.07, 'paid', 'Orange Money', 'fc6b07055ab49f859ec4ddc871eb1e6f', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (168, 9, 42015.09, 'paid', 'Carte Bancaire', '2ca2752ef60ed2a1ec8392374e062354', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (169, 10, 17057.47, 'paid', 'Kay Pay', 'f71915b3bade309adbf9ce7e5b0f56fc', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (170, 7, 16710.58, 'paid', 'Carte Bancaire', '7feb45db1e5a59094eaf59bfef289d31', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (171, 8, 42300.98, 'paid', 'Kay Pay', '8d3e7756449302b5abccbaa1aeb8723b', '2025-02-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (172, 7, 27051.48, 'paid', 'Orange Money', '8497023e37dbd3a4db6541a78e383732', '2025-02-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (173, 15, 37756.58, 'paid', 'Kay Pay', 'e8a631e838ef000c03ca25423235f924', '2025-02-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (174, 9, 40238.84, 'paid', 'Wave', 'e2214a03a5763f6c786e7194b0c7948d', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (175, 16, 27580.54, 'paid', 'Carte Bancaire', '3ed374239dab36e5b3cfe7defe39fe68', '2025-02-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (176, 16, 16185.82, 'paid', 'Yas Money', '00e84cb7ef37a5075932fc78c56d074b', '2025-02-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (177, 9, 10301.38, 'paid', 'Carte Bancaire', 'e101788a05ddb835e4fb977b57389130', '2025-02-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (178, 9, 52196.12, 'paid', 'Yas Money', '67b3271a74a8aa83760d946a1b97d707', '2025-02-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (179, 8, 8726.68, 'paid', 'Yas Money', '5e269787526b10c47adecd96867009da', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (180, 16, 17101.32, 'paid', 'Yas Money', 'cf8d55fb1453f515217b4c8b1287cc0d', '2025-02-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (181, 15, 44534.14, 'paid', 'Orange Money', 'bb5b362e40ab95641ffc1257503c06bc', '2025-02-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (182, 7, 31571.93, 'paid', 'Yas Money', '9ae87387619a3b0dfce8e292b13c33ea', '2025-02-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (183, 12, 24540.11, 'paid', 'Wave', '94a511b6213948b73801f5cef11ea179', '2025-02-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (184, 14, 14673.03, 'paid', 'Kay Pay', 'b578c5b6603a89a07f1df850cdeb0b4e', '2025-02-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (185, 10, 13526.38, 'paid', 'Orange Money', 'bcaeea055ef2e8ac0e8c4543f5e9db86', '2025-02-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (186, 14, 24704.24, 'paid', 'Carte Bancaire', 'c015bf2075718e41745cd805a60e92dd', '2025-02-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (187, 7, 28610.77, 'paid', 'Orange Money', 'ed4ad3e7d1cb00cb6486f58ef874e19c', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (188, 10, 34248.56, 'paid', 'Orange Money', '683c58ede40677caeb0f51f0b443a357', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (189, 10, 38511.40, 'paid', 'Orange Money', 'd0c40818aebd0b545a3937541bc50bf4', '2025-02-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (190, 13, 18096.46, 'paid', 'Wave', '936dabf7cca15280c5c797e76039ad7f', '2025-02-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (191, 9, 10241.59, 'paid', 'Wave', 'dcf8bc994885cc2ae28f73292bf0e414', '2025-02-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (192, 12, 15836.39, 'paid', 'Kay Pay', '6d7347d0e76fb50df952f472eeb80668', '2025-02-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (193, 14, 11929.38, 'paid', 'Yas Money', '80fddf6404de367fb77f4dc0353d0ea8', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (194, 8, 51681.69, 'paid', 'Kay Pay', '65d785471966b249a776580e5039095b', '2025-02-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (195, 7, 53382.43, 'paid', 'Wave', 'a2a4d632d05b0ab3d060e5ea95c38287', '2025-02-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (196, 11, 14004.72, 'paid', 'Wave', 'd65236d921250039958bb00b0cd2f6f8', '2025-02-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (197, 10, 5553.35, 'paid', 'Yas Money', '96aa4f173c26b316cc28f83bc05fa151', '2025-02-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (198, 9, 40251.45, 'paid', 'Wave', 'b024ad20d1af64886e19d795c56d222f', '2025-02-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (199, 9, 33278.35, 'paid', 'Wave', '71fb0619a41e621cad7f1df48735c419', '2025-02-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (200, 13, 54554.85, 'paid', 'Yas Money', 'f5964444606cca27950ad816b6262a7e', '2025-02-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (201, 16, 26016.03, 'paid', 'Orange Money', 'fcf34e54a1d754cf35cdb0aee1dd9674', '2025-02-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (202, 13, 51304.63, 'paid', 'Orange Money', 'a63a708965c55b01c78a04dbb00b421a', '2025-02-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (203, 9, 6811.61, 'paid', 'Kay Pay', '9fe8289a553a01c37495bcf1856b76f6', '2025-03-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (204, 8, 8531.76, 'paid', 'Wave', 'ef849acd1eaeedd13f3089bbe728f8d3', '2025-03-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (205, 14, 8198.29, 'paid', 'Wave', '624b83f1a8e8d389d1ffad83a9b06b56', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (206, 15, 21392.53, 'paid', 'Yas Money', 'b854150afb86e7c26a598e9f51135012', '2025-03-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (207, 9, 40886.58, 'paid', 'Orange Money', 'e88d3cda31064cd077f58c5047bbe624', '2025-03-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (208, 10, 44267.99, 'paid', 'Carte Bancaire', 'f5d2b03ace50331a838c09811352a08f', '2025-03-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (209, 15, 7778.36, 'paid', 'Yas Money', 'b4a87f1bd2e6e8648db983289ff000e7', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (210, 10, 49512.74, 'paid', 'Wave', 'f1121d97f5957cdad8a0c1a073d58687', '2025-03-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (211, 10, 44183.86, 'paid', 'Wave', '88743a98d763147a10c24a9693e75b14', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (212, 13, 49703.62, 'paid', 'Yas Money', 'bd885e7fb38b8fb939fe0cfa06fceee0', '2025-03-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (213, 8, 28252.25, 'paid', 'Yas Money', 'f95c6b65155c85bd293102b68693e1f6', '2025-03-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (214, 14, 21766.08, 'paid', 'Wave', '7560bf093707debd6c62814657438682', '2025-03-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (215, 10, 30956.24, 'paid', 'Kay Pay', '94156a902d33ee5ea92004ebbb17ba8c', '2025-03-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (216, 12, 28053.65, 'paid', 'Orange Money', '50d97277fe0f01a398cdcad7ad4c0be3', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (217, 8, 40253.22, 'paid', 'Kay Pay', '144ffea3888f6dae5da33f097ef299ca', '2025-03-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (218, 14, 22804.98, 'paid', 'Wave', '9a0e6a82e494600f5d16fd79b1b42aa1', '2025-03-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (219, 10, 24561.27, 'paid', 'Carte Bancaire', '49029dad80f27723afa900b628063e01', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (220, 15, 33520.27, 'paid', 'Kay Pay', 'a83c5cb1f689e2904ac56a48c95c5b60', '2025-03-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (221, 13, 9288.09, 'paid', 'Kay Pay', 'dac935b01a39766af46fb3343c24b2ff', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (222, 15, 37093.93, 'paid', 'Carte Bancaire', '528a79241367f7c57644d78664ca1365', '2025-03-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (223, 14, 42642.03, 'paid', 'Carte Bancaire', '257d9bf2d243fc93e9e2a148ced69172', '2025-03-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (224, 8, 51425.96, 'paid', 'Wave', 'af80824073d17c255f69f2f00d83ae67', '2025-03-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (225, 13, 12649.24, 'paid', 'Yas Money', '27f690718296103aaa1718738e858673', '2025-03-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (226, 15, 51609.61, 'paid', 'Carte Bancaire', 'aeceeb22f284ff23ddf195e2729255c8', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (227, 16, 44980.21, 'paid', 'Orange Money', '049062ed76f751091a5781b0c5d61494', '2025-03-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (228, 15, 22433.39, 'paid', 'Kay Pay', '8b9ce5871e88efb0a510f29cb8aaea7e', '2025-03-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (229, 12, 6929.20, 'paid', 'Orange Money', '02a355e9f6724e0cd8bfca7c9eaa6304', '2025-03-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (230, 13, 47672.34, 'paid', 'Carte Bancaire', 'dcc89107f9c69d681f6b438db66846ee', '2025-03-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (231, 9, 28989.12, 'paid', 'Yas Money', '418290f969fe4722319825bc212ac09b', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (232, 7, 30922.91, 'paid', 'Kay Pay', '4def262052063dca016a86e22a52ba6e', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (233, 15, 20578.28, 'paid', 'Orange Money', 'da6ad0c0d5338fadc519e4c94c99e2da', '2025-03-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (234, 14, 16314.53, 'paid', 'Wave', '14c5d13f274e0cd6566e259c81515735', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (235, 7, 15991.19, 'paid', 'Kay Pay', '888f25ccd886ba076e8c974b75431867', '2025-03-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (236, 12, 7230.64, 'paid', 'Yas Money', '30ce97ad761ba72474cadc8aba5bc019', '2025-03-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (237, 10, 51417.01, 'paid', 'Yas Money', '58003b82246567ac3ec0fe3f3896a8e2', '2025-03-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (238, 16, 10371.39, 'paid', 'Kay Pay', '25b4cc976d0391feaa26644adc7c64fb', '2025-03-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (239, 16, 46618.07, 'paid', 'Carte Bancaire', 'b276b48e82001ff53939912bd0cb1bb7', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (240, 12, 6204.61, 'paid', 'Yas Money', 'd918dc5368a9934fd7023785c845735d', '2025-03-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (241, 14, 35275.28, 'paid', 'Wave', '04da8b2e3f899e3696cd2680abec7264', '2025-03-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (242, 13, 28816.31, 'paid', 'Wave', '3db61c2c35cdd4cc8ab6409c8e612798', '2025-03-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (243, 14, 19064.18, 'paid', 'Wave', 'aff1b3b68d1d543b2fc59e1c79580a0b', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (244, 12, 32928.56, 'paid', 'Carte Bancaire', 'd0277a3c32951d3e26a3b2830b87f995', '2025-03-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (245, 12, 30755.78, 'paid', 'Orange Money', 'c51d178426891809f67ca23c9f8e771c', '2025-03-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (246, 11, 21819.87, 'paid', 'Carte Bancaire', 'a9d7e2e4ef431c9e80fdf4e978c05d96', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (247, 14, 46605.17, 'paid', 'Carte Bancaire', 'b87bb7545844de8dd157fd205438de64', '2025-03-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (248, 14, 39378.22, 'paid', 'Wave', '2951f31a170dba495ef27f06e4d6a529', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (249, 9, 10725.82, 'paid', 'Carte Bancaire', '1df7823a18c786da224a7727e57b7e7a', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (250, 10, 54603.22, 'paid', 'Carte Bancaire', 'ef624f10c94ae20b8aa66e5f2ace6c24', '2025-03-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (251, 8, 39286.57, 'paid', 'Carte Bancaire', 'd35afe1456ad36e975a03783448f991d', '2025-03-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (252, 16, 7484.44, 'paid', 'Kay Pay', '3ae4d6be73c31d97be6179719c059aaf', '2025-03-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (253, 14, 23573.72, 'paid', 'Kay Pay', '729adb76745bbaff5c97f5c71ba23f6e', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (254, 16, 38503.92, 'paid', 'Orange Money', 'ca908efecf333963f7ba33ed297e52cd', '2025-03-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (255, 8, 22037.41, 'paid', 'Kay Pay', '757939e4ab8f6379edf47ff8a3f33459', '2025-03-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (256, 14, 33692.78, 'paid', 'Carte Bancaire', '28df812998277b96f0a234232151c5a7', '2025-03-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (257, 9, 24872.61, 'paid', 'Wave', 'a21396c874a5eee36f85f2b8840bf16a', '2025-03-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (258, 11, 45118.98, 'paid', 'Wave', 'c7c83c0b7a438d9fc354c5e521df3912', '2025-03-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (259, 11, 31565.61, 'paid', 'Wave', '288172772c878eafa8f390c3dc7dfeb7', '2025-03-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (260, 14, 49123.50, 'paid', 'Orange Money', 'e9ccf1c6596094b0207056acaf55c011', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (261, 10, 27307.42, 'paid', 'Carte Bancaire', 'ec4b89ea8573d24d2b6b800a01057532', '2025-03-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (262, 10, 26823.51, 'paid', 'Kay Pay', '5b03852e8cb50b65f80b2715c30f382e', '2025-03-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (263, 14, 14522.94, 'paid', 'Kay Pay', '3ea141635e9e02c78e240439e1dc43e0', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (264, 7, 45106.46, 'paid', 'Carte Bancaire', '9abad6fdb1159f564dd736e53f4b625b', '2025-03-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (265, 9, 14561.87, 'paid', 'Kay Pay', 'a1386d6eb3b9f06382991d1d7ea5dac2', '2025-03-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (266, 14, 49277.15, 'paid', 'Yas Money', '69a0534fea574c928143a097efb51e6c', '2025-03-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (267, 13, 28297.51, 'paid', 'Carte Bancaire', '2159550ae19f7de5e4f73a9401f18225', '2025-03-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (268, 7, 23393.35, 'paid', 'Orange Money', 'cfb1418b43ddb8086ed23df5ebd31b06', '2025-03-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (269, 15, 28746.08, 'paid', 'Carte Bancaire', 'ec640ab2119fa198a688fc3aace8ddde', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (270, 14, 8538.70, 'paid', 'Wave', 'aab79b4c14234002260824062de96fbb', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (271, 8, 13041.90, 'paid', 'Carte Bancaire', '0a64e803e83cd1416e3789b67f8b3370', '2025-03-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (272, 11, 49138.61, 'paid', 'Wave', '16948e7b6033331f7ef1f00deac15cac', '2025-03-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (273, 7, 30056.65, 'paid', 'Wave', '34e2452163beedf98f52cb5a5cf0337d', '2025-03-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (274, 12, 20400.74, 'paid', 'Orange Money', '96b8a1f8b34ae75ff8c139454ad0c588', '2025-03-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (275, 8, 12764.14, 'paid', 'Carte Bancaire', 'c7bdd5c733a6038c1497261f99643ab4', '2025-03-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (276, 15, 53931.43, 'paid', 'Orange Money', 'e3f876963f02aec66cb66244af8af9ff', '2025-03-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (277, 14, 45411.38, 'paid', 'Yas Money', '3749c44a281e09e9c060ddf6dd3624e5', '2025-03-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (278, 16, 31805.49, 'paid', 'Kay Pay', '553821d9468f23e534e83d6b95d3c157', '2025-03-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (279, 14, 50871.65, 'paid', 'Wave', '4bb4451a341bbaf7f4e370a5fb62b898', '2025-03-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (280, 13, 30014.60, 'paid', 'Wave', '65b18e30618ef8f3e49f8d617100bfd5', '2025-03-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (281, 9, 15302.51, 'paid', 'Carte Bancaire', '232623965b24207d544e13df6e4ae3c2', '2025-03-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (282, 12, 38696.63, 'paid', 'Kay Pay', 'c1a637bd449c274b30377cc38ab275c0', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (283, 9, 53070.33, 'paid', 'Orange Money', '81c954717f9f549dc4fbfbd634265a26', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (284, 12, 16703.92, 'paid', 'Orange Money', '3c0301eff6491c683342dd8947212854', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (285, 12, 6435.40, 'paid', 'Carte Bancaire', '518781a487ca7139814fd11ae5fefe76', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (286, 13, 53471.39, 'paid', 'Orange Money', '2a445f110c6448ad1152329a2e27dbf5', '2025-03-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (287, 7, 25797.03, 'paid', 'Orange Money', 'ddbf47d89a8677cdaf4ac5659f2a9814', '2025-03-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (288, 14, 21300.51, 'paid', 'Wave', 'bdb3c05eb35fead4cc98a762d6f86879', '2025-03-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (289, 10, 11910.15, 'paid', 'Carte Bancaire', 'fc7184cea6acee7f08d2b248de5eadec', '2025-03-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (290, 15, 50338.86, 'paid', 'Carte Bancaire', '5dc89181177e4c0d46e1458a6bc38f55', '2025-03-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (291, 10, 17362.33, 'paid', 'Yas Money', '3401e92caeb499e9cde584c07d3b8565', '2025-03-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (292, 16, 8013.38, 'paid', 'Orange Money', 'f29ceb22ac9285af88b2cfffc9d65fdb', '2025-03-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (293, 8, 13874.30, 'paid', 'Carte Bancaire', 'bc360ea090fde5ea6f9f960948d24703', '2025-03-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (294, 9, 10032.49, 'paid', 'Yas Money', '91762329134a567a1822f1424209f062', '2025-03-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (295, 7, 7852.22, 'paid', 'Yas Money', 'dfc5e3ed0b572f3a1ed2ccca0fed44b2', '2025-03-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (296, 11, 40480.56, 'paid', 'Kay Pay', '4b9dc83a2463449afc3793a8879c8cc6', '2025-03-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (297, 9, 19999.06, 'paid', 'Yas Money', 'f0115ebb4f6637ee00d0b1fd05b38fc6', '2025-03-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (298, 9, 51792.10, 'paid', 'Yas Money', '9a8eea114a3f9e0a4b96bd60b81da996', '2025-03-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (299, 13, 34320.08, 'paid', 'Orange Money', 'ce5bbaaa1a4e3bc1e68e97ebb4d8ea59', '2025-03-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (300, 14, 25173.77, 'paid', 'Wave', '5714ff6e3363d550b6ff2841dc98e8e0', '2025-03-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (301, 14, 18375.95, 'paid', 'Yas Money', '2a7c5c35b8ccd8e51a30ed66b181cb06', '2025-03-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (302, 8, 11430.42, 'paid', 'Carte Bancaire', '47de196991d65949b6f72452bbc200a1', '2025-03-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (303, 14, 38171.62, 'paid', 'Kay Pay', 'cce82b2c02225284642f653d21815c46', '2025-04-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (304, 10, 33018.66, 'paid', 'Orange Money', 'bdf4b1a2b8ad9453b4c750a62ce7942e', '2025-04-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (305, 9, 33384.79, 'paid', 'Orange Money', '7224de4f7fa368646764802230a59f5a', '2025-04-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (306, 7, 27255.32, 'paid', 'Kay Pay', '28b9803a75c586fa384b201dafd4e1da', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (307, 13, 13551.13, 'paid', 'Yas Money', 'c69fc09a968fbe0406ab5d4727e4e3d0', '2025-04-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (308, 14, 42357.27, 'paid', 'Yas Money', 'be75ac664d303ee16a8d785b14c0bc51', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (309, 13, 11176.03, 'paid', 'Yas Money', '6eaed83847e15ef2584bd3b210a61b3a', '2025-04-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (310, 8, 34757.69, 'paid', 'Carte Bancaire', '3d0538c32c8a1fd160c29d8f5ae4999a', '2025-04-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (311, 7, 49892.94, 'paid', 'Orange Money', 'eea5164e81c697455b89bd9bbdebd213', '2025-04-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (312, 8, 15189.72, 'paid', 'Kay Pay', 'ac79d2091b71e558b3ed14e3a65d781e', '2025-04-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (313, 12, 54581.65, 'paid', 'Carte Bancaire', 'cec1adc6d691c8b6effd5a3858840b80', '2025-04-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (314, 11, 45882.15, 'paid', 'Wave', '54863f6b440fa72c4aa5feab2a651ff3', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (315, 14, 38649.50, 'paid', 'Orange Money', '37b582c78154df80efd011663dda2fc4', '2025-04-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (316, 16, 39134.46, 'paid', 'Kay Pay', 'f8111d9095d803138472ae19d459120f', '2025-04-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (317, 8, 14656.93, 'paid', 'Kay Pay', '2a31ff35489ea9236fe82271d2de3d42', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (318, 16, 25804.37, 'paid', 'Yas Money', '12b20b5365e25b783bc308e7d94abfa9', '2025-04-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (319, 14, 6791.01, 'paid', 'Orange Money', '6f35cf7d273fcc8a9b5959f22d568315', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (320, 10, 34808.73, 'paid', 'Yas Money', 'db9cb0f44ee1a4c9378d20646969124a', '2025-04-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (321, 7, 54054.69, 'paid', 'Orange Money', '32f90e7e73372f516428ea2511945433', '2025-04-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (322, 15, 50354.73, 'paid', 'Wave', '477ea1a6c46a1e35c694304e96dbaa67', '2025-04-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (323, 9, 35458.81, 'paid', 'Carte Bancaire', 'cc189b1bf9d2aaa6b397ce6784944fce', '2025-04-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (324, 10, 44626.79, 'paid', 'Kay Pay', '463e8824165c4f148df9980752dc54b5', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (325, 11, 47775.30, 'paid', 'Wave', '454955b7b2d42de3cf72eb43f99081f5', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (326, 14, 8130.82, 'paid', 'Wave', 'e710fcaf5313a12f55216cec5a52a895', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (327, 15, 34340.15, 'paid', 'Orange Money', '7798689675c2b855506a0d7c6de44be6', '2025-04-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (328, 14, 39869.43, 'paid', 'Orange Money', '4a76941731ae66a5dcb405b8dc382938', '2025-04-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (329, 8, 27849.97, 'paid', 'Carte Bancaire', '49fdf4c5a9b18b9ca096f773531a9671', '2025-04-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (330, 10, 47623.54, 'paid', 'Orange Money', '02a21ac0144fad20ca07813608547549', '2025-04-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (331, 13, 6294.06, 'paid', 'Carte Bancaire', '9733a8b1015b4a8aa8ee099400eee027', '2025-04-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (332, 15, 31701.25, 'paid', 'Wave', '3171b0e3c43b50fa7a4c5f632c662d67', '2025-04-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (333, 12, 39886.39, 'paid', 'Yas Money', '6da5d4ade989930c65f9767bde0530f4', '2025-04-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (334, 7, 25065.18, 'paid', 'Yas Money', '4c57911897aa55f38e64332e05c4abbe', '2025-04-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (335, 12, 49340.99, 'paid', 'Orange Money', 'c7c6234cdf92f552dda543b218cb7ac4', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (336, 10, 35426.54, 'paid', 'Carte Bancaire', '0bc13289c071a7d06a74710063da98a9', '2025-04-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (337, 11, 5372.67, 'paid', 'Wave', '532cce5097d07cd7923098b6bbd8b8d9', '2025-04-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (338, 7, 34463.45, 'paid', 'Kay Pay', 'e0219530ba747a6df5687a3bba7f7e9a', '2025-04-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (339, 8, 26108.66, 'paid', 'Carte Bancaire', 'dc3ce5653b55c2fff1d7737f9461432d', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (340, 9, 44250.31, 'paid', 'Orange Money', '96fbe56ac4ff8a9be13624521964a49e', '2025-04-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (341, 16, 18437.35, 'paid', 'Wave', '7b8a277e9a4314adbf9322b208ccdac6', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (342, 9, 46936.62, 'paid', 'Yas Money', 'a8a34e527fa1e3b5443c4297954dff0e', '2025-04-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (343, 15, 10535.80, 'paid', 'Wave', '8cde24f7717431e568d38b5cccec5b6e', '2025-04-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (344, 11, 42409.42, 'paid', 'Wave', '8feb31d5725495c7400f8838883fa9af', '2025-04-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (345, 14, 45409.35, 'paid', 'Kay Pay', 'f7b8b293130d35a6dae34cc04b2b09f8', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (346, 14, 5343.25, 'paid', 'Yas Money', '99a687d9e2d96e93825dd6e028f735c3', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (347, 16, 14502.14, 'paid', 'Yas Money', '1a30d33e2460c1fa17a4c08a51c02fc3', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (348, 14, 15523.30, 'paid', 'Yas Money', '419be751957c4a16caf780d78f95fcd8', '2025-04-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (349, 16, 52748.98, 'paid', 'Kay Pay', '00fa17506ed8bf07591106746cd0a52a', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (350, 15, 15480.96, 'paid', 'Yas Money', 'ce284b8100d12532541f5a274c935112', '2025-04-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (351, 8, 22979.00, 'paid', 'Wave', '670203cbb89bb72685ff826cce1bce57', '2025-04-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (352, 11, 52666.11, 'paid', 'Yas Money', '480f61a34a4365aab38f3b5c57a8932b', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (353, 8, 23454.53, 'paid', 'Kay Pay', '34fb0e4b43184de54f00b763b70e96ff', '2025-04-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (354, 11, 11717.27, 'paid', 'Wave', '1c6fbad43c9d2ec3fd1d2797cbd6c1c6', '2025-04-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (355, 8, 34852.84, 'paid', 'Yas Money', '400382e8f810caeaa76bd80eb6fbdcea', '2025-04-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (356, 14, 31808.47, 'paid', 'Wave', '819be4a8d67df14a2273cc405ef493df', '2025-04-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (357, 14, 25379.67, 'paid', 'Yas Money', '7c72e042b307a0bbb9e5b89cc8a464e9', '2025-04-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (358, 13, 27194.54, 'paid', 'Kay Pay', '5f0ca7dc72277453cc3a16022c972dce', '2025-04-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (359, 8, 29883.54, 'paid', 'Orange Money', 'a443e8cfca6528048edf688942b52d5b', '2025-04-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (360, 11, 21662.61, 'paid', 'Orange Money', 'c92197739cf6fb28264d4b0f6805358e', '2025-04-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (361, 10, 26247.03, 'paid', 'Carte Bancaire', '47fbd9dc3ef3d543d3bc8461911cc1da', '2025-04-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (362, 12, 30135.17, 'paid', 'Wave', '0708603db426b5e413a3d93c742600a5', '2025-04-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (363, 13, 52158.56, 'paid', 'Kay Pay', '3174001b096284df5b318b6325971e41', '2025-04-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (364, 16, 45425.45, 'paid', 'Wave', '72306c941b03347663580c7775c4fcd7', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (365, 7, 53423.21, 'paid', 'Wave', '41593a60daf0f6c196ec8e91ca2c8cfa', '2025-04-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (366, 9, 21165.48, 'paid', 'Wave', 'db6492bcfa2e8261bfd9639838c0b574', '2025-04-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (367, 16, 13337.10, 'paid', 'Wave', 'a9d1b3e0c82fe1a4469f17cb617c201a', '2025-04-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (368, 9, 33857.91, 'paid', 'Carte Bancaire', 'ef2b41f9e031a7a7f2d95dcd058cd37b', '2025-04-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (369, 14, 54259.29, 'paid', 'Carte Bancaire', 'b06e3ee12d2e31e543921b920908a721', '2025-04-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (370, 16, 16551.15, 'paid', 'Yas Money', '53f406bdf1796764aa0b5d4b2067be1b', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (371, 7, 44396.68, 'paid', 'Orange Money', '494443687f2ede829d3bd0fbe1e03fe5', '2025-04-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (372, 8, 17279.59, 'paid', 'Orange Money', '514d27ddfb7d9edf9fc317aca5ce5ec4', '2025-04-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (373, 13, 23279.02, 'paid', 'Kay Pay', 'b2fb4fbcb0cd99cbe3e0f63e0914d5d8', '2025-04-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (374, 7, 41894.81, 'paid', 'Carte Bancaire', '183e89eac215b27219997d500d472707', '2025-04-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (375, 12, 41011.30, 'paid', 'Orange Money', '62df9cdc8babda064e481e7e5b645509', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (376, 9, 23626.62, 'paid', 'Carte Bancaire', '196d73dc4afa391226b93c19dea1990d', '2025-04-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (377, 7, 48915.52, 'paid', 'Orange Money', 'f2a543de83dc56e45faede99c4c85525', '2025-04-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (378, 8, 21127.32, 'paid', 'Wave', '132b3145d27e67dca3280e845a5a69bd', '2025-04-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (379, 14, 13242.83, 'paid', 'Carte Bancaire', '397faa635ce70364ea8c01891ea7705b', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (380, 9, 8792.42, 'paid', 'Wave', 'a4aa42a7562fb7a3e3f47a1feff49a19', '2025-04-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (381, 8, 40789.67, 'paid', 'Carte Bancaire', '59587dd24da88e1d359c433714be472a', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (382, 10, 11399.97, 'paid', 'Wave', 'b86232a0ac005829a3dd633a36b69bef', '2025-04-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (383, 7, 51123.22, 'paid', 'Yas Money', 'ba63921e616c2cbc660f2bef0b84a6cf', '2025-04-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (384, 15, 6613.15, 'paid', 'Wave', '38c8d3c0aff269369ef194d4b34187f8', '2025-04-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (385, 12, 8719.11, 'paid', 'Yas Money', '522c1ec935b3643013ba66a7aa776612', '2025-04-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (386, 16, 14762.41, 'paid', 'Kay Pay', '8350a49fdaa0ea304c2a9cb6773e81e6', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (387, 16, 35302.95, 'paid', 'Wave', '5169dbb0eb15a3d85fd157253791b8a5', '2025-04-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (388, 12, 50321.54, 'paid', 'Carte Bancaire', '8be9daefa7f6673d54b466de3d828f62', '2025-04-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (389, 10, 25231.57, 'paid', 'Wave', 'ba68839daf71487a7994745a61e6859d', '2025-04-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (390, 13, 35345.43, 'paid', 'Orange Money', '9cd7e76386304985945fab7023b4d788', '2025-04-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (391, 8, 24262.54, 'paid', 'Orange Money', '887dc8734dd1162ded54803e77cc787d', '2025-04-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (392, 14, 53223.30, 'paid', 'Wave', '22b5dc9006354b1652910c2a251f47d0', '2025-04-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (393, 13, 22331.81, 'paid', 'Orange Money', '33ec1ca5a1fb0f2b622664dfe2c7e5f3', '2025-04-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (394, 14, 8991.76, 'paid', 'Carte Bancaire', 'ea00d8d55917d98d0a4ba4c933531b10', '2025-04-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (395, 10, 21022.75, 'paid', 'Kay Pay', 'c482a7f56a3ce4cf8897fdc2ca2890f0', '2025-04-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (396, 14, 5966.52, 'paid', 'Orange Money', '3ae94177b943a7eedc5dcdcd5dffc20f', '2025-04-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (397, 7, 46171.92, 'paid', 'Wave', '35a78b35ace27a847fe6127e361a63e0', '2025-04-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (398, 12, 49419.69, 'paid', 'Carte Bancaire', 'f5b63eeedcf2460366168014dea6a32f', '2025-04-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (399, 13, 27148.84, 'paid', 'Carte Bancaire', '757b317d061032cef8a8eac05df68b0d', '2025-04-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (400, 11, 15413.00, 'paid', 'Carte Bancaire', 'e679eb8b5cdc3bf1239ddb775eac3c96', '2025-04-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (401, 8, 33744.04, 'paid', 'Wave', '745f56f59864f989bf2fa3d14b66855f', '2025-04-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (402, 12, 35272.19, 'paid', 'Kay Pay', 'dbdac01d5f29ad0272d9e668e1bff1d1', '2025-04-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (403, 14, 26636.34, 'paid', 'Kay Pay', 'df8320bf9771c41f92e4ebd3023cdd2c', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (404, 12, 45797.77, 'paid', 'Orange Money', '249a778deea65080fe16e0c8e0142e02', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (405, 10, 46177.31, 'paid', 'Yas Money', '2e961f18d7fde3bd4d9ec389619ff92e', '2025-05-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (406, 10, 37587.10, 'paid', 'Kay Pay', '6f0b0f24fcfd48f9334f9fbf27aab160', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (407, 13, 27467.16, 'paid', 'Yas Money', 'ecdaeda26bd1f9dfc3ebb3fa5ae2e7b5', '2025-05-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (408, 14, 41866.15, 'paid', 'Wave', '2bec38fc391b3d3d2351e233f965fa9c', '2025-05-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (409, 10, 18736.25, 'paid', 'Orange Money', 'bd26968c237611938107e380f601e19c', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (410, 9, 23476.18, 'paid', 'Wave', '28a18898157880258fdf5ae98a56fe8d', '2025-05-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (411, 13, 36214.80, 'paid', 'Orange Money', '5c58cc10c3e97292dacadd0a2b8077f2', '2025-05-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (412, 11, 32063.99, 'paid', 'Kay Pay', 'be6c0900deb49a95879c21da77076674', '2025-05-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (413, 15, 36520.55, 'paid', 'Wave', '72951462a2c3977b088e08fbc2244040', '2025-05-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (414, 12, 31456.15, 'paid', 'Kay Pay', '26f8042f6730f8b3f9576ae2da1d22f4', '2025-05-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (415, 16, 16915.78, 'paid', 'Orange Money', '88761ba002391d329352025c1ebb706e', '2025-05-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (416, 8, 27599.09, 'paid', 'Wave', '849dae4bff6d0f78a6e48704d55fa11a', '2025-05-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (417, 7, 15936.67, 'paid', 'Carte Bancaire', '5bcef770ee7212a8e264a095bba93089', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (418, 11, 43447.97, 'paid', 'Carte Bancaire', '372900b4f10cad8c79a4829e51a7ae02', '2025-05-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (419, 16, 49631.62, 'paid', 'Kay Pay', '6bf11d9af61f41110e30dcefe11d5747', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (420, 7, 37063.82, 'paid', 'Yas Money', '70580df0667093ff0a4addd147f23e9f', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (421, 7, 15893.37, 'paid', 'Kay Pay', 'eb178b330b5bdff91050b2138f4ffc9d', '2025-05-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (422, 8, 25819.83, 'paid', 'Yas Money', '930cc443c451ed51353bcad70a4aed09', '2025-05-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (423, 14, 37950.47, 'paid', 'Carte Bancaire', '49382fd875d9c049bde6b720af36bdfc', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (424, 10, 18386.99, 'paid', 'Carte Bancaire', 'd181d8c611e1607af7b2153b3ee0081c', '2025-05-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (425, 13, 39212.18, 'paid', 'Kay Pay', '5585c8e484fbecddb72e8fb63c635281', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (426, 12, 39935.73, 'paid', 'Kay Pay', '80df36b43e0b1643176d3a73241dcb5a', '2025-05-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (427, 14, 12557.20, 'paid', 'Kay Pay', '39f046acb1f2471bcf222338dc583acb', '2025-05-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (428, 12, 13917.23, 'paid', 'Carte Bancaire', 'f0526d1535be7384efb37912079ff07c', '2025-05-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (429, 13, 46570.41, 'paid', 'Yas Money', '5e3d053c7201be88a518d1161d2eb5a2', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (430, 14, 12791.46, 'paid', 'Orange Money', 'df3515e1de963cca386dfa179d66129f', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (431, 11, 38196.32, 'paid', 'Wave', '82f2e585b03c3998cec9e795cae6fb2a', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (432, 10, 5615.43, 'paid', 'Orange Money', '9ebd5ed34a71f7a6c69defbd302b0122', '2025-05-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (433, 13, 51299.55, 'paid', 'Carte Bancaire', '1d461be1d46ad7b42154ff20c88487c6', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (434, 9, 26324.15, 'paid', 'Wave', 'd002eb1c1d83ea39fc77ccd0cb759c50', '2025-05-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (435, 11, 24632.96, 'paid', 'Orange Money', '9a7ee5e1c91d1d636a4736208ee58d1a', '2025-05-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (436, 12, 5886.52, 'paid', 'Kay Pay', '276582521592b1a15f3df19865ad06e5', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (437, 12, 20547.66, 'paid', 'Carte Bancaire', 'fd9da08cf65aed5f3a1b37b6b27dfce0', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (438, 10, 15237.72, 'paid', 'Kay Pay', '554d668a253cb20a780c4d8b57eac4a5', '2025-05-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (439, 12, 32060.02, 'paid', 'Orange Money', 'ab2129190aa3ec71875da0a23207593a', '2025-05-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (440, 15, 50578.27, 'paid', 'Carte Bancaire', 'e411935dd7bc605c2c80e2eefc72fc92', '2025-05-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (441, 12, 30251.49, 'paid', 'Kay Pay', 'dea7b96708073fd6313c002ece985ae5', '2025-05-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (442, 7, 53350.12, 'paid', 'Wave', 'e64b6ded19cf312284f210e902f893ad', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (443, 13, 51410.38, 'paid', 'Yas Money', '2eeba10a65fcb03a75a85323c7579e9a', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (444, 8, 48787.99, 'paid', 'Orange Money', 'fe90b1e3ef06e85a50913927c6ece99d', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (445, 16, 18194.78, 'paid', 'Orange Money', '8c12cc302b97db0ee20cacbfff9f1a3e', '2025-05-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (446, 15, 20739.45, 'paid', 'Orange Money', 'fef9f85d9ccbb37e0c8db86d70b406bc', '2025-05-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (447, 10, 15838.22, 'paid', 'Orange Money', '04473751e5ddbcf69e33c5a7c2ce9c52', '2025-05-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (448, 10, 53474.67, 'paid', 'Yas Money', '7fcdfdf782bc5ccfeb6a92a8e47b74ec', '2025-05-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (449, 14, 30723.87, 'paid', 'Orange Money', 'bd484c39a8911be4ff3f659a39bf2cd1', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (450, 11, 35351.13, 'paid', 'Wave', '7a5cc4e199426aba886d115117376611', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (451, 15, 15330.46, 'paid', 'Kay Pay', '62c9c36ccdc7a4bf2162ee88cd619743', '2025-05-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (452, 12, 49954.01, 'paid', 'Carte Bancaire', '4febf2fc918fda03a7377013256d535f', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (453, 14, 27506.13, 'paid', 'Orange Money', 'dfc6f0c0ad8f75aaff19127dad027ed2', '2025-05-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (454, 13, 29497.05, 'paid', 'Kay Pay', '966468065093c5b3cb77fe30c44cfbbc', '2025-05-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (455, 13, 12547.94, 'paid', 'Carte Bancaire', 'c78009c51438261a54755d17557d4b11', '2025-05-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (456, 9, 30174.25, 'paid', 'Orange Money', '91ef800ca41487a009283b759da2ecde', '2025-05-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (457, 10, 24792.67, 'paid', 'Wave', '9b162a691a018ddeff878c0f474aafc4', '2025-05-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (458, 15, 20341.09, 'paid', 'Wave', 'c5ca995c2ed439c70cdea283ceca7de5', '2025-05-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (459, 14, 16630.96, 'paid', 'Wave', 'f9431a63bd85288584b37dbcef4ebe57', '2025-05-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (460, 16, 49998.29, 'paid', 'Carte Bancaire', '819b6cc191100334a7c5ff5f766dbc82', '2025-05-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (461, 13, 10140.24, 'paid', 'Carte Bancaire', '9b036b0f6ccefb8037c8b64ac136e73f', '2025-05-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (462, 7, 20262.19, 'paid', 'Yas Money', 'fd43ab12b52b8aee074c42a2727ed409', '2025-05-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (463, 11, 46472.16, 'paid', 'Yas Money', '4e36ef4652f23f80db34f62b4d6323c0', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (464, 7, 13141.96, 'paid', 'Orange Money', 'a64df4b817428aac3f06ab6d623e1ab9', '2025-05-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (465, 8, 31535.99, 'paid', 'Carte Bancaire', 'b09517cd0ca0ac9d1459397b815f731f', '2025-05-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (466, 16, 42746.38, 'paid', 'Yas Money', '4a28df7b55949ff7f84903c03d741259', '2025-05-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (467, 11, 32500.57, 'paid', 'Kay Pay', '1757b67f2ff9f3cc49c84b38c62eb10b', '2025-05-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (468, 10, 51044.15, 'paid', 'Orange Money', '3b57df198e3cf1f8191b9bd531a47e8c', '2025-05-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (469, 11, 13619.32, 'paid', 'Orange Money', 'd70fee26787c543fb0299fc7b105b4e0', '2025-05-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (470, 11, 52451.75, 'paid', 'Orange Money', '86cb7f9b9acee05c8249bc41d0ecbd43', '2025-05-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (471, 14, 54048.50, 'paid', 'Wave', '66442dd59e72836ef0d22059ac7cc010', '2025-05-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (472, 12, 27608.80, 'paid', 'Carte Bancaire', '1b47a7d8b2ecb2594a97a06590a67ad0', '2025-05-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (473, 9, 10913.92, 'paid', 'Wave', '71743dbb6869f418dd39834575ae42a4', '2025-05-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (474, 7, 11200.00, 'paid', 'Carte Bancaire', '8d3cc313c71d5b9fbb7b8e9478ee3ffd', '2025-05-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (475, 13, 13268.86, 'paid', 'Yas Money', '52095c054cf1bf1b906fce8f9762d4c5', '2025-05-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (476, 15, 31755.33, 'paid', 'Carte Bancaire', 'fa73f6bd9f6da0cebc1e9d3b9d242a79', '2025-05-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (477, 11, 27603.76, 'paid', 'Wave', '3e1322d013e8f9abe7baf993df95b613', '2025-05-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (478, 10, 18563.50, 'paid', 'Carte Bancaire', 'e1bf8b56f3339e86c192bb8b1935599d', '2025-05-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (479, 16, 42153.26, 'paid', 'Orange Money', '53483c745c32be97d05f1b87873df63e', '2025-05-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (480, 8, 15392.21, 'paid', 'Kay Pay', 'dc2922f60cae081f2be1a6c8b321d420', '2025-05-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (481, 14, 32184.70, 'paid', 'Yas Money', 'e6fa06cb0f7dd2921289380da0a6959b', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (482, 13, 13453.73, 'paid', 'Yas Money', '1b4fa6a994455fa91228a92a6c62f086', '2025-05-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (483, 8, 43165.60, 'paid', 'Yas Money', '91d845ec6f1dbc7e7a5660b8206815e2', '2025-05-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (484, 12, 41442.80, 'paid', 'Orange Money', 'b5535305bd039a5f5bc80778967bb9dd', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (485, 9, 37753.71, 'paid', 'Wave', 'ac23ca95d6d8791cd2243b687fef0b4e', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (486, 13, 40533.52, 'paid', 'Orange Money', 'a0bb54cd107ba6607cb48aedbb365a77', '2025-05-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (487, 9, 54991.51, 'paid', 'Carte Bancaire', 'dbcc8926d1f35712cd23e793cf42c319', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (488, 11, 30770.00, 'paid', 'Orange Money', '3fb6b942380935d84233e84a9bca06ad', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (489, 16, 34271.75, 'paid', 'Orange Money', '1c7d872f7f8cfd6aaaf7b5c97f95925a', '2025-05-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (490, 13, 29731.65, 'paid', 'Yas Money', '86be420be68f086df43a9a69c7a0c6de', '2025-05-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (491, 8, 27772.37, 'paid', 'Wave', 'd1d40691b839b820f13654629b3fac98', '2025-05-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (492, 10, 42341.22, 'paid', 'Carte Bancaire', '1b012590b70dde789901c2eca6fa6b72', '2025-05-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (493, 10, 20515.86, 'paid', 'Wave', '22ed02d030b5ebaea2e78973f30e25f6', '2025-05-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (494, 14, 13556.81, 'paid', 'Yas Money', 'fc187c912ed825d8852ebcfe672d5f95', '2025-05-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (495, 8, 38637.26, 'paid', 'Kay Pay', '520aa51007953a139e6309bf2a856b9f', '2025-05-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (496, 13, 10064.83, 'paid', 'Carte Bancaire', '5a7d018f380af0fae6b35a608970b1c5', '2025-05-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (497, 8, 38647.05, 'paid', 'Carte Bancaire', '49cd00ba2588106faabd331269ff8b13', '2025-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (498, 9, 6768.68, 'paid', 'Carte Bancaire', '7b7700da9859553f181bb8b68fd98592', '2025-05-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (499, 8, 17054.52, 'paid', 'Carte Bancaire', '3c7d4b7009100d0579bf78752397e9b4', '2025-05-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (500, 9, 40510.50, 'paid', 'Wave', '1cb9361d97ce7ecc059ec26b79974ff9', '2025-05-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (501, 7, 17479.97, 'paid', 'Carte Bancaire', '3cd7ccc579b422b57349ac974bc688cb', '2025-05-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (502, 7, 39540.16, 'paid', 'Yas Money', '88e777b686bdba941d0227e6264591c3', '2025-05-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (503, 13, 14338.10, 'paid', 'Wave', 'd2b6e5ca3d21d794ed0afe813b7f11f1', '2025-06-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (504, 16, 16963.84, 'paid', 'Kay Pay', '72e8f514567edd6a4580f1479a07f3d2', '2025-06-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (505, 16, 42361.55, 'paid', 'Carte Bancaire', '1859d5465b9706fd104f35b52bf276fe', '2025-06-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (506, 7, 28370.01, 'paid', 'Carte Bancaire', '0d1b20754ee9c1d86ffd89a5d4498ef1', '2025-06-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (507, 8, 10612.54, 'paid', 'Kay Pay', '3dfd4d27a9b7e7a69b5e996cd4db478d', '2025-06-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (508, 15, 28389.90, 'paid', 'Kay Pay', 'db5833d9d077e140346776192ad9cbfb', '2025-06-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (509, 15, 46515.87, 'paid', 'Yas Money', 'de4650d412c11a96408f2feef9843a72', '2025-06-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (510, 14, 38153.41, 'paid', 'Kay Pay', '912458c2c96d07226a238efe8f787940', '2025-06-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (511, 12, 31904.61, 'paid', 'Wave', 'cbb9c8803afe63ec970f9ac3320dda3f', '2025-06-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (512, 9, 30365.02, 'paid', 'Kay Pay', '6bf4ebedc198da7c085b02bc07d64e7a', '2025-06-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (513, 12, 5787.11, 'paid', 'Orange Money', '4519557acd5c930d116357dac5fc16a5', '2025-06-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (514, 16, 40850.64, 'paid', 'Wave', '8471df30b46315a27356ad9aa36925fb', '2025-06-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (515, 9, 15463.57, 'paid', 'Orange Money', '9820349ae114d43fe0af0bc4a3267156', '2025-06-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (516, 11, 30776.74, 'paid', 'Orange Money', '5f1a2aa50fbdba92d09019a2f0d7c0fd', '2025-06-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (517, 16, 8623.20, 'paid', 'Orange Money', '91256bd7682736dce5b5080383ff3f0a', '2025-06-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (518, 15, 49065.77, 'paid', 'Orange Money', 'c5d6db2e20680dc4aee967f880a03560', '2025-06-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (519, 12, 16258.74, 'paid', 'Orange Money', '7017d32fa7e613cccbd7355949bcbbdf', '2025-06-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (520, 8, 33499.15, 'paid', 'Orange Money', 'a0b976cba951004b6fc0927c4bc7ed15', '2025-06-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (521, 15, 42113.70, 'paid', 'Yas Money', '6ac75f98a8805e792b72adde7c3c193e', '2025-06-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (522, 12, 41207.28, 'paid', 'Orange Money', 'f7fa10abaa321943e1d54de35230ef98', '2025-06-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (523, 9, 44114.42, 'paid', 'Orange Money', '178a872268925d2244bed44355cf818e', '2025-06-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (524, 8, 23252.86, 'paid', 'Wave', '6159c620ae8ff100e02e8674856bed8a', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (525, 7, 28900.03, 'paid', 'Carte Bancaire', '9cd96302ae06da1efa8ce3793f349941', '2025-06-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (526, 9, 48661.62, 'paid', 'Orange Money', '66a5d8ad5fe6d95f7f821a4c5b2dbe25', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (527, 15, 15418.33, 'paid', 'Kay Pay', '1df6ccfb243ffa4f3dc802f7815de398', '2025-06-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (528, 12, 39102.79, 'paid', 'Wave', 'd6afa23e0cf5c1817445f0e0c8faf98c', '2025-06-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (529, 11, 12696.21, 'paid', 'Kay Pay', 'bb524a04563ed62b37a80d6f09555c7b', '2025-06-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (530, 14, 39747.07, 'paid', 'Orange Money', '009a928453cb5d3433e883a90f496f58', '2025-06-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (531, 10, 18110.05, 'paid', 'Wave', '5e264958ed52f06354c7429b71867d11', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (532, 10, 17996.84, 'paid', 'Kay Pay', 'c5fbae542b2fd45c959204ede68afbe1', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (533, 7, 13425.68, 'paid', 'Wave', '1a08a2027450b64e47652c11609a8a49', '2025-06-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (534, 9, 51875.27, 'paid', 'Orange Money', '3d814efd3a693430b0a8e6504b7673eb', '2025-06-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (535, 7, 43949.36, 'paid', 'Yas Money', 'ea84f380bc9ee56c3bed270c7472fbec', '2025-06-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (536, 13, 28312.40, 'paid', 'Kay Pay', 'aee61c6e3afa9752185acf8938b887b2', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (537, 12, 47764.28, 'paid', 'Wave', 'bf54e31cec7509694541af65894b78a2', '2025-06-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (538, 9, 43988.71, 'paid', 'Orange Money', '74218fe7106c1fd481f57b338c9f2c10', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (539, 10, 41306.26, 'paid', 'Yas Money', 'db8a415b03d4d8ef199ea666eed84322', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (540, 13, 6018.82, 'paid', 'Wave', '6a5b31a3d3a3ea79911f2923d417c2f6', '2025-06-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (541, 14, 25284.01, 'paid', 'Wave', '57da397c22e39930f6c2b907f31e8540', '2025-06-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (542, 7, 15183.33, 'paid', 'Wave', 'aa1f62258e324ecedcd735dccb3c8304', '2025-06-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (543, 14, 13908.25, 'paid', 'Yas Money', 'bc55a14e8fce5c92d678c18d367cf019', '2025-06-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (544, 16, 45945.27, 'paid', 'Wave', 'b8b2eef1c858372902814a9b17af180e', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (545, 11, 37584.75, 'paid', 'Kay Pay', 'ac57c0a3f492757b9b733256d682cb45', '2025-06-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (546, 14, 51113.47, 'paid', 'Wave', '89291bdf2311d93cd26b0d7d9b891cdd', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (547, 16, 24650.52, 'paid', 'Orange Money', '9f46a7a4f333eb2005c9d16eed620338', '2025-06-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (548, 9, 14120.11, 'paid', 'Carte Bancaire', 'd8a26f58f3fb5a9f7455dd907d141854', '2025-06-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (549, 11, 50979.27, 'paid', 'Kay Pay', 'df79e9d02a4713aef5beef206c2e3a26', '2025-06-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (550, 12, 8480.82, 'paid', 'Yas Money', '41e0523d5ca1f7eddf14472181f4c27a', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (551, 13, 14997.31, 'paid', 'Orange Money', 'b930863c6b15bf9772535006622b807c', '2025-06-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (552, 14, 25761.55, 'paid', 'Carte Bancaire', 'bc2d616921d464788c12feb8dc7a2102', '2025-06-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (553, 11, 6035.91, 'paid', 'Kay Pay', '4a261bf1141aadb649115b4c008bc7f5', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (554, 9, 29865.62, 'paid', 'Orange Money', 'eaa87a39d3ff01ea70f6849d1a38137b', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (555, 8, 34565.57, 'paid', 'Carte Bancaire', 'c821bb7aa285dbb988cda15d7f859a7c', '2025-06-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (556, 10, 50549.38, 'paid', 'Carte Bancaire', 'b3f1c6ea080e09184ea0447a002da178', '2025-06-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (557, 14, 36207.41, 'paid', 'Orange Money', '08bc40e1829b665503e9eb581aebd47d', '2025-06-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (558, 14, 52969.38, 'paid', 'Yas Money', '250c8dfb2f5928eb7da2d4e625761596', '2025-06-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (559, 7, 48446.01, 'paid', 'Yas Money', '94908415dfbdf285a875abb08e0211cd', '2025-06-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (560, 9, 26405.83, 'paid', 'Wave', '049f179d3b760ce6571a1ba89d050d02', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (561, 15, 48217.70, 'paid', 'Carte Bancaire', '209d2334f4074a070f89e6a083ca229a', '2025-06-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (562, 13, 43333.47, 'paid', 'Orange Money', 'cf10bb26c9b2c4703562ba8b69e25220', '2025-06-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (563, 11, 21400.82, 'paid', 'Wave', 'ebc5eb44635f778d5076c4466149c500', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (564, 13, 40520.51, 'paid', 'Yas Money', 'd30bfcc21873cac44275084bbae3ce60', '2025-06-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (565, 9, 5792.92, 'paid', 'Kay Pay', '963a523ee122737ae94b0e56778d051c', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (566, 12, 32358.95, 'paid', 'Wave', 'd252adb568c2e638cbd83a8512c3e371', '2025-06-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (567, 8, 34951.80, 'paid', 'Carte Bancaire', '1d08c2ab6f9fa7c3f2c70a7dcf3838af', '2025-06-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (568, 13, 5068.89, 'paid', 'Carte Bancaire', '16f43e9c0e24fcf02e0d2304bc963565', '2025-06-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (569, 8, 53090.29, 'paid', 'Carte Bancaire', 'e261d380c75f7609109a56064f6e5fbe', '2025-06-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (570, 13, 30771.91, 'paid', 'Wave', '690775ccc770722f6cb3c4673c10b352', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (571, 7, 33639.27, 'paid', 'Kay Pay', 'af3785caa0d3bcaca63c2cc5d6c1810b', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (572, 9, 44608.06, 'paid', 'Wave', '1d2e1d2f438aaefd3562a074412375d8', '2025-06-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (573, 12, 20056.71, 'paid', 'Wave', '654f87b6af9d7b614d849619b45b8e5b', '2025-06-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (574, 16, 20182.68, 'paid', 'Kay Pay', '70a968834d0c339cb44f1215ee0ba848', '2025-06-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (575, 9, 29580.10, 'paid', 'Wave', '84fcd166b2488b93c5b85aa8cf2628b7', '2025-06-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (576, 13, 51648.27, 'paid', 'Orange Money', '107d01ea67080934be3c165ce2329713', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (577, 8, 19200.71, 'paid', 'Orange Money', '3ef58d0fbf516007d88090f6216c42e7', '2025-06-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (578, 8, 49182.44, 'paid', 'Orange Money', 'e7fe77c3da43d8be0a743cb6dc572a94', '2025-06-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (579, 15, 22604.27, 'paid', 'Kay Pay', '75969d89c5c7ce9979f9ce1149ba3a41', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (580, 11, 19365.86, 'paid', 'Wave', '77b469f457c651eda270da845556c5fa', '2025-06-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (581, 10, 9619.47, 'paid', 'Carte Bancaire', 'ebe681cbb2136bffad495d90afe2afbf', '2025-06-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (582, 10, 23742.13, 'paid', 'Yas Money', 'b59e13cd9b10e87b9952e961a7507049', '2025-06-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (583, 10, 50089.96, 'paid', 'Kay Pay', '57f2a817ef7885f8926b6c41bdf64527', '2025-06-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (584, 12, 19203.88, 'paid', 'Kay Pay', '666d65889bc52c8f2992b45a3755b6d1', '2025-06-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (585, 7, 8716.84, 'paid', 'Orange Money', 'ef15b96707a51cd1ec26422f73118bd3', '2025-06-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (586, 12, 7826.08, 'paid', 'Yas Money', '4833713396562588fff6eb023eeb771f', '2025-06-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (587, 14, 36067.27, 'paid', 'Carte Bancaire', '2540f2bed9f17e9221533cded379e31f', '2025-06-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (588, 9, 32280.67, 'paid', 'Wave', '35718af5f8821fde30568f6a6651278b', '2025-06-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (589, 9, 31850.90, 'paid', 'Wave', '9be7a556ee149ae614caa122e20f2721', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (590, 12, 16132.71, 'paid', 'Yas Money', '1d5978ee14180c703dac66f218c85bee', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (591, 13, 47274.73, 'paid', 'Kay Pay', '641bd7913030a4b9bb6025373b95e11b', '2025-06-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (592, 7, 25209.18, 'paid', 'Kay Pay', '3cea82c1b40483d407fa5f5266efb70a', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (593, 10, 30863.78, 'paid', 'Carte Bancaire', '3e01be8a1ca37b1c8e25436ec15356e9', '2025-06-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (594, 10, 45329.17, 'paid', 'Yas Money', '7d860384161983dea27385eb221621c5', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (595, 13, 33471.99, 'paid', 'Yas Money', '01a33133e5d7099aaf911f05304d5798', '2025-06-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (596, 10, 8193.74, 'paid', 'Yas Money', '03fa3034efe96790d655b3fb29f2579f', '2025-06-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (597, 10, 16615.86, 'paid', 'Carte Bancaire', '6d32c8170884bd9bf23159366a0f7827', '2025-06-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (598, 14, 9437.17, 'paid', 'Yas Money', '32907d5b09eb82ba0efa553c8076c561', '2025-06-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (599, 13, 32705.83, 'paid', 'Wave', '8cba899d4f497932e5746088ae2ca51d', '2025-06-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (600, 9, 10794.58, 'paid', 'Orange Money', 'e212a6b7ce85e0b1bd3fa2d77e16bd20', '2025-06-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (601, 13, 19119.71, 'paid', 'Yas Money', 'd679b1e9f88b6b6556dc43c03c06370b', '2025-06-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (602, 15, 44352.84, 'paid', 'Wave', '513727206670b1dfc652a02b4d16ee18', '2025-06-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (603, 8, 23500.50, 'paid', 'Kay Pay', '1639061018817d6d8bf1202488964532', '2025-07-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (604, 13, 26364.74, 'paid', 'Yas Money', '2ff568c3a87443250969c3b63f05733d', '2025-07-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (605, 13, 44019.35, 'paid', 'Yas Money', '92e083498480605705b8e5e1c788c822', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (606, 7, 10136.50, 'paid', 'Orange Money', '0f5c65c5b39ac86e95cb5e368537b122', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (607, 15, 20506.19, 'paid', 'Kay Pay', 'ddf4f488f67a80eb68b1c01008cee6c1', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (608, 13, 40420.41, 'paid', 'Wave', 'e7b0e56177890e794e71e630ad14b7cc', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (609, 16, 51719.25, 'paid', 'Kay Pay', '56ceddd64fdb95f443e551f177515332', '2025-07-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (610, 7, 42290.06, 'paid', 'Wave', 'd6cdc51ede98c7442d37b9bf61a9c879', '2025-07-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (611, 7, 32525.99, 'paid', 'Carte Bancaire', '629ee4f461313a78f5b51ddb8466d1d0', '2025-07-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (612, 10, 8972.39, 'paid', 'Orange Money', '0377770171ede6532e68b46463568e45', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (613, 9, 51940.37, 'paid', 'Wave', '26f07bbbe13b15ff4da101f4e560846a', '2025-07-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (614, 11, 34759.93, 'paid', 'Kay Pay', 'fd80b7db2f8cd642db05f9b5013543fd', '2025-07-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (615, 8, 32259.36, 'paid', 'Yas Money', '666c334ee35b67945d1a68d75ad2cb88', '2025-07-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (616, 15, 25899.73, 'paid', 'Kay Pay', 'ea048503f055f5bddf9a05222cc635fc', '2025-07-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (617, 13, 19859.97, 'paid', 'Yas Money', '345ef04b3f1291d22b8e31feb19491e2', '2025-07-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (618, 8, 30462.07, 'paid', 'Wave', 'e2b9f5a10050d478d5fb37dd9dda0cce', '2025-07-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (619, 14, 35511.30, 'paid', 'Kay Pay', '9c23542b5bb62302113f12cd82141a6b', '2025-07-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (620, 14, 51133.92, 'paid', 'Kay Pay', '7e154581e49ef3397e7a2aa266b93a13', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (621, 13, 22486.58, 'paid', 'Carte Bancaire', 'c89e2b27b17b814a544af43b8a91c2ff', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (622, 12, 38945.99, 'paid', 'Wave', 'bb7c0cc103229d113c29d96134f0e199', '2025-07-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (623, 11, 25680.77, 'paid', 'Wave', '94284d802e9367a590f6a311a19fadba', '2025-07-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (624, 16, 5662.25, 'paid', 'Orange Money', '7abee1def323236271b10630cb2750dd', '2025-07-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (625, 14, 36913.49, 'paid', 'Orange Money', '47519d6229c08a1f1344912de5e7f4df', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (626, 16, 45416.77, 'paid', 'Kay Pay', '152dd3e6d2bedc79b3468851c523a255', '2025-07-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (627, 12, 27282.86, 'paid', 'Carte Bancaire', 'f3f909d8bbf04e639f92ad706e261df8', '2025-07-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (628, 14, 8672.74, 'paid', 'Wave', 'b7b87d0056b7bbd4a61454f564bd515b', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (629, 14, 38764.55, 'paid', 'Wave', '6413345a1a10205223fb6f9a69faa7ec', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (630, 11, 9746.18, 'paid', 'Wave', 'fccd5e28cf5125045413a54e8a2cac9d', '2025-07-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (631, 15, 17965.71, 'paid', 'Yas Money', '99d7ac8ae841534560f7e580ed97fe6c', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (632, 10, 52562.93, 'paid', 'Carte Bancaire', 'cbea7e5b9841addfd3188d220a02d316', '2025-07-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (633, 13, 7299.67, 'paid', 'Wave', 'bb27faaa0fdd2ef4deedd22701ee9e23', '2025-07-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (634, 11, 53289.34, 'paid', 'Orange Money', 'a8614aa210a0b5a17d43a3405fcf8c46', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (635, 11, 23180.25, 'paid', 'Carte Bancaire', '6227a9c17d8a7a7b390dbf20c883c7a1', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (636, 13, 51486.00, 'paid', 'Orange Money', 'eeb14da6130762c3e93158ba52cf9e9e', '2025-07-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (637, 10, 33735.71, 'paid', 'Carte Bancaire', '6ae6d18ae05979df3140e6f5e6c5aee6', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (638, 16, 34465.05, 'paid', 'Orange Money', '4ef6c6a9a9b9dfd9e58452c6fb6fc36b', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (639, 11, 49015.53, 'paid', 'Yas Money', 'e873fd34515bd780613302281245797a', '2025-07-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (640, 13, 33959.84, 'paid', 'Orange Money', 'f8d0083cc802bab45b53f284eb5a937a', '2025-07-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (641, 7, 39314.16, 'paid', 'Wave', '74fc111427420d02bef24977198cd394', '2025-07-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (642, 16, 47894.11, 'paid', 'Wave', 'd6f373a9e44fcc0582ff635be9835878', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (643, 15, 7542.35, 'paid', 'Orange Money', 'dd16fa31273d8476ae3212241c2cda8b', '2025-07-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (644, 7, 10425.37, 'paid', 'Yas Money', 'cec8aa8e0b2cf48815d9548fb05056df', '2025-07-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (645, 13, 21589.29, 'paid', 'Orange Money', '12d3a259cc1167ab56414679056652f5', '2025-07-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (646, 11, 15160.16, 'paid', 'Orange Money', 'd7b40ba1a1da195f893d345cb17d1b1e', '2025-07-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (647, 12, 16251.80, 'paid', 'Kay Pay', 'ce5632672f1a134a63cbbc013bc60395', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (648, 15, 23677.06, 'paid', 'Wave', '261bb34b76c76bf411028ac34f08410b', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (649, 16, 35013.96, 'paid', 'Wave', '83f1e2a4539e38c38d885dd2f6982ba5', '2025-07-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (650, 7, 51898.18, 'paid', 'Wave', '65fc32676622a347545262da0b68e531', '2025-07-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (651, 8, 48550.98, 'paid', 'Yas Money', '97c82b3551cf2af796ff9882bd44cc61', '2025-07-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (652, 9, 7901.57, 'paid', 'Yas Money', '77e7fc3f3473e68c0f06f36cd4bde0c8', '2025-07-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (653, 7, 22162.73, 'paid', 'Carte Bancaire', '385a5e5bfdd2a8b227f73dcf50ccdc38', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (654, 16, 52416.44, 'paid', 'Kay Pay', 'deba614c59cef1e1b65618a9366aa8e3', '2025-07-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (655, 12, 27584.54, 'paid', 'Yas Money', 'fbbb4fa1d10f15ecccce8e973931bba5', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (656, 15, 46764.27, 'paid', 'Yas Money', '397f3645a75fe5b6196365219bbfbd71', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (657, 10, 50980.13, 'paid', 'Kay Pay', 'dd08ca30d333754e0bcd6fa0661ecd99', '2025-07-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (658, 11, 29206.83, 'paid', 'Yas Money', 'cf20b75a60a50af9c8f1ae0fcae85566', '2025-07-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (659, 14, 28500.95, 'paid', 'Yas Money', '184a457ca3f7eed615c868e77b7b4898', '2025-07-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (660, 15, 14038.85, 'paid', 'Orange Money', 'b0e6f71062b705b63c4316249a4c6173', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (661, 14, 39666.52, 'paid', 'Orange Money', '7db61c673190cb5ed8db4027d8a4677d', '2025-07-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (662, 9, 9436.55, 'paid', 'Yas Money', 'c8288e9c9b4717931d8d16bb1477e83a', '2025-07-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (663, 16, 22038.02, 'paid', 'Carte Bancaire', '9140660dbca1f5bc2e4d17131236d663', '2025-07-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (664, 10, 13581.85, 'paid', 'Yas Money', 'de21e56124c2e19f51d535cca93fd1df', '2025-07-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (665, 14, 12848.00, 'paid', 'Carte Bancaire', 'f843c168a606586ff83d16c166403f22', '2025-07-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (666, 16, 24952.21, 'paid', 'Kay Pay', '5019b8091bffe929b9d7801d4314f28c', '2025-07-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (667, 16, 44138.18, 'paid', 'Yas Money', '1cc5fa624d626c9ab7ad25328f795f63', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (668, 10, 37760.89, 'paid', 'Orange Money', 'ddb9db57499fcda6c7d6b91450b2a950', '2025-07-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (669, 10, 26742.26, 'paid', 'Orange Money', '74f8e4cea25ac3c1ff0b86029b758e3f', '2025-07-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (670, 15, 13896.56, 'paid', 'Kay Pay', '2f8726c52bcff0a8f778a905c9e4259d', '2025-07-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (671, 12, 21667.50, 'paid', 'Orange Money', 'c341ddb4d9eabc0355a37695038f6379', '2025-07-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (672, 14, 9003.63, 'paid', 'Yas Money', '3f395acd25b9f655893ee394e6dde9b2', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (673, 15, 24188.38, 'paid', 'Kay Pay', '49d5609b93c239be94146c484f429ed6', '2025-07-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (674, 13, 26372.37, 'paid', 'Wave', 'e4919fcfe68329becdc86fda15a5fad0', '2025-07-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (675, 8, 45888.47, 'paid', 'Wave', 'd87368ca1c820dbbf8a3c59f4f95204a', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (676, 14, 27646.50, 'paid', 'Yas Money', '86119338dc1a1d5554cd82352e1ee774', '2025-07-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (677, 15, 38337.92, 'paid', 'Orange Money', '4b550e1f4a448ee0d31f67c3cf40dd17', '2025-07-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (678, 7, 21538.03, 'paid', 'Orange Money', 'a09aa50445c408a1f94edd2f1f1b9a5f', '2025-07-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (679, 8, 17293.39, 'paid', 'Orange Money', '92e2804d328130ecb2975d5432a09588', '2025-07-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (680, 15, 24778.73, 'paid', 'Carte Bancaire', 'a6220c745074b17eebb4fc134ddf1714', '2025-07-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (681, 11, 9581.22, 'paid', 'Yas Money', '52c8021c64e0f3baed80da3a1f389074', '2025-07-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (682, 11, 43209.41, 'paid', 'Yas Money', '5a1b7170b8a53d96e528bfc9296de832', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (683, 10, 23042.53, 'paid', 'Kay Pay', '12a3a5d3b5d1a13d9c36e112ae6d6d2c', '2025-07-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (684, 12, 10740.81, 'paid', 'Wave', '18e1fab795a185f6177c034fd11a796d', '2025-07-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (685, 13, 7752.79, 'paid', 'Carte Bancaire', 'b0910cd9a1d77e8fba96426b878ddc00', '2025-07-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (686, 7, 20371.91, 'paid', 'Carte Bancaire', 'f7275ee1dbdb98bc47371fda72277d1f', '2025-07-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (687, 13, 54061.07, 'paid', 'Orange Money', 'e7342d5df90ba34af2d98ac9a91db507', '2025-07-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (688, 15, 54817.65, 'paid', 'Yas Money', '79ad9b25ce7f4bd9882ed686af59e6f1', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (689, 14, 23176.25, 'paid', 'Kay Pay', '02f040e9e594af808795b265b1d64286', '2025-07-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (690, 9, 33716.71, 'paid', 'Kay Pay', '541b42f612d661347fe43fec68f3338a', '2025-07-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (691, 14, 5133.75, 'paid', 'Yas Money', 'a81e99f055bfe7d4ecbe2fd38d6f585e', '2025-07-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (692, 15, 48933.05, 'paid', 'Carte Bancaire', 'b4b569b5554e49e54a054e292e2034b2', '2025-07-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (693, 7, 12173.81, 'paid', 'Carte Bancaire', 'c230b181eaff582b990ff1736035318b', '2025-07-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (694, 15, 5341.11, 'paid', 'Kay Pay', '143fbbc94ccc69fcad1b310667faa3c8', '2025-07-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (695, 13, 29275.13, 'paid', 'Carte Bancaire', '2f7a798ee1884abe3dd7ba371782f825', '2025-07-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (696, 12, 19972.03, 'paid', 'Kay Pay', '6c70effab53ea6a9050c9a2f16c2a988', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (697, 9, 13682.63, 'paid', 'Kay Pay', 'c095994012ab950dd46bc1114df12fa5', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (698, 11, 43093.01, 'paid', 'Orange Money', 'd91c6abe4f88bfcc9a5d956a70e84051', '2025-07-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (699, 16, 50589.76, 'paid', 'Yas Money', '27a1fcc5de57a900ec30ec1de336fecd', '2025-07-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (700, 8, 27434.58, 'paid', 'Carte Bancaire', 'a1530e7c00668e7feaa36edd55fdb03a', '2025-07-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (701, 16, 14694.05, 'paid', 'Kay Pay', '9a8c0ee8f3b8f7dabe116c22ef340758', '2025-07-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (702, 11, 33701.87, 'paid', 'Orange Money', '4ff4ca5ca2d20d56a40051d2fc44d203', '2025-07-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (703, 8, 37597.77, 'paid', 'Orange Money', '192c1b19a9b07d6cd84597eb05448592', '2025-08-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (704, 11, 30823.95, 'paid', 'Orange Money', '9f7316e15bd723d7948d81b615fc78e5', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (705, 13, 14751.25, 'paid', 'Yas Money', 'bc6deea2bca7ea7f743204de94a92ed6', '2025-08-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (706, 13, 30484.79, 'paid', 'Carte Bancaire', 'cccbac3a6151e2c1640d2058be5b0ef8', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (707, 10, 11944.69, 'paid', 'Orange Money', '3e4d37389d7c37bbf35bfe72cbf9eb77', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (708, 10, 12845.56, 'paid', 'Wave', 'b256b2c9270ccf0a5075dc65f826fb42', '2025-08-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (709, 14, 7605.09, 'paid', 'Kay Pay', '9ae4f49321e793fc87e786b7c88ed615', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (710, 11, 39198.69, 'paid', 'Wave', '99ccce06e82ff757578bb97c282aecb7', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (711, 13, 8498.06, 'paid', 'Kay Pay', '0bcd90c1b1ef4902a780b7c4d4ee4bad', '2025-08-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (712, 12, 50904.45, 'paid', 'Carte Bancaire', '99d02db66f00221b2c1e0411242fc303', '2025-08-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (713, 7, 40741.90, 'paid', 'Orange Money', 'bf52c6989f41d0052dbcae546920a4ad', '2025-08-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (714, 15, 46889.69, 'paid', 'Wave', '318a6e3ce14962e51eda7aff48e16032', '2025-08-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (715, 9, 18344.38, 'paid', 'Wave', '5a86753088c90dfbb25ebb189eac8999', '2025-08-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (716, 10, 52369.91, 'paid', 'Kay Pay', 'a49cf2b8efbfa708aff8c440b2bc8e03', '2025-08-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (717, 12, 35481.16, 'paid', 'Yas Money', '4d63b11ddef0bc53a5b8c8e3cce02855', '2025-08-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (718, 10, 5241.51, 'paid', 'Carte Bancaire', '40e52214e769795f26b6dd65bbbfc4f3', '2025-08-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (719, 14, 13618.90, 'paid', 'Wave', 'd14da9789dd13a5d8c8454c84e9ddd21', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (720, 15, 18611.72, 'paid', 'Carte Bancaire', '3c1dd7cddf5ceb3f1244984580e77de4', '2025-08-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (721, 16, 34967.11, 'paid', 'Orange Money', 'a3e18fdc5b348cdd49dd173a7e72ce93', '2025-08-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (722, 9, 19340.10, 'paid', 'Kay Pay', 'c39f2989d4c1d9d4fcca4c3a9d2be8ad', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (723, 16, 19166.63, 'paid', 'Wave', '16d45c5b872f1d79693ed18f3167d3f3', '2025-08-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (724, 13, 36080.54, 'paid', 'Kay Pay', 'a20a678d86b76fc2851b9760c66ba0bd', '2025-08-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (725, 12, 34986.63, 'paid', 'Carte Bancaire', 'e8247b1b64ff5897455f045151ef8f82', '2025-08-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (726, 12, 53499.47, 'paid', 'Orange Money', '7a8c55c83313fcff0abad628c6336118', '2025-08-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (727, 10, 43201.76, 'paid', 'Kay Pay', 'ca5053c2aa8592279df03f0756ddf217', '2025-08-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (728, 8, 28024.77, 'paid', 'Kay Pay', '3e9bc8744a3efc07659c4d3a99620285', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (729, 10, 7077.75, 'paid', 'Wave', '1f4a7e7c7959847fd2c0e9211ded1676', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (730, 12, 17990.10, 'paid', 'Kay Pay', 'e1046bb15cf0e5349f406a8401ddcfd9', '2025-08-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (731, 13, 32751.70, 'paid', 'Kay Pay', '139c1e912eb703c06b6c193bcb76a4e7', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (732, 10, 32595.56, 'paid', 'Kay Pay', '3618176732e2539c8742dad9697d5a7d', '2025-08-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (733, 7, 14221.87, 'paid', 'Yas Money', 'a1306de50a314871c5d9c552ac5327f2', '2025-08-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (734, 15, 11226.30, 'paid', 'Wave', 'eba7dfde2418d32bf7035af165ebaa24', '2025-08-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (735, 15, 46989.75, 'paid', 'Yas Money', '8395f18b0567dc9004a48ec71d6a81f0', '2025-08-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (736, 15, 22953.67, 'paid', 'Yas Money', 'ae88b87171677aaf7e28e6534ba4f15c', '2025-08-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (737, 9, 35637.18, 'paid', 'Yas Money', '934ceab680008db3f579732f4705ce38', '2025-08-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (738, 16, 8697.39, 'paid', 'Carte Bancaire', 'e8b51c36ed967376ef776630b833957a', '2025-08-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (739, 8, 52041.07, 'paid', 'Orange Money', 'b255079099c56c6a5b437534e42e5033', '2025-08-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (740, 7, 53062.31, 'paid', 'Yas Money', '318d8af98643cde4c2fc770cfb59d412', '2025-08-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (741, 8, 16302.41, 'paid', 'Orange Money', 'f49ba0c84975d8cf2a72a834e95f1a6d', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (742, 15, 41500.26, 'paid', 'Carte Bancaire', '541cb75255fb8244b7872624a197e40b', '2025-08-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (743, 15, 33598.13, 'paid', 'Carte Bancaire', '423c3135c61840513be30c2cb8e46f5d', '2025-08-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (744, 13, 13649.27, 'paid', 'Orange Money', 'e3071b9c629b3ddca321286ae50238b0', '2025-08-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (745, 10, 50959.37, 'paid', 'Yas Money', '615520a1868f1b1ded68008724b0aac9', '2025-08-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (746, 12, 20710.81, 'paid', 'Wave', 'beeb66ffa0fb3fe538d30fc1ef9e5053', '2025-08-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (747, 13, 19957.94, 'paid', 'Yas Money', '8c58a2c0b4c6324ffa80e818645732d1', '2025-08-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (748, 16, 49192.21, 'paid', 'Orange Money', '777c9eb9d81428b9a9b223c238235a0f', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (749, 8, 47157.32, 'paid', 'Kay Pay', '88eb82319e3c51783fae00e61bce571a', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (750, 10, 31339.40, 'paid', 'Yas Money', '671ef7dbb2a7765e3a34e0a309edddde', '2025-08-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (751, 9, 47404.28, 'paid', 'Kay Pay', 'db58489ed5ef39eb3d30df5a9fdbe279', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (752, 9, 50200.48, 'paid', 'Wave', 'ebfbc12f9e941a55527a371ef01527be', '2025-08-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (753, 10, 25335.29, 'paid', 'Kay Pay', 'b8f1500b2c87a310fbc81e48984f8a04', '2025-08-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (754, 7, 18809.93, 'paid', 'Kay Pay', 'da2a9aa6e96d1fa51c1a6609e5d7bd1e', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (755, 8, 5983.99, 'paid', 'Orange Money', 'd50031d2538610d801c9671f9d9e5796', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (756, 14, 48582.54, 'paid', 'Kay Pay', 'ebe666682dad09d3e85ed361fa272769', '2025-08-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (757, 10, 29717.06, 'paid', 'Yas Money', '6aa3697f3595834a393428b4b980cd83', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (758, 14, 44464.66, 'paid', 'Yas Money', 'a8b5a8acf5678e0a71cd1aa0f0d871d5', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (759, 7, 49909.72, 'paid', 'Carte Bancaire', '533aee61debfa4960eed641ff13d9021', '2025-08-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (760, 12, 21800.65, 'paid', 'Orange Money', '0e34398cedd0d860501d782386c21b66', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (761, 12, 10768.73, 'paid', 'Orange Money', '85a075e7ffb6d217a1c360d84fb38835', '2025-08-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (762, 15, 41511.36, 'paid', 'Yas Money', '225b25ed2fadf2600e55e4afa4a01a6a', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (763, 15, 16998.80, 'paid', 'Kay Pay', '3fa99172196077debbd40631bcdf0b53', '2025-08-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (764, 9, 32540.77, 'paid', 'Yas Money', '1d0ba97c5de3e41594bdf34f30b886f8', '2025-08-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (765, 7, 15072.51, 'paid', 'Orange Money', '73abb0f12512e71a919e4d3dc09478aa', '2025-08-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (766, 9, 45392.53, 'paid', 'Yas Money', 'e9e747d28f55e20a5d6cfb3d9166acac', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (767, 14, 30091.03, 'paid', 'Yas Money', '0e84c2203b3d182e2700153b56bc2239', '2025-08-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (768, 13, 15337.61, 'paid', 'Yas Money', '8e50ec82fe1618ffe845ce39d5ebcba1', '2025-08-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (769, 15, 44410.31, 'paid', 'Carte Bancaire', 'aace0bb34c3ca2e19e1562537342d652', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (770, 8, 26794.08, 'paid', 'Yas Money', 'e41a9e15aa7e14a33b9a883a84aec478', '2025-08-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (771, 9, 5349.15, 'paid', 'Wave', '1606aa049de2bc56c0fd4f333b4073cd', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (772, 16, 32173.17, 'paid', 'Kay Pay', 'c9bb33471b5c106a6fc41d6db4ea8f48', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (773, 15, 39291.78, 'paid', 'Carte Bancaire', '9ca9fd3f07259b73b15ce48cfafc52e9', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (774, 15, 10894.60, 'paid', 'Yas Money', 'a821ee08a36e26f44717786472b2a5a7', '2025-08-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (775, 15, 53595.56, 'paid', 'Kay Pay', '9c6980cb9c049223c931987fb81c21b0', '2025-08-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (776, 7, 24733.65, 'paid', 'Wave', '36b8f17f8c5a56fa5d7559e5c6dbc4c1', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (777, 14, 7952.08, 'paid', 'Yas Money', 'bf93c7a5399c45e2f6ce378f2100dc22', '2025-08-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (778, 11, 36218.65, 'paid', 'Wave', 'a42d6a4d43d56debc169a6a7f90c829e', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (779, 11, 16297.14, 'paid', 'Kay Pay', '0763578975249a1de82170d00a8da621', '2025-08-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (780, 16, 45770.69, 'paid', 'Orange Money', 'a92b2e30e24982ef37c9e3d0500104ee', '2025-08-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (781, 12, 49544.78, 'paid', 'Orange Money', '754bc3bcd922881ba69234c9727d41e2', '2025-08-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (782, 15, 7986.81, 'paid', 'Orange Money', 'b4ec9e8fe313177390174a6cfc00d9e8', '2025-08-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (783, 7, 35892.16, 'paid', 'Orange Money', '89bd6e4eaf8373fcea77a450bef42ee6', '2025-08-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (784, 12, 20268.24, 'paid', 'Carte Bancaire', '9f701ee7aaf3529d52691b2ae227200a', '2025-08-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (785, 9, 28208.61, 'paid', 'Yas Money', '454e8748e8d9af0b3a12720eb9957eab', '2025-08-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (786, 10, 18302.22, 'paid', 'Yas Money', 'b3de34a89c98bc6975e00331642f9753', '2025-08-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (787, 15, 15184.50, 'paid', 'Yas Money', 'bb39bcc9e5d4e97cc2df0d585de830ed', '2025-08-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (788, 8, 38222.76, 'paid', 'Wave', 'e9d7055c14372f3c807a14193a4acf2e', '2025-08-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (789, 13, 34264.61, 'paid', 'Wave', '94b08c7d406bca7d089752fc0897b40c', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (790, 13, 53194.23, 'paid', 'Kay Pay', '0df00f49b5702b9130683958af1810df', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (791, 15, 27400.41, 'paid', 'Wave', 'b1195e3d20fac1c5eeafdac59456996e', '2025-08-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (792, 7, 33622.93, 'paid', 'Wave', '1c096231d594f1c41f838059391a8bad', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (793, 16, 49467.31, 'paid', 'Wave', '650ae1d9b114e36102595bf683c66b0e', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (794, 12, 5201.79, 'paid', 'Carte Bancaire', '6b871cb3bd14ca3b546c61b2e46eceae', '2025-08-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (795, 16, 18916.29, 'paid', 'Wave', '0a3d9700784d826ff7cb3eb3626de2d8', '2025-08-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (796, 16, 52349.03, 'paid', 'Yas Money', 'd79fcf4dcd27ada31127654b3578c861', '2025-08-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (797, 7, 10234.73, 'paid', 'Kay Pay', 'ad188ef92e60825054427bfeeb6465c8', '2025-08-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (798, 10, 15311.19, 'paid', 'Orange Money', '899af80717776ef020caa27b65d02b76', '2025-08-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (799, 9, 54425.48, 'paid', 'Yas Money', 'd107c5726a7bda361a79f07352edd481', '2025-08-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (800, 12, 28963.76, 'paid', 'Orange Money', 'd97a211cb002a4d794e99ddb1929fb44', '2025-08-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (801, 8, 9332.08, 'paid', 'Yas Money', '1de63ee12f414f2d82105219130c809e', '2025-08-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (802, 11, 15356.38, 'paid', 'Yas Money', '16db02969de439fa43cbf0f1228d40ff', '2025-08-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (803, 11, 8797.08, 'paid', 'Yas Money', '8f84856ec643fa17481ae662d8aa84a3', '2025-09-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (804, 10, 19073.06, 'paid', 'Yas Money', 'a2b7b92d763250c90f75338a2e3ae6eb', '2025-09-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (805, 13, 42083.21, 'paid', 'Kay Pay', 'f192a4b55d2483cf0ac7ed65efc73b2e', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (806, 14, 37983.44, 'paid', 'Carte Bancaire', '1811ab9b4d8818f60da3756c6e7ae91b', '2025-09-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (807, 10, 7937.53, 'paid', 'Yas Money', '4e56014f6483ed284b5c6f6d8eff915a', '2025-09-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (808, 8, 45387.51, 'paid', 'Kay Pay', 'd5fc8373bd4e07dbffa8cb0cd962446d', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (809, 9, 20619.95, 'paid', 'Wave', 'd12284b5183f0fd62471058f9f12aac9', '2025-09-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (810, 11, 24262.92, 'paid', 'Orange Money', 'dd00504e00151ff6a963d7bba659982f', '2025-09-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (811, 12, 9616.52, 'paid', 'Carte Bancaire', 'e9d21c9a3867d71328f4f22887541e07', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (812, 7, 31245.75, 'paid', 'Yas Money', '3f25c4ca25a6eb3896373284bb871fbd', '2025-09-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (813, 16, 42694.73, 'paid', 'Yas Money', '6c4045a7b9400647d4ae0ff8fc26fa67', '2025-09-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (814, 7, 7909.79, 'paid', 'Yas Money', 'bd4006913318dfac5d322364e45cd515', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (815, 15, 31938.46, 'paid', 'Orange Money', '927c1c5c3f747d942dbd311531db0afe', '2025-09-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (816, 14, 38040.28, 'paid', 'Yas Money', '50826add688c45def647634178a326d4', '2025-09-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (817, 7, 34252.31, 'paid', 'Orange Money', '3a1aed265ccd4e041276e5b93f4d1bf9', '2025-09-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (818, 10, 51076.27, 'paid', 'Carte Bancaire', 'f5cadaf1ecb77e4440b3ed374f0e6fd5', '2025-09-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (819, 10, 45042.00, 'paid', 'Orange Money', '57d3f7254db1c051c8da2b3de9b6e8f3', '2025-09-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (820, 13, 9013.15, 'paid', 'Carte Bancaire', '705961771d7290595ef4aae83e4c59bd', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (821, 15, 20358.69, 'paid', 'Carte Bancaire', '13749da9aa174af930cfa0408cf4fb4d', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (822, 12, 35899.53, 'paid', 'Yas Money', '478ad7e9a18a595562fac220c44c6e73', '2025-09-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (823, 8, 15708.94, 'paid', 'Yas Money', '1af4c777a26d6a5a8c7884eb73553908', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (824, 10, 41869.34, 'paid', 'Carte Bancaire', '297642d83df4f46015ee7693e1d487b7', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (825, 8, 22967.30, 'paid', 'Yas Money', '8c8abd890097945f929e43b1b7c8b9ed', '2025-09-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (826, 16, 15195.11, 'paid', 'Kay Pay', '52935bb8c849305ee06101571baf1f59', '2025-09-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (827, 10, 54330.39, 'paid', 'Wave', '5045562bccf38d4274a8967eddedc786', '2025-09-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (828, 8, 8674.53, 'paid', 'Yas Money', '11037384b83005ee68d8ace730ac2af4', '2025-09-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (829, 8, 19017.36, 'paid', 'Yas Money', '72961a7e4968f1e194916fa6483d8c51', '2025-09-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (830, 7, 33496.91, 'paid', 'Carte Bancaire', '2c01f6166df8cfcf41b9701f310e9574', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (831, 15, 9241.25, 'paid', 'Yas Money', 'dd9d62a4818c8ad8922a2ef509bdc706', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (832, 15, 27319.51, 'paid', 'Carte Bancaire', '1412e26428cc75149e36e281d0c47669', '2025-09-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (833, 12, 20692.06, 'paid', 'Kay Pay', 'c4b0eab4f1ce959b08a65937b0ac6dc0', '2025-09-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (834, 14, 11054.61, 'paid', 'Orange Money', '4f921d3f8b0f5488966e5096f2e2770e', '2025-09-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (835, 16, 45096.09, 'paid', 'Kay Pay', 'a1a725fa11dd7560cc0d1c82a3bce3ad', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (836, 11, 17153.84, 'paid', 'Yas Money', 'd809284191226e2dfcb7044e7d624408', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (837, 13, 46319.79, 'paid', 'Yas Money', '7fb69119357e06d17e7cafd73be50c1f', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (838, 7, 45906.81, 'paid', 'Yas Money', '9282005703b9b950b941fafa9559f2f1', '2025-09-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (839, 12, 51837.27, 'paid', 'Kay Pay', 'a1ae77424b1d20809cbcf0446d472d48', '2025-09-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (840, 15, 38783.49, 'paid', 'Yas Money', '4ea1ce65d7dbe5e5eb194629d0b3e007', '2025-09-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (841, 10, 28512.51, 'paid', 'Kay Pay', 'a4b9d7886f4d23dff3539f70fd439001', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (842, 14, 9794.81, 'paid', 'Yas Money', 'a3a27645a89a5222b5a0a3ec2aa1445e', '2025-09-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (843, 11, 14010.19, 'paid', 'Carte Bancaire', '69a2bc54c709a1fcd08a3ffc6e127c32', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (844, 12, 50181.28, 'paid', 'Wave', '9e28c766bfd4c207e7b7c1db31c0e31f', '2025-09-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (845, 15, 49515.18, 'paid', 'Yas Money', 'ccfa1e1894a1178cac8b03fc84cc0175', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (846, 9, 32315.90, 'paid', 'Yas Money', '1a1ac09a6a6eeaf77dbdf75d5a022eb2', '2025-09-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (847, 12, 41713.26, 'paid', 'Wave', 'da87592c9ae9f037c31d8a8add5d0185', '2025-09-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (848, 12, 23799.46, 'paid', 'Carte Bancaire', '0b1458dbdbc0febbf349efbfc5349c73', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (849, 10, 26078.62, 'paid', 'Orange Money', '70b027b1fcc9b94c3095f0f7d2c2a7b3', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (850, 15, 45482.12, 'paid', 'Kay Pay', 'e54f54fb524ea072c5fac2e4fa3401fc', '2025-09-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (851, 13, 11050.45, 'paid', 'Kay Pay', '7f5c9732778e3bb077c728499509092d', '2025-09-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (852, 11, 43670.20, 'paid', 'Carte Bancaire', '014dee55f206b86bc1af433fe8fdbbe4', '2025-09-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (853, 15, 37377.66, 'paid', 'Carte Bancaire', '9d46ec71749896f633cfd37f31789c28', '2025-09-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (854, 16, 18909.09, 'paid', 'Orange Money', 'e7438701173d74aeff6c2cf4cdca2b8a', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (855, 12, 29997.57, 'paid', 'Carte Bancaire', '8405d335c74839dea100afe3a4424827', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (856, 7, 35218.87, 'paid', 'Yas Money', '281344a39e82307b5278156b8634b55f', '2025-09-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (857, 14, 51045.89, 'paid', 'Orange Money', '4e63f3806fc0e15c7b4104c26d9c6737', '2025-09-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (858, 14, 5156.69, 'paid', 'Orange Money', '877ff6096c33d390626821acaa69e6eb', '2025-09-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (859, 7, 5517.17, 'paid', 'Kay Pay', '83c248283bed96016e155597edacb952', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (860, 10, 15749.66, 'paid', 'Carte Bancaire', '9d97524415d041006cb3336619ea206d', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (861, 15, 39933.14, 'paid', 'Carte Bancaire', '1b920cf90878895643b62f7fe6284973', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (862, 14, 5528.66, 'paid', 'Wave', 'e262e817e07e6443c226cf53c5be976e', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (863, 8, 8518.81, 'paid', 'Carte Bancaire', '80706acccff89717d8887f6b966dce3d', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (864, 8, 47330.04, 'paid', 'Wave', '70b1aec7fee3281206a672f68c71d16e', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (865, 13, 19759.98, 'paid', 'Carte Bancaire', '7345bb3f261f5bd0daa988df1934385f', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (866, 12, 31297.11, 'paid', 'Yas Money', '6f542bb7951caaf0fa0f2432583675b5', '2025-09-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (867, 8, 8784.80, 'paid', 'Orange Money', 'e6694fa47dad64d72a78f316548e7ed9', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (868, 7, 24916.59, 'paid', 'Carte Bancaire', 'e02d77d937e0f100d449c58113410d60', '2025-09-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (869, 10, 15874.31, 'paid', 'Yas Money', '59838b562932ab383a6a5da2d62a9b2c', '2025-09-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (870, 14, 7957.28, 'paid', 'Kay Pay', '13eb7aff2019607373f2547487de3e32', '2025-09-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (871, 8, 40030.25, 'paid', 'Wave', '1f5c95847c4918fc5f1f90b26a9dbb76', '2025-09-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (872, 16, 16746.35, 'paid', 'Wave', 'b03353e5f4b6e4409cd628c41212170a', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (873, 13, 26144.27, 'paid', 'Yas Money', '70723ab5bc88df8cd7420a077c294247', '2025-09-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (874, 8, 26487.58, 'paid', 'Orange Money', '62eb863dc728108ee5e1ab17af3fdf7f', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (875, 9, 20166.72, 'paid', 'Wave', 'fed3a954ed5df01e005797e54f19efe9', '2025-09-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (876, 14, 13325.79, 'paid', 'Wave', 'eb4ab6dc2cdabc250f50424712114ebc', '2025-09-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (877, 14, 11626.25, 'paid', 'Carte Bancaire', 'f61eb6f0e288ff5688c7152fa5245b8d', '2025-09-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (878, 15, 30652.63, 'paid', 'Orange Money', '93d5b0872ba3cd43cf764896cba2a9de', '2025-09-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (879, 11, 29697.05, 'paid', 'Orange Money', 'b51e83034d82a1e2dd08b84c2d3d5a28', '2025-09-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (880, 8, 26514.76, 'paid', 'Wave', 'f907b63c5cdf303b8f88e5b5c705880c', '2025-09-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (881, 11, 45635.79, 'paid', 'Carte Bancaire', 'ae4359438c2a6f4fb2cc2a2be178dde2', '2025-09-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (882, 12, 28069.44, 'paid', 'Orange Money', 'd65487ab223205e176874ab0516dd14e', '2025-09-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (883, 10, 51932.25, 'paid', 'Yas Money', '1b19aa74549171562ba955bb17949298', '2025-09-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (884, 7, 51142.86, 'paid', 'Wave', 'b92a7f1afea518675bc5c90ad3b7f2d1', '2025-09-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (885, 16, 25429.29, 'paid', 'Kay Pay', '9e0ff8d6ab693a5ae8d2c97e4a02c832', '2025-09-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (886, 16, 33983.56, 'paid', 'Kay Pay', '33b08bfc1eba4d902eed06035547e4e3', '2025-09-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (887, 16, 23486.11, 'paid', 'Orange Money', '21cb178c48bf3aac8a6b337127bbf39a', '2025-09-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (888, 7, 15140.09, 'paid', 'Orange Money', 'a069d31510825a5413baed97dd172bc3', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (889, 11, 20085.03, 'paid', 'Yas Money', '9ccfdcf7e4aa0dcf1dfa775c4f29ada0', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (890, 15, 33853.20, 'paid', 'Carte Bancaire', 'fb78ab1a1406fdb4dcc22832d292e71c', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (891, 14, 46024.45, 'paid', 'Kay Pay', 'a98b18feec97032bf8240482d7935faa', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (892, 14, 50439.15, 'paid', 'Yas Money', '123f4aa0cdcf5b3f452d38d52eff2b28', '2025-09-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (893, 10, 21282.45, 'paid', 'Carte Bancaire', '6dd20aef5fb940ae30280ca1454e2ab6', '2025-09-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (894, 16, 35372.92, 'paid', 'Wave', '256c025bb6feebfc39b8dd6aa1a39fa4', '2025-09-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (895, 12, 19185.57, 'paid', 'Carte Bancaire', '8ba000bc0f252671a4c174368519104c', '2025-09-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (896, 11, 13452.00, 'paid', 'Wave', 'cd4b6f58593ef4fa616f3901c49b9c5c', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (897, 14, 23556.32, 'paid', 'Yas Money', '08715db806cd55f2a8820a958c630c3f', '2025-09-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (898, 12, 17537.50, 'paid', 'Orange Money', '3f1619c46eff2e0e32458075b887aad7', '2025-09-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (899, 11, 47158.54, 'paid', 'Carte Bancaire', '8bbefe2615083dc25639ae464c704a3a', '2025-09-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (900, 13, 33921.06, 'paid', 'Kay Pay', 'fc22d0ec20d04064cec4b61f70641a91', '2025-09-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (901, 15, 31250.95, 'paid', 'Carte Bancaire', '19a541afffb3de40fa134488f904aad0', '2025-09-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (902, 11, 38198.67, 'paid', 'Kay Pay', 'd6af0b8fb844b368abd61dd9a69ce6a6', '2025-09-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (903, 9, 21446.02, 'paid', 'Kay Pay', 'cdf93cb8d0a453327248d21945dc39e3', '2025-10-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (904, 8, 6860.95, 'paid', 'Orange Money', '61a4c24abac92b816d7db08b95c26bed', '2025-10-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (905, 13, 41107.82, 'paid', 'Carte Bancaire', 'a6fe14ab12046006cbf4658a4404783f', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (906, 15, 44795.06, 'paid', 'Carte Bancaire', 'ca04eefdb02f38fae9b9fadac0138697', '2025-10-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (907, 7, 29785.42, 'paid', 'Carte Bancaire', '02ec0268beb6e6a7f8cb987da37921d7', '2025-10-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (908, 7, 35720.23, 'paid', 'Orange Money', '771e335ca118cef9d17117ae3d4e7f90', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (909, 16, 23414.91, 'paid', 'Wave', '7b0bba0e1aaabd564138f194f6d1ac15', '2025-10-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (910, 7, 7081.02, 'paid', 'Yas Money', '8377663268968bb3d4cdf959634959bc', '2025-10-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (911, 16, 40604.62, 'paid', 'Orange Money', '4dde66c61e52455f354c7e54b078f4a1', '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (912, 15, 23216.17, 'paid', 'Yas Money', '342ab6df4bd042f7f7c84cf43ae3f026', '2025-10-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (913, 8, 9077.92, 'paid', 'Yas Money', '3701e967585c1e90415134b26515f7c9', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (914, 10, 33369.18, 'paid', 'Orange Money', '6ca7c89241784b84c37a6b31438794e4', '2025-10-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (915, 7, 51353.78, 'paid', 'Carte Bancaire', 'ac35f127b1899246704ed9fb1dfb07da', '2025-10-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (916, 11, 39066.90, 'paid', 'Carte Bancaire', 'c1b48ef6a7b97907469f16eb2d30c858', '2025-10-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (917, 9, 44070.28, 'paid', 'Wave', '2d0bdf62de7553dd88930854a100d832', '2025-10-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (918, 10, 32995.37, 'paid', 'Wave', '78c0e35db657f684439f71cbda7664ca', '2025-10-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (919, 15, 13940.75, 'paid', 'Orange Money', 'cf4b705404a832983857e859235f0828', '2025-10-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (920, 14, 29306.65, 'paid', 'Wave', 'e617f47622d8ae2dba737d4fed445d28', '2025-10-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (921, 9, 39742.22, 'paid', 'Carte Bancaire', '8a61faad8921191cc319e49f6e33ef2f', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (922, 10, 19713.04, 'paid', 'Kay Pay', '63779eb1a1f3b82eb778d3de2a96a4c6', '2025-10-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (923, 7, 43296.50, 'paid', 'Yas Money', '4d4c7139779b627824a41505e2e092a6', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (924, 7, 14462.57, 'paid', 'Yas Money', '520d73903307cbf919cffcff842f9e92', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (925, 10, 33162.92, 'paid', 'Carte Bancaire', '86e418f8560ffa05fee683007608c696', '2025-10-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (926, 9, 53567.46, 'paid', 'Orange Money', '3dcff22a954fde8e21a7ecff7a85d8e9', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (927, 13, 7315.53, 'paid', 'Kay Pay', '5c89a89a6419a24e8b52755123205a5c', '2025-10-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (928, 13, 36871.17, 'paid', 'Orange Money', 'f2e3eb941a7af468455efd0064df56b0', '2025-10-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (929, 14, 15371.09, 'paid', 'Kay Pay', '517d861a05f349597cade8d9d9bb8216', '2025-10-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (930, 7, 8853.34, 'paid', 'Kay Pay', 'f3001e2c539fb5cd919565d33c1bc910', '2025-10-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (931, 8, 35888.97, 'paid', 'Carte Bancaire', 'd7fa732626210d7ba1188224a0f99203', '2025-10-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (932, 15, 30955.58, 'paid', 'Yas Money', '4324a7ac4a69ce3fabcb219fadfc263c', '2025-10-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (933, 16, 32491.59, 'paid', 'Wave', 'bf4be8bb00562fcf9938d20586544b85', '2025-10-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (934, 10, 24902.67, 'paid', 'Orange Money', '0be37b1194c57506208d815ef0dc9888', '2025-10-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (935, 15, 46759.04, 'paid', 'Orange Money', 'fc016b5ff34d154ffdf54fc5fb11a828', '2025-10-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (936, 12, 20797.08, 'paid', 'Wave', '7acef898095edc0971e051929c622283', '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (937, 13, 45722.96, 'paid', 'Carte Bancaire', 'a20480bb16a43ec72a6efa7600cfa6bc', '2025-10-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (938, 15, 44343.64, 'paid', 'Kay Pay', 'b6c4fe509db032c739f802d5b6dfbbd9', '2025-10-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (939, 14, 49042.98, 'paid', 'Orange Money', '52f8b6038d0e88fd4b2bf9b27dbeec4f', '2025-10-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (940, 9, 49151.85, 'paid', 'Carte Bancaire', '294f86b29c9084d53818a3f68f143b85', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (941, 14, 29944.34, 'paid', 'Kay Pay', 'b2ccf8afec8837697ff48ab840ce558f', '2025-10-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (942, 9, 33522.26, 'paid', 'Kay Pay', 'f7e1f9bdd78f31f416e35625d58add75', '2025-10-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (943, 12, 40992.81, 'paid', 'Yas Money', 'c57732f2d81f39522f4aa53fce0108be', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (944, 7, 25154.74, 'paid', 'Kay Pay', 'ba219d7a318843c23257b25ac8938686', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (945, 16, 19100.16, 'paid', 'Wave', 'dde3c81ee395d662000c0909a6db32ab', '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (946, 11, 8684.77, 'paid', 'Wave', '644705edd6f3902422c6443a529b8c4c', '2025-10-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (947, 11, 17571.12, 'paid', 'Kay Pay', '715c99d4a3369fdc95234f906b90d58b', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (948, 7, 20326.24, 'paid', 'Kay Pay', '849d0f35afb523fad359aa0f6ef59de6', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (949, 16, 43679.86, 'paid', 'Wave', '76dd0b0b09e9735d5fd48dc8abeee04b', '2025-10-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (950, 7, 46092.13, 'paid', 'Wave', 'a66b5770b467d819e2589853de283fde', '2025-10-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (951, 13, 23384.50, 'paid', 'Orange Money', '53e0fadc16db894081161a5aa32e1049', '2025-10-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (952, 10, 34336.24, 'paid', 'Yas Money', 'dc84cc9f1e4848ac2afaa01e2d588fad', '2025-10-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (953, 15, 50101.72, 'paid', 'Orange Money', '195f600f44ab27a3e3de362fa29a96fb', '2025-10-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (954, 9, 14864.29, 'paid', 'Wave', '4b86dd25d5d71f87c9c02be7e0bb7eaf', '2025-10-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (955, 8, 29013.26, 'paid', 'Orange Money', 'f4eab639b4dbe5c00d3dc07189adbe54', '2025-10-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (956, 9, 36936.46, 'paid', 'Yas Money', 'c1e35c32189b7f78c045fe48c04622ab', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (957, 16, 13417.55, 'paid', 'Yas Money', 'df07d49173ae10f75f514459c65deef5', '2025-10-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (958, 10, 35407.13, 'paid', 'Yas Money', '3cba9f7ecfbdb0d52e972ba054beee92', '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (959, 16, 40774.33, 'paid', 'Kay Pay', 'dc9236fd5846ae1f084f90411d51c9e4', '2025-10-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (960, 14, 32994.17, 'paid', 'Carte Bancaire', 'd9203eee3d949d55dff77fd1af0fe419', '2025-10-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (961, 7, 20934.26, 'paid', 'Orange Money', '866c70ee9f90953b73c002dc9918426e', '2025-10-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (962, 13, 40692.44, 'paid', 'Orange Money', 'ce0c20584a33038d90e697d641bfcd04', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (963, 9, 41174.98, 'paid', 'Yas Money', '565bdd66f06ab7d5471c20aa950bc929', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (964, 8, 28650.93, 'paid', 'Kay Pay', '399627fc94a69bf47a88256bed6df84a', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (965, 10, 47742.38, 'paid', 'Kay Pay', 'ff1bce256090574442ed03879dd6ce07', '2025-10-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (966, 14, 45242.30, 'paid', 'Kay Pay', '40aceeac9ca13e913315b0e847c26821', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (967, 11, 23825.72, 'paid', 'Yas Money', '07d449bda6a42621b5c5fae5cca66bdc', '2025-10-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (968, 7, 25751.36, 'paid', 'Kay Pay', 'e21a859fd22a57ee5979c23d02bc04a9', '2025-10-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (969, 9, 7935.39, 'paid', 'Orange Money', '1766066ef4ac6830bfdc28dfad40c7b6', '2025-10-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (970, 13, 35710.53, 'paid', 'Yas Money', '74f3867b576ac6d4bacb18be9a456ac9', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (971, 7, 45832.56, 'paid', 'Carte Bancaire', 'ce9ff97932f5c14b010a2ad52a9ef149', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (972, 12, 46669.36, 'paid', 'Carte Bancaire', 'ef7cd269273192f4133922fe2d5b0655', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (973, 10, 7560.14, 'paid', 'Carte Bancaire', '569dda8958ca9ac071653f7b4e8fb0f1', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (974, 7, 11633.77, 'paid', 'Yas Money', '4199757be27f9a1d5b3a611b40ac7350', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (975, 14, 26374.42, 'paid', 'Orange Money', 'bf13f3a23611331c75821b8afef69676', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (976, 15, 54833.63, 'paid', 'Carte Bancaire', '53ccd86728d6dc0e5c38a54e69c57b50', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (977, 8, 51662.89, 'paid', 'Kay Pay', '966066c65091a808894d00a67a0b3a3c', '2025-10-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (978, 16, 36295.41, 'paid', 'Kay Pay', '7cda774fac5efadbc3b1d4928d979964', '2025-10-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (979, 12, 53207.58, 'paid', 'Carte Bancaire', 'be40a6ff7c8ac9d0cd314ee5c3b6b50c', '2025-10-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (980, 7, 8502.11, 'paid', 'Kay Pay', 'bac52a05dde60902f86aa6a8185bde50', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (981, 7, 52059.83, 'paid', 'Carte Bancaire', '779a294aae42fc198f3db11e18436345', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (982, 11, 39045.11, 'paid', 'Wave', '629ae7b42aba462213ea0bf5b6104d4b', '2025-10-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (983, 12, 29481.24, 'paid', 'Carte Bancaire', '01cad3d5bba68640dd75aafb2e1c6b51', '2025-10-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (984, 8, 15947.87, 'paid', 'Yas Money', 'e087605ef4c47c876d0e26dde7a40bd6', '2025-10-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (985, 8, 41892.59, 'paid', 'Kay Pay', '32316b376a44d1bfd3e0a43472bef5d0', '2025-10-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (986, 9, 15864.66, 'paid', 'Orange Money', '2423e04475ed5d0319c7f0ca5d4c14b9', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (987, 12, 20035.96, 'paid', 'Yas Money', '6517573c9a29dd8ca7884d7426bcc3ba', '2025-10-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (988, 11, 32772.97, 'paid', 'Carte Bancaire', 'c88106a8361aa015d0129c29e1acf237', '2025-10-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (989, 8, 43080.06, 'paid', 'Carte Bancaire', 'c8c3377cb454bc44b824e7de0270afec', '2025-10-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (990, 11, 12913.14, 'paid', 'Carte Bancaire', '2709f0834258e01879715e34ab507fe7', '2025-10-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (991, 15, 38254.39, 'paid', 'Orange Money', '49ed8c03b19ddef98005f87fc183cd19', '2025-10-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (992, 8, 33130.59, 'paid', 'Wave', 'd95329098a1289abf0dedebf6f13eb76', '2025-10-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (993, 12, 12362.07, 'paid', 'Wave', '778460cd0890ba97290fea83a472f99f', '2025-10-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (994, 16, 41425.58, 'paid', 'Kay Pay', 'c2badf8e882093019fd1f23b87bbb2ea', '2025-10-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (995, 7, 23220.05, 'paid', 'Wave', '949d38d14d9954f80888bed9630dbdf5', '2025-10-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (996, 13, 14736.56, 'paid', 'Carte Bancaire', 'e98a86fed1a1abd6317e5989135d0d37', '2025-10-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (997, 12, 39225.67, 'paid', 'Carte Bancaire', 'a568b6cdb861c100c5c40fd78e3bb0e1', '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (998, 12, 50134.01, 'paid', 'Wave', '8e781ee8c6af2aabc4bb27220f11a2f9', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (999, 16, 49746.31, 'paid', 'Orange Money', '93c9de86f24c800a204461718199ece6', '2025-10-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1000, 9, 46269.47, 'paid', 'Kay Pay', '93ac8c90d13ff4dafa5b26c64a3674e6', '2025-10-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1001, 11, 41087.54, 'paid', 'Carte Bancaire', 'cc1651d88dc5d302c315369bc8ecd4f4', '2025-10-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1002, 11, 43531.31, 'paid', 'Orange Money', 'f26a6440455c7c0a2c5f2ebeb80917de', '2025-10-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1003, 15, 30339.51, 'paid', 'Carte Bancaire', 'ae55a1615805972dac1d17bf5f13332a', '2025-11-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1004, 8, 22958.83, 'paid', 'Yas Money', 'ff463bacdf8751c27a0de86220a0e1fe', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1005, 11, 53462.62, 'paid', 'Kay Pay', '037a6224d22e50486391bd89fb107408', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1006, 7, 23804.99, 'paid', 'Kay Pay', 'c7eec51221e73a16fe2381e07a67f181', '2025-11-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1007, 11, 18110.23, 'paid', 'Yas Money', '930d93370bbf42783e2e09c5a11ddcfb', '2025-11-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1008, 12, 8485.44, 'paid', 'Wave', '3a6e127a41432b893b63447cc03ab0ad', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1009, 16, 21067.31, 'paid', 'Yas Money', '93256fa3f7e22762e64e051471ed6055', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1010, 7, 46358.96, 'paid', 'Wave', '0dd19ad31d8d5eb2fc4ecd8caf4cc6d6', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1011, 12, 19567.25, 'paid', 'Carte Bancaire', '8947312b58c9cb63c1221a31f31a63eb', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1012, 8, 36072.83, 'paid', 'Wave', '068c096e9a1e0e19bfbe391928448124', '2025-11-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1013, 13, 19665.89, 'paid', 'Wave', '15ebd15aa6da4735cf024bf556dad206', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1014, 10, 29966.81, 'paid', 'Kay Pay', '64bf61c463925c85d6f2a7836cc67774', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1015, 14, 47237.05, 'paid', 'Kay Pay', '91e452ca5403121421b1ca936aeaaf25', '2025-11-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1016, 14, 12907.01, 'paid', 'Wave', '88536f0854be2daf7fb433d554488a26', '2025-11-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1017, 7, 19773.30, 'paid', 'Wave', '9ba38593d9e2b8cff42f7a9518112e80', '2025-11-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1018, 7, 17268.65, 'paid', 'Yas Money', 'a264e236727d483bfced5b898309c944', '2025-11-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1019, 14, 20986.26, 'paid', 'Carte Bancaire', '8168b3eceed6363a07716d82a1257358', '2025-11-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1020, 14, 52731.02, 'paid', 'Kay Pay', '997751ddd8d65f5ba9e9ec3a87b9ee9f', '2025-11-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1021, 11, 52540.88, 'paid', 'Carte Bancaire', '4f151293f61cfa8946b75130b53fe9a1', '2025-11-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1022, 9, 22913.00, 'paid', 'Carte Bancaire', 'e73f856ad1062f6fa03acb7b1f1da167', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1023, 9, 13166.89, 'paid', 'Carte Bancaire', '1cbcbb54543c940e25ea6daba729eb8a', '2025-11-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1024, 15, 30035.65, 'paid', 'Carte Bancaire', '18d9a0f8e659fccc45233be25af936f4', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1025, 7, 33823.76, 'paid', 'Yas Money', 'b322304f5ff1dfd63e60064de0ab31d3', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1026, 15, 38632.71, 'paid', 'Orange Money', '1b79d524e4279bdef482ac21c0cd9541', '2025-11-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1027, 10, 53090.67, 'paid', 'Wave', '6e13463190483c144764217f645b23d9', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1028, 12, 17832.76, 'paid', 'Carte Bancaire', '4cadf8a529c51658c92b725ccce6339e', '2025-11-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1029, 13, 18095.14, 'paid', 'Wave', 'f02036653a0f35f6e32cdd8dfc35ed4e', '2025-11-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1030, 15, 39561.35, 'paid', 'Kay Pay', '6fb553de318619c4ff10d2af1fb55b8c', '2025-11-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1031, 13, 29089.49, 'paid', 'Carte Bancaire', 'a1f728865c74e9559422d601aba185bd', '2025-11-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1032, 12, 20493.59, 'paid', 'Yas Money', 'b8f6098edcff8376154f87aeecf4feae', '2025-11-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1033, 8, 7094.32, 'paid', 'Kay Pay', 'c3374cd05ed6108bf4d932e3a7de25b5', '2025-11-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1034, 8, 22405.59, 'paid', 'Kay Pay', '3fe26d477d14e6d89fc8cd612f3b6a90', '2025-11-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1035, 12, 47788.55, 'paid', 'Wave', '7d11f6fd1b7d537ca43eddec24e27329', '2025-11-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1036, 12, 41205.94, 'paid', 'Orange Money', '5f03cc102e523450f3204623cb44c618', '2025-11-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1037, 10, 7123.76, 'paid', 'Carte Bancaire', '49f3a8661c6f629257c56807456f7c8e', '2025-11-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1038, 8, 50461.99, 'paid', 'Wave', '4c747e84040572831c67798e8bf96b5e', '2025-11-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1039, 15, 45380.10, 'paid', 'Yas Money', '0b128ca2732463ade39499538f079701', '2025-11-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1040, 8, 21430.59, 'paid', 'Wave', '3f82fe4179ce1b0b839409b0de9aaa92', '2025-11-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1041, 10, 22224.19, 'paid', 'Kay Pay', '0c186cfb0fd05f7f3999121d7af4931b', '2025-11-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1042, 14, 45838.76, 'paid', 'Carte Bancaire', '124fd391ed8066c4c9815ae96990c3fd', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1043, 8, 7857.28, 'paid', 'Wave', '30bdf155a6d87f250e4117ee22361951', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1044, 8, 32823.38, 'paid', 'Kay Pay', 'f634a7a96fe9462e52dc53f6b284e2e2', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1045, 11, 32148.87, 'paid', 'Yas Money', '0705f6d2117499d336a0d7b9b8f5e961', '2025-11-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1046, 7, 40851.77, 'paid', 'Carte Bancaire', '45ccb81682708e208caed10990ce3bff', '2025-11-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1047, 14, 48140.50, 'paid', 'Kay Pay', '1527ff9e998621c094f6309e3e7b48e8', '2025-11-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1048, 14, 36533.59, 'paid', 'Carte Bancaire', 'ca0ee4fc5f207900d93449aeac635923', '2025-11-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1049, 10, 13140.81, 'paid', 'Kay Pay', 'f9760b6af75b375db28a8bf1f05f8885', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1050, 13, 11542.83, 'paid', 'Kay Pay', 'df65dc992013f7895ff324ba7d0735a2', '2025-11-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1051, 7, 31249.84, 'paid', 'Carte Bancaire', 'ccb90389a0c84c778309bddaf6db652c', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1052, 12, 38738.46, 'paid', 'Yas Money', 'ca0ab288293ffca7125d5220c7eb9480', '2025-11-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1053, 14, 41492.97, 'paid', 'Orange Money', '5585b4a66e7da10dfda6a6e2ae4bd29c', '2025-11-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1054, 7, 40393.40, 'paid', 'Carte Bancaire', 'a879975da6c24899ff889544b2ea1ff2', '2025-11-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1055, 11, 16261.75, 'paid', 'Kay Pay', 'bbb123e2a8026fa8f01692b53fa829b9', '2025-11-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1056, 11, 33819.25, 'paid', 'Carte Bancaire', '5e5b446d24a954ed778facccf3e645c9', '2025-11-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1057, 10, 36434.03, 'paid', 'Kay Pay', '2b818abd7be3e2b7baf1234ae23adfb7', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1058, 9, 34023.22, 'paid', 'Yas Money', '5d59fab3781af793c62e28d8ee31c94c', '2025-11-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1059, 7, 33053.83, 'paid', 'Orange Money', 'bac4ff45158a20fb998c8e4bef4f5106', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1060, 15, 36418.81, 'paid', 'Orange Money', '06c68a2821e757b01c4956fc25aed9fb', '2025-11-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1061, 13, 35247.35, 'paid', 'Yas Money', '9fe07cf839fd84ac935577a7b77c0a6f', '2025-11-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1062, 13, 24949.62, 'paid', 'Carte Bancaire', 'f9df6c82a98d9bc49d1858954279cd49', '2025-11-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1063, 10, 41935.51, 'paid', 'Carte Bancaire', 'c638f3944a288d1fd35656fb6016328a', '2025-11-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1064, 13, 22222.93, 'paid', 'Kay Pay', 'fac949351a3ec300446d51944480a95a', '2025-11-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1065, 16, 53742.98, 'paid', 'Yas Money', 'f29fcefacee78662cb5902a456c970e1', '2025-11-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1066, 13, 47245.03, 'paid', 'Wave', '4363ef9777cfb72d5b736e0c52048544', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1067, 16, 7560.72, 'paid', 'Yas Money', '5a4e7bda0d63fa0bbf3fac85a89635fe', '2025-11-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1068, 14, 21214.59, 'paid', 'Wave', 'cdeae3a5ed110878e7f313bfed39fd79', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1069, 15, 11097.42, 'paid', 'Kay Pay', '727d0c523686c1e4ebc1984146187eb3', '2025-11-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1070, 13, 20458.85, 'paid', 'Yas Money', 'd60c798c8dc9b8a10427a5d90b39d96b', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1071, 16, 19066.66, 'paid', 'Wave', 'd8a0ee0333a259629336f042c696ffe3', '2025-11-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1072, 12, 19277.94, 'paid', 'Kay Pay', '68ea5725a90c07ec090354922a1d6e87', '2025-11-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1073, 14, 35008.34, 'paid', 'Kay Pay', 'cceb86cd875b8bbb9a3d17a9ac5504ad', '2025-11-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1074, 8, 22766.82, 'paid', 'Orange Money', 'c4466e3bc0dc561b82d63e50b563b000', '2025-11-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1075, 14, 47126.07, 'paid', 'Carte Bancaire', '8dbc70dd27306b5f044ecddb06da99d9', '2025-11-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1076, 11, 10837.34, 'paid', 'Kay Pay', 'f9c998bb1996c53adad399ecb8148f87', '2025-11-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1077, 16, 46964.97, 'paid', 'Orange Money', '1cc7a1778d2b17fbfe61d1a407f0463a', '2025-11-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1078, 9, 46386.36, 'paid', 'Kay Pay', '91d4861ec99730d87ca66822dffc0d1b', '2025-11-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1079, 12, 12182.24, 'paid', 'Wave', '261e094b287bf6d964022cd8f50a70b1', '2025-11-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1080, 10, 14178.27, 'paid', 'Wave', '51c306e2cf108df99786d139cb0554d5', '2025-11-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1081, 10, 21930.21, 'paid', 'Kay Pay', '9ae01c787f1768527f79ff3c11972b6e', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1082, 10, 43184.67, 'paid', 'Orange Money', '1fb9568ebe27ae67cd2a25f3b310003f', '2025-11-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1083, 9, 54149.33, 'paid', 'Kay Pay', '6a20c1f61b8f2232df695842ea76a731', '2025-11-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1084, 10, 30642.62, 'paid', 'Wave', '871b9b77f5d9669e415e19d245b3dcfc', '2025-11-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1085, 14, 37826.09, 'paid', 'Carte Bancaire', '516ef018bfa0623b8b27a6fef8c3da22', '2025-11-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1086, 8, 29582.33, 'paid', 'Kay Pay', 'ed197c41d0f74b77671f7e0a5097190b', '2025-11-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1087, 16, 22936.70, 'paid', 'Carte Bancaire', '9f0d7d10f6c9a0fe0826e9da357828c8', '2025-11-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1088, 14, 19436.08, 'paid', 'Kay Pay', '77b1300e58a0d6b4af7d47bf057d091e', '2025-11-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1089, 7, 22629.42, 'paid', 'Kay Pay', '5c5e754636fee0f9f844eebe1ffed5e6', '2025-11-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1090, 14, 38330.50, 'paid', 'Yas Money', 'a6b7f67e125489d6c46e6330a4d37793', '2025-11-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1091, 7, 15447.65, 'paid', 'Orange Money', '81ebaed47d31bb2707194569b470bf81', '2025-11-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1092, 14, 39228.90, 'paid', 'Kay Pay', 'bb13269b2f65d1f4db87f70a9243425d', '2025-11-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1093, 12, 29156.02, 'paid', 'Yas Money', 'ae8116f3e9fb7c0d178d3263615e670b', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1094, 16, 52610.24, 'paid', 'Wave', 'e68a505f0783649b4ee1402a1a6a1e67', '2025-11-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1095, 15, 6070.74, 'paid', 'Orange Money', 'd383fadbba32d24557936ae9e1fe60e6', '2025-11-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1096, 14, 36493.83, 'paid', 'Wave', '79d6160e1733ca0892457429d7b09a90', '2025-11-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1097, 12, 51490.83, 'paid', 'Yas Money', 'fdcdc86289beb8c00acc06d0b8d5cdc8', '2025-11-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1098, 7, 24025.59, 'paid', 'Orange Money', 'd1562b0066ebbf174c1f50ffff25bb81', '2025-11-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1099, 13, 21452.98, 'paid', 'Kay Pay', '79a6a8401d83b2e723352d08b8a5f1e6', '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1100, 11, 45529.39, 'paid', 'Yas Money', 'e802e0c67159867655fa3e77c0e6112f', '2025-11-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1101, 13, 40611.08, 'paid', 'Orange Money', 'fc1855f7c6ac133ccc4315d09029f4df', '2025-11-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1102, 12, 19526.10, 'paid', 'Wave', '2d4328d2ca638dc75fc04dff5bb4e162', '2025-11-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1103, 14, 46064.43, 'paid', 'Carte Bancaire', '919383d08e9bf7fdeaf2531fadbe926c', '2025-12-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1104, 10, 39087.90, 'paid', 'Kay Pay', '8e4bec9579c4d8f9cf72296208b630a6', '2025-12-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1105, 7, 17750.36, 'paid', 'Carte Bancaire', '08a1b66865aaf829b91178c368b1e1d9', '2025-12-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1106, 8, 7366.56, 'paid', 'Wave', 'cd36f8787cdfc83ecc9f216a3586e316', '2025-12-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1107, 16, 35890.15, 'paid', 'Wave', '2a002e48c2e3a292feca0fecb81ddcd1', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1108, 8, 28327.07, 'paid', 'Carte Bancaire', '260162dc6a62809dcdb122ffe7663b88', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1109, 9, 45794.34, 'paid', 'Wave', 'beead265fd27dabafcecacc012f383f7', '2025-12-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1110, 7, 34108.73, 'paid', 'Kay Pay', 'db3c9507d711efe2f187a4e5c669795d', '2025-12-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1111, 16, 7025.67, 'paid', 'Wave', '3d7d351988a52ee093dcc7fe584dc384', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1112, 7, 22423.36, 'paid', 'Kay Pay', 'b80f5d260d3233580cce73e2466b49d5', '2025-12-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1113, 9, 19126.15, 'paid', 'Kay Pay', '58a8a7dc8fc95e45a3dff28c6587567b', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1114, 12, 22113.64, 'paid', 'Wave', '19eea54d3578c92f658bf1f9448c449d', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1115, 7, 33609.00, 'paid', 'Kay Pay', '368a4eff978d05c7f0badafb455f0558', '2025-12-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1116, 10, 36265.30, 'paid', 'Kay Pay', 'caaf08b98c6af1f1a94e6e3c2104436a', '2025-12-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1117, 11, 5961.81, 'paid', 'Kay Pay', 'd71ee663f120441648680d441a25e609', '2025-12-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1118, 13, 45457.39, 'paid', 'Kay Pay', '38da36e0dc9f6f3269492dfdd8b7fb0a', '2025-12-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1119, 14, 36182.40, 'paid', 'Kay Pay', '150ce5278ae1e5697185e814fb67e99c', '2025-12-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1120, 10, 27520.13, 'paid', 'Carte Bancaire', '81b50df44be2192e20134536bfef3609', '2025-12-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1121, 7, 22163.50, 'paid', 'Wave', '55c843f0aff071d99c79caecbe47b234', '2025-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1122, 11, 9314.71, 'paid', 'Carte Bancaire', '4f188ebf8e8f5a53795828ef68702ac1', '2025-12-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1123, 7, 17566.25, 'paid', 'Yas Money', '56c559c6dabac068b89339b7fc24dd7e', '2025-12-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1124, 8, 54705.73, 'paid', 'Wave', '749dbf3b2d00261e42b7ff08404ddea0', '2025-12-04 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1125, 10, 50834.28, 'paid', 'Kay Pay', '19c6444460a78bd4de70daac89f9a2a7', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1126, 9, 49768.20, 'paid', 'Carte Bancaire', '4bb0759e76c0d63cda28af81549eb0c1', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1127, 7, 29617.08, 'paid', 'Orange Money', '156d50d750ff5ce537d304e34a72ff3a', '2025-12-23 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1128, 7, 22565.07, 'paid', 'Yas Money', '04f6322666e94b2be295fc8b61d141b7', '2025-12-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1129, 10, 49711.89, 'paid', 'Yas Money', '9ff3986b88d1941712f2b82e9be567f6', '2025-12-22 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1130, 12, 54838.26, 'paid', 'Kay Pay', '183ff409aea1d60fb2f286d7ee0c0296', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1131, 11, 12212.76, 'paid', 'Yas Money', 'd053cd7f475a4f953a788be39793731c', '2025-12-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1132, 12, 41231.88, 'paid', 'Wave', '57e863c412b4a6c5085c4d2e355ee7ef', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1133, 10, 16555.31, 'paid', 'Wave', '7875f650cdb87fe11c2a3495b96a41e1', '2025-12-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1134, 13, 39242.59, 'paid', 'Carte Bancaire', '6e1ab3bdec5768ccd5054438b4104525', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1135, 8, 40659.44, 'paid', 'Wave', '6df0915a010fcddd90d56cf27b6a8a67', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1136, 13, 51751.17, 'paid', 'Carte Bancaire', '9260e59a8facd51fc9c64e88051f7881', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1137, 7, 26265.54, 'paid', 'Wave', 'e605e9bd14485f33c8ad053642383be9', '2025-12-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1138, 14, 33473.62, 'paid', 'Kay Pay', '49e81f87496937fd75cfb597b1713b83', '2025-12-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1139, 16, 26271.68, 'paid', 'Kay Pay', '28ec37693065a6f9b1156712b31cf1c3', '2025-12-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1140, 13, 32171.81, 'paid', 'Carte Bancaire', 'f541cf5c7001a2e028659aff7c1c91af', '2025-12-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1141, 7, 13827.69, 'paid', 'Yas Money', '29c655d7c0f0bbb1e7f9ff64b8f585fc', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1142, 9, 10295.61, 'paid', 'Yas Money', '9a9821c6f0e5b58849c390980cc2991f', '2025-12-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1143, 8, 36037.22, 'paid', 'Kay Pay', '83c6987e2a9847736dd7ef69f4d9a4a1', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1144, 12, 35263.39, 'paid', 'Orange Money', '7e8956c311ad4c34eea314065d53d247', '2025-12-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1145, 8, 43537.69, 'paid', 'Yas Money', '526408b186eb520e6205bf09ac6aac29', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1146, 15, 25004.39, 'paid', 'Orange Money', '5e3297f41ee2baa1ed2031edb1a347e0', '2025-12-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1147, 13, 8697.84, 'paid', 'Wave', '9861ba03a388949ccd20d925ef13a35b', '2025-12-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1148, 14, 5004.20, 'paid', 'Carte Bancaire', 'bef123796eaf80f1dabd56ffbabcaabb', '2025-12-15 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1149, 14, 31316.37, 'paid', 'Orange Money', '1946df9b7f56bb8703819c4b4cbc79c8', '2025-12-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1150, 15, 30352.80, 'paid', 'Wave', '4c39a9431ed3275a75d791a8f548a389', '2025-12-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1151, 14, 9791.73, 'paid', 'Orange Money', '4f9198186875fd9531974353aa1ba11d', '2025-12-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1152, 15, 51688.17, 'paid', 'Kay Pay', '8f0515f80646e12e276730f5fb4469fe', '2025-12-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1153, 12, 44088.90, 'paid', 'Kay Pay', '782437d1a459ac6c5be99a1ccf762c65', '2025-12-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1154, 11, 31259.99, 'paid', 'Orange Money', '13c69f45acd330fb3688d3ca0a51ff89', '2025-12-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1155, 14, 47553.11, 'paid', 'Kay Pay', '3d214e9a31c6239f0c5469f64c8152b7', '2025-12-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1156, 14, 43878.20, 'paid', 'Carte Bancaire', '9dba4fd97e6374357a4727b24eecece5', '2025-12-01 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1157, 7, 49669.22, 'paid', 'Orange Money', 'f5c33bf76cdaee3c43a0e61033b2d684', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1158, 15, 9915.27, 'paid', 'Yas Money', 'c545da59e13aeb040b199ee79f1ff963', '2025-12-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1159, 11, 41695.12, 'paid', 'Orange Money', 'c84a3002d0130847b6f186e7a3deb1e5', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1160, 14, 12167.89, 'paid', 'Orange Money', 'a959bafad022a0a655a802ebe3d5e750', '2025-12-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1161, 16, 22155.19, 'paid', 'Wave', 'a8dd2cb38f819b472d202c95c265bf18', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1162, 11, 14512.14, 'paid', 'Orange Money', '8ecdd8600a610401e26ba3a472e8efab', '2025-12-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1163, 15, 45375.07, 'paid', 'Carte Bancaire', 'e66b119805c861291098a93a26b95c57', '2025-12-14 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1164, 14, 25200.42, 'paid', 'Orange Money', '93406c060e62451e3b9cff3ea1a7e4a9', '2025-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1165, 15, 45959.77, 'paid', 'Orange Money', '8f2bf68806a1b4072f680c6fe24ab4fb', '2025-12-16 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1166, 13, 47356.33, 'paid', 'Orange Money', '8327896cd055ad2dce86ace1416e6bb9', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1167, 16, 40767.46, 'paid', 'Orange Money', '8bcd2fa0d9cb2bb0f030c9426885e7d4', '2025-12-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1168, 13, 21341.62, 'paid', 'Kay Pay', 'fa7f61fe2344b842865af6b926e6c3ce', '2025-12-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1169, 7, 22705.73, 'paid', 'Yas Money', '769356ae4718dd03f4c6e6a7cefce212', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1170, 16, 7489.77, 'paid', 'Wave', '0f63af648e6fd805238a29a97df76d01', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1171, 11, 9541.22, 'paid', 'Wave', '74b956fee7d14d7b100f93ca2f24196d', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1172, 7, 11271.00, 'paid', 'Carte Bancaire', 'a472322af623829ce7effb5c200e5e22', '2025-12-17 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1173, 13, 20624.66, 'paid', 'Carte Bancaire', '0d5c0ff4a7200af4f1ea881281531c37', '2025-12-19 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1174, 7, 13551.31, 'paid', 'Kay Pay', '2456788f179a6f57f377a5d12aeec69f', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1175, 15, 17779.62, 'paid', 'Carte Bancaire', '65878def4aa1300ac5f7b4248c5cf940', '2025-12-12 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1176, 9, 6309.06, 'paid', 'Carte Bancaire', 'd0600e4c658c49c65d773aae3ef3a408', '2025-12-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1177, 16, 39502.63, 'paid', 'Carte Bancaire', 'aa5936982aa7118b3f43abe61306e163', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1178, 9, 12693.10, 'paid', 'Kay Pay', '7b281d1c7e5e05e84ecb8d0f1c586ac6', '2025-12-26 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1179, 11, 20824.75, 'paid', 'Yas Money', '394e730bf9b6316cecaea84fbc489c50', '2025-12-09 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1180, 12, 28248.54, 'paid', 'Kay Pay', '5ff40a25d02f5f2e598c3b841fa4809c', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1181, 16, 44149.05, 'paid', 'Kay Pay', '2ebb72496ab84a39974929d6daae3b79', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1182, 13, 39712.28, 'paid', 'Yas Money', '8ffd5ba73655bcd887c7f70ea5b7a1c4', '2025-12-28 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1183, 14, 18273.21, 'paid', 'Wave', '6489f9178bbbfd41a3cf19494774c600', '2025-12-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1184, 7, 45867.80, 'paid', 'Kay Pay', '072d6bcb183addf4b2776ce13dd87245', '2025-12-11 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1185, 16, 12842.75, 'paid', 'Carte Bancaire', '0dae49f87e9eeaf6bae841f1767f043b', '2025-12-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1186, 7, 5489.94, 'paid', 'Orange Money', '23174d3f202ed999d5391da41c3b0f91', '2025-12-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1187, 8, 44970.37, 'paid', 'Orange Money', '1fdb49374135f53e6824e6f47ba635fd', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1188, 8, 11683.27, 'paid', 'Kay Pay', '16cbe5fc1386d0bedd47569fea85e38f', '2025-12-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1189, 11, 19513.20, 'paid', 'Carte Bancaire', 'd58cf1b1c6d6b48ebb63e560ea23c1f3', '2025-12-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1190, 10, 15303.60, 'paid', 'Orange Money', '826d0bf9c4b7f39faf6e549e7585f256', '2025-12-18 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1191, 11, 13674.36, 'paid', 'Wave', '026ab950a26d9e1568124e132673a628', '2025-12-24 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1192, 9, 41901.90, 'paid', 'Kay Pay', '22b5118d2e85db6fcec95d334a66f8f8', '2025-12-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1193, 9, 30314.87, 'paid', 'Yas Money', '615a05a955f16eb9ae6fef0296434995', '2025-12-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1194, 15, 23536.00, 'paid', 'Yas Money', 'cc8e005df4b728399de442d18ae7fb22', '2025-12-10 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1195, 12, 17377.75, 'paid', 'Wave', '37bf4e63a1f5513529b8f186a9b32809', '2025-12-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1196, 9, 31036.15, 'paid', 'Carte Bancaire', '8ba2180ef91dc6c5042d564e34673294', '2025-12-03 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1197, 8, 45749.08, 'paid', 'Wave', 'ae1e3e5cc99df35e8545b97015a82d9a', '2025-12-07 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1198, 14, 45932.54, 'paid', 'Orange Money', '8ba1f380407353d7106d121fd4f44732', '2025-12-02 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1199, 15, 49764.83, 'paid', 'Kay Pay', '952d6fec02c05095ee0199b1b047910d', '2025-12-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1200, 10, 51738.42, 'paid', 'Wave', 'd7e4365bd44a65790d6bba930d993ec3', '2025-12-13 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1201, 14, 32778.92, 'paid', 'Orange Money', '471d14efd50ff08c11eef03118e0b059', '2025-12-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1202, 9, 7544.99, 'paid', 'Orange Money', '7e0cd3b467ee2836f854d45cf0f2e3b9', '2025-12-25 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}');
INSERT INTO public.payments VALUES (1207, 8, 15000.00, 'paid', 'Wave', 'TXN-1767198247539-m1zac6gum', '2025-12-31 16:24:07.537335', NULL, NULL, NULL, NULL, '+221779947443', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1209, 7, 15000.00, 'pending', 'mobile_money', 'TXN-1767617138055-0pi3vtnf6', '2026-01-05 12:45:38.056464', NULL, NULL, NULL, NULL, '+221779947443', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1210, 7, 15000.00, 'pending', 'mobile_money', 'TXN-1767617138182-g8ogwgyu5', '2026-01-05 12:45:38.182894', NULL, NULL, NULL, NULL, '+221779947443', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1211, 7, 15000.00, 'pending', 'mobile_money', 'TXN-1767617439868-zfia5mxk4', '2026-01-05 12:50:39.870143', NULL, NULL, NULL, NULL, '+221779947443', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1212, 7, 15000.00, 'pending', 'mobile_money', 'TXN-1767617768571-8uhxi07tv', '2026-01-05 12:56:08.572486', NULL, NULL, NULL, NULL, '+221779947443', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1213, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767618491475-hsrs6i', '2026-01-05 13:08:11.478046', NULL, NULL, NULL, NULL, '770000000', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1214, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767618609825-bd61wl', '2026-01-05 13:10:09.830685', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1215, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767618647514-ydn9vg', '2026-01-05 13:10:47.519175', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1216, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767619008738-z5pvm0', '2026-01-05 13:16:48.739742', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1217, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767621703422-ix2oni', '2026-01-05 14:01:43.423631', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1218, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767621722511-whdxg2', '2026-01-05 14:02:02.513296', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1219, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622165893-cl0w1k', '2026-01-05 14:09:25.894822', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1220, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622186717-jgmirl', '2026-01-05 14:09:46.718542', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1221, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622202582-1xvrq1', '2026-01-05 14:10:02.583149', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1222, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622252590-67giki', '2026-01-05 14:10:52.592003', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1223, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622589995-zu52n1', '2026-01-05 14:16:29.996887', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1224, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622660194-1zhph8', '2026-01-05 14:17:40.195059', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1225, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622764131-04ogpk', '2026-01-05 14:19:24.135392', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');
INSERT INTO public.payments VALUES (1226, 8, 15000.00, 'pending', 'mobile_money', 'PTC-1767622835115-0xmof5', '2026-01-05 14:20:35.117398', NULL, NULL, NULL, NULL, '770000001', NULL, 'subscription', NULL, 'Wave', '{}');


--
-- Data for Name: public_holidays; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.public_holidays VALUES (1, '2026-01-01', 'Nouvel An');
INSERT INTO public.public_holidays VALUES (2, '2026-05-01', 'Fête du Travail');
INSERT INTO public.public_holidays VALUES (3, '2026-04-04', 'Indépendance');
INSERT INTO public.public_holidays VALUES (4, '2025-12-28', 'fer');
INSERT INTO public.public_holidays VALUES (5, '2027-01-01', 'AN');


--
-- Data for Name: reported_messages; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: saved_payment_methods; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.saved_payment_methods VALUES (3, 15, 'card', 'Mamadou Diop', '1234', 'Visa', 12, 2025, 'tok_1234567890', NULL, NULL, true, false, 'Ma carte Visa', '2025-12-31 15:22:09.447463', '2025-12-31 15:22:09.447463', NULL);
INSERT INTO public.saved_payment_methods VALUES (5, 15, 'mobile_money', NULL, NULL, NULL, NULL, NULL, NULL, '+221771234567', 'Wave', false, false, 'Mon compte Wave', '2025-12-31 15:24:38.923879', '2025-12-31 15:24:38.923879', NULL);


--
-- Data for Name: school_vacations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.school_vacations VALUES (1, 1, 'Vacances d été 2026', '2026-07-01', '2026-08-31', '2025-12-23 11:33:49.818524');
INSERT INTO public.school_vacations VALUES (2, 1, 'pacue', '2025-12-26', '2025-12-27', '2025-12-23 15:36:58.276306');
INSERT INTO public.school_vacations VALUES (3, 11, 'testVacances', '2025-12-25', '2025-12-29', '2025-12-24 10:30:04.60423');
INSERT INTO public.school_vacations VALUES (4, 2, 'vac', '2025-12-25', '2025-12-29', '2025-12-24 10:30:56.553313');
INSERT INTO public.school_vacations VALUES (5, 4, 'vactes', '2026-01-22', '2026-01-25', '2026-01-14 00:02:05.607525');


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.subscription_plans VALUES (1, 'Chauffeur Mensuel', 'Abonnement mensuel pour chauffeur', 15000.00, 30, '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}]', 'driver', true, '2025-12-31 15:10:00.252592');
INSERT INTO public.subscription_plans VALUES (2, 'Chauffeur Trimestriel', 'Abonnement trimestriel pour chauffeur (-10%)', 40500.00, 90, '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}, {"name": "Économie de 10%"}]', 'driver', true, '2025-12-31 15:10:00.252592');
INSERT INTO public.subscription_plans VALUES (3, 'Parent Mensuel', 'Abonnement mensuel pour parent', 25000.00, 30, '[{"name": "Réservations illimitées"}, {"name": "Notifications en temps réel"}, {"name": "Support client"}]', 'parent', true, '2025-12-31 15:10:00.252592');
INSERT INTO public.subscription_plans VALUES (4, 'Chauffeur Mensuel', 'Abonnement mensuel pour chauffeur', 15000.00, 30, '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}]', 'driver', true, '2025-12-31 15:12:02.390983');
INSERT INTO public.subscription_plans VALUES (5, 'Chauffeur Trimestriel', 'Abonnement trimestriel pour chauffeur (-10%)', 40500.00, 90, '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}, {"name": "Économie de 10%"}]', 'driver', true, '2025-12-31 15:12:02.390983');
INSERT INTO public.subscription_plans VALUES (6, 'Parent Mensuel', 'Abonnement mensuel pour parent', 25000.00, 30, '[{"name": "Réservations illimitées"}, {"name": "Notifications en temps réel"}, {"name": "Support client"}]', 'parent', true, '2025-12-31 15:12:02.390983');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.subscriptions VALUES (102, 14, 'Annuel', 100000.00, true, '2025-01-16 00:00:00', '2025-12-16 16:37:36.913217', '2025-01-16', '2026-01-16', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (108, 13, 'Annuel', 100000.00, true, '2025-02-13 00:00:00', '2025-12-16 16:37:36.913217', '2025-02-13', '2026-02-13', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (111, 11, 'Trimestriel', 27000.00, false, '2025-02-26 00:00:00', '2025-12-16 16:37:36.913217', '2025-02-26', '2025-05-26', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (114, 9, 'Annuel', 100000.00, true, '2025-02-27 00:00:00', '2025-12-16 16:37:36.913217', '2025-02-27', '2026-02-27', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (118, 15, 'Annuel', 100000.00, false, '2025-03-14 00:00:00', '2025-12-16 16:37:36.913217', '2025-03-14', '2026-03-14', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (123, 15, 'Trimestriel', 27000.00, false, '2025-03-19 00:00:00', '2025-12-16 16:37:36.913217', '2025-03-19', '2025-06-19', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (129, 10, 'Annuel', 100000.00, false, '2025-04-01 00:00:00', '2025-12-16 16:37:36.913217', '2025-04-01', '2026-04-01', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (134, 13, 'Trimestriel', 27000.00, false, '2025-04-17 00:00:00', '2025-12-16 16:37:36.913217', '2025-04-17', '2025-07-17', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (135, 11, 'Annuel', 100000.00, true, '2025-05-23 00:00:00', '2025-12-16 16:37:36.913217', '2025-05-23', '2026-05-23', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (136, 9, 'Annuel', 100000.00, true, '2025-05-20 00:00:00', '2025-12-16 16:37:36.913217', '2025-05-20', '2026-05-20', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (142, 10, 'Trimestriel', 27000.00, false, '2025-05-12 00:00:00', '2025-12-16 16:37:36.913217', '2025-05-12', '2025-08-12', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (143, 12, 'Annuel', 100000.00, true, '2025-05-20 00:00:00', '2025-12-16 16:37:36.913217', '2025-05-20', '2026-05-20', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (150, 10, 'Mensuel', 10000.00, false, '2025-06-24 00:00:00', '2025-12-16 16:37:36.913217', '2025-06-24', '2025-07-24', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (151, 12, 'Annuel', 100000.00, true, '2025-06-16 00:00:00', '2025-12-16 16:37:36.913217', '2025-06-16', '2026-06-16', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (153, 12, 'Annuel', 100000.00, false, '2025-07-24 00:00:00', '2025-12-16 16:37:36.913217', '2025-07-24', '2026-07-24', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (158, 10, 'Annuel', 100000.00, false, '2025-07-10 00:00:00', '2025-12-16 16:37:36.913217', '2025-07-10', '2026-07-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (161, 9, 'Annuel', 100000.00, true, '2025-07-02 00:00:00', '2025-12-16 16:37:36.913217', '2025-07-02', '2026-07-02', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (163, 14, 'Annuel', 100000.00, true, '2025-08-11 00:00:00', '2025-12-16 16:37:36.913217', '2025-08-11', '2026-08-11', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (164, 9, 'Mensuel', 10000.00, false, '2025-08-20 00:00:00', '2025-12-16 16:37:36.913217', '2025-08-20', '2025-09-20', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (171, 12, 'Annuel', 100000.00, true, '2025-09-03 00:00:00', '2025-12-16 16:37:36.913217', '2025-09-03', '2026-09-03', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (172, 14, 'Annuel', 100000.00, true, '2025-09-03 00:00:00', '2025-12-16 16:37:36.913217', '2025-09-03', '2026-09-03', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (173, 10, 'Annuel', 100000.00, false, '2025-09-16 00:00:00', '2025-12-16 16:37:36.913217', '2025-09-16', '2026-09-16', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (174, 14, 'Mensuel', 10000.00, false, '2025-09-14 00:00:00', '2025-12-16 16:37:36.913217', '2025-09-14', '2025-10-14', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (175, 15, 'Annuel', 100000.00, true, '2025-09-26 00:00:00', '2025-12-16 16:37:36.913217', '2025-09-26', '2026-09-26', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (181, 12, 'Annuel', 100000.00, true, '2025-10-15 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-15', '2026-10-15', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (182, 12, 'Trimestriel', 27000.00, false, '2025-10-13 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-13', '2026-01-13', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (183, 10, 'Annuel', 100000.00, true, '2025-10-07 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-07', '2026-10-07', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (184, 12, 'Trimestriel', 27000.00, true, '2025-10-18 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-18', '2026-01-18', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (185, 13, 'Annuel', 100000.00, false, '2025-10-20 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-20', '2026-10-20', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (186, 9, 'Mensuel', 10000.00, false, '2025-10-23 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-23', '2025-11-23', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (187, 9, 'Annuel', 100000.00, true, '2025-10-08 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-08', '2026-10-08', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (188, 11, 'Annuel', 100000.00, true, '2025-10-21 00:00:00', '2025-12-16 16:37:36.913217', '2025-10-21', '2026-10-21', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (99, 15, 'Mensuel', 10000.00, false, '2025-01-10 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-10', '2025-02-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (100, 12, 'Trimestriel', 27000.00, false, '2025-01-15 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-15', '2025-04-15', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (101, 9, 'Mensuel', 10000.00, false, '2025-01-06 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-06', '2025-02-06', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (104, 11, 'Mensuel', 10000.00, false, '2025-01-14 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-14', '2025-02-14', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (105, 13, 'Mensuel', 10000.00, false, '2025-01-07 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-07', '2025-02-07', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (106, 15, 'Annuel', 100000.00, false, '2025-01-03 00:00:00', '2026-01-05 11:02:58.510377', '2025-01-03', '2026-01-03', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (110, 10, 'Mensuel', 10000.00, false, '2025-02-10 00:00:00', '2026-01-05 11:02:58.510377', '2025-02-10', '2025-03-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (112, 13, 'Mensuel', 10000.00, false, '2025-02-10 00:00:00', '2026-01-05 11:02:58.510377', '2025-02-10', '2025-03-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (113, 9, 'Mensuel', 10000.00, false, '2025-02-08 00:00:00', '2026-01-05 11:02:58.510377', '2025-02-08', '2025-03-08', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (117, 12, 'Mensuel', 10000.00, false, '2025-03-08 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-08', '2025-04-08', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (119, 13, 'Trimestriel', 27000.00, false, '2025-03-10 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-10', '2025-06-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (120, 12, 'Trimestriel', 27000.00, false, '2025-03-24 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-24', '2025-06-24', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (121, 13, 'Mensuel', 10000.00, false, '2025-03-02 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-02', '2025-04-02', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (122, 12, 'Trimestriel', 27000.00, false, '2025-03-03 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-03', '2025-06-03', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (194, 9, 'Annuel', 100000.00, true, '2025-11-06 00:00:00', '2025-12-16 16:37:36.913217', '2025-11-06', '2026-11-06', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (196, 12, 'Annuel', 100000.00, true, '2025-11-26 00:00:00', '2025-12-16 16:37:36.913217', '2025-11-26', '2026-11-26', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (197, 13, 'Annuel', 100000.00, true, '2025-11-06 00:00:00', '2025-12-16 16:37:36.913217', '2025-11-06', '2026-11-06', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (200, 15, 'Trimestriel', 27000.00, true, '2025-12-07 00:00:00', '2025-12-16 16:37:36.913217', '2025-12-07', '2026-03-07', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (202, 14, 'Trimestriel', 27000.00, true, '2025-12-26 00:00:00', '2025-12-16 16:37:36.913217', '2025-12-26', '2026-03-26', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (204, 9, 'Annuel', 100000.00, true, '2025-12-27 00:00:00', '2025-12-16 16:37:36.913217', '2025-12-27', '2026-12-27', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (205, 14, 'Trimestriel', 27000.00, false, '2025-12-23 00:00:00', '2025-12-16 16:37:36.913217', '2025-12-23', '2026-03-23', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (206, 10, 'Trimestriel', 27000.00, true, '2025-12-18 00:00:00', '2025-12-16 16:37:36.913217', '2025-12-18', '2026-03-18', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (124, 15, 'Trimestriel', 27000.00, false, '2025-03-16 00:00:00', '2026-01-05 11:02:58.510377', '2025-03-16', '2025-06-16', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (127, 14, 'Mensuel', 10000.00, false, '2025-04-09 00:00:00', '2026-01-05 11:02:58.510377', '2025-04-09', '2025-05-09', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (128, 13, 'Trimestriel', 27000.00, false, '2025-04-10 00:00:00', '2026-01-05 11:02:58.510377', '2025-04-10', '2025-07-10', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (130, 11, 'Mensuel', 10000.00, false, '2025-04-25 00:00:00', '2026-01-05 11:02:58.510377', '2025-04-25', '2025-05-25', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (132, 9, 'Trimestriel', 27000.00, false, '2025-04-07 00:00:00', '2026-01-05 11:02:58.510377', '2025-04-07', '2025-07-07', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (140, 14, 'Trimestriel', 27000.00, false, '2025-05-14 00:00:00', '2026-01-05 11:02:58.510377', '2025-05-14', '2025-08-14', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (141, 14, 'Trimestriel', 27000.00, false, '2025-05-17 00:00:00', '2026-01-05 11:02:58.510377', '2025-05-17', '2025-08-17', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (144, 13, 'Mensuel', 10000.00, false, '2025-06-23 00:00:00', '2026-01-05 11:02:58.510377', '2025-06-23', '2025-07-23', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (146, 14, 'Trimestriel', 27000.00, false, '2025-06-05 00:00:00', '2026-01-05 11:02:58.510377', '2025-06-05', '2025-09-05', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (149, 12, 'Trimestriel', 27000.00, false, '2025-06-09 00:00:00', '2026-01-05 11:02:58.510377', '2025-06-09', '2025-09-09', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (152, 11, 'Mensuel', 10000.00, false, '2025-06-18 00:00:00', '2026-01-05 11:02:58.510377', '2025-06-18', '2025-07-18', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (154, 13, 'Mensuel', 10000.00, false, '2025-07-23 00:00:00', '2026-01-05 11:02:58.510377', '2025-07-23', '2025-08-23', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (155, 13, 'Mensuel', 10000.00, false, '2025-07-26 00:00:00', '2026-01-05 11:02:58.510377', '2025-07-26', '2025-08-26', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (157, 14, 'Trimestriel', 27000.00, false, '2025-07-25 00:00:00', '2026-01-05 11:02:58.510377', '2025-07-25', '2025-10-25', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (159, 9, 'Mensuel', 10000.00, false, '2025-07-02 00:00:00', '2026-01-05 11:02:58.510377', '2025-07-02', '2025-08-02', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (160, 11, 'Mensuel', 10000.00, false, '2025-07-17 00:00:00', '2026-01-05 11:02:58.510377', '2025-07-17', '2025-08-17', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (162, 12, 'Trimestriel', 27000.00, false, '2025-08-22 00:00:00', '2026-01-05 11:02:58.510377', '2025-08-22', '2025-11-22', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (166, 14, 'Trimestriel', 27000.00, false, '2025-08-25 00:00:00', '2026-01-05 11:02:58.510377', '2025-08-25', '2025-11-25', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (167, 13, 'Trimestriel', 27000.00, false, '2025-08-14 00:00:00', '2026-01-05 11:02:58.510377', '2025-08-14', '2025-11-14', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (168, 10, 'Trimestriel', 27000.00, false, '2025-08-21 00:00:00', '2026-01-05 11:02:58.510377', '2025-08-21', '2025-11-21', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (170, 13, 'Mensuel', 10000.00, false, '2025-08-04 00:00:00', '2026-01-05 11:02:58.510377', '2025-08-04', '2025-09-04', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (176, 14, 'Mensuel', 10000.00, false, '2025-09-17 00:00:00', '2026-01-05 11:02:58.510377', '2025-09-17', '2025-10-17', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (178, 12, 'Mensuel', 10000.00, false, '2025-09-19 00:00:00', '2026-01-05 11:02:58.510377', '2025-09-19', '2025-10-19', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (179, 10, 'Trimestriel', 27000.00, false, '2025-09-08 00:00:00', '2026-01-05 11:02:58.510377', '2025-09-08', '2025-12-08', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (180, 13, 'Mensuel', 10000.00, false, '2025-10-07 00:00:00', '2026-01-05 11:02:58.510377', '2025-10-07', '2025-11-07', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (190, 9, 'Mensuel', 10000.00, false, '2025-11-06 00:00:00', '2026-01-05 11:02:58.510377', '2025-11-06', '2025-12-06', NULL, false, NULL, NULL);
INSERT INTO public.subscriptions VALUES (191, 15, 'Mensuel', 10000.00, false, '2025-11-03 00:00:00', '2026-01-05 11:02:58.510377', '2025-11-03', '2025-12-03', NULL, false, NULL, NULL);


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: trip_children; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.trip_children VALUES (29, 1, '2025-12-30 09:34:27.989134');
INSERT INTO public.trip_children VALUES (29, 2, '2025-12-30 14:55:51.242972');
INSERT INTO public.trip_children VALUES (29, 7, '2025-12-30 14:55:56.222294');
INSERT INTO public.trip_children VALUES (43, 1, '2026-01-14 13:01:22.104389');
INSERT INTO public.trip_children VALUES (43, 2, '2026-01-14 13:02:02.265987');
INSERT INTO public.trip_children VALUES (43, 7, '2026-01-14 13:02:02.265987');


--
-- Name: carpool_calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carpool_calendar_id_seq', 1, true);


--
-- Name: carpool_exchanges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carpool_exchanges_id_seq', 1, false);


--
-- Name: carpool_group_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carpool_group_members_id_seq', 2, true);


--
-- Name: carpool_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carpool_groups_id_seq', 2, true);


--
-- Name: child_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.child_schedules_id_seq', 1, false);


--
-- Name: children_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.children_id_seq', 14, true);


--
-- Name: conversation_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conversation_participants_id_seq', 9, true);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conversations_id_seq', 7, true);


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.drivers_id_seq', 36, true);


--
-- Name: evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.evaluations_id_seq', 1, true);


--
-- Name: incidents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.incidents_id_seq', 15, true);


--
-- Name: message_read_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.message_read_status_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 2, true);


--
-- Name: notification_destinataires_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_destinataires_id_seq', 110, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 109, true);


--
-- Name: password_resets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_resets_id_seq', 2, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1226, true);


--
-- Name: public_holidays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.public_holidays_id_seq', 5, true);


--
-- Name: reported_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reported_messages_id_seq', 1, false);


--
-- Name: saved_payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.saved_payment_methods_id_seq', 5, true);


--
-- Name: school_vacations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.school_vacations_id_seq', 5, true);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 22, true);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 6, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 231, true);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, false);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trips_id_seq', 43, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 29, true);


--
-- PostgreSQL database dump complete
--

\unrestrict bAu1Wlu0yJuTfQufzt3np7FXydtIAYd6oC6hsHJKUCfthauAFQsctHM2hQwObGc

