--
-- PostgreSQL database dump
--

\restrict vtgeX7yHXYJTINGbYEiolzY3SPvOgeiwb91NTEC5LC7tQ8p5z1OqUOenfD6bZW1

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-19 19:10:29

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
-- TOC entry 5204 (class 0 OID 34052)
-- Dependencies: 278
-- Data for Name: carpool_calendar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carpool_calendar (id, group_id, date, driver_id, start_point, end_point, departure_time, return_time, capacity_max, notes, status, created_at, updated_at) FROM stdin;
1	1	2026-01-13	14	Place de la République	École Primaire Victor Hugo	08:00:00	16:30:00	4	\N	scheduled	2026-01-12 01:11:56.726751	2026-01-12 01:11:56.726751
\.


--
-- TOC entry 5206 (class 0 OID 34082)
-- Dependencies: 280
-- Data for Name: carpool_exchanges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carpool_exchanges (id, group_id, calendar_id, requester_id, target_driver_id, original_date, proposed_date, exchange_type, message, status, created_at, responded_at) FROM stdin;
\.


--
-- TOC entry 5202 (class 0 OID 34027)
-- Dependencies: 276
-- Data for Name: carpool_group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carpool_group_members (id, group_id, parent_id, status, invited_at, responded_at) FROM stdin;
1	1	14	accepted	2026-01-12 01:11:56.726751	2026-01-12 01:11:56.726751
\.


--
-- TOC entry 5200 (class 0 OID 34001)
-- Dependencies: 274
-- Data for Name: carpool_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carpool_groups (id, name, description, school_id, creator_id, status, created_at, updated_at) FROM stdin;
1	Covoiturage École Victor Hugo - Matin	Groupe de covoiturage pour les trajets du matin vers l'école Victor Hugo	4	14	active	2026-01-12 01:11:56.726751	2026-01-12 01:11:56.726751
\.


--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 277
-- Name: carpool_calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carpool_calendar_id_seq', 1, true);


--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 279
-- Name: carpool_exchanges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carpool_exchanges_id_seq', 1, false);


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 275
-- Name: carpool_group_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carpool_group_members_id_seq', 2, true);


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 273
-- Name: carpool_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carpool_groups_id_seq', 2, true);


-- Completed on 2026-01-19 19:10:29

--
-- PostgreSQL database dump complete
--

\unrestrict vtgeX7yHXYJTINGbYEiolzY3SPvOgeiwb91NTEC5LC7tQ8p5z1OqUOenfD6bZW1

