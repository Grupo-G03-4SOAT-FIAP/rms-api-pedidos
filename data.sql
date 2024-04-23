--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-04-23 18:56:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3370 (class 0 OID 16412)
-- Dependencies: 217
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categorias VALUES ('43a7f9e1-632b-4cb6-b7d7-38e1004f2a9c', 'Lanches', 'Lanches Para Todos Os Gostos!', '2024-04-23 21:55:15.005029', '2024-04-23 21:55:15.005029', NULL);


--
-- TOC entry 3369 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.produtos VALUES ('4511aa20-90b2-45ae-bbf8-3ab05ec85983', 'X-tudo', 'Ingredientes: 1 Hambúrguer, 50 G De Bacon Picados, 1 Ovo, 2 Fatias De Presunto, 2 Fatias De Mussarela (cheddar), 1 Folha De Alface, 1 Rodela De Tomate, 1 Pão De Hambúrguer, 1 Colher De Maionese, Catchup A Gosto (opcional)', 29.9, 'https://conteudo.imguol.com.br/c/entretenimento/17/2023/05/24/x-tudo-brasileiro-tem-variedade-de-ingredientes-de-acordo-com-preferencias-regionais-aqui-versao-com-carne-bovina-tomato-salsicha-presunto-bacon-e-queijo-no-pao-1684938396547_v2_1x1.jpg', '2024-04-23 21:55:24.331599', '2024-04-23 21:55:24.331599', NULL, '43a7f9e1-632b-4cb6-b7d7-38e1004f2a9c');


-- Completed on 2024-04-23 18:56:12

--
-- PostgreSQL database dump complete
--

