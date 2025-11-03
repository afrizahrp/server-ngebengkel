--
-- PostgreSQL database dump
--

\restrict FYSM9MbheKGMVYyEEHgXPsqJHBlwTUkO0i6dWSnyG1d9XHZvmYeqjUYo7KOtWF1

-- Dumped from database version 16.10
-- Dumped by pg_dump version 17.6

-- Started on 2025-11-03 08:24:08

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
-- TOC entry 1105 (class 1247 OID 109838)
-- Name: APInvoiceStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."APInvoiceStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '9'
);


ALTER TYPE public."APInvoiceStatusEnum" OWNER TO postgres;

--
-- TOC entry 1111 (class 1247 OID 109864)
-- Name: APPaymentConfirmStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."APPaymentConfirmStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '9'
);


ALTER TYPE public."APPaymentConfirmStatusEnum" OWNER TO postgres;

--
-- TOC entry 1108 (class 1247 OID 109854)
-- Name: APPaymentStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."APPaymentStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '9'
);


ALTER TYPE public."APPaymentStatusEnum" OWNER TO postgres;

--
-- TOC entry 979 (class 1247 OID 109332)
-- Name: AddonStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddonStatusEnum" AS ENUM (
    'A',
    'S',
    'E',
    'C'
);


ALTER TYPE public."AddonStatusEnum" OWNER TO postgres;

--
-- TOC entry 958 (class 1247 OID 109270)
-- Name: ApprovalStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatusEnum" AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public."ApprovalStatusEnum" OWNER TO postgres;

--
-- TOC entry 1084 (class 1247 OID 109762)
-- Name: BalanceTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BalanceTypeEnum" AS ENUM (
    'D',
    'C'
);


ALTER TYPE public."BalanceTypeEnum" OWNER TO postgres;

--
-- TOC entry 970 (class 1247 OID 109302)
-- Name: BillingCycleEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BillingCycleEnum" AS ENUM (
    'M',
    'Y'
);


ALTER TYPE public."BillingCycleEnum" OWNER TO postgres;

--
-- TOC entry 976 (class 1247 OID 109320)
-- Name: BillingStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BillingStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '9'
);


ALTER TYPE public."BillingStatusEnum" OWNER TO postgres;

--
-- TOC entry 946 (class 1247 OID 109236)
-- Name: BookingSourceEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingSourceEnum" AS ENUM (
    'WEB',
    'APP',
    'PHONE',
    'WALKIN'
);


ALTER TYPE public."BookingSourceEnum" OWNER TO postgres;

--
-- TOC entry 943 (class 1247 OID 109221)
-- Name: BookingStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '9'
);


ALTER TYPE public."BookingStatusEnum" OWNER TO postgres;

--
-- TOC entry 1081 (class 1247 OID 109750)
-- Name: COATypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."COATypeEnum" AS ENUM (
    'A',
    'L',
    'E',
    'R',
    'X'
);


ALTER TYPE public."COATypeEnum" OWNER TO postgres;

--
-- TOC entry 1099 (class 1247 OID 109812)
-- Name: CashReceiptStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashReceiptStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '5',
    '9'
);


ALTER TYPE public."CashReceiptStatusEnum" OWNER TO postgres;

--
-- TOC entry 1054 (class 1247 OID 109626)
-- Name: ComplaintLogTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintLogTypeEnum" AS ENUM (
    'SC',
    'AS',
    'RS',
    'ES',
    'RE',
    'FU',
    'NT',
    'CL',
    'EM',
    'CP'
);


ALTER TYPE public."ComplaintLogTypeEnum" OWNER TO postgres;

--
-- TOC entry 1048 (class 1247 OID 109592)
-- Name: ComplaintSourceEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintSourceEnum" AS ENUM (
    'PH',
    'EM',
    'WA',
    'IP',
    'SM',
    'WB',
    'SV'
);


ALTER TYPE public."ComplaintSourceEnum" OWNER TO postgres;

--
-- TOC entry 1051 (class 1247 OID 109608)
-- Name: ComplaintStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '9'
);


ALTER TYPE public."ComplaintStatusEnum" OWNER TO postgres;

--
-- TOC entry 1042 (class 1247 OID 109564)
-- Name: ComplaintTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintTypeEnum" AS ENUM (
    'SQ',
    'PQ',
    'PR',
    'DL',
    'SB',
    'FC',
    'WR',
    'OT'
);


ALTER TYPE public."ComplaintTypeEnum" OWNER TO postgres;

--
-- TOC entry 1072 (class 1247 OID 109712)
-- Name: CreditNoteStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreditNoteStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '9'
);


ALTER TYPE public."CreditNoteStatusEnum" OWNER TO postgres;

--
-- TOC entry 1066 (class 1247 OID 109686)
-- Name: CreditReasonEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreditReasonEnum" AS ENUM (
    'SI',
    'OC',
    'GW',
    'RT',
    'CP',
    'OT'
);


ALTER TYPE public."CreditReasonEnum" OWNER TO postgres;

--
-- TOC entry 982 (class 1247 OID 109342)
-- Name: CustomerTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CustomerTypeEnum" AS ENUM (
    'I',
    'C'
);


ALTER TYPE public."CustomerTypeEnum" OWNER TO postgres;

--
-- TOC entry 1009 (class 1247 OID 109436)
-- Name: DetailStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DetailStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '9'
);


ALTER TYPE public."DetailStatusEnum" OWNER TO postgres;

--
-- TOC entry 1006 (class 1247 OID 109430)
-- Name: DetailTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DetailTypeEnum" AS ENUM (
    'S',
    'P'
);


ALTER TYPE public."DetailTypeEnum" OWNER TO postgres;

--
-- TOC entry 1075 (class 1247 OID 109726)
-- Name: DocumentResetEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentResetEnum" AS ENUM (
    'N',
    'Y',
    'M',
    'D'
);


ALTER TYPE public."DocumentResetEnum" OWNER TO postgres;

--
-- TOC entry 988 (class 1247 OID 109354)
-- Name: FuelLevelEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FuelLevelEnum" AS ENUM (
    'E',
    'Q',
    'H',
    'F'
);


ALTER TYPE public."FuelLevelEnum" OWNER TO postgres;

--
-- TOC entry 985 (class 1247 OID 109348)
-- Name: GenderEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GenderEnum" AS ENUM (
    'M',
    'F'
);


ALTER TYPE public."GenderEnum" OWNER TO postgres;

--
-- TOC entry 1030 (class 1247 OID 109514)
-- Name: InternalMovementTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InternalMovementTypeEnum" AS ENUM (
    'TRF',
    'ADJ',
    'RET',
    'SCP',
    'ASM',
    'DIS',
    'ALC',
    'CSM'
);


ALTER TYPE public."InternalMovementTypeEnum" OWNER TO postgres;

--
-- TOC entry 1093 (class 1247 OID 109794)
-- Name: InvoiceItemTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceItemTypeEnum" AS ENUM (
    'S',
    'P',
    'O'
);


ALTER TYPE public."InvoiceItemTypeEnum" OWNER TO postgres;

--
-- TOC entry 1090 (class 1247 OID 109784)
-- Name: InvoicePaymentStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoicePaymentStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."InvoicePaymentStatusEnum" OWNER TO postgres;

--
-- TOC entry 1087 (class 1247 OID 109768)
-- Name: InvoiceStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '9'
);


ALTER TYPE public."InvoiceStatusEnum" OWNER TO postgres;

--
-- TOC entry 1102 (class 1247 OID 109824)
-- Name: JournalStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JournalStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '5',
    '8',
    '9'
);


ALTER TYPE public."JournalStatusEnum" OWNER TO postgres;

--
-- TOC entry 952 (class 1247 OID 109254)
-- Name: MasterRecordStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MasterRecordStatusEnum" AS ENUM (
    '0',
    '1'
);


ALTER TYPE public."MasterRecordStatusEnum" OWNER TO postgres;

--
-- TOC entry 994 (class 1247 OID 109380)
-- Name: MechanicLevelEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MechanicLevelEnum" AS ENUM (
    'JR',
    'SR',
    'MT',
    'FM'
);


ALTER TYPE public."MechanicLevelEnum" OWNER TO postgres;

--
-- TOC entry 1039 (class 1247 OID 109552)
-- Name: MovementDetailStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MovementDetailStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '9'
);


ALTER TYPE public."MovementDetailStatusEnum" OWNER TO postgres;

--
-- TOC entry 1036 (class 1247 OID 109538)
-- Name: MovementStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MovementStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '5',
    '9'
);


ALTER TYPE public."MovementStatusEnum" OWNER TO postgres;

--
-- TOC entry 1021 (class 1247 OID 109484)
-- Name: PODetailStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PODetailStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '9'
);


ALTER TYPE public."PODetailStatusEnum" OWNER TO postgres;

--
-- TOC entry 1096 (class 1247 OID 109802)
-- Name: PaymentConfirmStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentConfirmStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '9'
);


ALTER TYPE public."PaymentConfirmStatusEnum" OWNER TO postgres;

--
-- TOC entry 1078 (class 1247 OID 109736)
-- Name: PaymentMethodTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethodTypeEnum" AS ENUM (
    'CASH',
    'BANK',
    'CARD',
    'EWLT',
    'QRIS',
    'GIRO'
);


ALTER TYPE public."PaymentMethodTypeEnum" OWNER TO postgres;

--
-- TOC entry 1003 (class 1247 OID 109420)
-- Name: PaymentStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."PaymentStatusEnum" OWNER TO postgres;

--
-- TOC entry 961 (class 1247 OID 109278)
-- Name: PostingStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PostingStatusEnum" AS ENUM (
    '0',
    '1'
);


ALTER TYPE public."PostingStatusEnum" OWNER TO postgres;

--
-- TOC entry 967 (class 1247 OID 109292)
-- Name: PriorityEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PriorityEnum" AS ENUM (
    'L',
    'N',
    'H',
    'U'
);


ALTER TYPE public."PriorityEnum" OWNER TO postgres;

--
-- TOC entry 1015 (class 1247 OID 109456)
-- Name: PurchaseOrderStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseOrderStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '9'
);


ALTER TYPE public."PurchaseOrderStatusEnum" OWNER TO postgres;

--
-- TOC entry 1024 (class 1247 OID 109494)
-- Name: QualityStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QualityStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."QualityStatusEnum" OWNER TO postgres;

--
-- TOC entry 1027 (class 1247 OID 109504)
-- Name: ReceiveDetailStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiveDetailStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."ReceiveDetailStatusEnum" OWNER TO postgres;

--
-- TOC entry 1018 (class 1247 OID 109472)
-- Name: ReceiveStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiveStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '5'
);


ALTER TYPE public."ReceiveStatusEnum" OWNER TO postgres;

--
-- TOC entry 1069 (class 1247 OID 109700)
-- Name: RefundMethodEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RefundMethodEnum" AS ENUM (
    'CSH',
    'TRF',
    'CTA',
    'VCH',
    'OFF'
);


ALTER TYPE public."RefundMethodEnum" OWNER TO postgres;

--
-- TOC entry 1132 (class 1247 OID 109960)
-- Name: ReminderChannelEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderChannelEnum" AS ENUM (
    'WA',
    'EM',
    'SM'
);


ALTER TYPE public."ReminderChannelEnum" OWNER TO postgres;

--
-- TOC entry 1126 (class 1247 OID 109928)
-- Name: ReminderEntityTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderEntityTypeEnum" AS ENUM (
    'SO',
    'BK',
    'SH',
    'VM',
    'SUB',
    'PAY',
    'CUS'
);


ALTER TYPE public."ReminderEntityTypeEnum" OWNER TO postgres;

--
-- TOC entry 1138 (class 1247 OID 109980)
-- Name: ReminderLogTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderLogTypeEnum" AS ENUM (
    'S',
    'F',
    'C',
    'U'
);


ALTER TYPE public."ReminderLogTypeEnum" OWNER TO postgres;

--
-- TOC entry 1135 (class 1247 OID 109968)
-- Name: ReminderStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderStatusEnum" AS ENUM (
    'P',
    'S',
    'T',
    'F',
    'C'
);


ALTER TYPE public."ReminderStatusEnum" OWNER TO postgres;

--
-- TOC entry 1129 (class 1247 OID 109944)
-- Name: ReminderTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReminderTypeEnum" AS ENUM (
    'SCH',
    'DUE',
    'APT',
    'PAY',
    'EXP',
    'FUP',
    'CUS'
);


ALTER TYPE public."ReminderTypeEnum" OWNER TO postgres;

--
-- TOC entry 1120 (class 1247 OID 109906)
-- Name: ReturnDetailStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReturnDetailStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '9'
);


ALTER TYPE public."ReturnDetailStatusEnum" OWNER TO postgres;

--
-- TOC entry 1114 (class 1247 OID 109874)
-- Name: ReturnReasonEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReturnReasonEnum" AS ENUM (
    'DMG',
    'DEF',
    'WRG',
    'EXC',
    'EXP',
    'OTH'
);


ALTER TYPE public."ReturnReasonEnum" OWNER TO postgres;

--
-- TOC entry 1117 (class 1247 OID 109888)
-- Name: ReturnStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReturnStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '8',
    '9'
);


ALTER TYPE public."ReturnStatusEnum" OWNER TO postgres;

--
-- TOC entry 1063 (class 1247 OID 109674)
-- Name: ReworkActionEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReworkActionEnum" AS ENUM (
    'RD',
    'RP',
    'AD',
    'RF',
    'VC'
);


ALTER TYPE public."ReworkActionEnum" OWNER TO postgres;

--
-- TOC entry 1057 (class 1247 OID 109648)
-- Name: ReworkReasonEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReworkReasonEnum" AS ENUM (
    'PQ',
    'IC',
    'WP',
    'MF',
    'DM',
    'OT'
);


ALTER TYPE public."ReworkReasonEnum" OWNER TO postgres;

--
-- TOC entry 1060 (class 1247 OID 109662)
-- Name: ReworkStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReworkStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '9'
);


ALTER TYPE public."ReworkStatusEnum" OWNER TO postgres;

--
-- TOC entry 997 (class 1247 OID 109390)
-- Name: ServiceBayTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceBayTypeEnum" AS ENUM (
    'GEN',
    'HEAVY',
    'QUICK',
    'BODY',
    'WASH'
);


ALTER TYPE public."ServiceBayTypeEnum" OWNER TO postgres;

--
-- TOC entry 991 (class 1247 OID 109364)
-- Name: ServiceCategoryEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceCategoryEnum" AS ENUM (
    'MAINT',
    'REPAIR',
    'BODY',
    'WASH',
    'INSP',
    'TUNE',
    'EMERG'
);


ALTER TYPE public."ServiceCategoryEnum" OWNER TO postgres;

--
-- TOC entry 1000 (class 1247 OID 109402)
-- Name: ServiceOrderStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceOrderStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '9'
);


ALTER TYPE public."ServiceOrderStatusEnum" OWNER TO postgres;

--
-- TOC entry 1045 (class 1247 OID 109582)
-- Name: SeverityEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SeverityEnum" AS ENUM (
    'L',
    'M',
    'H',
    'C'
);


ALTER TYPE public."SeverityEnum" OWNER TO postgres;

--
-- TOC entry 949 (class 1247 OID 109246)
-- Name: SlotStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SlotStatusEnum" AS ENUM (
    'OPEN',
    'BLOCKED',
    'FULL'
);


ALTER TYPE public."SlotStatusEnum" OWNER TO postgres;

--
-- TOC entry 973 (class 1247 OID 109308)
-- Name: SubscriptionStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatusEnum" AS ENUM (
    'T',
    'A',
    'E',
    'S',
    'C'
);


ALTER TYPE public."SubscriptionStatusEnum" OWNER TO postgres;

--
-- TOC entry 1012 (class 1247 OID 109446)
-- Name: SupplierTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupplierTypeEnum" AS ENUM (
    'V',
    'D',
    'M',
    'A'
);


ALTER TYPE public."SupplierTypeEnum" OWNER TO postgres;

--
-- TOC entry 1123 (class 1247 OID 109918)
-- Name: TaxTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaxTypeEnum" AS ENUM (
    'S',
    'P',
    'W',
    'O'
);


ALTER TYPE public."TaxTypeEnum" OWNER TO postgres;

--
-- TOC entry 955 (class 1247 OID 109260)
-- Name: TransactionRecordStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionRecordStatusEnum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."TransactionRecordStatusEnum" OWNER TO postgres;

--
-- TOC entry 964 (class 1247 OID 109284)
-- Name: TransactionStatusEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatusEnum" AS ENUM (
    'E',
    'P',
    'U'
);


ALTER TYPE public."TransactionStatusEnum" OWNER TO postgres;

--
-- TOC entry 1033 (class 1247 OID 109532)
-- Name: TransactionTypeEnum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionTypeEnum" AS ENUM (
    'I',
    'O'
);


ALTER TYPE public."TransactionTypeEnum" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 109211)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 110870)
-- Name: acc_BankAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."acc_BankAccount" (
    id character(10) NOT NULL,
    coa_id character(15) NOT NULL,
    "bankName" character varying(100) NOT NULL,
    "branchName" character varying(100),
    "accountNumber" character varying(30) NOT NULL,
    "accountName" character varying(100) NOT NULL,
    currency character(3) DEFAULT 'IDR'::bpchar NOT NULL,
    "swiftCode" character varying(20),
    "openingBalance" numeric(21,4) DEFAULT 0,
    "currentBalance" numeric(21,4) DEFAULT 0,
    "isDefault" boolean DEFAULT false,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."acc_BankAccount" OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 110850)
-- Name: acc_COA; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."acc_COA" (
    id character(15) NOT NULL,
    "accountCode" character varying(20) NOT NULL,
    "accountName" character varying(150) NOT NULL,
    "accountName_en" character varying(150),
    "accountType" public."COATypeEnum" NOT NULL,
    "accountGroup" character varying(50),
    "normalBalance" public."BalanceTypeEnum" NOT NULL,
    parent_id character(15),
    level smallint NOT NULL,
    "isHeader" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isCash" boolean DEFAULT false NOT NULL,
    "isBank" boolean DEFAULT false NOT NULL,
    "isAP" boolean DEFAULT false NOT NULL,
    "isAR" boolean DEFAULT false NOT NULL,
    "isInventory" boolean DEFAULT false NOT NULL,
    "openingBalance" numeric(21,4) DEFAULT 0,
    "openingBalanceDate" date,
    "currentDebit" numeric(21,4) DEFAULT 0,
    "currentCredit" numeric(21,4) DEFAULT 0,
    "currentBalance" numeric(21,4) DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."acc_COA" OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 111070)
-- Name: acc_GLTrans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."acc_GLTrans" (
    id character(30) NOT NULL,
    "journalNumber" character varying(30) NOT NULL,
    "journalDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    source_module character varying(20),
    source_document_id character(30),
    source_document_number character varying(30),
    invoice_id character(30),
    payment_id character(30),
    "cashReceipt_id" character(30),
    "apInvoice_id" character(30),
    "apPayment_id" character(30),
    "purchaseOrder_id" character(20),
    "purchaseReturn_id" character(30),
    "creditNote_id" character(30),
    description character varying(250) NOT NULL,
    notes text,
    "totalDebit" numeric(21,4) DEFAULT 0 NOT NULL,
    "totalCredit" numeric(21,4) DEFAULT 0 NOT NULL,
    "journalStatus" public."JournalStatusEnum" DEFAULT '0'::public."JournalStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedBy" character(10),
    "postedDate" timestamp(3) without time zone,
    "isReversed" boolean DEFAULT false,
    "reversedBy" character(10),
    "reversedDate" timestamp(3) without time zone,
    "reversalJournal_id" character(30),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."acc_GLTrans" OWNER TO postgres;

--
-- TOC entry 314 (class 1259 OID 111085)
-- Name: acc_GLTransDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."acc_GLTransDetail" (
    id character(30) NOT NULL,
    "glTrans_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    coa_id character(15) NOT NULL,
    description character varying(250),
    "debitAmount" numeric(21,4) DEFAULT 0,
    "creditAmount" numeric(21,4) DEFAULT 0,
    "costCenter" character varying(20),
    department character varying(20),
    project character varying(20),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."acc_GLTransDetail" OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 110982)
-- Name: apm_Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."apm_Invoice" (
    id character(30) NOT NULL,
    "invoiceNumber" character varying(30) NOT NULL,
    "invoiceDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" date,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "taxScheme_id" character(5),
    source_module character varying(20),
    "purchaseReceive_id" character(20),
    "purchaseOrder_id" character(20),
    "receiveNumber" character varying(30),
    "poNumber" character varying(30),
    supplier_id character(20) NOT NULL,
    "supplierName" character varying(150) NOT NULL,
    "supplierAddress" text,
    "supplierPhone" character varying(20),
    "supplierEmail" character varying(100),
    "supplierInvoiceNumber" character varying(30),
    "supplierInvoiceDate" date,
    "taxInvoiceNumber" character varying(30),
    "subtotalAmount" numeric(21,4) DEFAULT 0 NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "shippingCost" numeric(21,4) DEFAULT 0,
    "otherCharges" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) NOT NULL,
    "paidAmount" numeric(21,4) DEFAULT 0,
    "outstandingAmount" numeric(21,4),
    "paymentTermDays" smallint,
    "paymentDueDate" date,
    "invoiceStatus" public."APInvoiceStatusEnum" DEFAULT '0'::public."APInvoiceStatusEnum" NOT NULL,
    "paymentStatus" public."APPaymentStatusEnum" DEFAULT '0'::public."APPaymentStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."apm_Invoice" OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 111004)
-- Name: apm_InvoiceDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."apm_InvoiceDetail" (
    id character(30) NOT NULL,
    "apInvoice_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    product_id character(20),
    "productVariant_id" character(30),
    "productName" character varying(250) NOT NULL,
    "productCode" character varying(50),
    description text,
    quantity numeric(12,4) NOT NULL,
    uom character varying(10),
    "unitPrice" numeric(21,4) NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    expense_coa_id character(15),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."apm_InvoiceDetail" OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 111018)
-- Name: apm_Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."apm_Payment" (
    id character(30) NOT NULL,
    "paymentNumber" character varying(30) NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "apInvoice_id" character(30) NOT NULL,
    "invoiceNumber" character varying(30),
    supplier_id character(20) NOT NULL,
    "supplierName" character varying(150),
    "paymentMethod_id" character(10) NOT NULL,
    "bankAccount_id" character(10),
    "referenceNumber" character varying(50),
    "paymentAmount" numeric(21,4) NOT NULL,
    "processingFee" numeric(21,4) DEFAULT 0,
    "netAmount" numeric(21,4) NOT NULL,
    "paymentStatus" public."APPaymentConfirmStatusEnum" DEFAULT '0'::public."APPaymentConfirmStatusEnum" NOT NULL,
    "verifiedBy" character(10),
    "verifiedDate" timestamp(3) without time zone,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "internalNotes" text,
    "proofImageURL" character varying(250),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."apm_Payment" OWNER TO postgres;

--
-- TOC entry 310 (class 1259 OID 111032)
-- Name: apm_PaymentDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."apm_PaymentDetail" (
    id character(30) NOT NULL,
    "apPayment_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    description character varying(250),
    "paymentMethod_id" character(10) NOT NULL,
    amount numeric(21,4) NOT NULL,
    "referenceNumber" character varying(50),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."apm_PaymentDetail" OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 110961)
-- Name: arm_CashReceipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_CashReceipt" (
    id character(30) NOT NULL,
    "receiptNumber" character varying(30) NOT NULL,
    "receiptDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "receivedFrom" character varying(150) NOT NULL,
    "receivedFromType" character varying(20),
    "receivedFrom_id" character(20),
    "totalAmount" numeric(21,4) NOT NULL,
    "receiptStatus" public."CashReceiptStatusEnum" DEFAULT '0'::public."CashReceiptStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    description text,
    notes text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_CashReceipt" OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 110974)
-- Name: arm_CashReceiptDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_CashReceiptDetail" (
    id character(30) NOT NULL,
    "cashReceipt_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    coa_id character(15) NOT NULL,
    description character varying(250),
    amount numeric(21,4) NOT NULL,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_CashReceiptDetail" OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 110679)
-- Name: arm_CreditNote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_CreditNote" (
    id character(30) NOT NULL,
    "creditNoteNumber" character varying(30) NOT NULL,
    "creditNoteDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    source_module character varying(20),
    invoice_id character(30),
    "invoiceNumber" character varying(30),
    "serviceOrder_id" character(20),
    complaint_id character(30),
    "serviceRework_id" character(30),
    customer_id character(20) NOT NULL,
    "customerName" character varying(100) NOT NULL,
    "customerVehicle_id" character(20),
    vehicle_customer_id character(20),
    "vehicleInfo" character varying(250),
    "creditReason" public."CreditReasonEnum",
    "creditReasonDesc" text,
    "originalAmount" numeric(21,4),
    "creditAmount" numeric(21,4) NOT NULL,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "totalCreditAmount" numeric(21,4) NOT NULL,
    "refundMethod" public."RefundMethodEnum",
    "refundBankAccount_id" character(10),
    "refundReferenceNumber" character varying(50),
    "refundDate" timestamp(3) without time zone,
    "approvedBy" character(10),
    "approvedDate" timestamp(3) without time zone,
    "approvalNotes" text,
    "creditNoteStatus" public."CreditNoteStatusEnum" DEFAULT '0'::public."CreditNoteStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    "isRefunded" boolean DEFAULT false,
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_CreditNote" OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 110694)
-- Name: arm_CreditNoteDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_CreditNoteDetail" (
    id character(30) NOT NULL,
    "creditNote_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    "itemType" public."InvoiceItemTypeEnum" NOT NULL,
    item_id character(30),
    "itemCode" character varying(50),
    "itemName" character varying(250) NOT NULL,
    description text,
    "originalQuantity" numeric(12,4),
    "originalUnitPrice" numeric(21,4),
    "originalAmount" numeric(21,4),
    "creditQuantity" numeric(12,4),
    "creditUnitPrice" numeric(21,4),
    "creditAmount" numeric(21,4) NOT NULL,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "totalCredit" numeric(21,4) NOT NULL,
    "creditReason" character varying(250),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_CreditNoteDetail" OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 110904)
-- Name: arm_Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_Invoice" (
    id character(30) NOT NULL,
    "invoiceNumber" character varying(30) NOT NULL,
    "invoiceDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" date,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "taxScheme_id" character(5),
    source_module character varying(20),
    source_document_id character(30),
    source_document_number character varying(30),
    customer_id character(20) NOT NULL,
    "customerName" character varying(100) NOT NULL,
    "customerAddress" text,
    "customerPhone" character varying(20),
    "customerEmail" character varying(100),
    "customerVehicle_id" character(20),
    vehicle_customer_id character(20),
    "vehicleInfo" character varying(250),
    "subtotalAmount" numeric(21,4) DEFAULT 0 NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "otherCharges" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) NOT NULL,
    "paidAmount" numeric(21,4) DEFAULT 0,
    "outstandingAmount" numeric(21,4),
    "paymentTermDays" smallint,
    "invoiceStatus" public."InvoiceStatusEnum" DEFAULT '0'::public."InvoiceStatusEnum" NOT NULL,
    "paymentStatus" public."InvoicePaymentStatusEnum" DEFAULT '0'::public."InvoicePaymentStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_Invoice" OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 110925)
-- Name: arm_InvoiceDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_InvoiceDetail" (
    id character(30) NOT NULL,
    invoice_id character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    "itemType" public."InvoiceItemTypeEnum" NOT NULL,
    item_id character(30),
    "itemCode" character varying(50),
    "itemName" character varying(250) NOT NULL,
    "itemDescription" text,
    quantity numeric(12,4) NOT NULL,
    uom character varying(10),
    "unitPrice" numeric(21,4) NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    revenue_coa_id character(15),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_InvoiceDetail" OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 110939)
-- Name: arm_Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_Payment" (
    id character(30) NOT NULL,
    "paymentNumber" character varying(30) NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    invoice_id character(30) NOT NULL,
    "invoiceNumber" character varying(30),
    customer_id character(20) NOT NULL,
    "customerName" character varying(100),
    "paymentMethod_id" character(10) NOT NULL,
    "bankAccount_id" character(10),
    "referenceNumber" character varying(50),
    "paymentAmount" numeric(21,4) NOT NULL,
    "processingFee" numeric(21,4) DEFAULT 0,
    "netAmount" numeric(21,4) NOT NULL,
    "paymentStatus" public."PaymentConfirmStatusEnum" DEFAULT '0'::public."PaymentConfirmStatusEnum" NOT NULL,
    "verifiedBy" character(10),
    "verifiedDate" timestamp(3) without time zone,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "internalNotes" text,
    "proofImageURL" character varying(250),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_Payment" OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 110953)
-- Name: arm_PaymentDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."arm_PaymentDetail" (
    id character(30) NOT NULL,
    payment_id character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    description character varying(250),
    "paymentMethod_id" character(10) NOT NULL,
    amount numeric(21,4) NOT NULL,
    "referenceNumber" character varying(50),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."arm_PaymentDetail" OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 110425)
-- Name: cmf_Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_Customer" (
    id character(20) NOT NULL,
    "customerType" public."CustomerTypeEnum" DEFAULT 'I'::public."CustomerTypeEnum" NOT NULL,
    name character varying(100) NOT NULL,
    "legalName" character varying(150),
    nickname character varying(50),
    email character varying(100),
    phone1 character varying(20),
    phone2 character varying(20),
    mobile1 character varying(20) NOT NULL,
    mobile2 character varying(20),
    website character varying(100),
    "companyRegistrationNumber" character varying(50),
    "businessType" character varying(50),
    "industryType" character varying(50),
    "companySize" character varying(20),
    "numberOfEmployees" smallint,
    "numberOfVehicles" smallint,
    province character varying(50),
    district character varying(50),
    city character varying(50),
    "subDistrict" character varying(50),
    address1 character varying(250),
    address2 character varying(250),
    "postalCode" character(6),
    "billingProvince" character varying(50),
    "billingDistrict" character varying(50),
    "billingCity" character varying(50),
    "billingSubDistrict" character varying(50),
    "billingAddress1" character varying(250),
    "billingAddress2" character varying(250),
    "billingPostalCode" character(6),
    "idCardType" character varying(20),
    "idCardNumber" character varying(30),
    "taxNumber" character varying(30),
    "taxName" character varying(150),
    "taxAddress" character varying(250),
    "birthDate" date,
    gender public."GenderEnum",
    occupation character varying(50),
    "customerSince" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "membershipLevel" character varying(20),
    "loyaltyPoints" integer DEFAULT 0,
    "totalTransaction" numeric(21,4) DEFAULT 0,
    "lastVisitDate" timestamp(3) without time zone,
    "paymentTermDays" smallint,
    "creditLimit" numeric(21,4),
    "currentDebt" numeric(21,4) DEFAULT 0,
    "isCOD" boolean DEFAULT true,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isBlacklisted" boolean DEFAULT false,
    "blacklistReason" character varying(250),
    remarks character varying(250),
    "profileImageURL" character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_Customer" OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 110441)
-- Name: cmf_CustomerContactPerson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_CustomerContactPerson" (
    id character(20) NOT NULL,
    customer_id character(20) NOT NULL,
    name character varying(100) NOT NULL,
    "position" character varying(50),
    department character varying(50),
    email character varying(100),
    phone character varying(20),
    mobile character varying(20),
    whatsapp character varying(20),
    "isPrimary" boolean DEFAULT false,
    "canApprove" boolean DEFAULT false,
    "canOrder" boolean DEFAULT false,
    "approvalLimit" numeric(21,4),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_CustomerContactPerson" OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 110453)
-- Name: cmf_CustomerVehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_CustomerVehicle" (
    id character(20) NOT NULL,
    customer_id character(20) NOT NULL,
    "vehicleType_id" character(5) NOT NULL,
    brand_id character(10) NOT NULL,
    model_id character(15) NOT NULL,
    "licensePlate" character varying(15) NOT NULL,
    "vehicleYear" smallint,
    color character varying(30),
    "chassisNumber" character varying(30),
    "engineNumber" character varying(30),
    "registrationNumber" character varying(30),
    "ownershipDocument" character varying(30),
    "registrationExpiry" date,
    transmission character varying(30),
    "fuelType" character varying(30),
    "engineCapacity" character varying(20),
    "currentOdometer" integer DEFAULT 0,
    "lastServiceDate" timestamp(3) without time zone,
    "lastServiceOdometer" integer,
    "nextServiceOdometer" integer,
    "nextServiceDate" timestamp(3) without time zone,
    "purchaseDate" date,
    "insuranceProvider" character varying(50),
    "insurancePolicyNo" character varying(30),
    "insuranceExpiry" date,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isPrimary" boolean DEFAULT false,
    remarks character varying(250),
    "vehicleImageURL" character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_CustomerVehicle" OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 110388)
-- Name: cmf_Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_Employee" (
    id character(20) NOT NULL,
    "employeeCode" character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    nickname character varying(50),
    email character varying(100),
    mobile character varying(20),
    phone character varying(20),
    "birthDate" date,
    gender character(1),
    "identityNumber" character varying(30),
    "taxNumber" character varying(30),
    address character varying(250),
    city character varying(50),
    province character varying(50),
    "postalCode" character(6),
    "joinDate" date,
    "resignDate" date,
    "employmentStatus" character varying(20),
    department character varying(50),
    "position" character varying(50),
    "bankName" character varying(50),
    "bankAccountNo" character varying(30),
    "bankAccountName" character varying(100),
    "photoURL" character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_Employee" OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 110474)
-- Name: cmf_Mechanic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_Mechanic" (
    id character(10) NOT NULL,
    employee_id character(20) NOT NULL,
    specialization character varying(100),
    level public."MechanicLevelEnum" DEFAULT 'JR'::public."MechanicLevelEnum",
    "totalJobs" integer DEFAULT 0,
    "averageRating" numeric(3,2),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isAvailable" boolean DEFAULT true,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_Mechanic" OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 110840)
-- Name: cmf_PaymentMethod; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_PaymentMethod" (
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    "methodType" public."PaymentMethodTypeEnum",
    "requireBankAccount" boolean DEFAULT false NOT NULL,
    "requireReference" boolean DEFAULT false NOT NULL,
    "processingFee" numeric(5,2),
    "fixedFee" numeric(21,4),
    seq integer DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."cmf_PaymentMethod" OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 110883)
-- Name: cmf_TaxScheme; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_TaxScheme" (
    id character(5) NOT NULL,
    "schemeCode" character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    "taxType" public."TaxTypeEnum" NOT NULL,
    category character varying(50),
    "isInclusive" boolean DEFAULT false NOT NULL,
    "defaultRate" numeric(5,2) NOT NULL,
    "isCompound" boolean DEFAULT false NOT NULL,
    "taxAccount_id" character(15),
    "isDefault" boolean DEFAULT false,
    "effectiveFrom" date,
    "effectiveTo" date,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_TaxScheme" OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 110894)
-- Name: cmf_TaxSchemeDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_TaxSchemeDetail" (
    id character(10) NOT NULL,
    "taxScheme_id" character(5) NOT NULL,
    "lineNumber" smallint NOT NULL,
    "componentName" character varying(100) NOT NULL,
    "componentName_en" character varying(100),
    "taxRate" numeric(5,2) NOT NULL,
    "taxAccount_id" character(15) NOT NULL,
    "calculationBase" character varying(20),
    "isAdditive" boolean DEFAULT true NOT NULL,
    seq smallint NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."cmf_TaxSchemeDetail" OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 110832)
-- Name: cmf_TransactionClass; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_TransactionClass" (
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    seq integer DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."cmf_TransactionClass" OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 110822)
-- Name: cmf_TransactionType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cmf_TransactionType" (
    id character(5) NOT NULL,
    name character varying(50) NOT NULL,
    category character varying(20),
    module character varying(20),
    "affectGL" boolean DEFAULT true NOT NULL,
    "requireApproval" boolean DEFAULT false NOT NULL,
    seq integer DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."cmf_TransactionType" OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 110290)
-- Name: imc_Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Brand" (
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Brand" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 110270)
-- Name: imc_Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Category" (
    type smallint NOT NULL,
    id character(10) NOT NULL,
    name character varying(80),
    seq integer DEFAULT 0,
    remarks character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "imageURL" character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    href character varying(150),
    icon character varying(50)
);


ALTER TABLE public."imc_Category" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 110262)
-- Name: imc_CategoryType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_CategoryType" (
    id smallint NOT NULL,
    name character varying(20),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    stock_acct character(10),
    sales_acct character(10),
    cogs_acct character(10),
    expense_acct character(10),
    asset_acct character(10),
    company_id character(5) NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone,
    branch_id character(10)
);


ALTER TABLE public."imc_CategoryType" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 110261)
-- Name: imc_CategoryType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."imc_CategoryType_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."imc_CategoryType_id_seq" OWNER TO postgres;

--
-- TOC entry 6525 (class 0 OID 0)
-- Dependencies: 245
-- Name: imc_CategoryType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."imc_CategoryType_id_seq" OWNED BY public."imc_CategoryType".id;


--
-- TOC entry 241 (class 1259 OID 110236)
-- Name: imc_Floor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Floor" (
    warehouse_id character(4) NOT NULL,
    id character(5) NOT NULL,
    name character(35),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Floor" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 110297)
-- Name: imc_Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Product" (
    id character(20) NOT NULL,
    register_id character(20),
    catalog_id character(20),
    name character varying(250) NOT NULL,
    category_id character(10) NOT NULL,
    "subCategory_id" character(10) NOT NULL,
    brand_id character(10) NOT NULL,
    uom_id character(10) NOT NULL,
    "eCatalogURL" character varying(250),
    remarks character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isMaterial" boolean DEFAULT false NOT NULL,
    "isService" boolean DEFAULT false NOT NULL,
    "isFeatured" boolean DEFAULT false,
    "isFinishing" boolean DEFAULT false NOT NULL,
    "isAccessories" boolean DEFAULT false NOT NULL,
    "createdBy" character(50),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(50),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Product" OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 110327)
-- Name: imc_ProductImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductImage" (
    id character(150) NOT NULL,
    product_id character(20) NOT NULL,
    "imageURL" character varying(250) NOT NULL,
    "isPrimary" boolean NOT NULL,
    "isBrochure" boolean,
    seq integer,
    "isVideo" boolean DEFAULT false,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10) NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductImage" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 110311)
-- Name: imc_ProductStock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductStock" (
    id character(20) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    warehouse_id character(4) NOT NULL,
    floor_id character(5) NOT NULL,
    shelf_id character(15) NOT NULL,
    row_id character(15) NOT NULL,
    batch_no character(20),
    "mExpired_dt" character(10) NOT NULL,
    "yExpired_dt" character(4) NOT NULL,
    product_cd character(20),
    i_month_expired integer,
    i_year_expired integer,
    req_qty numeric(12,4),
    po_qty numeric(12,4),
    grn_qty numeric(12,4),
    so_qty numeric(12,4),
    spk_qty numeric(12,4),
    sj_qty numeric(12,4),
    sl_invoice_qty numeric(12,4),
    sl_return_qty numeric(12,4),
    po_return_qty numeric(12,4),
    stock_opname_qty numeric(12,4),
    intern_receive_qty numeric(12,4),
    intern_issue_qty numeric(12,4),
    onhand_qty numeric(22,4),
    unit_cost numeric(21,4),
    selling_price numeric(21,4),
    "createdBy" character(50),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(50),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductStock" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 110318)
-- Name: imc_ProductStockCard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductStockCard" (
    customer_or_supplier_id character(20) NOT NULL,
    trx_id character(2) NOT NULL,
    trx_class character(2) NOT NULL,
    module_id character(2) NOT NULL,
    is_in_or_out character(1) NOT NULL,
    doc_year smallint NOT NULL,
    doc_month smallint NOT NULL,
    doc_date timestamp(3) without time zone NOT NULL,
    doc_id character(20) NOT NULL,
    descs character varying(250),
    mutation_id character(20) NOT NULL,
    mutation_date timestamp(3) without time zone NOT NULL,
    ref_id character(20) NOT NULL,
    ref_date timestamp(3) without time zone NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    warehouse_id character(4) NOT NULL,
    to_warehouse_id character(4) NOT NULL,
    srn_seq smallint NOT NULL,
    product_id character(20) NOT NULL,
    qty numeric(12,4) NOT NULL,
    mutation_qty numeric(12,4) NOT NULL,
    unit_cost numeric(21,4),
    mutation_cost numeric(21,4),
    floor_id character(5) NOT NULL,
    shelf_id character(15) NOT NULL,
    row_id character(15) NOT NULL,
    batch_no_item character(20) NOT NULL,
    "mExpired_dt" character(10) NOT NULL,
    "yExpired_dt" character(4) NOT NULL,
    product_cd character(20),
    i_month_expired smallint,
    i_year_expired integer,
    selling_price numeric(21,4),
    "createdBy" character(50),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(50),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductStockCard" OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 110361)
-- Name: imc_ProductVariant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductVariant" (
    id character(30) NOT NULL,
    product_id character(20) NOT NULL,
    sku character varying(50) NOT NULL,
    barcode character varying(50),
    name character varying(250),
    "additionalPrice" numeric(21,4),
    "stockQty" numeric(12,4),
    weight numeric(10,2),
    length numeric(10,2),
    width numeric(10,2),
    height numeric(10,2),
    "imageURL" character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isDefault" boolean DEFAULT false,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductVariant" OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 110376)
-- Name: imc_ProductVariantImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductVariantImage" (
    id character(150) NOT NULL,
    "productVariant_id" character(30) NOT NULL,
    product_id character(20) NOT NULL,
    "imageURL" character varying(250) NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    seq integer DEFAULT 0,
    "isVideo" boolean DEFAULT false,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductVariantImage" OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 110371)
-- Name: imc_ProductVariantOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductVariantOption" (
    "productVariant_id" character(30) NOT NULL,
    product_id character(20) NOT NULL,
    "variantType_id" character(10) NOT NULL,
    "variantOption_id" character(15) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductVariantOption" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 110352)
-- Name: imc_ProductVariantType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_ProductVariantType" (
    product_id character(20) NOT NULL,
    "variantType_id" character(10) NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    seq integer DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_ProductVariantType" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 110248)
-- Name: imc_Row; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Row" (
    floor_id character(5) NOT NULL,
    shelf_id character(15) NOT NULL,
    id character(15) NOT NULL,
    name character(35),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    storages character(15)
);


ALTER TABLE public."imc_Row" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 110242)
-- Name: imc_Shelf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Shelf" (
    floor_id character(5) NOT NULL,
    id character(15) NOT NULL,
    name character(35),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Shelf" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 110280)
-- Name: imc_SubCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_SubCategory" (
    id character(10) NOT NULL,
    seq integer DEFAULT 0,
    "imageURL" character varying(250),
    category_id character(10) NOT NULL,
    name character varying(80) NOT NULL,
    descriptions character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_SubCategory" OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 110254)
-- Name: imc_Uom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Uom" (
    id character(10) NOT NULL,
    name character varying(50),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Uom" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 110342)
-- Name: imc_VariantOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_VariantOption" (
    id character(15) NOT NULL,
    "variantType_id" character(10) NOT NULL,
    name character varying(100) NOT NULL,
    code character(20),
    "hexColorCode" character(7),
    "imageURL" character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_VariantOption" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 110334)
-- Name: imc_VariantType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_VariantType" (
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_VariantType" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 110230)
-- Name: imc_Warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."imc_Warehouse" (
    id character(4) NOT NULL,
    name character(60),
    "iMain" integer,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    address character varying(250),
    "postalCode" character(6),
    phone character(12),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."imc_Warehouse" OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 110799)
-- Name: inv_InternalMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."inv_InternalMovement" (
    id character(30) NOT NULL,
    "movementNumber" character varying(30) NOT NULL,
    "movementDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "movementType" public."InternalMovementTypeEnum" NOT NULL,
    "transactionType" public."TransactionTypeEnum" NOT NULL,
    "sourceWarehouse_id" character(4),
    "destWarehouse_id" character(4),
    "sourceLocation" character varying(100),
    "destLocation" character varying(100),
    "referenceNumber" character varying(30),
    "referenceType" character varying(20),
    "requestedBy" character(10),
    "requestDate" timestamp(3) without time zone,
    "approvedBy" character(10),
    "approvedDate" timestamp(3) without time zone,
    "executedBy" character(10),
    "executedDate" timestamp(3) without time zone,
    "vehicleNumber" character varying(15),
    "driverName" character varying(100),
    "movementStatus" public."MovementStatusEnum" DEFAULT '0'::public."MovementStatusEnum" NOT NULL,
    "postingStatus" public."PostingStatusEnum" DEFAULT '0'::public."PostingStatusEnum",
    "postedBy" character(10),
    "postedDate" timestamp(3) without time zone,
    reason text,
    notes text,
    "internalNotes" text,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."inv_InternalMovement" OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 110811)
-- Name: inv_InternalMovementDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."inv_InternalMovementDetail" (
    id character(30) NOT NULL,
    "internalMovement_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    product_id character(20) NOT NULL,
    "productVariant_id" character(30),
    "productName" character varying(250) NOT NULL,
    "productCode" character varying(50),
    "requestedQty" numeric(12,4) NOT NULL,
    "movedQty" numeric(12,4) NOT NULL,
    "receivedQty" numeric(12,4) DEFAULT 0,
    uom character varying(10) NOT NULL,
    "sourceWarehouse_id" character(4),
    "sourceFloor_id" character(5),
    "sourceShelf_id" character(15),
    "sourceRow_id" character(15),
    "destWarehouse_id" character(4),
    "destFloor_id" character(5),
    "destShelf_id" character(15),
    "destRow_id" character(15),
    "batchNumber" character varying(30),
    "serialNumber" character varying(50),
    "expiryDate" date,
    "unitCost" numeric(21,4),
    "totalCost" numeric(21,4),
    "adjustmentValue" numeric(21,4),
    "lineStatus" public."MovementDetailStatusEnum" DEFAULT '0'::public."MovementDetailStatusEnum",
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."inv_InternalMovementDetail" OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 110721)
-- Name: prc_PurchaseOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseOrder" (
    id character(20) NOT NULL,
    "poNumber" character varying(30) NOT NULL,
    "poDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    supplier_id character(20) NOT NULL,
    "requisitionNumber" character varying(30),
    "quotationNumber" character varying(30),
    "requestedDeliveryDate" date,
    "expectedDeliveryDate" date,
    warehouse_id character(4),
    "deliveryAddress" character varying(250),
    "buyerName" character varying(100),
    "supplierContactPerson" character varying(100),
    "supplierPhone" character varying(20),
    "paymentTermDays" smallint,
    "paymentMethod" character varying(30),
    "downPaymentPercent" numeric(5,2) DEFAULT 0,
    "downPaymentAmount" numeric(21,4) DEFAULT 0,
    "subtotalAmount" numeric(21,4) DEFAULT 0,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "shippingCost" numeric(21,4) DEFAULT 0,
    "otherCost" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) DEFAULT 0,
    "poStatus" public."PurchaseOrderStatusEnum" DEFAULT '0'::public."PurchaseOrderStatusEnum" NOT NULL,
    "approvalStatus" public."ApprovalStatusEnum" DEFAULT '0'::public."ApprovalStatusEnum",
    "receiveStatus" public."ReceiveStatusEnum" DEFAULT '0'::public."ReceiveStatusEnum",
    "paymentStatus" public."PaymentStatusEnum" DEFAULT '0'::public."PaymentStatusEnum",
    "approvedBy" character(10),
    "approvedDate" timestamp(3) without time zone,
    "approvalNotes" text,
    "cancelledBy" character(10),
    "cancelledDate" timestamp(3) without time zone,
    "cancelReason" character varying(250),
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseOrder" OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 110746)
-- Name: prc_PurchaseOrderDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseOrderDetail" (
    id character(30) NOT NULL,
    "purchaseOrder_id" character(20) NOT NULL,
    "lineNumber" smallint NOT NULL,
    product_id character(20) NOT NULL,
    "productVariant_id" character(30),
    "productName" character varying(250) NOT NULL,
    "productCode" character varying(50),
    "productDescription" text,
    "supplierPartNumber" character varying(50),
    "supplierProductName" character varying(250),
    "orderedQty" numeric(12,4) NOT NULL,
    "receivedQty" numeric(12,4) DEFAULT 0,
    "outstandingQty" numeric(12,4),
    uom character varying(10) NOT NULL,
    "unitPrice" numeric(21,4) NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    "requestedDate" date,
    "expectedDate" date,
    "lineStatus" public."PODetailStatusEnum" DEFAULT '0'::public."PODetailStatusEnum",
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseOrderDetail" OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 110762)
-- Name: prc_PurchaseReceive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseReceive" (
    id character(20) NOT NULL,
    "receiveNumber" character varying(30) NOT NULL,
    "receiveDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "purchaseOrder_id" character(20) NOT NULL,
    supplier_id character(20) NOT NULL,
    "supplierInvoiceNumber" character varying(30),
    "supplierInvoiceDate" date,
    "deliveryNoteNumber" character varying(30),
    warehouse_id character(4),
    "receivedBy" character(10),
    "vehicleNumber" character varying(15),
    "driverName" character varying(100),
    "driverPhone" character varying(20),
    "inspectedBy" character(10),
    "inspectionDate" timestamp(3) without time zone,
    "inspectionNotes" text,
    "qualityStatus" public."QualityStatusEnum" DEFAULT '0'::public."QualityStatusEnum",
    "subtotalAmount" numeric(21,4) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "shippingCost" numeric(21,4) DEFAULT 0,
    "otherCost" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) DEFAULT 0,
    "receiveStatus" public."ReceiveStatusEnum" DEFAULT '1'::public."ReceiveStatusEnum" NOT NULL,
    "postingStatus" public."PostingStatusEnum" DEFAULT '0'::public."PostingStatusEnum",
    "postedBy" character(10),
    "postedDate" timestamp(3) without time zone,
    "hasReturn" boolean DEFAULT false,
    "returnReason" character varying(250),
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseReceive" OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 110783)
-- Name: prc_PurchaseReceiveDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseReceiveDetail" (
    id character(30) NOT NULL,
    "purchaseReceive_id" character(20) NOT NULL,
    "purchaseOrderDetail_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    product_id character(20) NOT NULL,
    "productVariant_id" character(30),
    "productName" character varying(250) NOT NULL,
    "productCode" character varying(50),
    "orderedQty" numeric(12,4) NOT NULL,
    "receivedQty" numeric(12,4) NOT NULL,
    "acceptedQty" numeric(12,4),
    "rejectedQty" numeric(12,4) DEFAULT 0,
    "damagedQty" numeric(12,4) DEFAULT 0,
    uom character varying(10) NOT NULL,
    warehouse_id character(4),
    floor_id character(5),
    shelf_id character(15),
    row_id character(15),
    "batchNumber" character varying(30),
    "manufactureDate" date,
    "expiryDate" date,
    "unitPrice" numeric(21,4) NOT NULL,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    "qualityStatus" public."QualityStatusEnum" DEFAULT '0'::public."QualityStatusEnum",
    "rejectionReason" character varying(250),
    "qualityNotes" text,
    "lineStatus" public."ReceiveDetailStatusEnum" DEFAULT '0'::public."ReceiveDetailStatusEnum",
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseReceiveDetail" OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 111040)
-- Name: prc_PurchaseReturn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseReturn" (
    id character(30) NOT NULL,
    "returnNumber" character varying(30) NOT NULL,
    "returnDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "purchaseReceive_id" character(20) NOT NULL,
    "purchaseOrder_id" character(20),
    supplier_id character(20) NOT NULL,
    "receiveNumber" character varying(30),
    "poNumber" character varying(30),
    "supplierReturnNumber" character varying(30),
    "returnReason" public."ReturnReasonEnum",
    "returnReasonDesc" text,
    warehouse_id character(4),
    "subtotalAmount" numeric(21,4) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) NOT NULL,
    "returnStatus" public."ReturnStatusEnum" DEFAULT '0'::public."ReturnStatusEnum" NOT NULL,
    "approvalStatus" public."ApprovalStatusEnum" DEFAULT '0'::public."ApprovalStatusEnum",
    "approvedBy" character(10),
    "approvedDate" timestamp(3) without time zone,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseReturn" OWNER TO postgres;

--
-- TOC entry 312 (class 1259 OID 111056)
-- Name: prc_PurchaseReturnDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_PurchaseReturnDetail" (
    id character(30) NOT NULL,
    "purchaseReturn_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    product_id character(20) NOT NULL,
    "productVariant_id" character(30),
    "productName" character varying(250) NOT NULL,
    "productCode" character varying(50),
    "returnedQty" numeric(12,4) NOT NULL,
    "acceptedQty" numeric(12,4),
    "rejectedQty" numeric(12,4) DEFAULT 0,
    uom character varying(10) NOT NULL,
    "unitPrice" numeric(21,4) NOT NULL,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    "returnReason" character varying(250),
    warehouse_id character(4),
    floor_id character(5),
    shelf_id character(15),
    row_id character(15),
    "batchNumber" character varying(30),
    "lineStatus" public."ReturnDetailStatusEnum" DEFAULT '0'::public."ReturnDetailStatusEnum",
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_PurchaseReturnDetail" OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 110705)
-- Name: prc_Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."prc_Supplier" (
    id character(20) NOT NULL,
    "supplierCode" character(20),
    "supplierType" public."SupplierTypeEnum" DEFAULT 'V'::public."SupplierTypeEnum" NOT NULL,
    name character varying(150) NOT NULL,
    "legalName" character varying(150),
    nickname character varying(50),
    "contactPerson" character varying(100),
    "contactPosition" character varying(50),
    phone1 character varying(20),
    phone2 character varying(20),
    mobile1 character varying(20),
    mobile2 character varying(20),
    email character varying(100),
    website character varying(100),
    province character varying(50),
    district character varying(50),
    city character varying(50),
    "subDistrict" character varying(50),
    address1 character varying(250),
    address2 character varying(250),
    "postalCode" character(6),
    "taxNumber" character varying(30),
    "taxName" character varying(150),
    "taxAddress" character varying(250),
    "bankName" character varying(50),
    "bankBranch" character varying(50),
    "accountNumber" character varying(30),
    "accountName" character varying(100),
    "paymentTermDays" smallint DEFAULT 30,
    "creditLimit" numeric(21,4),
    "currentDebt" numeric(21,4) DEFAULT 0,
    "supplierRating" numeric(3,2),
    "totalPurchase" numeric(21,4) DEFAULT 0,
    "totalTransaction" integer DEFAULT 0,
    "lastPurchaseDate" timestamp(3) without time zone,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isPreferred" boolean DEFAULT false,
    "isBlacklisted" boolean DEFAULT false,
    "blacklistReason" character varying(250),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."prc_Supplier" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 110064)
-- Name: saas_AddonFeature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_AddonFeature" (
    id character(10) NOT NULL,
    "addonCode" character varying(30) NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(30),
    description text,
    description_en text,
    "monthlyPrice" numeric(21,4) NOT NULL,
    "yearlyPrice" numeric(21,4),
    currency character(3) DEFAULT 'IDR'::bpchar NOT NULL,
    "additionalLimit" integer,
    "limitType" character varying(20),
    "availableForLite" boolean DEFAULT true NOT NULL,
    "availableForPro" boolean DEFAULT true NOT NULL,
    "availableForEnterprise" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 0,
    "isPopular" boolean DEFAULT false,
    "iconName" character varying(50),
    "isActive" boolean DEFAULT true NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."saas_AddonFeature" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 110080)
-- Name: saas_CompanyAddon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_CompanyAddon" (
    id character(30) NOT NULL,
    subscription_id character(30) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    addon_id character(10) NOT NULL,
    "activatedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" date,
    "isActive" boolean DEFAULT true NOT NULL,
    "monthlyPrice" numeric(21,4) NOT NULL,
    "yearlyPrice" numeric(21,4),
    "lastBilledDate" timestamp(3) without time zone,
    "nextBillingDate" timestamp(3) without time zone,
    "addonStatus" public."AddonStatusEnum" DEFAULT 'A'::public."AddonStatusEnum" NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."saas_CompanyAddon" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 110002)
-- Name: saas_CompanySubscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_CompanySubscription" (
    id character(30) NOT NULL,
    "subscriptionNumber" character varying(30) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    plan_id character(10) NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "billingCycle" public."BillingCycleEnum" NOT NULL,
    "monthlyPrice" numeric(21,4) NOT NULL,
    "yearlyPrice" numeric(21,4),
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "finalPrice" numeric(21,4) NOT NULL,
    "autoRenewal" boolean DEFAULT true NOT NULL,
    "renewalDate" date,
    "isTrialPeriod" boolean DEFAULT false,
    "trialEndDate" date,
    "subscriptionStatus" public."SubscriptionStatusEnum" DEFAULT 'A'::public."SubscriptionStatusEnum" NOT NULL,
    "isCancelled" boolean DEFAULT false,
    "cancelledDate" timestamp(3) without time zone,
    "cancelReason" text,
    "notifyBeforeExpiry" smallint DEFAULT 7,
    "lastNotificationDate" timestamp(3) without time zone,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."saas_CompanySubscription" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 110018)
-- Name: saas_PlanFeature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_PlanFeature" (
    id character(20) NOT NULL,
    plan_id character(10) NOT NULL,
    "featureCode" character varying(30) NOT NULL,
    "featureName" character varying(100) NOT NULL,
    "featureName_en" character varying(100),
    category character varying(30),
    "isEnabled" boolean DEFAULT true NOT NULL,
    "customLimit" integer,
    description text,
    seq integer DEFAULT 0,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."saas_PlanFeature" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 110029)
-- Name: saas_SubscriptionBilling; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_SubscriptionBilling" (
    id character(30) NOT NULL,
    "billingNumber" character varying(30) NOT NULL,
    "billingDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" date NOT NULL,
    subscription_id character(30) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    "periodStart" date NOT NULL,
    "periodEnd" date NOT NULL,
    "billingCycle" public."BillingCycleEnum" NOT NULL,
    "baseAmount" numeric(21,4) NOT NULL,
    "additionalCharges" numeric(21,4) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) NOT NULL,
    "paidAmount" numeric(21,4) DEFAULT 0,
    "outstandingAmount" numeric(21,4),
    "paymentMethod" character varying(30),
    "paymentDate" timestamp(3) without time zone,
    "paymentReference" character varying(50),
    "billingStatus" public."BillingStatusEnum" DEFAULT '0'::public."BillingStatusEnum" NOT NULL,
    "isPosted" boolean DEFAULT false,
    "postedDate" timestamp(3) without time zone,
    notes text,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."saas_SubscriptionBilling" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 109989)
-- Name: saas_SubscriptionPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_SubscriptionPlan" (
    id character(10) NOT NULL,
    "planCode" character varying(20) NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    description_en text,
    "monthlyPrice" numeric(21,4) NOT NULL,
    "yearlyPrice" numeric(21,4) NOT NULL,
    "yearlyMonthlyEquiv" numeric(21,4),
    "discountYearly" numeric(5,2),
    currency character(3) DEFAULT 'IDR'::bpchar NOT NULL,
    "maxUsers" integer,
    "maxBranches" integer,
    "maxProducts" integer,
    "maxCustomers" integer,
    "maxVehicles" integer,
    "maxTransactions" integer,
    "storageLimit" integer,
    features jsonb,
    "displayOrder" integer DEFAULT 0,
    "isPopular" boolean DEFAULT false,
    "highlightText" character varying(100),
    "isActive" boolean DEFAULT true NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."saas_SubscriptionPlan" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 110045)
-- Name: saas_UsageTracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."saas_UsageTracking" (
    id character(30) NOT NULL,
    subscription_id character(30) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    "trackingDate" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalUsers" integer DEFAULT 0,
    "totalBranches" integer DEFAULT 0,
    "totalProducts" integer DEFAULT 0,
    "totalCustomers" integer DEFAULT 0,
    "totalVehicles" integer DEFAULT 0,
    "totalTransactions" integer DEFAULT 0,
    "storageUsed" numeric(10,2) DEFAULT 0,
    "monthlyServiceOrders" integer DEFAULT 0,
    "monthlyInvoices" integer DEFAULT 0,
    "monthlyPurchaseOrders" integer DEFAULT 0,
    "isOverLimit" boolean DEFAULT false,
    "alertSent" boolean DEFAULT false,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."saas_UsageTracking" OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 128649)
-- Name: sys_Branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Branch" (
    company_id character(5) NOT NULL,
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    "isMain" boolean DEFAULT false,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(255),
    province character varying(50),
    district character varying(50),
    city character varying(50),
    address1 character varying(250),
    address2 character varying(250),
    address3 character varying(250),
    "postalCode" character(6),
    phone1 character varying(20),
    phone2 character varying(20),
    phone3 character varying(20),
    mobile1 character varying(20),
    mobile2 character varying(20),
    mobile3 character varying(20),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."sys_Branch" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 110090)
-- Name: sys_Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Company" (
    seq_no smallint NOT NULL,
    id character(5) NOT NULL,
    name character varying(50),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isMain" boolean DEFAULT false,
    email1 character varying(100),
    email2 character varying(100),
    email3 character varying(100),
    "officialWebsite" character varying(100),
    "companyLogo" character varying(255),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."sys_Company" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 110129)
-- Name: sys_EmailVerification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_EmailVerification" (
    id character varying(50) NOT NULL,
    user_id smallint NOT NULL,
    token character varying(255) NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_EmailVerification" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 110177)
-- Name: sys_Menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Menu" (
    id smallint NOT NULL,
    parent_id smallint,
    menu_description character varying(255) NOT NULL,
    href character varying(255),
    module_id character(3) NOT NULL,
    menu_type character varying(50),
    has_child boolean DEFAULT false NOT NULL,
    icon character varying(50),
    "iStatus" text DEFAULT '1'::text NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."sys_Menu" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 110187)
-- Name: sys_Menu_Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Menu_Permission" (
    id integer NOT NULL,
    "userCompanyRole_id" integer NOT NULL,
    menu_id integer NOT NULL,
    can_view boolean DEFAULT false NOT NULL,
    can_create boolean DEFAULT false NOT NULL,
    can_edit boolean DEFAULT false NOT NULL,
    can_delete boolean DEFAULT false NOT NULL,
    can_print boolean DEFAULT false NOT NULL,
    can_approve boolean DEFAULT false NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."sys_Menu_Permission" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 110201)
-- Name: sys_Migration_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Migration_log" (
    id integer NOT NULL,
    "from_tableName" text NOT NULL,
    "to_tableName" text NOT NULL,
    "migratedAt" timestamp(3) without time zone NOT NULL,
    status text NOT NULL
);


ALTER TABLE public."sys_Migration_log" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 110200)
-- Name: sys_Migration_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."sys_Migration_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."sys_Migration_log_id_seq" OWNER TO postgres;

--
-- TOC entry 6526 (class 0 OID 0)
-- Dependencies: 236
-- Name: sys_Migration_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."sys_Migration_log_id_seq" OWNED BY public."sys_Migration_log".id;


--
-- TOC entry 238 (class 1259 OID 110209)
-- Name: sys_Module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Module" (
    id character(3) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public."sys_Module" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 110214)
-- Name: sys_Numbering; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Numbering" (
    module_id character varying(3) NOT NULL,
    id character varying(10) NOT NULL,
    description character varying(100),
    prefix character varying(10),
    delimiter character varying(5) DEFAULT '/'::character varying NOT NULL,
    "includeYear" boolean DEFAULT true NOT NULL,
    "includeMonth" boolean DEFAULT true NOT NULL,
    "startNumber" integer DEFAULT 1 NOT NULL,
    "currentNumber" integer DEFAULT 0 NOT NULL,
    "sequenceLength" integer DEFAULT 5 NOT NULL,
    "resetAt" public."DocumentResetEnum" DEFAULT 'M'::public."DocumentResetEnum" NOT NULL,
    format character varying(50) NOT NULL,
    "sampleOutput" character varying(50),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."sys_Numbering" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 110143)
-- Name: sys_PasswordReset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_PasswordReset" (
    id integer NOT NULL,
    user_id smallint NOT NULL,
    token character varying(255) NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    used boolean DEFAULT false NOT NULL,
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_PasswordReset" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 110142)
-- Name: sys_PasswordReset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."sys_PasswordReset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."sys_PasswordReset_id_seq" OWNER TO postgres;

--
-- TOC entry 6527 (class 0 OID 0)
-- Dependencies: 229
-- Name: sys_PasswordReset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."sys_PasswordReset_id_seq" OWNED BY public."sys_PasswordReset".id;


--
-- TOC entry 279 (class 1259 OID 110590)
-- Name: sys_Reminder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Reminder" (
    id character(30) NOT NULL,
    "reminderNumber" character varying(30) NOT NULL,
    "entityType" public."ReminderEntityTypeEnum" NOT NULL,
    entity_id character(30) NOT NULL,
    "reminderType" public."ReminderTypeEnum" DEFAULT 'SCH'::public."ReminderTypeEnum" NOT NULL,
    title character varying(250) NOT NULL,
    message text,
    "scheduledDate" timestamp(3) without time zone,
    "scheduledTime" character varying(10),
    "sendBeforeDays" smallint,
    "sendBeforeHours" smallint,
    customer_id character(20),
    "recipientPhone" character varying(20),
    "recipientEmail" character varying(100),
    channels character varying(50),
    status public."ReminderStatusEnum" DEFAULT 'P'::public."ReminderStatusEnum" NOT NULL,
    "lastAttemptAt" timestamp(3) without time zone,
    "lastSentAt" timestamp(3) without time zone,
    "sentCount" smallint DEFAULT 0 NOT NULL,
    "maxRetries" smallint DEFAULT 3 NOT NULL,
    "retryCount" smallint DEFAULT 0 NOT NULL,
    "failureReason" character varying(250),
    "isRead" boolean DEFAULT false,
    "readAt" timestamp(3) without time zone,
    "actionTaken" boolean DEFAULT false,
    "actionTakenAt" timestamp(3) without time zone,
    "actionNotes" text,
    metadata jsonb,
    "isRecurring" boolean DEFAULT false,
    "recurringInterval" smallint,
    "recurringEndDate" timestamp(3) without time zone,
    "nextRecurringDate" timestamp(3) without time zone,
    "parentReminder_id" character(30),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."sys_Reminder" OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 110608)
-- Name: sys_ReminderLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_ReminderLog" (
    id character(30) NOT NULL,
    reminder_id character(30) NOT NULL,
    "logType" public."ReminderLogTypeEnum" DEFAULT 'S'::public."ReminderLogTypeEnum" NOT NULL,
    channel public."ReminderChannelEnum" NOT NULL,
    "sentAt" timestamp(3) without time zone,
    message text,
    recipient character varying(100),
    status character varying(50),
    "responseCode" character varying(20),
    "responseMessage" text,
    "errorMessage" text,
    "externalId" character varying(100),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."sys_ReminderLog" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 110106)
-- Name: sys_Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Role" (
    id character(20) NOT NULL,
    name character varying(20) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(255),
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_Role" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 110151)
-- Name: sys_Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_Session" (
    id character varying(50) NOT NULL,
    user_id integer NOT NULL,
    "refreshToken" character varying(500) NOT NULL,
    "deviceName" character varying(255),
    "deviceType" character varying(50),
    browser character varying(100),
    os character varying(100),
    "ipAddress" character varying(45),
    "userAgent" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastActivityAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "revokedReason" character varying(255),
    "hasRefreshedToken" boolean DEFAULT false NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_Session" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 110135)
-- Name: sys_TwoFactorToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_TwoFactorToken" (
    id character varying(50) NOT NULL,
    user_id smallint NOT NULL,
    code character varying(6) NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_TwoFactorToken" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 110118)
-- Name: sys_User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_User" (
    id smallint NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    image character varying(255),
    password character varying(255) NOT NULL,
    "hashedRefreshToken" character varying(255),
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    employee_id character(20),
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_User" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 110170)
-- Name: sys_UserCompanyRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_UserCompanyRole" (
    id smallint NOT NULL,
    "userRole_id" smallint NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isDefault" boolean DEFAULT false
);


ALTER TABLE public."sys_UserCompanyRole" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 110163)
-- Name: sys_UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_UserRole" (
    id smallint NOT NULL,
    user_id smallint NOT NULL,
    role_id character(20) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isDefault" boolean DEFAULT false,
    company_id character(5),
    branch_id character(10)
);


ALTER TABLE public."sys_UserRole" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 110112)
-- Name: sys_WhiteListEmail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sys_WhiteListEmail" (
    id smallint NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."sys_WhiteListEmail" OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 110514)
-- Name: wks_BayBlock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_BayBlock" (
    id character(20) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    bay_id character(10) NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    reason character varying(100),
    remarks character varying(250),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."wks_BayBlock" OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 110520)
-- Name: wks_BookingSlot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_BookingSlot" (
    id character(20) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    bay_id character(10),
    date date NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    capacity integer DEFAULT 1 NOT NULL,
    "bookedCount" integer DEFAULT 0 NOT NULL,
    "slotStatus" public."SlotStatusEnum" DEFAULT 'OPEN'::public."SlotStatusEnum" NOT NULL,
    remarks character varying(250),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."wks_BookingSlot" OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 110500)
-- Name: wks_BranchHoliday; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_BranchHoliday" (
    id character(20) NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10),
    date date NOT NULL,
    name character varying(100),
    "isClosed" boolean DEFAULT true NOT NULL,
    remarks character varying(250),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."wks_BranchHoliday" OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 110493)
-- Name: wks_BranchWorkingHour; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_BranchWorkingHour" (
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    weekday smallint NOT NULL,
    "isOpen" boolean DEFAULT true NOT NULL,
    "openTime" character(5),
    "closeTime" character(5),
    "bookingBufferMinutes" integer DEFAULT 0,
    remarks character varying(250)
);


ALTER TABLE public."wks_BranchWorkingHour" OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 110636)
-- Name: wks_ComplaintLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ComplaintLog" (
    id character(30) NOT NULL,
    complaint_id character(30) NOT NULL,
    "logDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "logType" public."ComplaintLogTypeEnum" NOT NULL,
    "oldStatus" public."ComplaintStatusEnum",
    "newStatus" public."ComplaintStatusEnum",
    action character varying(100),
    description text,
    "actionBy" character(10),
    "isInternal" boolean DEFAULT false,
    attachments text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ComplaintLog" OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 110619)
-- Name: wks_CustomerComplaint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_CustomerComplaint" (
    id character(30) NOT NULL,
    "complaintNumber" character varying(30) NOT NULL,
    "complaintDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "serviceOrder_id" character(20),
    customer_id character(20) NOT NULL,
    "customerVehicle_id" character(20),
    vehicle_customer_id character(20),
    "complaintType" public."ComplaintTypeEnum",
    "complaintCategory" character varying(50),
    subject character varying(250) NOT NULL,
    description text NOT NULL,
    severity public."SeverityEnum" DEFAULT 'M'::public."SeverityEnum",
    "customerName" character varying(100),
    "customerPhone" character varying(20),
    "customerEmail" character varying(100),
    "preferredContactMethod" character varying(20),
    "complaintSource" public."ComplaintSourceEnum",
    "occurredDate" timestamp(3) without time zone,
    "reportedBy" character varying(100),
    attachments text,
    "witnessName" character varying(100),
    "witnessContact" character varying(50),
    "assignedTo" character(10),
    "assignedDate" timestamp(3) without time zone,
    department character varying(50),
    "investigationNotes" text,
    "rootCause" text,
    "resolutionDescription" text,
    "resolutionDate" timestamp(3) without time zone,
    "resolvedBy" character(10),
    "compensationType" character varying(50),
    "compensationAmount" numeric(21,4),
    "compensationNotes" text,
    "followUpRequired" boolean DEFAULT false,
    "followUpDate" timestamp(3) without time zone,
    "followUpBy" character(10),
    "followUpNotes" text,
    "resolutionRating" smallint,
    "customerFeedback" text,
    "isSatisfied" boolean,
    "complaintStatus" public."ComplaintStatusEnum" DEFAULT '0'::public."ComplaintStatusEnum" NOT NULL,
    priority public."PriorityEnum" DEFAULT 'N'::public."PriorityEnum",
    "targetResolutionDate" timestamp(3) without time zone,
    "isOverdue" boolean DEFAULT false,
    "isEscalated" boolean DEFAULT false,
    "escalatedTo" character(10),
    "escalatedDate" timestamp(3) without time zone,
    "escalationReason" character varying(250),
    "preventiveAction" text,
    "implementedBy" character(10),
    "implementedDate" timestamp(3) without time zone,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_CustomerComplaint" OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 110507)
-- Name: wks_MechanicAvailability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_MechanicAvailability" (
    id character(20) NOT NULL,
    company_id character(5) NOT NULL,
    mechanic_id character(10) NOT NULL,
    date date NOT NULL,
    "availableStart" character(5),
    "availableEnd" character(5),
    "isAvailable" boolean DEFAULT true NOT NULL,
    reason character varying(100),
    remarks character varying(250),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."wks_MechanicAvailability" OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 110484)
-- Name: wks_ServiceBay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceBay" (
    id character(10) NOT NULL,
    name character varying(50) NOT NULL,
    "bayType" public."ServiceBayTypeEnum",
    capacity integer DEFAULT 1,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    "isOccupied" boolean DEFAULT false,
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceBay" OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 110529)
-- Name: wks_ServiceBooking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceBooking" (
    id character(30) NOT NULL,
    "bookingNumber" character varying(30) NOT NULL,
    "bookingDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL,
    customer_id character(20) NOT NULL,
    "customerVehicle_id" character(20) NOT NULL,
    vehicle_customer_id character(20) NOT NULL,
    "preferredDate" date,
    "preferredStartTime" character(5),
    "preferredEndTime" character(5),
    "scheduledStart" timestamp(3) without time zone,
    "scheduledEnd" timestamp(3) without time zone,
    bay_id character(10),
    mechanic_id character(10),
    "serviceType_id" character(10),
    "complaintNotes" text,
    "additionalRequest" text,
    status public."BookingStatusEnum" DEFAULT '0'::public."BookingStatusEnum" NOT NULL,
    source public."BookingSourceEnum" DEFAULT 'WEB'::public."BookingSourceEnum" NOT NULL,
    "reminderSent" boolean DEFAULT false,
    "checkInAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "cancelReason" character varying(250),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."wks_ServiceBooking" OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 110580)
-- Name: wks_ServiceHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceHistory" (
    id character(30) NOT NULL,
    "serviceOrder_id" character(20) NOT NULL,
    customer_id character(20) NOT NULL,
    "customerVehicle_id" character(20) NOT NULL,
    vehicle_customer_id character(20) NOT NULL,
    "serviceDate" timestamp(3) without time zone NOT NULL,
    "orderNumber" character varying(30) NOT NULL,
    "serviceSummary" text,
    "partsReplaced" text,
    "odometerReading" integer,
    "totalServiceCost" numeric(21,4),
    "totalPartsCost" numeric(21,4),
    "totalAmount" numeric(21,4),
    "nextServiceDate" timestamp(3) without time zone,
    "nextServiceOdometer" integer,
    "mechanicName" character varying(100),
    "customerRating" smallint,
    "customerFeedback" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceHistory" OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 110543)
-- Name: wks_ServiceOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceOrder" (
    id character(30) NOT NULL,
    "orderNumber" character varying(30) NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    customer_id character(20) NOT NULL,
    "customerVehicle_id" character(20) NOT NULL,
    vehicle_customer_id character(20) NOT NULL,
    "odometerIn" integer,
    "fuelLevel" public."FuelLevelEnum" DEFAULT 'E'::public."FuelLevelEnum",
    "vehicleConditionNotes" text,
    mechanic_id character(10),
    "serviceBay_id" character(10),
    "scheduledStartDate" timestamp(3) without time zone,
    "scheduledEndDate" timestamp(3) without time zone,
    "actualStartDate" timestamp(3) without time zone,
    "actualEndDate" timestamp(3) without time zone,
    "estimatedDuration" integer,
    "actualDuration" integer,
    "customerComplaint" text,
    "serviceRequest" text,
    "mechanicDiagnosis" text,
    "mechanicRecommendation" text,
    "serviceCost" numeric(21,4) DEFAULT 0,
    "partsCost" numeric(21,4) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    "totalAmount" numeric(21,4) DEFAULT 0,
    "orderStatus" public."ServiceOrderStatusEnum" DEFAULT '0'::public."ServiceOrderStatusEnum" NOT NULL,
    "paymentStatus" public."PaymentStatusEnum" DEFAULT '0'::public."PaymentStatusEnum",
    priority public."PriorityEnum" DEFAULT 'N'::public."PriorityEnum",
    "qcCheckedBy" character(10),
    "qcCheckedDate" timestamp(3) without time zone,
    "qcNotes" text,
    "qcApproved" boolean DEFAULT false,
    "customerRating" smallint,
    "customerFeedback" text,
    "customerSignature" character varying(250),
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceOrder" OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 110564)
-- Name: wks_ServiceOrderDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceOrderDetail" (
    id character(30) NOT NULL,
    "serviceOrder_id" character(20) NOT NULL,
    "lineNumber" smallint NOT NULL,
    "detailType" public."DetailTypeEnum" NOT NULL,
    "serviceType_id" character(10),
    "serviceName" character varying(100),
    "serviceDescription" text,
    product_id character(20),
    "productVariant_id" character(30),
    "partName" character varying(250),
    "partNumber" character varying(50),
    mechanic_id character(10),
    quantity numeric(12,4) DEFAULT 1 NOT NULL,
    "unitPrice" numeric(21,4) NOT NULL,
    "discountPercent" numeric(5,2) DEFAULT 0,
    "discountAmount" numeric(21,4) DEFAULT 0,
    "taxPercent" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(21,4) DEFAULT 0,
    subtotal numeric(21,4) NOT NULL,
    "startTime" timestamp(3) without time zone,
    "endTime" timestamp(3) without time zone,
    duration integer,
    "detailStatus" public."DetailStatusEnum" DEFAULT '0'::public."DetailStatusEnum",
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceOrderDetail" OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 110648)
-- Name: wks_ServiceRework; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceRework" (
    id character(30) NOT NULL,
    "reworkNumber" character varying(30) NOT NULL,
    "reworkDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type character(5) NOT NULL,
    transaction_class character(10) NOT NULL,
    "originalServiceOrder_id" character(20) NOT NULL,
    "originalOrderNumber" character varying(30),
    complaint_id character(30),
    customer_id character(20) NOT NULL,
    "customerVehicle_id" character(20) NOT NULL,
    vehicle_customer_id character(20) NOT NULL,
    "reworkReason" public."ReworkReasonEnum",
    "reworkReasonDesc" text,
    "issueDescription" text,
    mechanic_id character(10),
    "serviceBay_id" character(10),
    "scheduledDate" timestamp(3) without time zone,
    "actualStartDate" timestamp(3) without time zone,
    "actualEndDate" timestamp(3) without time zone,
    "isWarrantyWork" boolean DEFAULT true,
    "isFreeService" boolean DEFAULT true,
    "chargeToCustomer" boolean DEFAULT false,
    "additionalCost" numeric(21,4) DEFAULT 0,
    "qcCheckedBy" character(10),
    "qcCheckedDate" timestamp(3) without time zone,
    "qcApproved" boolean DEFAULT false,
    "customerRating" smallint,
    "customerFeedback" text,
    "isSatisfied" boolean,
    "reworkStatus" public."ReworkStatusEnum" DEFAULT '0'::public."ReworkStatusEnum" NOT NULL,
    notes text,
    "internalNotes" text,
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceRework" OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 110665)
-- Name: wks_ServiceReworkItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceReworkItem" (
    id character(30) NOT NULL,
    "serviceRework_id" character(30) NOT NULL,
    "lineNumber" smallint NOT NULL,
    "itemType" public."DetailTypeEnum" NOT NULL,
    "originalItem_id" character(30),
    "serviceType_id" character(10),
    "serviceName" character varying(100),
    "serviceDescription" text,
    product_id character(20),
    "productVariant_id" character(30),
    "partName" character varying(250),
    "reworkAction" public."ReworkActionEnum",
    "actionDescription" text,
    quantity numeric(12,4) DEFAULT 0,
    "originalCost" numeric(21,4) DEFAULT 0,
    "additionalCost" numeric(21,4) DEFAULT 0,
    "itemStatus" public."DetailStatusEnum" DEFAULT '0'::public."DetailStatusEnum",
    "transactionStatus" public."TransactionStatusEnum" DEFAULT 'E'::public."TransactionStatusEnum" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" character(10),
    remarks character varying(250),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceReworkItem" OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 110464)
-- Name: wks_ServiceType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_ServiceType" (
    id character(10) NOT NULL,
    name character varying(100) NOT NULL,
    category public."ServiceCategoryEnum",
    description character varying(250),
    "estimatedTime" integer,
    "defaultPrice" numeric(21,4),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    company_id character(5) NOT NULL,
    branch_id character(10) NOT NULL
);


ALTER TABLE public."wks_ServiceType" OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 110405)
-- Name: wks_VehicleBrand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_VehicleBrand" (
    id character(10) NOT NULL,
    "vehicleType_id" character(5) NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50),
    "logoURL" character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."wks_VehicleBrand" OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 110415)
-- Name: wks_VehicleModel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_VehicleModel" (
    id character(15) NOT NULL,
    "vehicleType_id" character(5) NOT NULL,
    brand_id character(10) NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100),
    "imageURL" character varying(250),
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "engineType" character varying(50),
    transmission character varying(30),
    "fuelType" character varying(30),
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."wks_VehicleModel" OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 110397)
-- Name: wks_VehicleType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."wks_VehicleType" (
    id character(5) NOT NULL,
    name character varying(50) NOT NULL,
    "iStatus" public."MasterRecordStatusEnum" DEFAULT '1'::public."MasterRecordStatusEnum" NOT NULL,
    remarks character varying(250),
    seq integer DEFAULT 0,
    "createdBy" character(10),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" character(10),
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."wks_VehicleType" OWNER TO postgres;

--
-- TOC entry 5384 (class 2604 OID 110265)
-- Name: imc_CategoryType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_CategoryType" ALTER COLUMN id SET DEFAULT nextval('public."imc_CategoryType_id_seq"'::regclass);


--
-- TOC entry 5368 (class 2604 OID 110204)
-- Name: sys_Migration_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Migration_log" ALTER COLUMN id SET DEFAULT nextval('public."sys_Migration_log_id_seq"'::regclass);


--
-- TOC entry 5345 (class 2604 OID 110146)
-- Name: sys_PasswordReset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_PasswordReset" ALTER COLUMN id SET DEFAULT nextval('public."sys_PasswordReset_id_seq"'::regclass);


--
-- TOC entry 6419 (class 0 OID 109211)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
13b98353-a345-486c-b19a-58c6f1f7bb1e	2ee05891102429cd4e221a07e6bf1a4cbbd4c69de33bc85d0fd44823236e057d	2025-11-01 23:01:42.623409+07	20251101160140_initial_migration_at_nov25	\N	\N	2025-11-01 23:01:40.230771+07	1
6153a1d8-8298-4294-90e4-0a5eb4d45534	cb797d524c445c9f620ceff3c6fce77d2b71c48b7e9a738c039188aadf24c22e	2025-11-02 09:46:13.344834+07	20251102024613_replace_location_from_sys_company_to_sys_branch	\N	\N	2025-11-02 09:46:13.323083+07	1
f849b97f-d0d1-4c8e-a58a-c14c8d9ee60d	91a1df12e4e7b64f5d3eed22c432e213e785b931ed50b53b5f5408ca24baee32	2025-11-02 09:47:59.340637+07	20251102024759_remove_sys_branch	\N	\N	2025-11-02 09:47:59.313832+07	1
aea3f34f-9af8-40e7-ba00-6a976ab855ad	a9fea0a30354df13045cd7999e16ca9fef6e3d9b4f35b3c35e467f7f691f2300	2025-11-02 09:49:24.617137+07	20251102024924_add_sys_branch_with_new_structures	\N	\N	2025-11-02 09:49:24.588243+07	1
\.


--
-- TOC entry 6502 (class 0 OID 110870)
-- Dependencies: 298
-- Data for Name: acc_BankAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."acc_BankAccount" (id, coa_id, "bankName", "branchName", "accountNumber", "accountName", currency, "swiftCode", "openingBalance", "currentBalance", "isDefault", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6501 (class 0 OID 110850)
-- Dependencies: 297
-- Data for Name: acc_COA; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."acc_COA" (id, "accountCode", "accountName", "accountName_en", "accountType", "accountGroup", "normalBalance", parent_id, level, "isHeader", "isActive", "isCash", "isBank", "isAP", "isAR", "isInventory", "openingBalance", "openingBalanceDate", "currentDebit", "currentCredit", "currentBalance", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6517 (class 0 OID 111070)
-- Dependencies: 313
-- Data for Name: acc_GLTrans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."acc_GLTrans" (id, "journalNumber", "journalDate", transaction_type, transaction_class, source_module, source_document_id, source_document_number, invoice_id, payment_id, "cashReceipt_id", "apInvoice_id", "apPayment_id", "purchaseOrder_id", "purchaseReturn_id", "creditNote_id", description, notes, "totalDebit", "totalCredit", "journalStatus", "isPosted", "postedBy", "postedDate", "isReversed", "reversedBy", "reversedDate", "reversalJournal_id", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6518 (class 0 OID 111085)
-- Dependencies: 314
-- Data for Name: acc_GLTransDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."acc_GLTransDetail" (id, "glTrans_id", "lineNumber", coa_id, description, "debitAmount", "creditAmount", "costCenter", department, project, "iStatus", "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6511 (class 0 OID 110982)
-- Dependencies: 307
-- Data for Name: apm_Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."apm_Invoice" (id, "invoiceNumber", "invoiceDate", "dueDate", transaction_type, transaction_class, "taxScheme_id", source_module, "purchaseReceive_id", "purchaseOrder_id", "receiveNumber", "poNumber", supplier_id, "supplierName", "supplierAddress", "supplierPhone", "supplierEmail", "supplierInvoiceNumber", "supplierInvoiceDate", "taxInvoiceNumber", "subtotalAmount", "discountPercent", "discountAmount", "taxPercent", "taxAmount", "shippingCost", "otherCharges", "totalAmount", "paidAmount", "outstandingAmount", "paymentTermDays", "paymentDueDate", "invoiceStatus", "paymentStatus", "isPosted", "postedDate", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6512 (class 0 OID 111004)
-- Dependencies: 308
-- Data for Name: apm_InvoiceDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."apm_InvoiceDetail" (id, "apInvoice_id", "lineNumber", product_id, "productVariant_id", "productName", "productCode", description, quantity, uom, "unitPrice", "discountPercent", "discountAmount", "taxPercent", "taxAmount", subtotal, expense_coa_id, "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6513 (class 0 OID 111018)
-- Dependencies: 309
-- Data for Name: apm_Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."apm_Payment" (id, "paymentNumber", "paymentDate", transaction_type, transaction_class, "apInvoice_id", "invoiceNumber", supplier_id, "supplierName", "paymentMethod_id", "bankAccount_id", "referenceNumber", "paymentAmount", "processingFee", "netAmount", "paymentStatus", "verifiedBy", "verifiedDate", "isPosted", "postedDate", notes, "internalNotes", "proofImageURL", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6514 (class 0 OID 111032)
-- Dependencies: 310
-- Data for Name: apm_PaymentDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."apm_PaymentDetail" (id, "apPayment_id", "lineNumber", description, "paymentMethod_id", amount, "referenceNumber", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6509 (class 0 OID 110961)
-- Dependencies: 305
-- Data for Name: arm_CashReceipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_CashReceipt" (id, "receiptNumber", "receiptDate", transaction_type, transaction_class, "receivedFrom", "receivedFromType", "receivedFrom_id", "totalAmount", "receiptStatus", "isPosted", "postedDate", description, notes, "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6510 (class 0 OID 110974)
-- Dependencies: 306
-- Data for Name: arm_CashReceiptDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_CashReceiptDetail" (id, "cashReceipt_id", "lineNumber", coa_id, description, amount, "transactionStatus", "isDeleted", "deletedAt", "deletedBy", "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6489 (class 0 OID 110679)
-- Dependencies: 285
-- Data for Name: arm_CreditNote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_CreditNote" (id, "creditNoteNumber", "creditNoteDate", transaction_type, transaction_class, source_module, invoice_id, "invoiceNumber", "serviceOrder_id", complaint_id, "serviceRework_id", customer_id, "customerName", "customerVehicle_id", vehicle_customer_id, "vehicleInfo", "creditReason", "creditReasonDesc", "originalAmount", "creditAmount", "taxAmount", "totalCreditAmount", "refundMethod", "refundBankAccount_id", "refundReferenceNumber", "refundDate", "approvedBy", "approvedDate", "approvalNotes", "creditNoteStatus", "isPosted", "postedDate", "isRefunded", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6490 (class 0 OID 110694)
-- Dependencies: 286
-- Data for Name: arm_CreditNoteDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_CreditNoteDetail" (id, "creditNote_id", "lineNumber", "itemType", item_id, "itemCode", "itemName", description, "originalQuantity", "originalUnitPrice", "originalAmount", "creditQuantity", "creditUnitPrice", "creditAmount", "taxAmount", "totalCredit", "creditReason", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6505 (class 0 OID 110904)
-- Dependencies: 301
-- Data for Name: arm_Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_Invoice" (id, "invoiceNumber", "invoiceDate", "dueDate", transaction_type, transaction_class, "taxScheme_id", source_module, source_document_id, source_document_number, customer_id, "customerName", "customerAddress", "customerPhone", "customerEmail", "customerVehicle_id", vehicle_customer_id, "vehicleInfo", "subtotalAmount", "discountPercent", "discountAmount", "taxPercent", "taxAmount", "otherCharges", "totalAmount", "paidAmount", "outstandingAmount", "paymentTermDays", "invoiceStatus", "paymentStatus", "isPosted", "postedDate", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6506 (class 0 OID 110925)
-- Dependencies: 302
-- Data for Name: arm_InvoiceDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_InvoiceDetail" (id, invoice_id, "lineNumber", "itemType", item_id, "itemCode", "itemName", "itemDescription", quantity, uom, "unitPrice", "discountPercent", "discountAmount", "taxPercent", "taxAmount", subtotal, revenue_coa_id, "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6507 (class 0 OID 110939)
-- Dependencies: 303
-- Data for Name: arm_Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_Payment" (id, "paymentNumber", "paymentDate", transaction_type, transaction_class, invoice_id, "invoiceNumber", customer_id, "customerName", "paymentMethod_id", "bankAccount_id", "referenceNumber", "paymentAmount", "processingFee", "netAmount", "paymentStatus", "verifiedBy", "verifiedDate", "isPosted", "postedDate", notes, "internalNotes", "proofImageURL", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6508 (class 0 OID 110953)
-- Dependencies: 304
-- Data for Name: arm_PaymentDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."arm_PaymentDetail" (id, payment_id, "lineNumber", description, "paymentMethod_id", amount, "referenceNumber", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6468 (class 0 OID 110425)
-- Dependencies: 264
-- Data for Name: cmf_Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_Customer" (id, "customerType", name, "legalName", nickname, email, phone1, phone2, mobile1, mobile2, website, "companyRegistrationNumber", "businessType", "industryType", "companySize", "numberOfEmployees", "numberOfVehicles", province, district, city, "subDistrict", address1, address2, "postalCode", "billingProvince", "billingDistrict", "billingCity", "billingSubDistrict", "billingAddress1", "billingAddress2", "billingPostalCode", "idCardType", "idCardNumber", "taxNumber", "taxName", "taxAddress", "birthDate", gender, occupation, "customerSince", "membershipLevel", "loyaltyPoints", "totalTransaction", "lastVisitDate", "paymentTermDays", "creditLimit", "currentDebt", "isCOD", "iStatus", "isBlacklisted", "blacklistReason", remarks, "profileImageURL", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
CUST01              	I	Agus Widodo	\N	\N	agus@example.com	\N	\N	081111111111	\N	\N	\N	\N	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Selatan	\N	Jl. Sudirman No. 1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 10:38:33.834	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.825	SEEDER    	2025-11-02 10:38:33.825	NGB  	MAIN      
CUST02              	I	Indah Permata	\N	\N	indah@example.com	\N	\N	081111111112	\N	\N	\N	\N	\N	\N	\N	\N	Jawa Barat	\N	Bandung	\N	Jl. Gatot Subroto No. 2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 10:38:33.834	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.825	SEEDER    	2025-11-02 10:38:33.825	NGB  	MAIN      
CUST03              	C	PT Transportasi Mandiri	PT Transportasi Mandiri	\N	info@transportasimandiri.com	\N	\N	081111111113	\N	\N	SIUP123456	PT	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Pusat	\N	Jl. Thamrin No. 3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 10:38:33.834	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.826	SEEDER    	2025-11-02 10:38:33.826	NGB  	MAIN      
CUST04              	I	Budi Kurniawan	\N	\N	budi.k@example.com	\N	\N	081111111114	\N	\N	\N	\N	\N	\N	\N	\N	Jawa Timur	\N	Surabaya	\N	Jl. Pemuda No. 4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 10:38:33.834	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.826	SEEDER    	2025-11-02 10:38:33.826	NGB  	MAIN      
CUST05              	I	Sinta Dewi	\N	\N	sinta@example.com	\N	\N	081111111115	\N	\N	\N	\N	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Barat	\N	Jl. Kebon Jeruk No. 5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 10:38:33.834	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.828	SEEDER    	2025-11-02 10:38:33.828	NGB  	MAIN      
CUST-004            	I	Rahma Widya	\N	\N	rahma.widya@test.com	\N	\N	081234567893	\N	\N	\N	\N	\N	\N	\N	\N	Jawa Timur	\N	Surabaya	\N	Jl. Pemuda No. 321	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 11:42:55.426	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	\N	2025-11-02 11:42:55.426	\N	2025-11-02 11:42:55.426	NGB  	MAIN      
CUST-002            	I	Siti Nurhaliza	\N	\N	siti.nurhaliza@test.com	\N	\N	081234567891	\N	\N	\N	\N	\N	\N	\N	\N	Jawa Barat	\N	Bandung	\N	Jl. Gatot Subroto No. 456	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 11:42:55.424	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	\N	2025-11-02 11:42:55.424	\N	2025-11-02 11:42:55.424	NGB  	MAIN      
CUST-001            	I	Budi Santoso	\N	\N	budi.santoso@test.com	\N	\N	081234567890	\N	\N	\N	\N	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Selatan	\N	Jl. Sudirman No. 123	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 11:42:55.423	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	\N	2025-11-02 11:42:55.423	\N	2025-11-02 11:42:55.423	NGB  	MAIN      
CUST-005            	C	PT Maju Bersama	\N	\N	info@majubersama.com	\N	\N	081234567894	\N	\N	\N	\N	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Barat	\N	Jl. Kebon Jeruk No. 654	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 11:42:55.426	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	\N	2025-11-02 11:42:55.426	\N	2025-11-02 11:42:55.426	NGB  	MAIN      
CUST-003            	I	Ahmad Dahlan	\N	\N	ahmad.dahlan@test.com	\N	\N	081234567892	\N	\N	\N	\N	\N	\N	\N	\N	DKI Jakarta	\N	Jakarta Pusat	\N	Jl. Thamrin No. 789	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-02 11:42:55.425	\N	0	0.0000	\N	\N	\N	0.0000	t	1	f	\N	\N	\N	\N	2025-11-02 11:42:55.425	\N	2025-11-02 11:42:55.425	NGB  	MAIN      
\.


--
-- TOC entry 6469 (class 0 OID 110441)
-- Dependencies: 265
-- Data for Name: cmf_CustomerContactPerson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_CustomerContactPerson" (id, customer_id, name, "position", department, email, phone, mobile, whatsapp, "isPrimary", "canApprove", "canOrder", "approvalLimit", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6470 (class 0 OID 110453)
-- Dependencies: 266
-- Data for Name: cmf_CustomerVehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_CustomerVehicle" (id, customer_id, "vehicleType_id", brand_id, model_id, "licensePlate", "vehicleYear", color, "chassisNumber", "engineNumber", "registrationNumber", "ownershipDocument", "registrationExpiry", transmission, "fuelType", "engineCapacity", "currentOdometer", "lastServiceDate", "lastServiceOdometer", "nextServiceOdometer", "nextServiceDate", "purchaseDate", "insuranceProvider", "insurancePolicyNo", "insuranceExpiry", "iStatus", "isPrimary", remarks, "vehicleImageURL", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
VH001               	CUST01              	VT001	VB001     	VM001          	B 1234 ABC	2020	Silver	\N	\N	\N	\N	\N	\N	\N	\N	45000	\N	\N	\N	\N	\N	\N	\N	\N	1	t	\N	\N	SEEDER    	2025-11-02 10:38:33.884	SEEDER    	2025-11-02 10:38:33.884	NGB  	MAIN      
VH002               	CUST02              	VT001	VB002     	VM003          	D 5678 DEF	2021	White	\N	\N	\N	\N	\N	\N	\N	\N	30000	\N	\N	\N	\N	\N	\N	\N	\N	1	t	\N	\N	SEEDER    	2025-11-02 10:38:33.884	SEEDER    	2025-11-02 10:38:33.884	NGB  	MAIN      
VH003               	CUST03              	VT001	VB001     	VM002          	B 9012 GHI	2019	Black	\N	\N	\N	\N	\N	\N	\N	\N	60000	\N	\N	\N	\N	\N	\N	\N	\N	1	t	\N	\N	SEEDER    	2025-11-02 10:38:33.885	SEEDER    	2025-11-02 10:38:33.885	NGB  	MAIN      
VH004               	CUST04              	VT001	VB002     	VM004          	L 3456 JKL	2022	Red	\N	\N	\N	\N	\N	\N	\N	\N	25000	\N	\N	\N	\N	\N	\N	\N	\N	1	t	\N	\N	SEEDER    	2025-11-02 10:38:33.885	SEEDER    	2025-11-02 10:38:33.885	NGB  	MAIN      
VH005               	CUST05              	VT002	VB004     	VM005          	B 7890 MNO	2021	Blue	\N	\N	\N	\N	\N	\N	\N	\N	15000	\N	\N	\N	\N	\N	\N	\N	\N	1	t	\N	\N	SEEDER    	2025-11-02 10:38:33.885	SEEDER    	2025-11-02 10:38:33.885	NGB  	MAIN      
\.


--
-- TOC entry 6464 (class 0 OID 110388)
-- Dependencies: 260
-- Data for Name: cmf_Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_Employee" (id, "employeeCode", name, nickname, email, mobile, phone, "birthDate", gender, "identityNumber", "taxNumber", address, city, province, "postalCode", "joinDate", "resignDate", "employmentStatus", department, "position", "bankName", "bankAccountNo", "bankAccountName", "photoURL", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
EMP001              	EMP001	Budi Santoso	Budi	budi@example.com	081234567890	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Service	Mekanik Senior	\N	\N	\N	\N	1	\N	SEEDER    	2025-11-02 10:38:33.749	SEEDER    	2025-11-02 10:38:33.749	NGB  	MAIN      
EMP002              	EMP002	Siti Nurhaliza	Siti	siti@example.com	081234567891	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Admin	Admin Service	\N	\N	\N	\N	1	\N	SEEDER    	2025-11-02 10:38:33.75	SEEDER    	2025-11-02 10:38:33.75	NGB  	MAIN      
EMP003              	EMP003	Ahmad Dahlan	Ahmad	ahmad@example.com	081234567892	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Service	Mekanik Junior	\N	\N	\N	\N	1	\N	SEEDER    	2025-11-02 10:38:33.751	SEEDER    	2025-11-02 10:38:33.751	NGB  	MAIN      
EMP004              	EMP004	Rahma Widya	Rahma	rahma@example.com	081234567893	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Kasir	Kasir	\N	\N	\N	\N	1	\N	SEEDER    	2025-11-02 10:38:33.751	SEEDER    	2025-11-02 10:38:33.751	NGB  	MAIN      
EMP005              	EMP005	Joko Susilo	Joko	joko@example.com	081234567894	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Service	Foreman	\N	\N	\N	\N	1	\N	SEEDER    	2025-11-02 10:38:33.751	SEEDER    	2025-11-02 10:38:33.751	NGB  	MAIN      
\.


--
-- TOC entry 6472 (class 0 OID 110474)
-- Dependencies: 268
-- Data for Name: cmf_Mechanic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_Mechanic" (id, employee_id, specialization, level, "totalJobs", "averageRating", "iStatus", "isAvailable", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
MEC001    	EMP001              	Mesin & Transmisi	SR	0	0.00	1	t	\N	SEEDER    	2025-11-02 10:38:33.79	SEEDER    	2025-11-02 10:38:33.79	NGB  	MAIN      
MEC002    	EMP003              	AC & Kelistrikan	JR	0	0.00	1	t	\N	SEEDER    	2025-11-02 10:38:33.79	SEEDER    	2025-11-02 10:38:33.79	NGB  	MAIN      
MEC003    	EMP005              	Oversee & Quality Control	FM	0	0.00	1	t	\N	SEEDER    	2025-11-02 10:38:33.79	SEEDER    	2025-11-02 10:38:33.79	NGB  	MAIN      
\.


--
-- TOC entry 6500 (class 0 OID 110840)
-- Dependencies: 296
-- Data for Name: cmf_PaymentMethod; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_PaymentMethod" (id, name, "methodType", "requireBankAccount", "requireReference", "processingFee", "fixedFee", seq, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6503 (class 0 OID 110883)
-- Dependencies: 299
-- Data for Name: cmf_TaxScheme; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_TaxScheme" (id, "schemeCode", name, "taxType", category, "isInclusive", "defaultRate", "isCompound", "taxAccount_id", "isDefault", "effectiveFrom", "effectiveTo", "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6504 (class 0 OID 110894)
-- Dependencies: 300
-- Data for Name: cmf_TaxSchemeDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_TaxSchemeDetail" (id, "taxScheme_id", "lineNumber", "componentName", "componentName_en", "taxRate", "taxAccount_id", "calculationBase", "isAdditive", seq, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6499 (class 0 OID 110832)
-- Dependencies: 295
-- Data for Name: cmf_TransactionClass; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_TransactionClass" (id, name, seq, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6498 (class 0 OID 110822)
-- Dependencies: 294
-- Data for Name: cmf_TransactionType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cmf_TransactionType" (id, name, category, module, "affectGL", "requireApproval", seq, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6453 (class 0 OID 110290)
-- Dependencies: 249
-- Data for Name: imc_Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Brand" (id, name, slug, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
BRAND01   	Shell	shell	1	\N	SEEDER    	2025-11-02 10:38:33.243	SEEDER    	2025-11-02 10:38:33.243	NGB  	MAIN      
BRAND02   	Total	total	1	\N	SEEDER    	2025-11-02 10:38:33.243	SEEDER    	2025-11-02 10:38:33.243	NGB  	MAIN      
BRAND03   	Yamalube	yamalube	1	\N	SEEDER    	2025-11-02 10:38:33.243	SEEDER    	2025-11-02 10:38:33.243	NGB  	MAIN      
BRAND04   	Bosch	bosch	1	\N	SEEDER    	2025-11-02 10:38:33.243	SEEDER    	2025-11-02 10:38:33.243	NGB  	MAIN      
BRAND05   	Michelin	michelin	1	\N	SEEDER    	2025-11-02 10:38:33.243	SEEDER    	2025-11-02 10:38:33.243	NGB  	MAIN      
\.


--
-- TOC entry 6451 (class 0 OID 110270)
-- Dependencies: 247
-- Data for Name: imc_Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Category" (type, id, name, seq, remarks, "iStatus", "imageURL", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id, href, icon) FROM stdin;
1	CAT001    	Oli & Fluida	1	\N	1	\N	SEEDER    	2025-11-02 10:38:33.111	SEEDER    	2025-11-02 10:38:33.111	NGB  	MAIN      	\N	\N
1	CAT002    	Filter	2	\N	1	\N	SEEDER    	2025-11-02 10:38:33.111	SEEDER    	2025-11-02 10:38:33.111	NGB  	MAIN      	\N	\N
1	CAT003    	Ban	3	\N	1	\N	SEEDER    	2025-11-02 10:38:33.112	SEEDER    	2025-11-02 10:38:33.112	NGB  	MAIN      	\N	\N
1	CAT004    	Battery	4	\N	1	\N	SEEDER    	2025-11-02 10:38:33.112	SEEDER    	2025-11-02 10:38:33.112	NGB  	MAIN      	\N	\N
1	CAT005    	Lampu	5	\N	1	\N	SEEDER    	2025-11-02 10:38:33.112	SEEDER    	2025-11-02 10:38:33.112	NGB  	MAIN      	\N	\N
\.


--
-- TOC entry 6450 (class 0 OID 110262)
-- Dependencies: 246
-- Data for Name: imc_CategoryType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_CategoryType" (id, name, "iStatus", remarks, stock_acct, sales_acct, cogs_acct, expense_acct, asset_acct, company_id, "createdBy", "createdAt", "updatedBy", "updatedAt", branch_id) FROM stdin;
1	Sparepart	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:38:33.066	SEEDER    	2025-11-02 10:38:33.066	\N
2	Material	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:38:33.098	SEEDER    	2025-11-02 10:38:33.098	\N
3	Service	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:38:33.104	SEEDER    	2025-11-02 10:38:33.104	\N
25	Sparepart	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:58:45.718	SEEDER    	2025-11-02 10:58:45.718	\N
26	Material	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:58:45.721	SEEDER    	2025-11-02 10:58:45.721	\N
27	Service	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 10:58:45.723	SEEDER    	2025-11-02 10:58:45.723	\N
28	Sparepart	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:56:58.697	SEEDER    	2025-11-02 11:56:58.697	\N
29	Material	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:56:58.704	SEEDER    	2025-11-02 11:56:58.704	\N
30	Service	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:56:58.708	SEEDER    	2025-11-02 11:56:58.708	\N
31	Sparepart	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:58:18.182	SEEDER    	2025-11-02 11:58:18.182	\N
32	Material	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:58:18.186	SEEDER    	2025-11-02 11:58:18.186	\N
33	Service	1	\N	\N	\N	\N	\N	\N	NGB  	SEEDER    	2025-11-02 11:58:18.187	SEEDER    	2025-11-02 11:58:18.187	\N
\.


--
-- TOC entry 6445 (class 0 OID 110236)
-- Dependencies: 241
-- Data for Name: imc_Floor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Floor" (warehouse_id, id, name, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
WH01	FL001	Lantai 1                           	1	SEEDER    	2025-11-02 10:38:32.894	SEEDER    	2025-11-02 10:38:32.894	NGB  	MAIN      
WH01	FL002	Lantai 2                           	1	SEEDER    	2025-11-02 10:38:32.894	SEEDER    	2025-11-02 10:38:32.894	NGB  	MAIN      
WH02	FL003	Lantai 1                           	1	SEEDER    	2025-11-02 10:38:32.895	SEEDER    	2025-11-02 10:38:32.895	NGB  	MAIN      
\.


--
-- TOC entry 6454 (class 0 OID 110297)
-- Dependencies: 250
-- Data for Name: imc_Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Product" (id, register_id, catalog_id, name, category_id, "subCategory_id", brand_id, uom_id, "eCatalogURL", remarks, "iStatus", "isMaterial", "isService", "isFeatured", "isFinishing", "isAccessories", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
PROD001             	\N	\N	Shell Helix Ultra 5W-40	CAT001    	SCAT01    	BRAND01   	UOM001    	\N	\N	1	t	f	f	f	f	SEEDER                                            	2025-11-02 10:38:33.417	SEEDER                                            	2025-11-02 10:38:33.417	NGB  	MAIN      
PROD002             	\N	\N	Total Quartz 7000	CAT001    	SCAT01    	BRAND02   	UOM001    	\N	\N	1	t	f	f	f	f	SEEDER                                            	2025-11-02 10:38:33.417	SEEDER                                            	2025-11-02 10:38:33.417	NGB  	MAIN      
PROD003             	\N	\N	Bosch Filter Udara	CAT002    	SCAT01    	BRAND04   	UOM001    	\N	\N	1	t	f	f	f	f	SEEDER                                            	2025-11-02 10:38:33.418	SEEDER                                            	2025-11-02 10:38:33.418	NGB  	MAIN      
PROD004             	\N	\N	Bosch Filter Oli	CAT002    	SCAT02    	BRAND04   	UOM001    	\N	\N	1	t	f	f	f	f	SEEDER                                            	2025-11-02 10:38:33.418	SEEDER                                            	2025-11-02 10:38:33.418	NGB  	MAIN      
PROD005             	\N	\N	Michelin Energy XM2 205/55R16	CAT003    	SCAT01    	BRAND05   	UOM001    	\N	\N	1	t	f	f	f	f	SEEDER                                            	2025-11-02 10:38:33.418	SEEDER                                            	2025-11-02 10:38:33.418	NGB  	MAIN      
\.


--
-- TOC entry 6457 (class 0 OID 110327)
-- Dependencies: 253
-- Data for Name: imc_ProductImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductImage" (id, product_id, "imageURL", "isPrimary", "isBrochure", seq, "isVideo", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6455 (class 0 OID 110311)
-- Dependencies: 251
-- Data for Name: imc_ProductStock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductStock" (id, "iStatus", warehouse_id, floor_id, shelf_id, row_id, batch_no, "mExpired_dt", "yExpired_dt", product_cd, i_month_expired, i_year_expired, req_qty, po_qty, grn_qty, so_qty, spk_qty, sj_qty, sl_invoice_qty, sl_return_qty, po_return_qty, stock_opname_qty, intern_receive_qty, intern_issue_qty, onhand_qty, unit_cost, selling_price, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6456 (class 0 OID 110318)
-- Dependencies: 252
-- Data for Name: imc_ProductStockCard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductStockCard" (customer_or_supplier_id, trx_id, trx_class, module_id, is_in_or_out, doc_year, doc_month, doc_date, doc_id, descs, mutation_id, mutation_date, ref_id, ref_date, "iStatus", warehouse_id, to_warehouse_id, srn_seq, product_id, qty, mutation_qty, unit_cost, mutation_cost, floor_id, shelf_id, row_id, batch_no_item, "mExpired_dt", "yExpired_dt", product_cd, i_month_expired, i_year_expired, selling_price, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6461 (class 0 OID 110361)
-- Dependencies: 257
-- Data for Name: imc_ProductVariant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductVariant" (id, product_id, sku, barcode, name, "additionalPrice", "stockQty", weight, length, width, height, "imageURL", "iStatus", "isDefault", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
PV001                         	PROD001             	SHU-1L	\N	Shell Helix Ultra 5W-40 - 1 Liter	\N	50.0000	\N	\N	\N	\N	\N	1	f	\N	SEEDER    	2025-11-02 10:38:33.528	SEEDER    	2025-11-02 10:38:33.528	NGB  	MAIN      
PV002                         	PROD001             	SHU-4L	\N	Shell Helix Ultra 5W-40 - 4 Liter	\N	30.0000	\N	\N	\N	\N	\N	1	f	\N	SEEDER    	2025-11-02 10:38:33.528	SEEDER    	2025-11-02 10:38:33.528	NGB  	MAIN      
PV003                         	PROD002             	TQ7-1L	\N	Total Quartz 7000 - 1 Liter	\N	40.0000	\N	\N	\N	\N	\N	1	f	\N	SEEDER    	2025-11-02 10:38:33.529	SEEDER    	2025-11-02 10:38:33.529	NGB  	MAIN      
\.


--
-- TOC entry 6463 (class 0 OID 110376)
-- Dependencies: 259
-- Data for Name: imc_ProductVariantImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductVariantImage" (id, "productVariant_id", product_id, "imageURL", "isPrimary", seq, "isVideo", "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6462 (class 0 OID 110371)
-- Dependencies: 258
-- Data for Name: imc_ProductVariantOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductVariantOption" ("productVariant_id", product_id, "variantType_id", "variantOption_id", company_id, branch_id) FROM stdin;
PV001                         	PROD001             	VT001     	VO001          	NGB  	MAIN      
PV002                         	PROD001             	VT001     	VO002          	NGB  	MAIN      
PV003                         	PROD002             	VT001     	VO001          	NGB  	MAIN      
\.


--
-- TOC entry 6460 (class 0 OID 110352)
-- Dependencies: 256
-- Data for Name: imc_ProductVariantType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_ProductVariantType" (product_id, "variantType_id", "isRequired", seq, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
PROD001             	VT001     	t	1	1	SEEDER    	2025-11-02 10:38:33.494	SEEDER    	2025-11-02 10:38:33.494	NGB  	MAIN      
PROD002             	VT001     	t	1	1	SEEDER    	2025-11-02 10:38:33.494	SEEDER    	2025-11-02 10:38:33.494	NGB  	MAIN      
\.


--
-- TOC entry 6447 (class 0 OID 110248)
-- Dependencies: 243
-- Data for Name: imc_Row; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Row" (floor_id, shelf_id, id, name, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id, storages) FROM stdin;
FL001	SH001          	RW001          	Baris 1                            	1	SEEDER    	2025-11-02 10:38:32.977	SEEDER    	2025-11-02 10:38:32.977	NGB  	MAIN      	\N
FL001	SH001          	RW002          	Baris 2                            	1	SEEDER    	2025-11-02 10:38:32.977	SEEDER    	2025-11-02 10:38:32.977	NGB  	MAIN      	\N
FL001	SH002          	RW001          	Baris 3                            	1	SEEDER    	2025-11-02 10:38:32.978	SEEDER    	2025-11-02 10:38:32.978	NGB  	MAIN      	\N
\.


--
-- TOC entry 6446 (class 0 OID 110242)
-- Dependencies: 242
-- Data for Name: imc_Shelf; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Shelf" (floor_id, id, name, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
FL001	SH001          	Rak A                              	1	SEEDER    	2025-11-02 10:38:32.938	SEEDER    	2025-11-02 10:38:32.938	NGB  	MAIN      
FL001	SH002          	Rak B                              	1	SEEDER    	2025-11-02 10:38:32.939	SEEDER    	2025-11-02 10:38:32.939	NGB  	MAIN      
FL002	SH001          	Rak C                              	1	SEEDER    	2025-11-02 10:38:32.939	SEEDER    	2025-11-02 10:38:32.939	NGB  	MAIN      
\.


--
-- TOC entry 6452 (class 0 OID 110280)
-- Dependencies: 248
-- Data for Name: imc_SubCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_SubCategory" (id, seq, "imageURL", category_id, name, descriptions, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
SCAT01    	1	\N	CAT001    	Oli Mesin	\N	1	\N	SEEDER    	2025-11-02 10:38:33.182	SEEDER    	2025-11-02 10:38:33.182	NGB  	MAIN      
SCAT02    	2	\N	CAT001    	Oli Gardan	\N	1	\N	SEEDER    	2025-11-02 10:38:33.182	SEEDER    	2025-11-02 10:38:33.182	NGB  	MAIN      
SCAT01    	1	\N	CAT002    	Filter Udara	\N	1	\N	SEEDER    	2025-11-02 10:38:33.183	SEEDER    	2025-11-02 10:38:33.183	NGB  	MAIN      
SCAT02    	2	\N	CAT002    	Filter Oli	\N	1	\N	SEEDER    	2025-11-02 10:38:33.183	SEEDER    	2025-11-02 10:38:33.183	NGB  	MAIN      
SCAT01    	1	\N	CAT003    	Ban Mobil	\N	1	\N	SEEDER    	2025-11-02 10:38:33.183	SEEDER    	2025-11-02 10:38:33.183	NGB  	MAIN      
\.


--
-- TOC entry 6448 (class 0 OID 110254)
-- Dependencies: 244
-- Data for Name: imc_Uom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Uom" (id, name, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
UOM001    	PCS	1	\N	SEEDER    	2025-11-02 10:38:33.02	SEEDER    	2025-11-02 10:38:33.02	NGB  	MAIN      
UOM002    	BOX	1	\N	SEEDER    	2025-11-02 10:38:33.021	SEEDER    	2025-11-02 10:38:33.021	NGB  	MAIN      
UOM003    	KG	1	\N	SEEDER    	2025-11-02 10:38:33.021	SEEDER    	2025-11-02 10:38:33.021	NGB  	MAIN      
\.


--
-- TOC entry 6459 (class 0 OID 110342)
-- Dependencies: 255
-- Data for Name: imc_VariantOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_VariantOption" (id, "variantType_id", name, code, "hexColorCode", "imageURL", "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
VO001          	VT001     	1 Liter	1L                  	\N	\N	1	\N	1	SEEDER    	2025-11-02 10:38:33.352	SEEDER    	2025-11-02 10:38:33.352	NGB  	MAIN      
VO002          	VT001     	4 Liter	4L                  	\N	\N	1	\N	2	SEEDER    	2025-11-02 10:38:33.352	SEEDER    	2025-11-02 10:38:33.352	NGB  	MAIN      
VO003          	VT001     	20 Liter	20L                 	\N	\N	1	\N	3	SEEDER    	2025-11-02 10:38:33.353	SEEDER    	2025-11-02 10:38:33.353	NGB  	MAIN      
VO001          	VT002     	Merah	RED                 	#FF0000	\N	1	\N	1	SEEDER    	2025-11-02 10:38:33.353	SEEDER    	2025-11-02 10:38:33.353	NGB  	MAIN      
VO002          	VT002     	Hitam	BLK                 	#000000	\N	1	\N	2	SEEDER    	2025-11-02 10:38:33.353	SEEDER    	2025-11-02 10:38:33.353	NGB  	MAIN      
\.


--
-- TOC entry 6458 (class 0 OID 110334)
-- Dependencies: 254
-- Data for Name: imc_VariantType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_VariantType" (id, name, "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
VT001     	Kemasan	1	\N	1	SEEDER    	2025-11-02 10:38:33.291	SEEDER    	2025-11-02 10:38:33.291	NGB  	MAIN      
VT002     	Warna	1	\N	2	SEEDER    	2025-11-02 10:38:33.292	SEEDER    	2025-11-02 10:38:33.292	NGB  	MAIN      
VT003     	Ukuran	1	\N	3	SEEDER    	2025-11-02 10:38:33.292	SEEDER    	2025-11-02 10:38:33.292	NGB  	MAIN      
VT004     	Type	1	\N	4	SEEDER    	2025-11-02 10:38:33.292	SEEDER    	2025-11-02 10:38:33.292	NGB  	MAIN      
VT005     	Grade	1	\N	5	SEEDER    	2025-11-02 10:38:33.292	SEEDER    	2025-11-02 10:38:33.292	NGB  	MAIN      
\.


--
-- TOC entry 6444 (class 0 OID 110230)
-- Dependencies: 240
-- Data for Name: imc_Warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."imc_Warehouse" (id, name, "iMain", "iStatus", address, "postalCode", phone, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
WH01	Gudang Utama                                                	1	1	Jl. Gudang Utama No. 1	12345 	0211234567  	SEEDER    	2025-11-02 10:38:32.819	SEEDER    	2025-11-02 10:38:32.819	NGB  	MAIN      
WH02	Gudang Sparepart                                            	2	1	Jl. Sparepart No. 2	12346 	0211234568  	SEEDER    	2025-11-02 10:38:32.82	SEEDER    	2025-11-02 10:38:32.82	NGB  	MAIN      
\.


--
-- TOC entry 6496 (class 0 OID 110799)
-- Dependencies: 292
-- Data for Name: inv_InternalMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."inv_InternalMovement" (id, "movementNumber", "movementDate", "movementType", "transactionType", "sourceWarehouse_id", "destWarehouse_id", "sourceLocation", "destLocation", "referenceNumber", "referenceType", "requestedBy", "requestDate", "approvedBy", "approvedDate", "executedBy", "executedDate", "vehicleNumber", "driverName", "movementStatus", "postingStatus", "postedBy", "postedDate", reason, notes, "internalNotes", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6497 (class 0 OID 110811)
-- Dependencies: 293
-- Data for Name: inv_InternalMovementDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."inv_InternalMovementDetail" (id, "internalMovement_id", "lineNumber", product_id, "productVariant_id", "productName", "productCode", "requestedQty", "movedQty", "receivedQty", uom, "sourceWarehouse_id", "sourceFloor_id", "sourceShelf_id", "sourceRow_id", "destWarehouse_id", "destFloor_id", "destShelf_id", "destRow_id", "batchNumber", "serialNumber", "expiryDate", "unitCost", "totalCost", "adjustmentValue", "lineStatus", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6492 (class 0 OID 110721)
-- Dependencies: 288
-- Data for Name: prc_PurchaseOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseOrder" (id, "poNumber", "poDate", supplier_id, "requisitionNumber", "quotationNumber", "requestedDeliveryDate", "expectedDeliveryDate", warehouse_id, "deliveryAddress", "buyerName", "supplierContactPerson", "supplierPhone", "paymentTermDays", "paymentMethod", "downPaymentPercent", "downPaymentAmount", "subtotalAmount", "discountPercent", "discountAmount", "taxPercent", "taxAmount", "shippingCost", "otherCost", "totalAmount", "poStatus", "approvalStatus", "receiveStatus", "paymentStatus", "approvedBy", "approvedDate", "approvalNotes", "cancelledBy", "cancelledDate", "cancelReason", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6493 (class 0 OID 110746)
-- Dependencies: 289
-- Data for Name: prc_PurchaseOrderDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseOrderDetail" (id, "purchaseOrder_id", "lineNumber", product_id, "productVariant_id", "productName", "productCode", "productDescription", "supplierPartNumber", "supplierProductName", "orderedQty", "receivedQty", "outstandingQty", uom, "unitPrice", "discountPercent", "discountAmount", "taxPercent", "taxAmount", subtotal, "requestedDate", "expectedDate", "lineStatus", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6494 (class 0 OID 110762)
-- Dependencies: 290
-- Data for Name: prc_PurchaseReceive; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseReceive" (id, "receiveNumber", "receiveDate", "purchaseOrder_id", supplier_id, "supplierInvoiceNumber", "supplierInvoiceDate", "deliveryNoteNumber", warehouse_id, "receivedBy", "vehicleNumber", "driverName", "driverPhone", "inspectedBy", "inspectionDate", "inspectionNotes", "qualityStatus", "subtotalAmount", "discountAmount", "taxAmount", "shippingCost", "otherCost", "totalAmount", "receiveStatus", "postingStatus", "postedBy", "postedDate", "hasReturn", "returnReason", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6495 (class 0 OID 110783)
-- Dependencies: 291
-- Data for Name: prc_PurchaseReceiveDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseReceiveDetail" (id, "purchaseReceive_id", "purchaseOrderDetail_id", "lineNumber", product_id, "productVariant_id", "productName", "productCode", "orderedQty", "receivedQty", "acceptedQty", "rejectedQty", "damagedQty", uom, warehouse_id, floor_id, shelf_id, row_id, "batchNumber", "manufactureDate", "expiryDate", "unitPrice", "discountAmount", "taxAmount", subtotal, "qualityStatus", "rejectionReason", "qualityNotes", "lineStatus", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6515 (class 0 OID 111040)
-- Dependencies: 311
-- Data for Name: prc_PurchaseReturn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseReturn" (id, "returnNumber", "returnDate", transaction_type, transaction_class, "purchaseReceive_id", "purchaseOrder_id", supplier_id, "receiveNumber", "poNumber", "supplierReturnNumber", "returnReason", "returnReasonDesc", warehouse_id, "subtotalAmount", "taxAmount", "totalAmount", "returnStatus", "approvalStatus", "approvedBy", "approvedDate", "isPosted", "postedDate", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6516 (class 0 OID 111056)
-- Dependencies: 312
-- Data for Name: prc_PurchaseReturnDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_PurchaseReturnDetail" (id, "purchaseReturn_id", "lineNumber", product_id, "productVariant_id", "productName", "productCode", "returnedQty", "acceptedQty", "rejectedQty", uom, "unitPrice", "discountAmount", "taxAmount", subtotal, "returnReason", warehouse_id, floor_id, shelf_id, row_id, "batchNumber", "lineStatus", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6491 (class 0 OID 110705)
-- Dependencies: 287
-- Data for Name: prc_Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."prc_Supplier" (id, "supplierCode", "supplierType", name, "legalName", nickname, "contactPerson", "contactPosition", phone1, phone2, mobile1, mobile2, email, website, province, district, city, "subDistrict", address1, address2, "postalCode", "taxNumber", "taxName", "taxAddress", "bankName", "bankBranch", "accountNumber", "accountName", "paymentTermDays", "creditLimit", "currentDebt", "supplierRating", "totalPurchase", "totalTransaction", "lastPurchaseDate", "iStatus", "isPreferred", "isBlacklisted", "blacklistReason", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
SUP001              	\N	V	CV Sparepart Jaya	\N	\N	Budi Handoko	\N	02112345678	\N	081222222222	\N	budi@sparepartjaya.com	\N	DKI Jakarta	\N	Jakarta Utara	\N	Jl. Sparepart No. 1	\N	\N	\N	\N	\N	\N	\N	\N	\N	30	\N	0.0000	\N	0.0000	0	\N	1	f	f	\N	\N	SEEDER    	2025-11-02 10:38:33.977	SEEDER    	2025-11-02 10:38:33.977	NGB  	MAIN      
SUP002              	\N	D	PT Distributor Otomotif	PT Distributor Otomotif	\N	Siti Rahmawati	\N	02187654321	\N	081333333333	\N	siti@distributoroto.com	\N	Jawa Barat	\N	Bekasi	\N	Jl. Distributor No. 2	\N	\N	\N	\N	\N	\N	\N	\N	\N	45	\N	0.0000	\N	0.0000	0	\N	1	f	f	\N	\N	SEEDER    	2025-11-02 10:38:33.978	SEEDER    	2025-11-02 10:38:33.978	NGB  	MAIN      
SUP003              	\N	V	CV Sumber Teknik	\N	\N	Ahmad Fauzi	\N	02155555555	\N	081444444444	\N	ahmad@sumberteknik.com	\N	DKI Jakarta	\N	Jakarta Selatan	\N	Jl. Teknik No. 3	\N	\N	\N	\N	\N	\N	\N	\N	\N	30	\N	0.0000	\N	0.0000	0	\N	1	f	f	\N	\N	SEEDER    	2025-11-02 10:38:33.978	SEEDER    	2025-11-02 10:38:33.978	NGB  	MAIN      
SUP004              	\N	M	PT Oli Nasional	PT Oli Nasional	\N	Indah Permatasari	\N	02166666666	\N	081555555555	\N	indah@olinasional.com	\N	Jawa Timur	\N	Surabaya	\N	Jl. Oli No. 4	\N	\N	\N	\N	\N	\N	\N	\N	\N	60	\N	0.0000	\N	0.0000	0	\N	1	f	f	\N	\N	SEEDER    	2025-11-02 10:38:33.979	SEEDER    	2025-11-02 10:38:33.979	NGB  	MAIN      
SUP005              	\N	V	CV Filter Sejahtera	\N	\N	Bambang Sutrisno	\N	02177777777	\N	081666666666	\N	bambang@filtersejahtera.com	\N	DKI Jakarta	\N	Jakarta Timur	\N	Jl. Filter No. 5	\N	\N	\N	\N	\N	\N	\N	\N	\N	30	\N	0.0000	\N	0.0000	0	\N	1	f	f	\N	\N	SEEDER    	2025-11-02 10:38:33.979	SEEDER    	2025-11-02 10:38:33.979	NGB  	MAIN      
\.


--
-- TOC entry 6425 (class 0 OID 110064)
-- Dependencies: 221
-- Data for Name: saas_AddonFeature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_AddonFeature" (id, "addonCode", name, category, description, description_en, "monthlyPrice", "yearlyPrice", currency, "additionalLimit", "limitType", "availableForLite", "availableForPro", "availableForEnterprise", "displayOrder", "isPopular", "iconName", "isActive", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6426 (class 0 OID 110080)
-- Dependencies: 222
-- Data for Name: saas_CompanyAddon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_CompanyAddon" (id, subscription_id, company_id, branch_id, addon_id, "activatedDate", "expiryDate", "isActive", "monthlyPrice", "yearlyPrice", "lastBilledDate", "nextBillingDate", "addonStatus", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6421 (class 0 OID 110002)
-- Dependencies: 217
-- Data for Name: saas_CompanySubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_CompanySubscription" (id, "subscriptionNumber", company_id, branch_id, plan_id, "startDate", "endDate", "billingCycle", "monthlyPrice", "yearlyPrice", "discountPercent", "discountAmount", "finalPrice", "autoRenewal", "renewalDate", "isTrialPeriod", "trialEndDate", "subscriptionStatus", "isCancelled", "cancelledDate", "cancelReason", "notifyBeforeExpiry", "lastNotificationDate", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6422 (class 0 OID 110018)
-- Dependencies: 218
-- Data for Name: saas_PlanFeature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_PlanFeature" (id, plan_id, "featureCode", "featureName", "featureName_en", category, "isEnabled", "customLimit", description, seq, "iStatus", "createdAt") FROM stdin;
\.


--
-- TOC entry 6423 (class 0 OID 110029)
-- Dependencies: 219
-- Data for Name: saas_SubscriptionBilling; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_SubscriptionBilling" (id, "billingNumber", "billingDate", "dueDate", subscription_id, company_id, branch_id, "periodStart", "periodEnd", "billingCycle", "baseAmount", "additionalCharges", "discountAmount", "taxAmount", "totalAmount", "paidAmount", "outstandingAmount", "paymentMethod", "paymentDate", "paymentReference", "billingStatus", "isPosted", "postedDate", notes, "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6420 (class 0 OID 109989)
-- Dependencies: 216
-- Data for Name: saas_SubscriptionPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_SubscriptionPlan" (id, "planCode", name, description, description_en, "monthlyPrice", "yearlyPrice", "yearlyMonthlyEquiv", "discountYearly", currency, "maxUsers", "maxBranches", "maxProducts", "maxCustomers", "maxVehicles", "maxTransactions", "storageLimit", features, "displayOrder", "isPopular", "highlightText", "isActive", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
\.


--
-- TOC entry 6424 (class 0 OID 110045)
-- Dependencies: 220
-- Data for Name: saas_UsageTracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."saas_UsageTracking" (id, subscription_id, company_id, branch_id, "trackingDate", "totalUsers", "totalBranches", "totalProducts", "totalCustomers", "totalVehicles", "totalTransactions", "storageUsed", "monthlyServiceOrders", "monthlyInvoices", "monthlyPurchaseOrders", "isOverLimit", "alertSent", "createdAt") FROM stdin;
\.


--
-- TOC entry 6519 (class 0 OID 128649)
-- Dependencies: 315
-- Data for Name: sys_Branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Branch" (company_id, id, name, "isMain", "iStatus", remarks, province, district, city, address1, address2, address3, "postalCode", phone1, phone2, phone3, mobile1, mobile2, mobile3, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
NGB  	MAIN      	Main Branch	t	1	\N	DKI Jakarta	Duren Sawit	Jakarta	Jl. Raya Kalimalang Blok G No. 99	\N	\N	13440 	021 877 7721	021 877 7722	021 877 7723	0811 8781 7716	0811 8781 7717	0811 8781 7718	SYSTEM    	2025-11-02 00:00:00	SYSTEM    	2025-11-02 00:00:00
\.


--
-- TOC entry 6427 (class 0 OID 110090)
-- Dependencies: 223
-- Data for Name: sys_Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Company" (seq_no, id, name, "iStatus", "isMain", email1, email2, email3, "officialWebsite", "companyLogo", "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
1	NGB  	ngebengkel.com	1	t	info@ngebengkel.com	repair@ngebengkel.com	support@ngebengkel.com	https://www.ngebengkel.com	https://ik.imagekit.io/wnhatkskj/logo_oli2ld.webp?updatedAt=1760584265185	SYSTEM    	2025-11-02 00:00:00	SYSTEM    	2025-11-02 00:00:00
\.


--
-- TOC entry 6431 (class 0 OID 110129)
-- Dependencies: 227
-- Data for Name: sys_EmailVerification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_EmailVerification" (id, user_id, token, "expiresAt", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6438 (class 0 OID 110177)
-- Dependencies: 234
-- Data for Name: sys_Menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Menu" (id, parent_id, menu_description, href, module_id, menu_type, has_child, icon, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
8	\N	Pengingat	\N	SYS	menu	t	AlarmClock	1	\N	2025-11-02 08:22:30.092	\N	2025-11-02 08:22:30.092
1	\N	Beranda	/dashboard	SYS	menu	f	Home	1	\N	2025-11-02 08:22:30.046	\N	2025-11-02 08:22:30.046
2	\N	Pemesanan	\N	WKS	menu	t	Calendar	1	\N	2025-11-02 08:22:30.066	\N	2025-11-02 08:22:30.066
3	2	Daftar Pemesanan	/booking	WKS	submenu	f	List	1	\N	2025-11-02 08:22:30.07	\N	2025-11-02 08:22:30.07
4	2	Kalender Pemesanan	/booking/calendar	WKS	submenu	f	CalendarDays	1	\N	2025-11-02 08:22:30.074	\N	2025-11-02 08:22:30.074
5	\N	Perbaikan	\N	WKS	menu	t	Wrench	1	\N	2025-11-02 08:22:30.082	\N	2025-11-02 08:22:30.082
6	5	Daftar Perbaikan	/service-order	WKS	submenu	f	FileText	1	\N	2025-11-02 08:22:30.085	\N	2025-11-02 08:22:30.085
7	5	Riwayat Perbaikan	/service-order/history	WKS	submenu	f	History	1	\N	2025-11-02 08:22:30.089	\N	2025-11-02 08:22:30.089
9	8	Daftar Pengingat	/reminder	SYS	submenu	f	List	1	\N	2025-11-02 08:22:30.095	\N	2025-11-02 08:22:30.095
10	8	Atur Pengingat	/reminder/settings	SYS	submenu	f	Settings	1	\N	2025-11-02 08:22:30.098	\N	2025-11-02 08:22:30.098
11	\N	Promosi	\N	SYS	menu	f	Tag	1	\N	2025-11-02 08:22:30.105	\N	2025-11-02 08:22:30.105
12	\N	Pengaturan	\N	SYS	menu	t	Settings	1	\N	2025-11-02 08:22:30.108	\N	2025-11-02 08:22:30.108
13	12	Pengguna	/settings/users	SYS	submenu	f	Users	1	\N	2025-11-02 08:22:30.112	\N	2025-11-02 08:22:30.112
14	12	Aplikasi	/settings/app	SYS	submenu	f	Sliders	1	\N	2025-11-02 08:22:30.115	\N	2025-11-02 08:22:30.115
\.


--
-- TOC entry 6439 (class 0 OID 110187)
-- Dependencies: 235
-- Data for Name: sys_Menu_Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Menu_Permission" (id, "userCompanyRole_id", menu_id, can_view, can_create, can_edit, can_delete, can_print, can_approve, "iStatus", "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
1	1	1	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.151	\N	2025-11-02 08:22:30.151
2	1	2	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.166	\N	2025-11-02 08:22:30.166
3	1	3	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.177	\N	2025-11-02 08:22:30.177
4	1	4	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.194	\N	2025-11-02 08:22:30.194
5	1	5	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.211	\N	2025-11-02 08:22:30.211
6	1	6	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.234	\N	2025-11-02 08:22:30.234
7	1	7	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.255	\N	2025-11-02 08:22:30.255
8	1	8	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.273	\N	2025-11-02 08:22:30.273
9	1	9	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.288	\N	2025-11-02 08:22:30.288
10	1	10	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.304	\N	2025-11-02 08:22:30.304
11	1	11	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.32	\N	2025-11-02 08:22:30.32
12	1	12	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.33	\N	2025-11-02 08:22:30.33
13	1	13	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.343	\N	2025-11-02 08:22:30.343
14	1	14	t	t	t	t	t	t	1	\N	2025-11-02 08:22:30.35	\N	2025-11-02 08:22:30.35
\.


--
-- TOC entry 6441 (class 0 OID 110201)
-- Dependencies: 237
-- Data for Name: sys_Migration_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Migration_log" (id, "from_tableName", "to_tableName", "migratedAt", status) FROM stdin;
\.


--
-- TOC entry 6442 (class 0 OID 110209)
-- Dependencies: 238
-- Data for Name: sys_Module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Module" (id, name) FROM stdin;
\.


--
-- TOC entry 6443 (class 0 OID 110214)
-- Dependencies: 239
-- Data for Name: sys_Numbering; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Numbering" (module_id, id, description, prefix, delimiter, "includeYear", "includeMonth", "startNumber", "currentNumber", "sequenceLength", "resetAt", format, "sampleOutput", "iStatus", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6434 (class 0 OID 110143)
-- Dependencies: 230
-- Data for Name: sys_PasswordReset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_PasswordReset" (id, user_id, token, "expiresAt", "createdAt", used, company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6483 (class 0 OID 110590)
-- Dependencies: 279
-- Data for Name: sys_Reminder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Reminder" (id, "reminderNumber", "entityType", entity_id, "reminderType", title, message, "scheduledDate", "scheduledTime", "sendBeforeDays", "sendBeforeHours", customer_id, "recipientPhone", "recipientEmail", channels, status, "lastAttemptAt", "lastSentAt", "sentCount", "maxRetries", "retryCount", "failureReason", "isRead", "readAt", "actionTaken", "actionTakenAt", "actionNotes", metadata, "isRecurring", "recurringInterval", "recurringEndDate", "nextRecurringDate", "parentReminder_id", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
REM-009                       	REM-2025-00009	VM	VH001                         	SCH	Reminder Service Berkala Kendaraan	Kendaraan perlu service rutin 50rb km	2025-11-07 12:00:58.759	\N	7	\N	CUST01              	081234567890	budi.santoso@test.com	WA,EM,SM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-26 12:00:58.759	\N	2025-10-26 12:00:58.759	NGB  	MAIN      
REM-001                       	REM-2025-00001	SO	SO-001                        	SCH	Reminder Service Order SO-001	Jangan lupa follow up service order SO-001	2025-11-07 12:00:58.758	09:00	1	24	CUST01              	081234567890	budi.santoso@test.com	WA,EM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-28 12:00:58.758	\N	2025-10-28 12:00:58.758	NGB  	MAIN      
REM-010                       	REM-2025-00010	CUS	BKG-010                       	CUS	Custom Reminder untuk Booking	Custom reminder untuk customer VIP	2025-11-09 12:00:58.759	09:00	1	24	CUST04              	081234567893	rahma.widya@test.com	WA	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.759	\N	2025-11-01 12:00:58.759	NGB  	MAIN      
REM-004                       	REM-2025-00004	BK	BKG-004                       	APT	Reminder Booking Follow Up BKG-004	Konfirmasi ulang booking dengan customer	2025-11-05 12:00:58.758	14:00	2	24	CUST01              	081234567890	budi.santoso@test.com	WA,EM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-30 12:00:58.758	\N	2025-10-30 12:00:58.758	NGB  	MAIN      
REM-003                       	REM-2025-00003	SO	SO-003                        	DUE	Reminder Service Order Due SO-003	Service order sudah due dan perlu segera diselesaikan	2025-11-01 12:00:58.758	\N	\N	\N	CUST03              	081234567892	ahmad.dahlan@test.com	WA	T	\N	\N	1	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-27 12:00:58.758	\N	2025-10-27 12:00:58.758	NGB  	MAIN      
REM-005                       	REM-2025-00005	SO	SO-005                        	SCH	Reminder Next Service SO-005	Informasi next service untuk kendaraan customer	2025-11-12 12:00:58.758	08:00	7	\N	CUST04              	081234567893	rahma.widya@test.com	EM,SM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-28 12:00:58.758	\N	2025-10-28 12:00:58.758	NGB  	MAIN      
REM-007                       	REM-2025-00007	BK	BKG-007                       	APT	Reminder Booking Appointment BKG-007	Customer akan datang untuk service rem	2025-11-04 12:00:58.758	10:00	1	24	CUST02              	081234567891	siti.nurhaliza@test.com	WA	S	\N	\N	1	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-31 12:00:58.758	\N	2025-10-31 12:00:58.758	NGB  	MAIN      
REM-006                       	REM-2025-00006	PAY	SO-006                        	PAY	Reminder Payment Due SO-006	Pembayaran service order sudah jatuh tempo	2025-11-05 12:00:58.758	\N	3	\N	CUST05              	081234567894	info@majubersama.com	WA,EM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-29 12:00:58.758	\N	2025-10-29 12:00:58.758	NGB  	MAIN      
REM-002                       	REM-2025-00002	BK	BKG-002                       	APT	Reminder Appointment Booking BKG-002	Customer appointment akan datang besok	2025-11-03 12:00:58.758	10:00	1	2	CUST02              	081234567891	siti.nurhaliza@test.com	WA,EM,SM	S	\N	\N	1	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-29 12:00:58.758	\N	2025-10-29 12:00:58.758	NGB  	MAIN      
REM-008                       	REM-2025-00008	SO	SO-008                        	FUP	Reminder Follow Up SO-008	Follow up progress service order	2025-11-03 12:00:58.759	15:00	1	\N	CUST03              	081234567892	ahmad.dahlan@test.com	WA,EM	P	\N	\N	0	3	0	\N	f	\N	f	\N	\N	\N	f	\N	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-30 12:00:58.759	\N	2025-10-30 12:00:58.759	NGB  	MAIN      
\.


--
-- TOC entry 6484 (class 0 OID 110608)
-- Dependencies: 280
-- Data for Name: sys_ReminderLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_ReminderLog" (id, reminder_id, "logType", channel, "sentAt", message, recipient, status, "responseCode", "responseMessage", "errorMessage", "externalId", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", company_id, branch_id) FROM stdin;
RML-004                       	REM-007                       	S	SM	2025-10-31 12:00:58.838	Customer akan datang untuk service rem besok	081234567891	Success	200	SMS sent successfully	\N	SMS-MSG-456789123	E	f	\N	\N	\N	\N	2025-10-31 12:00:58.838	NGB  	MAIN      
RML-001                       	REM-002                       	S	WA	2025-11-01 12:00:58.838	Customer appointment akan datang besok pukul 10:00 WIB	081234567891	Success	200	Message sent successfully	\N	WA-MSG-123456789	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.838	NGB  	MAIN      
RML-005                       	REM-010                       	S	WA	2025-10-26 12:00:58.838	Reminder custom untuk booking appointment	081234567893	Success	200	Message sent successfully	\N	WA-MSG-789123456	E	f	\N	\N	\N	\N	2025-10-26 12:00:58.838	NGB  	MAIN      
RML-002                       	REM-002                       	S	EM	2025-11-01 12:00:58.838	Reminder appointment untuk tomorrow	siti.nurhaliza@test.com	Success	200	Email sent successfully	\N	EML-MSG-987654321	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.838	NGB  	MAIN      
RML-003                       	REM-003                       	F	WA	2025-11-01 12:00:58.838	Service order sudah due dan perlu segera diselesaikan	081234567892	Failed	400	Invalid phone number format	Phone number format tidak valid	\N	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.838	NGB  	MAIN      
\.


--
-- TOC entry 6428 (class 0 OID 110106)
-- Dependencies: 224
-- Data for Name: sys_Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Role" (id, name, "iStatus", remarks, company_id, branch_id) FROM stdin;
ADMIN               	Administrator	1	Full access	NGB  	MAIN      
MECHANIC            	Mekanik	1	Service technician	NGB  	MAIN      
MANAGER             	MANAGER	1	User can only edit data	NGB  	MAIN      
USER                	ENTRY USER	1	Staff Entry	NGB  	MAIN      
\.


--
-- TOC entry 6435 (class 0 OID 110151)
-- Dependencies: 231
-- Data for Name: sys_Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_Session" (id, user_id, "refreshToken", "deviceName", "deviceType", browser, os, "ipAddress", "userAgent", "isActive", "lastActivityAt", "expiresAt", "createdAt", "revokedAt", "revokedReason", "hasRefreshedToken", "iStatus", company_id, branch_id) FROM stdin;
cmhh8g75i000386loygx5wtkw	1	$argon2id$v=19$m=65536,t=3,p=4$QJg+NjQYhK/i0OPdYiq1dw$nlzIUTIvxnHNOY6Qkm6FOOPoEQxgA6aglfVL4G9Gejg	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 04:50:27.509	2025-11-09 04:50:27.343	2025-11-02 04:50:27.509	\N	\N	f	1	\N	\N
cmhhawzoc000186skmcoies9i	1	$argon2id$v=19$m=65536,t=3,p=4$Lw7Qbad011WeoC/Bh+FN1g$l+5kAMIeCeRKMZsX5I/kVB9IhiFs57y1mv9bhNhSGNE	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 05:59:30.077	2025-11-09 05:59:29.939	2025-11-02 05:59:30.077	\N	\N	f	1	\N	\N
cmhhclchv00018640lwoawsfk	1	$argon2id$v=19$m=65536,t=3,p=4$0gOgutOLvdkAdM7Vn9aHGw$lyFTYf8Wnl9QuGG1gPq8LvRta9im23upvoXFFy1OKBE	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 06:46:26.174	2025-11-09 06:46:26.038	2025-11-02 06:46:26.174	\N	\N	f	1	\N	\N
cmhhcyl0p000386403mh7xizt	1	$argon2id$v=19$m=65536,t=3,p=4$jew6wWKlJxW6F72K3f41zQ$/kjRBuDMBm8KsdWog7m1AARp2DSVJkBtwJ1adsRRgPc	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 06:56:43.634	2025-11-09 06:56:43.508	2025-11-02 06:56:43.634	\N	\N	f	1	\N	\N
cmhhdajhz000186ugdbacgym2	1	$argon2id$v=19$m=65536,t=3,p=4$/fjUBLvGVNTzu0i7RT545g$gQFnyJQBN6KOMBQTzrxa+GnDf/m+y3OFzRekkWe0AqY	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 07:06:01.654	2025-11-09 07:06:01.453	2025-11-02 07:06:01.654	\N	\N	f	1	\N	\N
cmhhdnstg000186jcqfmye3mf	1	$argon2id$v=19$m=65536,t=3,p=4$/HA35akJBrktnpz2xD81Gw$kS8pHVr0vncr/1kcQgR1+/vr7XWMpOhQU2JaOKJuXg4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 07:16:20.259	2025-11-09 07:16:20.072	2025-11-02 07:16:20.259	\N	\N	f	1	\N	\N
cmhhfst5u0001861gwq7l6kpv	1	$argon2id$v=19$m=65536,t=3,p=4$3I9I+2ZewVSsZgQmFW5FOw$If8dtzQOeGe/in/HMMJ8Fh9x5/sulKhzX3IYd1vcK2w	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 08:16:13.051	2025-11-09 08:16:12.926	2025-11-02 08:16:13.051	\N	\N	f	1	\N	\N
cmhhg2q340001869w6tijct69	1	$argon2id$v=19$m=65536,t=3,p=4$NXddjIXE7OT64gFg0NFAZw$E6oFK9/6I5DMmlO+IxQd2m2nay8ludCiO7thZTahAI4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 08:23:55.791	2025-11-09 08:23:55.587	2025-11-02 08:23:55.791	\N	\N	f	1	\N	\N
cmhhgrfwr00018634mb2gz406	1	$argon2id$v=19$m=65536,t=3,p=4$H+2ycTVj0vk0KXUNQeug5w$zR81CTbZvtAJNv1uSEJr1oB1W6kBJw9bCUBvrRumI0w	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 08:43:08.873	2025-11-09 08:43:08.745	2025-11-02 08:43:08.873	\N	\N	f	1	\N	\N
cmhhh7ohm00038634tyzlvt41	1	$argon2id$v=19$m=65536,t=3,p=4$LMFN+3FEpfpC3JWe4g7Gfg$K4dV9z7Mr0UqX2rf73zz7WlfPsstKS483O9E7k3PsM4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 08:55:46.45	2025-11-09 08:55:46.258	2025-11-02 08:55:46.45	\N	\N	f	1	\N	\N
cmhhhr5d700058634qtd1r6rn	1	$argon2id$v=19$m=65536,t=3,p=4$Ss0QFEfJ4XJ3VouXCBJrVw$4XH6nJvd4x5Ko0eCRndFbmCd5EwkhkA1A+sJiIDyP9M	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 09:10:54.81	2025-11-09 09:10:54.704	2025-11-02 09:10:54.81	\N	\N	f	1	\N	\N
cmhhhv3px00078634529f57bz	1	$argon2id$v=19$m=65536,t=3,p=4$irL9Y0unROLXV73opW9EsQ$VvyK7T3quC9BYaeum8EuVfObRXhFBRiJah9MtmanmwM	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 09:13:59.444	2025-11-09 09:13:59.377	2025-11-02 09:13:59.444	\N	\N	f	1	\N	\N
cmhhi0bz200098634odo59y5c	1	$argon2id$v=19$m=65536,t=3,p=4$5XAFjevjQS70KpYXrLK2rg$UN9YvAOfu5zX8TuGJBOzJF1R55WZT65eUNSsHw+3FLA	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 09:18:03.33	2025-11-09 09:18:03.219	2025-11-02 09:18:03.33	\N	\N	f	1	\N	\N
cmhhirs2t000b8634zcah6kuk	1	$argon2id$v=19$m=65536,t=3,p=4$RCSv14iYCuYpGYaG7+PgpQ$8OZYfvq7pIj2dJ8J/40tmYNXT62yZwCQX2OaCjC1h8o	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	desktop	\N	\N	::1	node	t	2025-11-02 09:39:23.865	2025-11-09 09:39:23.742	2025-11-02 09:39:23.865	\N	\N	f	1	\N	\N
\.


--
-- TOC entry 6432 (class 0 OID 110135)
-- Dependencies: 228
-- Data for Name: sys_TwoFactorToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_TwoFactorToken" (id, user_id, code, "expiresAt", used, "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6430 (class 0 OID 110118)
-- Dependencies: 226
-- Data for Name: sys_User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_User" (id, name, email, "emailVerified", "emailVerifiedAt", "isAdmin", "iStatus", image, password, "hashedRefreshToken", "twoFactorEnabled", employee_id, company_id, branch_id) FROM stdin;
1	afrizaU	afrizaforuber@gmail.com	t	2025-11-02 04:50:15.337	f	1	\N	$argon2id$v=19$m=65536,t=3,p=4$pWwdZ9vwWDnrE8Y8g8X6Mw$Gi1nwhTZreqiKRZpOVyXtltND4fOsMerldVN/B6n+7M	$argon2id$v=19$m=65536,t=3,p=4$cKb6bV7A0Wh94vnJ22wCuQ$tTd0XkLx+pYXpJU02oNpNwJm+InydIKbdOf/1komDhA	f	\N	NGB  	MAIN      
\.


--
-- TOC entry 6437 (class 0 OID 110170)
-- Dependencies: 233
-- Data for Name: sys_UserCompanyRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_UserCompanyRole" (id, "userRole_id", company_id, branch_id, "iStatus", "isDefault") FROM stdin;
1	1	NGB  	MAIN      	1	t
\.


--
-- TOC entry 6436 (class 0 OID 110163)
-- Dependencies: 232
-- Data for Name: sys_UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_UserRole" (id, user_id, role_id, "iStatus", "isDefault", company_id, branch_id) FROM stdin;
1	1	ADMIN               	1	t	\N	\N
\.


--
-- TOC entry 6429 (class 0 OID 110112)
-- Dependencies: 225
-- Data for Name: sys_WhiteListEmail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sys_WhiteListEmail" (id, name, email, "createdAt") FROM stdin;
\.


--
-- TOC entry 6477 (class 0 OID 110514)
-- Dependencies: 273
-- Data for Name: wks_BayBlock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_BayBlock" (id, company_id, branch_id, bay_id, "startTime", "endTime", reason, remarks, "createdAt") FROM stdin;
\.


--
-- TOC entry 6478 (class 0 OID 110520)
-- Dependencies: 274
-- Data for Name: wks_BookingSlot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_BookingSlot" (id, company_id, branch_id, bay_id, date, "startTime", "endTime", capacity, "bookedCount", "slotStatus", remarks, "createdAt") FROM stdin;
\.


--
-- TOC entry 6475 (class 0 OID 110500)
-- Dependencies: 271
-- Data for Name: wks_BranchHoliday; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_BranchHoliday" (id, company_id, branch_id, date, name, "isClosed", remarks, "createdAt") FROM stdin;
\.


--
-- TOC entry 6474 (class 0 OID 110493)
-- Dependencies: 270
-- Data for Name: wks_BranchWorkingHour; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_BranchWorkingHour" (company_id, branch_id, weekday, "isOpen", "openTime", "closeTime", "bookingBufferMinutes", remarks) FROM stdin;
\.


--
-- TOC entry 6486 (class 0 OID 110636)
-- Dependencies: 282
-- Data for Name: wks_ComplaintLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ComplaintLog" (id, complaint_id, "logDate", "logType", "oldStatus", "newStatus", action, description, "actionBy", "isInternal", attachments, "transactionStatus", "isDeleted", "deletedAt", "deletedBy", "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6485 (class 0 OID 110619)
-- Dependencies: 281
-- Data for Name: wks_CustomerComplaint; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_CustomerComplaint" (id, "complaintNumber", "complaintDate", "serviceOrder_id", customer_id, "customerVehicle_id", vehicle_customer_id, "complaintType", "complaintCategory", subject, description, severity, "customerName", "customerPhone", "customerEmail", "preferredContactMethod", "complaintSource", "occurredDate", "reportedBy", attachments, "witnessName", "witnessContact", "assignedTo", "assignedDate", department, "investigationNotes", "rootCause", "resolutionDescription", "resolutionDate", "resolvedBy", "compensationType", "compensationAmount", "compensationNotes", "followUpRequired", "followUpDate", "followUpBy", "followUpNotes", "resolutionRating", "customerFeedback", "isSatisfied", "complaintStatus", priority, "targetResolutionDate", "isOverdue", "isEscalated", "escalatedTo", "escalatedDate", "escalationReason", "preventiveAction", "implementedBy", "implementedDate", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6476 (class 0 OID 110507)
-- Dependencies: 272
-- Data for Name: wks_MechanicAvailability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_MechanicAvailability" (id, company_id, mechanic_id, date, "availableStart", "availableEnd", "isAvailable", reason, remarks, "createdAt") FROM stdin;
\.


--
-- TOC entry 6473 (class 0 OID 110484)
-- Dependencies: 269
-- Data for Name: wks_ServiceBay; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceBay" (id, name, "bayType", capacity, "iStatus", "isOccupied", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
BAY001    	Bay 1	GEN	1	1	f	\N	SEEDER    	2025-11-02 10:38:33.956	SEEDER    	2025-11-02 10:38:33.956	NGB  	MAIN      
BAY002    	Bay 2	GEN	1	1	f	\N	SEEDER    	2025-11-02 10:38:33.956	SEEDER    	2025-11-02 10:38:33.956	NGB  	MAIN      
BAY003    	Bay 3	BODY	1	1	f	\N	SEEDER    	2025-11-02 10:38:33.956	SEEDER    	2025-11-02 10:38:33.956	NGB  	MAIN      
BAY004    	Bay 4	QUICK	1	1	f	\N	SEEDER    	2025-11-02 10:38:33.956	SEEDER    	2025-11-02 10:38:33.956	NGB  	MAIN      
BAY005    	Bay 5	HEAVY	1	1	f	\N	SEEDER    	2025-11-02 10:38:33.956	SEEDER    	2025-11-02 10:38:33.956	NGB  	MAIN      
\.


--
-- TOC entry 6479 (class 0 OID 110529)
-- Dependencies: 275
-- Data for Name: wks_ServiceBooking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceBooking" (id, "bookingNumber", "bookingDate", company_id, branch_id, customer_id, "customerVehicle_id", vehicle_customer_id, "preferredDate", "preferredStartTime", "preferredEndTime", "scheduledStart", "scheduledEnd", bay_id, mechanic_id, "serviceType_id", "complaintNotes", "additionalRequest", status, source, "reminderSent", "checkInAt", "cancelledAt", "cancelReason", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
BKG-001                       	BKG-2025-00001	2025-10-23 12:00:58.26	NGB  	MAIN      	CUST01              	VH001               	CUST01              	2025-11-03	09:00	11:00	\N	\N	\N	\N	\N	Mesin kasar, perlu service berkala	\N	0	WEB	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-23 12:00:58.26	\N	2025-10-23 12:00:58.26
BKG-002                       	BKG-2025-00002	2025-10-24 12:00:58.26	NGB  	MAIN      	CUST02              	VH002               	CUST02              	2025-11-04	10:00	12:00	\N	\N	\N	\N	\N	Rem bunyi, perlu cek	\N	1	APP	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-24 12:00:58.26	\N	2025-10-24 12:00:58.26
BKG-003                       	BKG-2025-00003	2025-10-25 12:00:58.26	NGB  	MAIN      	CUST03              	VH003               	CUST03              	2025-11-05	13:00	15:00	\N	\N	\N	\N	\N	AC kurang dingin	\N	2	PHONE	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-25 12:00:58.26	\N	2025-10-25 12:00:58.26
BKG-004                       	BKG-2025-00004	2025-10-26 12:00:58.26	NGB  	MAIN      	CUST01              	VH001               	CUST01              	2025-11-06	14:00	16:00	\N	\N	\N	\N	\N	Ganti oli rutin	\N	1	WEB	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-26 12:00:58.26	\N	2025-10-26 12:00:58.26
BKG-007                       	BKG-2025-00007	2025-10-29 12:00:58.26	NGB  	MAIN      	CUST02              	VH002               	CUST02              	2025-11-09	10:00	12:00	\N	\N	\N	\N	\N	Ganti kampas rem	\N	2	WEB	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-29 12:00:58.26	\N	2025-10-29 12:00:58.26
BKG-010                       	BKG-2025-00010	2025-11-01 12:00:58.26	NGB  	MAIN      	CUST04              	VH004               	CUST04              	2025-11-12	08:00	10:00	\N	\N	\N	\N	\N	Inspection service	\N	1	APP	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.26	\N	2025-11-01 12:00:58.26
BKG-006                       	BKG-2025-00006	2025-10-28 12:00:58.26	NGB  	MAIN      	CUST05              	VH005               	CUST05              	2025-11-08	09:00	11:00	\N	\N	\N	\N	\N	Service 40rb km	\N	1	APP	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-28 12:00:58.26	\N	2025-10-28 12:00:58.26
BKG-005                       	BKG-2025-00005	2025-10-27 12:00:58.26	NGB  	MAIN      	CUST04              	VH004               	CUST04              	2025-11-07	08:00	10:00	\N	\N	\N	\N	\N	Ban bocor, perlu perbaikan	\N	0	WALKIN	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-27 12:00:58.26	\N	2025-10-27 12:00:58.26
BKG-009                       	BKG-2025-00009	2025-10-31 12:00:58.26	NGB  	MAIN      	CUST01              	VH001               	CUST01              	2025-11-11	14:00	16:00	\N	\N	\N	\N	\N	Ganti baterai	\N	0	WALKIN	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-31 12:00:58.26	\N	2025-10-31 12:00:58.26
BKG-008                       	BKG-2025-00008	2025-10-30 12:00:58.26	NGB  	MAIN      	CUST03              	VH003               	CUST03              	2025-11-10	13:00	15:00	\N	\N	\N	\N	\N	Tune up mesin	\N	1	PHONE	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-30 12:00:58.26	\N	2025-10-30 12:00:58.26
\.


--
-- TOC entry 6482 (class 0 OID 110580)
-- Dependencies: 278
-- Data for Name: wks_ServiceHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceHistory" (id, "serviceOrder_id", customer_id, "customerVehicle_id", vehicle_customer_id, "serviceDate", "orderNumber", "serviceSummary", "partsReplaced", "odometerReading", "totalServiceCost", "totalPartsCost", "totalAmount", "nextServiceDate", "nextServiceOdometer", "mechanicName", "customerRating", "customerFeedback", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
SH-005                        	SO-010              	CUST04              	VH004               	CUST04              	2025-11-01 12:00:58.26	SO-2025-00010	Inspection lengkap dan perawatan	Filter udara, Filter AC	26000	200000.0000	100000.0000	300000.0000	2026-03-02 12:00:58.81	40000	Mekanik Candra	4	Kendaraan tetap prima	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.26	\N	2025-11-01 12:00:58.26	NGB  	MAIN      
SH-002                        	SO-003              	CUST03              	VH003               	CUST03              	2025-10-25 12:00:58.26	SO-2025-00003	Service AC dan tune up mesin	Freon R134a, Filter AC, Busi	60000	400000.0000	450000.0000	850000.0000	2026-05-01 12:00:58.81	70000	Mekanik Andi	4	AC sudah dingin lagi, terima kasih	E	f	\N	\N	\N	\N	2025-10-25 12:00:58.26	\N	2025-10-25 12:00:58.26	NGB  	MAIN      
SH-004                        	SO-009              	CUST01              	VH001               	CUST01              	2025-10-31 12:00:58.26	SO-2025-00009	Ganti baterai AGM dan service umum	Baterai AGM 70Ah	47000	300000.0000	250000.0000	550000.0000	2026-01-01 12:00:58.81	50000	Mekanik Budi	5	Baterai baru, starter lebih kuat	E	f	\N	\N	\N	\N	2025-10-31 12:00:58.26	\N	2025-10-31 12:00:58.26	NGB  	MAIN      
SH-003                        	SO-005              	CUST04              	VH004               	CUST04              	2025-10-27 12:00:58.26	SO-2025-00005	Perbaikan ban dan service cepat	Ban Tubeless 16 inch	25000	150000.0000	200000.0000	350000.0000	2025-12-02 12:00:58.81	30000	Mekanik Candra	5	Fast response, ban langsung bisa dipakai	E	f	\N	\N	\N	\N	2025-10-27 12:00:58.26	\N	2025-10-27 12:00:58.26	NGB  	MAIN      
SH-001                        	SO-001              	CUST01              	VH001               	CUST01              	2025-10-23 12:00:58.26	SO-2025-00001	Ganti oli mesin dan filter oli	Shell Helix HX7 5W-30 4L, Filter Oli Toyota	45000	350000.0000	500000.0000	850000.0000	2026-01-31 12:00:58.81	50000	Mekanik Budi	5	Service sangat memuaskan, mekanik sangat profesional	E	f	\N	\N	\N	\N	2025-10-23 12:00:58.26	\N	2025-10-23 12:00:58.26	NGB  	MAIN      
\.


--
-- TOC entry 6480 (class 0 OID 110543)
-- Dependencies: 276
-- Data for Name: wks_ServiceOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceOrder" (id, "orderNumber", "orderDate", customer_id, "customerVehicle_id", vehicle_customer_id, "odometerIn", "fuelLevel", "vehicleConditionNotes", mechanic_id, "serviceBay_id", "scheduledStartDate", "scheduledEndDate", "actualStartDate", "actualEndDate", "estimatedDuration", "actualDuration", "customerComplaint", "serviceRequest", "mechanicDiagnosis", "mechanicRecommendation", "serviceCost", "partsCost", "discountAmount", "taxAmount", "totalAmount", "orderStatus", "paymentStatus", priority, "qcCheckedBy", "qcCheckedDate", "qcNotes", "qcApproved", "customerRating", "customerFeedback", "customerSignature", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
SO-001                        	SO-2025-00001	2025-10-23 12:00:58.26	CUST01              	VH001               	CUST01              	45000	H	Kendaraan bersih, tidak ada goresan	\N	\N	\N	\N	\N	\N	\N	\N	Mesin kasar	Ganti oli dan filter	\N	\N	350000.0000	500000.0000	0.0000	0.0000	850000.0000	5	2	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-23 12:00:58.26	\N	2025-10-23 12:00:58.26	NGB  	MAIN      
SO-002                        	SO-2025-00002	2025-10-24 12:00:58.26	CUST02              	VH002               	CUST02              	30000	Q	Ada goresan kecil di bumper	\N	\N	\N	\N	\N	\N	\N	\N	Rem bunyi	Cek kampas rem	\N	\N	200000.0000	300000.0000	0.0000	0.0000	500000.0000	4	1	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-24 12:00:58.26	\N	2025-10-24 12:00:58.26	NGB  	MAIN      
SO-005                        	SO-2025-00005	2025-10-27 12:00:58.26	CUST04              	VH004               	CUST04              	25000	E	Ban bocor sudah diperbaiki	\N	\N	\N	\N	\N	\N	\N	\N	Ban bocor	Perbaikan ban	\N	\N	150000.0000	200000.0000	0.0000	0.0000	350000.0000	5	2	H	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-27 12:00:58.26	\N	2025-10-27 12:00:58.26	NGB  	MAIN      
SO-007                        	SO-2025-00007	2025-10-29 12:00:58.26	CUST02              	VH002               	CUST02              	32000	H	Tidak ada catatan	\N	\N	\N	\N	\N	\N	\N	\N	Ganti kampas rem	Service rem depan belakang	\N	\N	300000.0000	400000.0000	0.0000	0.0000	700000.0000	3	0	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-29 12:00:58.26	\N	2025-10-29 12:00:58.26	NGB  	MAIN      
SO-003                        	SO-2025-00003	2025-10-25 12:00:58.26	CUST03              	VH003               	CUST03              	60000	F	Kondisi baik	\N	\N	\N	\N	\N	\N	\N	\N	AC kurang dingin	Service AC	\N	\N	400000.0000	450000.0000	0.0000	0.0000	850000.0000	5	2	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-25 12:00:58.26	\N	2025-10-25 12:00:58.26	NGB  	MAIN      
SO-010                        	SO-2025-00010	2025-11-01 12:00:58.26	CUST04              	VH004               	CUST04              	26000	H	Kondisi baik	\N	\N	\N	\N	\N	\N	\N	\N	Inspection service	Pemeriksaan lengkap	\N	\N	200000.0000	100000.0000	0.0000	0.0000	300000.0000	0	0	L	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-11-01 12:00:58.26	\N	2025-11-01 12:00:58.26	NGB  	MAIN      
SO-009                        	SO-2025-00009	2025-10-31 12:00:58.26	CUST01              	VH001               	CUST01              	47000	Q	Ban aus	\N	\N	\N	\N	\N	\N	\N	\N	Ganti baterai	Ganti baterai AGM	\N	\N	300000.0000	250000.0000	0.0000	0.0000	550000.0000	5	2	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-31 12:00:58.26	\N	2025-10-31 12:00:58.26	NGB  	MAIN      
SO-004                        	SO-2025-00004	2025-10-26 12:00:58.26	CUST01              	VH001               	CUST01              	46000	H	Tidak ada masalah	\N	\N	\N	\N	\N	\N	\N	\N	Ganti oli rutin	Service berkala	\N	\N	250000.0000	350000.0000	0.0000	0.0000	600000.0000	1	0	L	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-26 12:00:58.26	\N	2025-10-26 12:00:58.26	NGB  	MAIN      
SO-008                        	SO-2025-00008	2025-10-30 12:00:58.26	CUST03              	VH003               	CUST03              	61000	F	Kondisi baik	\N	\N	\N	\N	\N	\N	\N	\N	Tune up mesin	Tune up lengkap	\N	\N	500000.0000	600000.0000	0.0000	0.0000	1100000.0000	2	0	H	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-30 12:00:58.26	\N	2025-10-30 12:00:58.26	NGB  	MAIN      
SO-006                        	SO-2025-00006	2025-10-28 12:00:58.26	CUST05              	VH005               	CUST05              	35000	Q	Kondisi prima	\N	\N	\N	\N	\N	\N	\N	\N	Service 40rb km	Service berkala lengkap	\N	\N	750000.0000	800000.0000	0.0000	0.0000	1550000.0000	2	0	N	\N	\N	\N	f	\N	\N	\N	E	f	\N	\N	\N	\N	2025-10-28 12:00:58.26	\N	2025-10-28 12:00:58.26	NGB  	MAIN      
\.


--
-- TOC entry 6481 (class 0 OID 110564)
-- Dependencies: 277
-- Data for Name: wks_ServiceOrderDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceOrderDetail" (id, "serviceOrder_id", "lineNumber", "detailType", "serviceType_id", "serviceName", "serviceDescription", product_id, "productVariant_id", "partName", "partNumber", mechanic_id, quantity, "unitPrice", "discountPercent", "discountAmount", "taxPercent", "taxAmount", subtotal, "startTime", "endTime", duration, "detailStatus", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6487 (class 0 OID 110648)
-- Dependencies: 283
-- Data for Name: wks_ServiceRework; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceRework" (id, "reworkNumber", "reworkDate", transaction_type, transaction_class, "originalServiceOrder_id", "originalOrderNumber", complaint_id, customer_id, "customerVehicle_id", vehicle_customer_id, "reworkReason", "reworkReasonDesc", "issueDescription", mechanic_id, "serviceBay_id", "scheduledDate", "actualStartDate", "actualEndDate", "isWarrantyWork", "isFreeService", "chargeToCustomer", "additionalCost", "qcCheckedBy", "qcCheckedDate", "qcApproved", "customerRating", "customerFeedback", "isSatisfied", "reworkStatus", notes, "internalNotes", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6488 (class 0 OID 110665)
-- Dependencies: 284
-- Data for Name: wks_ServiceReworkItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceReworkItem" (id, "serviceRework_id", "lineNumber", "itemType", "originalItem_id", "serviceType_id", "serviceName", "serviceDescription", product_id, "productVariant_id", "partName", "reworkAction", "actionDescription", quantity, "originalCost", "additionalCost", "itemStatus", "transactionStatus", "isDeleted", "deletedAt", "deletedBy", remarks, "createdBy", "createdAt", company_id, branch_id) FROM stdin;
\.


--
-- TOC entry 6471 (class 0 OID 110464)
-- Dependencies: 267
-- Data for Name: wks_ServiceType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_ServiceType" (id, name, category, description, "estimatedTime", "defaultPrice", "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt", company_id, branch_id) FROM stdin;
ST001     	Service Berkala	MAINT	Service berkala sesuai jadwal	120	150000.0000	1	\N	1	SEEDER    	2025-11-02 10:38:33.932	SEEDER    	2025-11-02 10:38:33.932	NGB  	MAIN      
ST002     	Ganti Oli	MAINT	Ganti oli mesin dan filter	30	250000.0000	1	\N	2	SEEDER    	2025-11-02 10:38:33.933	SEEDER    	2025-11-02 10:38:33.933	NGB  	MAIN      
ST003     	Tune Up Mesin	REPAIR	Tune up mesin lengkap	180	500000.0000	1	\N	3	SEEDER    	2025-11-02 10:38:33.933	SEEDER    	2025-11-02 10:38:33.933	NGB  	MAIN      
ST004     	Service AC	REPAIR	Service AC lengkap	90	400000.0000	1	\N	4	SEEDER    	2025-11-02 10:38:33.933	SEEDER    	2025-11-02 10:38:33.933	NGB  	MAIN      
ST005     	Cuci & Wax	WASH	Cuci dan wax kendaraan	60	100000.0000	1	\N	5	SEEDER    	2025-11-02 10:38:33.933	SEEDER    	2025-11-02 10:38:33.933	NGB  	MAIN      
\.


--
-- TOC entry 6466 (class 0 OID 110405)
-- Dependencies: 262
-- Data for Name: wks_VehicleBrand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_VehicleBrand" (id, "vehicleType_id", name, slug, "logoURL", "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
VB001     	VT001	Toyota	toyota	\N	1	\N	1	SEEDER    	2025-11-02 10:38:33.63	SEEDER    	2025-11-02 10:38:33.63
VB002     	VT001	Honda	honda	\N	1	\N	2	SEEDER    	2025-11-02 10:38:33.63	SEEDER    	2025-11-02 10:38:33.63
VB003     	VT001	Suzuki	suzuki	\N	1	\N	3	SEEDER    	2025-11-02 10:38:33.63	SEEDER    	2025-11-02 10:38:33.63
VB004     	VT002	Yamaha	yamaha	\N	1	\N	1	SEEDER    	2025-11-02 10:38:33.63	SEEDER    	2025-11-02 10:38:33.63
VB005     	VT002	Honda	honda	\N	1	\N	2	SEEDER    	2025-11-02 10:38:33.63	SEEDER    	2025-11-02 10:38:33.63
\.


--
-- TOC entry 6467 (class 0 OID 110415)
-- Dependencies: 263
-- Data for Name: wks_VehicleModel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_VehicleModel" (id, "vehicleType_id", brand_id, name, slug, "imageURL", "iStatus", remarks, seq, "engineType", transmission, "fuelType", "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
VM001          	VT001	VB001     	Avanza	avanza	\N	1	\N	1	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.688	SEEDER    	2025-11-02 10:38:33.688
VM002          	VT001	VB001     	Innova	innova	\N	1	\N	2	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.688	SEEDER    	2025-11-02 10:38:33.688
VM003          	VT001	VB002     	Jazz	jazz	\N	1	\N	1	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.689	SEEDER    	2025-11-02 10:38:33.689
VM004          	VT001	VB002     	CR-V	cr-v	\N	1	\N	2	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.689	SEEDER    	2025-11-02 10:38:33.689
VM005          	VT002	VB004     	Vario	vario	\N	1	\N	1	\N	\N	\N	SEEDER    	2025-11-02 10:38:33.689	SEEDER    	2025-11-02 10:38:33.689
VM005          	VT001	VB001     	Fortuner	\N	\N	1	\N	0	\N	\N	\N	\N	2025-11-02 11:42:55.181	\N	2025-11-02 11:42:55.181
\.


--
-- TOC entry 6465 (class 0 OID 110397)
-- Dependencies: 261
-- Data for Name: wks_VehicleType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."wks_VehicleType" (id, name, "iStatus", remarks, seq, "createdBy", "createdAt", "updatedBy", "updatedAt") FROM stdin;
VT001	Mobil	1	\N	1	SEEDER    	2025-11-02 10:38:33.589	SEEDER    	2025-11-02 10:38:33.589
VT002	Motor	1	\N	2	SEEDER    	2025-11-02 10:38:33.589	SEEDER    	2025-11-02 10:38:33.589
VT003	Truk	1	\N	3	SEEDER    	2025-11-02 10:38:33.589	SEEDER    	2025-11-02 10:38:33.589
\.


--
-- TOC entry 6528 (class 0 OID 0)
-- Dependencies: 245
-- Name: imc_CategoryType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."imc_CategoryType_id_seq"', 33, true);


--
-- TOC entry 6529 (class 0 OID 0)
-- Dependencies: 236
-- Name: sys_Migration_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."sys_Migration_log_id_seq"', 1, false);


--
-- TOC entry 6530 (class 0 OID 0)
-- Dependencies: 229
-- Name: sys_PasswordReset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."sys_PasswordReset_id_seq"', 1, false);


--
-- TOC entry 5782 (class 2606 OID 109219)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5876 (class 2606 OID 110269)
-- Name: imc_CategoryType imc_CategoryType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_CategoryType"
    ADD CONSTRAINT "imc_CategoryType_pkey" PRIMARY KEY (id);


--
-- TOC entry 5890 (class 2606 OID 110326)
-- Name: imc_ProductStockCard imc_ProductStockCard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductStockCard"
    ADD CONSTRAINT "imc_ProductStockCard_pkey" PRIMARY KEY (product_id, floor_id, shelf_id, row_id, "mExpired_dt", "yExpired_dt", doc_id, mutation_id, srn_seq, batch_no_item, warehouse_id, company_id);


--
-- TOC entry 5888 (class 2606 OID 110317)
-- Name: imc_ProductStock imc_ProductStock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductStock"
    ADD CONSTRAINT "imc_ProductStock_pkey" PRIMARY KEY (id, floor_id, shelf_id, row_id, "mExpired_dt", "yExpired_dt", warehouse_id, company_id);


--
-- TOC entry 5864 (class 2606 OID 110235)
-- Name: imc_Warehouse imc_Warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Warehouse"
    ADD CONSTRAINT "imc_Warehouse_pkey" PRIMARY KEY (id);


--
-- TOC entry 6057 (class 2606 OID 110882)
-- Name: acc_BankAccount pk_acc_BankAccount; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_BankAccount"
    ADD CONSTRAINT "pk_acc_BankAccount" PRIMARY KEY (company_id, id);


--
-- TOC entry 6054 (class 2606 OID 110869)
-- Name: acc_COA pk_acc_COA; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_COA"
    ADD CONSTRAINT "pk_acc_COA" PRIMARY KEY (company_id, id);


--
-- TOC entry 6117 (class 2606 OID 111084)
-- Name: acc_GLTrans pk_acc_GLTrans; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "pk_acc_GLTrans" PRIMARY KEY (company_id, id);


--
-- TOC entry 6122 (class 2606 OID 111093)
-- Name: acc_GLTransDetail pk_acc_GLTransDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTransDetail"
    ADD CONSTRAINT "pk_acc_GLTransDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6093 (class 2606 OID 111003)
-- Name: apm_Invoice pk_apm_Invoice; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Invoice"
    ADD CONSTRAINT "pk_apm_Invoice" PRIMARY KEY (company_id, id);


--
-- TOC entry 6097 (class 2606 OID 111017)
-- Name: apm_InvoiceDetail pk_apm_InvoiceDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_InvoiceDetail"
    ADD CONSTRAINT "pk_apm_InvoiceDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6101 (class 2606 OID 111031)
-- Name: apm_Payment pk_apm_Payment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Payment"
    ADD CONSTRAINT "pk_apm_Payment" PRIMARY KEY (company_id, id);


--
-- TOC entry 6105 (class 2606 OID 111039)
-- Name: apm_PaymentDetail pk_apm_PaymentDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_PaymentDetail"
    ADD CONSTRAINT "pk_apm_PaymentDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6084 (class 2606 OID 110973)
-- Name: arm_CashReceipt pk_arm_CashReceipt; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CashReceipt"
    ADD CONSTRAINT "pk_arm_CashReceipt" PRIMARY KEY (company_id, id);


--
-- TOC entry 6088 (class 2606 OID 110981)
-- Name: arm_CashReceiptDetail pk_arm_CashReceiptDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CashReceiptDetail"
    ADD CONSTRAINT "pk_arm_CashReceiptDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6008 (class 2606 OID 110693)
-- Name: arm_CreditNote pk_arm_CreditNote; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "pk_arm_CreditNote" PRIMARY KEY (company_id, id);


--
-- TOC entry 6012 (class 2606 OID 110704)
-- Name: arm_CreditNoteDetail pk_arm_CreditNoteDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNoteDetail"
    ADD CONSTRAINT "pk_arm_CreditNoteDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6070 (class 2606 OID 110924)
-- Name: arm_Invoice pk_arm_Invoice; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Invoice"
    ADD CONSTRAINT "pk_arm_Invoice" PRIMARY KEY (company_id, id);


--
-- TOC entry 6074 (class 2606 OID 110938)
-- Name: arm_InvoiceDetail pk_arm_InvoiceDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_InvoiceDetail"
    ADD CONSTRAINT "pk_arm_InvoiceDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6078 (class 2606 OID 110952)
-- Name: arm_Payment pk_arm_Payment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Payment"
    ADD CONSTRAINT "pk_arm_Payment" PRIMARY KEY (company_id, id);


--
-- TOC entry 6082 (class 2606 OID 110960)
-- Name: arm_PaymentDetail pk_arm_PaymentDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_PaymentDetail"
    ADD CONSTRAINT "pk_arm_PaymentDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 5921 (class 2606 OID 110440)
-- Name: cmf_Customer pk_cmf_Customer; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_Customer"
    ADD CONSTRAINT "pk_cmf_Customer" PRIMARY KEY (company_id, id);


--
-- TOC entry 5992 (class 2606 OID 110635)
-- Name: wks_CustomerComplaint pk_cmf_CustomerComplaint; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_CustomerComplaint"
    ADD CONSTRAINT "pk_cmf_CustomerComplaint" PRIMARY KEY (company_id, id);


--
-- TOC entry 5925 (class 2606 OID 110452)
-- Name: cmf_CustomerContactPerson pk_cmf_CustomerContactPerson; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerContactPerson"
    ADD CONSTRAINT "pk_cmf_CustomerContactPerson" PRIMARY KEY (company_id, customer_id, id);


--
-- TOC entry 5929 (class 2606 OID 110463)
-- Name: cmf_CustomerVehicle pk_cmf_CustomerVehicle; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerVehicle"
    ADD CONSTRAINT "pk_cmf_CustomerVehicle" PRIMARY KEY (company_id, customer_id, id);


--
-- TOC entry 5910 (class 2606 OID 110396)
-- Name: cmf_Employee pk_cmf_Employee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_Employee"
    ADD CONSTRAINT "pk_cmf_Employee" PRIMARY KEY (company_id, id);


--
-- TOC entry 5935 (class 2606 OID 110483)
-- Name: cmf_Mechanic pk_cmf_Mechanic; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_Mechanic"
    ADD CONSTRAINT "pk_cmf_Mechanic" PRIMARY KEY (company_id, id);


--
-- TOC entry 6050 (class 2606 OID 110849)
-- Name: cmf_PaymentMethod pk_cmf_PaymentMethod; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_PaymentMethod"
    ADD CONSTRAINT "pk_cmf_PaymentMethod" PRIMARY KEY (id);


--
-- TOC entry 6061 (class 2606 OID 110893)
-- Name: cmf_TaxScheme pk_cmf_TaxScheme; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TaxScheme"
    ADD CONSTRAINT "pk_cmf_TaxScheme" PRIMARY KEY (company_id, id);


--
-- TOC entry 6065 (class 2606 OID 110903)
-- Name: cmf_TaxSchemeDetail pk_cmf_TaxSchemeDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TaxSchemeDetail"
    ADD CONSTRAINT "pk_cmf_TaxSchemeDetail" PRIMARY KEY (company_id, "taxScheme_id", id);


--
-- TOC entry 6048 (class 2606 OID 110839)
-- Name: cmf_TransactionClass pk_cmf_TransactionClass; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TransactionClass"
    ADD CONSTRAINT "pk_cmf_TransactionClass" PRIMARY KEY (id);


--
-- TOC entry 6046 (class 2606 OID 110831)
-- Name: cmf_TransactionType pk_cmf_TransactionType; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TransactionType"
    ADD CONSTRAINT "pk_cmf_TransactionType" PRIMARY KEY (id);


--
-- TOC entry 5866 (class 2606 OID 110241)
-- Name: imc_Floor pk_ic_floor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Floor"
    ADD CONSTRAINT pk_ic_floor PRIMARY KEY (id);


--
-- TOC entry 5871 (class 2606 OID 110253)
-- Name: imc_Row pk_ic_row; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Row"
    ADD CONSTRAINT pk_ic_row PRIMARY KEY (floor_id, shelf_id, id);


--
-- TOC entry 5868 (class 2606 OID 110247)
-- Name: imc_Shelf pk_ic_shelf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Shelf"
    ADD CONSTRAINT pk_ic_shelf PRIMARY KEY (floor_id, id);


--
-- TOC entry 5883 (class 2606 OID 110296)
-- Name: imc_Brand pk_imc_Brands; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Brand"
    ADD CONSTRAINT "pk_imc_Brands" PRIMARY KEY (company_id, id);


--
-- TOC entry 5879 (class 2606 OID 110279)
-- Name: imc_Category pk_imc_Categories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Category"
    ADD CONSTRAINT "pk_imc_Categories" PRIMARY KEY (company_id, id);


--
-- TOC entry 5892 (class 2606 OID 110333)
-- Name: imc_ProductImage pk_imc_ProductImages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductImage"
    ADD CONSTRAINT "pk_imc_ProductImages" PRIMARY KEY (product_id, company_id, id);


--
-- TOC entry 5900 (class 2606 OID 110370)
-- Name: imc_ProductVariant pk_imc_ProductVariant; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariant"
    ADD CONSTRAINT "pk_imc_ProductVariant" PRIMARY KEY (company_id, product_id, id);


--
-- TOC entry 5905 (class 2606 OID 110387)
-- Name: imc_ProductVariantImage pk_imc_ProductVariantImage; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantImage"
    ADD CONSTRAINT "pk_imc_ProductVariantImage" PRIMARY KEY (company_id, product_id, "productVariant_id", id);


--
-- TOC entry 5903 (class 2606 OID 110375)
-- Name: imc_ProductVariantOption pk_imc_ProductVariantOption; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantOption"
    ADD CONSTRAINT "pk_imc_ProductVariantOption" PRIMARY KEY (company_id, product_id, "productVariant_id", "variantType_id", "variantOption_id");


--
-- TOC entry 5898 (class 2606 OID 110360)
-- Name: imc_ProductVariantType pk_imc_ProductVariantType; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantType"
    ADD CONSTRAINT "pk_imc_ProductVariantType" PRIMARY KEY (company_id, product_id, "variantType_id");


--
-- TOC entry 5885 (class 2606 OID 110310)
-- Name: imc_Product pk_imc_Products; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Product"
    ADD CONSTRAINT "pk_imc_Products" PRIMARY KEY (company_id, id);


--
-- TOC entry 5881 (class 2606 OID 110289)
-- Name: imc_SubCategory pk_imc_SubCategories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_SubCategory"
    ADD CONSTRAINT "pk_imc_SubCategories" PRIMARY KEY (company_id, category_id, id);


--
-- TOC entry 5874 (class 2606 OID 110260)
-- Name: imc_Uom pk_imc_Uoms; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Uom"
    ADD CONSTRAINT "pk_imc_Uoms" PRIMARY KEY (company_id, id);


--
-- TOC entry 5896 (class 2606 OID 110351)
-- Name: imc_VariantOption pk_imc_VariantOption; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_VariantOption"
    ADD CONSTRAINT "pk_imc_VariantOption" PRIMARY KEY (company_id, "variantType_id", id);


--
-- TOC entry 5894 (class 2606 OID 110341)
-- Name: imc_VariantType pk_imc_VariantType; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_VariantType"
    ADD CONSTRAINT "pk_imc_VariantType" PRIMARY KEY (company_id, id);


--
-- TOC entry 6040 (class 2606 OID 110810)
-- Name: inv_InternalMovement pk_inv_InternalMovement; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovement"
    ADD CONSTRAINT "pk_inv_InternalMovement" PRIMARY KEY (company_id, id);


--
-- TOC entry 6044 (class 2606 OID 110821)
-- Name: inv_InternalMovementDetail pk_inv_InternalMovementDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovementDetail"
    ADD CONSTRAINT "pk_inv_InternalMovementDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6022 (class 2606 OID 110745)
-- Name: prc_PurchaseOrder pk_prc_PurchaseOrder; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrder"
    ADD CONSTRAINT "pk_prc_PurchaseOrder" PRIMARY KEY (company_id, id);


--
-- TOC entry 6026 (class 2606 OID 110761)
-- Name: prc_PurchaseOrderDetail pk_prc_PurchaseOrderDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrderDetail"
    ADD CONSTRAINT "pk_prc_PurchaseOrderDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6031 (class 2606 OID 110782)
-- Name: prc_PurchaseReceive pk_prc_PurchaseReceive; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceive"
    ADD CONSTRAINT "pk_prc_PurchaseReceive" PRIMARY KEY (company_id, id);


--
-- TOC entry 6035 (class 2606 OID 110798)
-- Name: prc_PurchaseReceiveDetail pk_prc_PurchaseReceiveDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceiveDetail"
    ADD CONSTRAINT "pk_prc_PurchaseReceiveDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6109 (class 2606 OID 111055)
-- Name: prc_PurchaseReturn pk_prc_PurchaseReturn; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturn"
    ADD CONSTRAINT "pk_prc_PurchaseReturn" PRIMARY KEY (company_id, id);


--
-- TOC entry 6113 (class 2606 OID 111069)
-- Name: prc_PurchaseReturnDetail pk_prc_PurchaseReturnDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturnDetail"
    ADD CONSTRAINT "pk_prc_PurchaseReturnDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6016 (class 2606 OID 110720)
-- Name: prc_Supplier pk_prc_Supplier; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_Supplier"
    ADD CONSTRAINT "pk_prc_Supplier" PRIMARY KEY (company_id, id);


--
-- TOC entry 5806 (class 2606 OID 110079)
-- Name: saas_AddonFeature pk_saas_AddonFeature; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_AddonFeature"
    ADD CONSTRAINT "pk_saas_AddonFeature" PRIMARY KEY (id);


--
-- TOC entry 5812 (class 2606 OID 110089)
-- Name: saas_CompanyAddon pk_saas_CompanyAddon; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanyAddon"
    ADD CONSTRAINT "pk_saas_CompanyAddon" PRIMARY KEY (id);


--
-- TOC entry 5790 (class 2606 OID 110017)
-- Name: saas_CompanySubscription pk_saas_CompanySubscription; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanySubscription"
    ADD CONSTRAINT "pk_saas_CompanySubscription" PRIMARY KEY (id);


--
-- TOC entry 5794 (class 2606 OID 110028)
-- Name: saas_PlanFeature pk_saas_PlanFeature; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_PlanFeature"
    ADD CONSTRAINT "pk_saas_PlanFeature" PRIMARY KEY (plan_id, id);


--
-- TOC entry 5798 (class 2606 OID 110044)
-- Name: saas_SubscriptionBilling pk_saas_SubscriptionBilling; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_SubscriptionBilling"
    ADD CONSTRAINT "pk_saas_SubscriptionBilling" PRIMARY KEY (id);


--
-- TOC entry 5784 (class 2606 OID 110001)
-- Name: saas_SubscriptionPlan pk_saas_SubscriptionPlan; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_SubscriptionPlan"
    ADD CONSTRAINT "pk_saas_SubscriptionPlan" PRIMARY KEY (id);


--
-- TOC entry 5804 (class 2606 OID 110063)
-- Name: saas_UsageTracking pk_saas_UsageTracking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_UsageTracking"
    ADD CONSTRAINT "pk_saas_UsageTracking" PRIMARY KEY (id);


--
-- TOC entry 5861 (class 2606 OID 110229)
-- Name: sys_Numbering pk_sys_Numbering; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Numbering"
    ADD CONSTRAINT "pk_sys_Numbering" PRIMARY KEY (company_id, branch_id, id);


--
-- TOC entry 5981 (class 2606 OID 110607)
-- Name: sys_Reminder pk_sys_Reminder; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Reminder"
    ADD CONSTRAINT "pk_sys_Reminder" PRIMARY KEY (company_id, id);


--
-- TOC entry 5986 (class 2606 OID 110618)
-- Name: sys_ReminderLog pk_sys_ReminderLog; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_ReminderLog"
    ADD CONSTRAINT "pk_sys_ReminderLog" PRIMARY KEY (company_id, id);


--
-- TOC entry 5950 (class 2606 OID 110519)
-- Name: wks_BayBlock pk_wks_BayBlock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BayBlock"
    ADD CONSTRAINT "pk_wks_BayBlock" PRIMARY KEY (company_id, id);


--
-- TOC entry 5954 (class 2606 OID 110528)
-- Name: wks_BookingSlot pk_wks_BookingSlot; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BookingSlot"
    ADD CONSTRAINT "pk_wks_BookingSlot" PRIMARY KEY (company_id, id);


--
-- TOC entry 5944 (class 2606 OID 110506)
-- Name: wks_BranchHoliday pk_wks_BranchHoliday; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BranchHoliday"
    ADD CONSTRAINT "pk_wks_BranchHoliday" PRIMARY KEY (company_id, id);


--
-- TOC entry 5941 (class 2606 OID 110499)
-- Name: wks_BranchWorkingHour pk_wks_BranchWorkingHour; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BranchWorkingHour"
    ADD CONSTRAINT "pk_wks_BranchWorkingHour" PRIMARY KEY (company_id, branch_id, weekday);


--
-- TOC entry 5996 (class 2606 OID 110647)
-- Name: wks_ComplaintLog pk_wks_ComplaintLog; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ComplaintLog"
    ADD CONSTRAINT "pk_wks_ComplaintLog" PRIMARY KEY (company_id, id);


--
-- TOC entry 5947 (class 2606 OID 110513)
-- Name: wks_MechanicAvailability pk_wks_MechanicAvailability; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_MechanicAvailability"
    ADD CONSTRAINT "pk_wks_MechanicAvailability" PRIMARY KEY (company_id, id);


--
-- TOC entry 5938 (class 2606 OID 110492)
-- Name: wks_ServiceBay pk_wks_ServiceBay; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBay"
    ADD CONSTRAINT "pk_wks_ServiceBay" PRIMARY KEY (company_id, id);


--
-- TOC entry 5959 (class 2606 OID 110542)
-- Name: wks_ServiceBooking pk_wks_ServiceBooking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "pk_wks_ServiceBooking" PRIMARY KEY (company_id, id);


--
-- TOC entry 5974 (class 2606 OID 110589)
-- Name: wks_ServiceHistory pk_wks_ServiceHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceHistory"
    ADD CONSTRAINT "pk_wks_ServiceHistory" PRIMARY KEY (company_id, id);


--
-- TOC entry 5965 (class 2606 OID 110563)
-- Name: wks_ServiceOrder pk_wks_ServiceOrder; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrder"
    ADD CONSTRAINT "pk_wks_ServiceOrder" PRIMARY KEY (company_id, id);


--
-- TOC entry 5969 (class 2606 OID 110579)
-- Name: wks_ServiceOrderDetail pk_wks_ServiceOrderDetail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrderDetail"
    ADD CONSTRAINT "pk_wks_ServiceOrderDetail" PRIMARY KEY (company_id, id);


--
-- TOC entry 6000 (class 2606 OID 110664)
-- Name: wks_ServiceRework pk_wks_ServiceRework; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "pk_wks_ServiceRework" PRIMARY KEY (company_id, id);


--
-- TOC entry 6004 (class 2606 OID 110678)
-- Name: wks_ServiceReworkItem pk_wks_ServiceReworkItem; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceReworkItem"
    ADD CONSTRAINT "pk_wks_ServiceReworkItem" PRIMARY KEY (company_id, id);


--
-- TOC entry 5932 (class 2606 OID 110473)
-- Name: wks_ServiceType pk_wks_ServiceType; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceType"
    ADD CONSTRAINT "pk_wks_ServiceType" PRIMARY KEY (company_id, id);


--
-- TOC entry 5915 (class 2606 OID 110414)
-- Name: wks_VehicleBrand pk_wks_VehicleBrand; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_VehicleBrand"
    ADD CONSTRAINT "pk_wks_VehicleBrand" PRIMARY KEY ("vehicleType_id", id);


--
-- TOC entry 5917 (class 2606 OID 110424)
-- Name: wks_VehicleModel pk_wks_VehicleModel; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_VehicleModel"
    ADD CONSTRAINT "pk_wks_VehicleModel" PRIMARY KEY ("vehicleType_id", brand_id, id);


--
-- TOC entry 5913 (class 2606 OID 110404)
-- Name: wks_VehicleType pk_wks_VehicleType; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_VehicleType"
    ADD CONSTRAINT "pk_wks_VehicleType" PRIMARY KEY (id);


--
-- TOC entry 6125 (class 2606 OID 128657)
-- Name: sys_Branch sys_Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Branch"
    ADD CONSTRAINT "sys_Branch_pkey" PRIMARY KEY (id);


--
-- TOC entry 5815 (class 2606 OID 110098)
-- Name: sys_Company sys_Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Company"
    ADD CONSTRAINT "sys_Company_pkey" PRIMARY KEY (id);


--
-- TOC entry 5826 (class 2606 OID 110134)
-- Name: sys_EmailVerification sys_EmailVerification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_EmailVerification"
    ADD CONSTRAINT "sys_EmailVerification_pkey" PRIMARY KEY (id);


--
-- TOC entry 5853 (class 2606 OID 110199)
-- Name: sys_Menu_Permission sys_Menu_Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Menu_Permission"
    ADD CONSTRAINT "sys_Menu_Permission_pkey" PRIMARY KEY (id);


--
-- TOC entry 5851 (class 2606 OID 110186)
-- Name: sys_Menu sys_Menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Menu"
    ADD CONSTRAINT "sys_Menu_pkey" PRIMARY KEY (id);


--
-- TOC entry 5856 (class 2606 OID 110208)
-- Name: sys_Migration_log sys_Migration_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Migration_log"
    ADD CONSTRAINT "sys_Migration_log_pkey" PRIMARY KEY (id);


--
-- TOC entry 5858 (class 2606 OID 110213)
-- Name: sys_Module sys_Module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Module"
    ADD CONSTRAINT "sys_Module_pkey" PRIMARY KEY (id);


--
-- TOC entry 5834 (class 2606 OID 110150)
-- Name: sys_PasswordReset sys_PasswordReset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_PasswordReset"
    ADD CONSTRAINT "sys_PasswordReset_pkey" PRIMARY KEY (id);


--
-- TOC entry 5817 (class 2606 OID 110111)
-- Name: sys_Role sys_Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Role"
    ADD CONSTRAINT "sys_Role_pkey" PRIMARY KEY (id);


--
-- TOC entry 5840 (class 2606 OID 110162)
-- Name: sys_Session sys_Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Session"
    ADD CONSTRAINT "sys_Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 5831 (class 2606 OID 110141)
-- Name: sys_TwoFactorToken sys_TwoFactorToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_TwoFactorToken"
    ADD CONSTRAINT "sys_TwoFactorToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 5848 (class 2606 OID 110176)
-- Name: sys_UserCompanyRole sys_UserCompanyRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserCompanyRole"
    ADD CONSTRAINT "sys_UserCompanyRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 5845 (class 2606 OID 110169)
-- Name: sys_UserRole sys_UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserRole"
    ADD CONSTRAINT "sys_UserRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 5823 (class 2606 OID 110128)
-- Name: sys_User sys_User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_User"
    ADD CONSTRAINT "sys_User_pkey" PRIMARY KEY (id);


--
-- TOC entry 5820 (class 2606 OID 110117)
-- Name: sys_WhiteListEmail sys_WhiteListEmail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_WhiteListEmail"
    ADD CONSTRAINT "sys_WhiteListEmail_pkey" PRIMARY KEY (id);


--
-- TOC entry 5906 (class 1259 OID 111136)
-- Name: cmf_Employee_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "cmf_Employee_email_key" ON public."cmf_Employee" USING btree (email);


--
-- TOC entry 5877 (class 1259 OID 111133)
-- Name: company_id_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX company_id_id ON public."imc_Category" USING btree (company_id, id);


--
-- TOC entry 6089 (class 1259 OID 111226)
-- Name: idx_ap_invoice_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_invoice_date ON public."apm_Invoice" USING btree (company_id, "invoiceDate");


--
-- TOC entry 6095 (class 1259 OID 111229)
-- Name: idx_ap_invoice_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_invoice_detail ON public."apm_InvoiceDetail" USING btree (company_id, "apInvoice_id");


--
-- TOC entry 6090 (class 1259 OID 111227)
-- Name: idx_ap_invoice_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_invoice_status ON public."apm_Invoice" USING btree (company_id, "invoiceStatus");


--
-- TOC entry 6091 (class 1259 OID 111225)
-- Name: idx_ap_invoice_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_invoice_supplier ON public."apm_Invoice" USING btree (company_id, supplier_id);


--
-- TOC entry 6103 (class 1259 OID 111233)
-- Name: idx_ap_payment_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_payment_detail ON public."apm_PaymentDetail" USING btree (company_id, "apPayment_id");


--
-- TOC entry 6098 (class 1259 OID 111230)
-- Name: idx_ap_payment_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_payment_invoice ON public."apm_Payment" USING btree (company_id, "apInvoice_id");


--
-- TOC entry 6099 (class 1259 OID 111231)
-- Name: idx_ap_payment_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ap_payment_supplier ON public."apm_Payment" USING btree (company_id, supplier_id);


--
-- TOC entry 5948 (class 1259 OID 111152)
-- Name: idx_bayblock_range; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bayblock_range ON public."wks_BayBlock" USING btree (company_id, branch_id, bay_id, "startTime", "endTime");


--
-- TOC entry 5795 (class 1259 OID 111101)
-- Name: idx_billing_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_company ON public."saas_SubscriptionBilling" USING btree (company_id);


--
-- TOC entry 5796 (class 1259 OID 111100)
-- Name: idx_billing_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_subscription ON public."saas_SubscriptionBilling" USING btree (subscription_id);


--
-- TOC entry 5955 (class 1259 OID 111155)
-- Name: idx_booking_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_date ON public."wks_ServiceBooking" USING btree (company_id, branch_id, "bookingDate");


--
-- TOC entry 5956 (class 1259 OID 111157)
-- Name: idx_booking_scheduled_start; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_scheduled_start ON public."wks_ServiceBooking" USING btree (company_id, "scheduledStart");


--
-- TOC entry 5957 (class 1259 OID 111156)
-- Name: idx_booking_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_status ON public."wks_ServiceBooking" USING btree (company_id, status);


--
-- TOC entry 5951 (class 1259 OID 111154)
-- Name: idx_bookingslot_bay_range; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookingslot_bay_range ON public."wks_BookingSlot" USING btree (company_id, bay_id, "startTime", "endTime");


--
-- TOC entry 5952 (class 1259 OID 111153)
-- Name: idx_bookingslot_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookingslot_date ON public."wks_BookingSlot" USING btree (company_id, branch_id, date);


--
-- TOC entry 5942 (class 1259 OID 111150)
-- Name: idx_branch_holiday_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_branch_holiday_date ON public."wks_BranchHoliday" USING btree (company_id, branch_id, date);


--
-- TOC entry 5939 (class 1259 OID 111149)
-- Name: idx_branch_workinghour_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_branch_workinghour_branch ON public."wks_BranchWorkingHour" USING btree (company_id, branch_id);


--
-- TOC entry 6086 (class 1259 OID 111224)
-- Name: idx_cash_receipt_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cash_receipt_detail ON public."arm_CashReceiptDetail" USING btree (company_id, "cashReceipt_id");


--
-- TOC entry 6051 (class 1259 OID 111208)
-- Name: idx_coa_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coa_parent ON public."acc_COA" USING btree (company_id, parent_id);


--
-- TOC entry 6052 (class 1259 OID 111207)
-- Name: idx_coa_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coa_type ON public."acc_COA" USING btree (company_id, "accountType");


--
-- TOC entry 5808 (class 1259 OID 111109)
-- Name: idx_company_addon_addon; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_addon_addon ON public."saas_CompanyAddon" USING btree (addon_id);


--
-- TOC entry 5809 (class 1259 OID 111108)
-- Name: idx_company_addon_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_addon_company ON public."saas_CompanyAddon" USING btree (company_id);


--
-- TOC entry 5810 (class 1259 OID 111107)
-- Name: idx_company_addon_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_addon_subscription ON public."saas_CompanyAddon" USING btree (subscription_id);


--
-- TOC entry 5987 (class 1259 OID 111175)
-- Name: idx_complaint_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_customer ON public."wks_CustomerComplaint" USING btree (company_id, customer_id);


--
-- TOC entry 5988 (class 1259 OID 111177)
-- Name: idx_complaint_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_date ON public."wks_CustomerComplaint" USING btree (company_id, "complaintDate");


--
-- TOC entry 5994 (class 1259 OID 111180)
-- Name: idx_complaint_log; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_log ON public."wks_ComplaintLog" USING btree (company_id, complaint_id);


--
-- TOC entry 5989 (class 1259 OID 111176)
-- Name: idx_complaint_service; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_service ON public."wks_CustomerComplaint" USING btree (company_id, "serviceOrder_id");


--
-- TOC entry 5990 (class 1259 OID 111178)
-- Name: idx_complaint_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_status ON public."wks_CustomerComplaint" USING btree (company_id, "complaintStatus");


--
-- TOC entry 5923 (class 1259 OID 111143)
-- Name: idx_contact_person; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_person ON public."cmf_CustomerContactPerson" USING btree (company_id, customer_id);


--
-- TOC entry 6005 (class 1259 OID 111185)
-- Name: idx_credit_note_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_credit_note_customer ON public."arm_CreditNote" USING btree (company_id, customer_id);


--
-- TOC entry 6010 (class 1259 OID 111188)
-- Name: idx_credit_note_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_credit_note_detail ON public."arm_CreditNoteDetail" USING btree (company_id, "creditNote_id");


--
-- TOC entry 6006 (class 1259 OID 111186)
-- Name: idx_credit_note_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_credit_note_invoice ON public."arm_CreditNote" USING btree (company_id, invoice_id);


--
-- TOC entry 5918 (class 1259 OID 111141)
-- Name: idx_customer_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_email ON public."cmf_Customer" USING btree (company_id, email);


--
-- TOC entry 5919 (class 1259 OID 111140)
-- Name: idx_customer_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_name ON public."cmf_Customer" USING btree (company_id, name);


--
-- TOC entry 5926 (class 1259 OID 111144)
-- Name: idx_customer_vehicles; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_vehicles ON public."cmf_CustomerVehicle" USING btree (company_id, customer_id);


--
-- TOC entry 5907 (class 1259 OID 111138)
-- Name: idx_employee_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_department ON public."cmf_Employee" USING btree (company_id, department);


--
-- TOC entry 5908 (class 1259 OID 111137)
-- Name: idx_employee_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_name ON public."cmf_Employee" USING btree (company_id, name);


--
-- TOC entry 6114 (class 1259 OID 111238)
-- Name: idx_gl_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gl_date ON public."acc_GLTrans" USING btree (company_id, "journalDate");


--
-- TOC entry 6119 (class 1259 OID 111241)
-- Name: idx_gl_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gl_detail ON public."acc_GLTransDetail" USING btree (company_id, "glTrans_id");


--
-- TOC entry 6120 (class 1259 OID 111242)
-- Name: idx_gl_detail_coa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gl_detail_coa ON public."acc_GLTransDetail" USING btree (company_id, coa_id);


--
-- TOC entry 6115 (class 1259 OID 111239)
-- Name: idx_gl_trx_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gl_trx_type ON public."acc_GLTrans" USING btree (company_id, transaction_type);


--
-- TOC entry 6066 (class 1259 OID 111214)
-- Name: idx_invoice_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_customer ON public."arm_Invoice" USING btree (company_id, customer_id);


--
-- TOC entry 6067 (class 1259 OID 111215)
-- Name: idx_invoice_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_date ON public."arm_Invoice" USING btree (company_id, "invoiceDate");


--
-- TOC entry 6072 (class 1259 OID 111218)
-- Name: idx_invoice_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_detail ON public."arm_InvoiceDetail" USING btree (company_id, invoice_id);


--
-- TOC entry 6068 (class 1259 OID 111216)
-- Name: idx_invoice_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoice_status ON public."arm_Invoice" USING btree (company_id, "invoiceStatus");


--
-- TOC entry 5927 (class 1259 OID 111145)
-- Name: idx_license_plate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_license_plate ON public."cmf_CustomerVehicle" USING btree (company_id, "licensePlate");


--
-- TOC entry 5945 (class 1259 OID 111151)
-- Name: idx_mechanic_availability_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mechanic_availability_date ON public."wks_MechanicAvailability" USING btree (company_id, mechanic_id, date);


--
-- TOC entry 5933 (class 1259 OID 111147)
-- Name: idx_mechanic_specialization; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mechanic_specialization ON public."cmf_Mechanic" USING btree (company_id, specialization);


--
-- TOC entry 6036 (class 1259 OID 111202)
-- Name: idx_movement_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movement_date ON public."inv_InternalMovement" USING btree (company_id, "movementDate");


--
-- TOC entry 6042 (class 1259 OID 111206)
-- Name: idx_movement_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movement_detail ON public."inv_InternalMovementDetail" USING btree (company_id, "internalMovement_id");


--
-- TOC entry 6037 (class 1259 OID 111204)
-- Name: idx_movement_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movement_status ON public."inv_InternalMovement" USING btree (company_id, "movementStatus");


--
-- TOC entry 6038 (class 1259 OID 111203)
-- Name: idx_movement_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movement_type ON public."inv_InternalMovement" USING btree (company_id, "movementType");


--
-- TOC entry 5859 (class 1259 OID 111129)
-- Name: idx_numbering_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_numbering_module ON public."sys_Numbering" USING btree (company_id, branch_id, module_id);


--
-- TOC entry 6075 (class 1259 OID 111220)
-- Name: idx_payment_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_customer ON public."arm_Payment" USING btree (company_id, customer_id);


--
-- TOC entry 6080 (class 1259 OID 111222)
-- Name: idx_payment_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_detail ON public."arm_PaymentDetail" USING btree (company_id, payment_id);


--
-- TOC entry 6076 (class 1259 OID 111219)
-- Name: idx_payment_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_invoice ON public."arm_Payment" USING btree (company_id, invoice_id);


--
-- TOC entry 5792 (class 1259 OID 111099)
-- Name: idx_plan_feature; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plan_feature ON public."saas_PlanFeature" USING btree (plan_id);


--
-- TOC entry 6018 (class 1259 OID 111193)
-- Name: idx_po_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_date ON public."prc_PurchaseOrder" USING btree (company_id, "poDate");


--
-- TOC entry 6024 (class 1259 OID 111196)
-- Name: idx_po_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_detail ON public."prc_PurchaseOrderDetail" USING btree (company_id, "purchaseOrder_id");


--
-- TOC entry 6019 (class 1259 OID 111194)
-- Name: idx_po_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_status ON public."prc_PurchaseOrder" USING btree (company_id, "poStatus");


--
-- TOC entry 6020 (class 1259 OID 111192)
-- Name: idx_po_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_supplier ON public."prc_PurchaseOrder" USING btree (company_id, supplier_id);


--
-- TOC entry 6027 (class 1259 OID 111199)
-- Name: idx_receive_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receive_date ON public."prc_PurchaseReceive" USING btree (company_id, "receiveDate");


--
-- TOC entry 6033 (class 1259 OID 111201)
-- Name: idx_receive_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receive_detail ON public."prc_PurchaseReceiveDetail" USING btree (company_id, "purchaseReceive_id");


--
-- TOC entry 6028 (class 1259 OID 111197)
-- Name: idx_receive_po; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receive_po ON public."prc_PurchaseReceive" USING btree (company_id, "purchaseOrder_id");


--
-- TOC entry 6029 (class 1259 OID 111198)
-- Name: idx_receive_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receive_supplier ON public."prc_PurchaseReceive" USING btree (company_id, supplier_id);


--
-- TOC entry 5975 (class 1259 OID 111168)
-- Name: idx_reminder_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_customer ON public."sys_Reminder" USING btree (company_id, customer_id);


--
-- TOC entry 5976 (class 1259 OID 111167)
-- Name: idx_reminder_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_entity ON public."sys_Reminder" USING btree (company_id, "entityType", entity_id);


--
-- TOC entry 5983 (class 1259 OID 111174)
-- Name: idx_reminder_log_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_log_date ON public."sys_ReminderLog" USING btree (company_id, "sentAt");


--
-- TOC entry 5984 (class 1259 OID 111173)
-- Name: idx_reminder_log_reminder; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_log_reminder ON public."sys_ReminderLog" USING btree (company_id, reminder_id);


--
-- TOC entry 5977 (class 1259 OID 111171)
-- Name: idx_reminder_pending; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_pending ON public."sys_Reminder" USING btree (company_id, status, "scheduledDate");


--
-- TOC entry 5978 (class 1259 OID 111170)
-- Name: idx_reminder_scheduled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_scheduled ON public."sys_Reminder" USING btree (company_id, "scheduledDate");


--
-- TOC entry 5979 (class 1259 OID 111169)
-- Name: idx_reminder_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminder_status ON public."sys_Reminder" USING btree (company_id, status);


--
-- TOC entry 6106 (class 1259 OID 111235)
-- Name: idx_return_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_date ON public."prc_PurchaseReturn" USING btree (company_id, "returnDate");


--
-- TOC entry 6111 (class 1259 OID 111237)
-- Name: idx_return_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_detail ON public."prc_PurchaseReturnDetail" USING btree (company_id, "purchaseReturn_id");


--
-- TOC entry 6107 (class 1259 OID 111234)
-- Name: idx_return_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_supplier ON public."prc_PurchaseReturn" USING btree (company_id, supplier_id);


--
-- TOC entry 5997 (class 1259 OID 111182)
-- Name: idx_rework_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rework_customer ON public."wks_ServiceRework" USING btree (company_id, customer_id);


--
-- TOC entry 6002 (class 1259 OID 111184)
-- Name: idx_rework_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rework_item ON public."wks_ServiceReworkItem" USING btree (company_id, "serviceRework_id");


--
-- TOC entry 5998 (class 1259 OID 111181)
-- Name: idx_rework_service; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rework_service ON public."wks_ServiceRework" USING btree (company_id, "originalServiceOrder_id");


--
-- TOC entry 5970 (class 1259 OID 111164)
-- Name: idx_service_history_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_history_customer ON public."wks_ServiceHistory" USING btree (company_id, customer_id);


--
-- TOC entry 5971 (class 1259 OID 111166)
-- Name: idx_service_history_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_history_date ON public."wks_ServiceHistory" USING btree (company_id, "serviceDate");


--
-- TOC entry 5972 (class 1259 OID 111165)
-- Name: idx_service_history_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_history_vehicle ON public."wks_ServiceHistory" USING btree (company_id, "customerVehicle_id");


--
-- TOC entry 5961 (class 1259 OID 111159)
-- Name: idx_service_order_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_order_customer ON public."wks_ServiceOrder" USING btree (company_id, customer_id);


--
-- TOC entry 5962 (class 1259 OID 111160)
-- Name: idx_service_order_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_order_date ON public."wks_ServiceOrder" USING btree (company_id, "orderDate");


--
-- TOC entry 5967 (class 1259 OID 111163)
-- Name: idx_service_order_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_order_detail ON public."wks_ServiceOrderDetail" USING btree (company_id, "serviceOrder_id");


--
-- TOC entry 5963 (class 1259 OID 111161)
-- Name: idx_service_order_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_order_status ON public."wks_ServiceOrder" USING btree (company_id, "orderStatus");


--
-- TOC entry 5786 (class 1259 OID 111095)
-- Name: idx_subscription_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscription_company ON public."saas_CompanySubscription" USING btree (company_id);


--
-- TOC entry 5787 (class 1259 OID 111096)
-- Name: idx_subscription_plan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscription_plan ON public."saas_CompanySubscription" USING btree (plan_id);


--
-- TOC entry 5788 (class 1259 OID 111097)
-- Name: idx_subscription_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscription_status ON public."saas_CompanySubscription" USING btree ("subscriptionStatus");


--
-- TOC entry 6013 (class 1259 OID 111189)
-- Name: idx_supplier_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_name ON public."prc_Supplier" USING btree (company_id, name);


--
-- TOC entry 6014 (class 1259 OID 111190)
-- Name: idx_supplier_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_type ON public."prc_Supplier" USING btree (company_id, "supplierType");


--
-- TOC entry 6123 (class 1259 OID 128658)
-- Name: idx_sys_Branch_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_sys_Branch_company_id" ON public."sys_Branch" USING btree (company_id);


--
-- TOC entry 5813 (class 1259 OID 111110)
-- Name: idx_sys_Company_seq_no; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_sys_Company_seq_no" ON public."sys_Company" USING btree (seq_no);


--
-- TOC entry 6063 (class 1259 OID 111213)
-- Name: idx_tax_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tax_detail ON public."cmf_TaxSchemeDetail" USING btree (company_id, "taxScheme_id");


--
-- TOC entry 6059 (class 1259 OID 111211)
-- Name: idx_tax_scheme_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tax_scheme_type ON public."cmf_TaxScheme" USING btree (company_id, "taxType");


--
-- TOC entry 5800 (class 1259 OID 111104)
-- Name: idx_usage_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_company ON public."saas_UsageTracking" USING btree (company_id);


--
-- TOC entry 5801 (class 1259 OID 111105)
-- Name: idx_usage_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_date ON public."saas_UsageTracking" USING btree ("trackingDate");


--
-- TOC entry 5802 (class 1259 OID 111103)
-- Name: idx_usage_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_subscription ON public."saas_UsageTracking" USING btree (subscription_id);


--
-- TOC entry 5827 (class 1259 OID 111115)
-- Name: sys_EmailVerification_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_EmailVerification_token_key" ON public."sys_EmailVerification" USING btree (token);


--
-- TOC entry 5828 (class 1259 OID 111116)
-- Name: sys_EmailVerification_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_EmailVerification_user_id_idx" ON public."sys_EmailVerification" USING btree (user_id);


--
-- TOC entry 5854 (class 1259 OID 111128)
-- Name: sys_Menu_Permission_userCompanyRole_id_menu_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_Menu_Permission_userCompanyRole_id_menu_id_key" ON public."sys_Menu_Permission" USING btree ("userCompanyRole_id", menu_id);


--
-- TOC entry 5835 (class 1259 OID 111120)
-- Name: sys_PasswordReset_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_PasswordReset_token_idx" ON public."sys_PasswordReset" USING btree (token);


--
-- TOC entry 5836 (class 1259 OID 111119)
-- Name: sys_PasswordReset_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_PasswordReset_token_key" ON public."sys_PasswordReset" USING btree (token);


--
-- TOC entry 5837 (class 1259 OID 111121)
-- Name: sys_PasswordReset_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_PasswordReset_user_id_idx" ON public."sys_PasswordReset" USING btree (user_id);


--
-- TOC entry 5838 (class 1259 OID 111125)
-- Name: sys_Session_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_Session_isActive_idx" ON public."sys_Session" USING btree ("isActive");


--
-- TOC entry 5841 (class 1259 OID 111124)
-- Name: sys_Session_refreshToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_Session_refreshToken_idx" ON public."sys_Session" USING btree ("refreshToken");


--
-- TOC entry 5842 (class 1259 OID 111122)
-- Name: sys_Session_refreshToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_Session_refreshToken_key" ON public."sys_Session" USING btree ("refreshToken");


--
-- TOC entry 5843 (class 1259 OID 111123)
-- Name: sys_Session_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_Session_user_id_idx" ON public."sys_Session" USING btree (user_id);


--
-- TOC entry 5829 (class 1259 OID 111118)
-- Name: sys_TwoFactorToken_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_TwoFactorToken_code_idx" ON public."sys_TwoFactorToken" USING btree (code);


--
-- TOC entry 5832 (class 1259 OID 111117)
-- Name: sys_TwoFactorToken_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sys_TwoFactorToken_user_id_idx" ON public."sys_TwoFactorToken" USING btree (user_id);


--
-- TOC entry 5821 (class 1259 OID 111113)
-- Name: sys_User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_User_email_key" ON public."sys_User" USING btree (email);


--
-- TOC entry 5818 (class 1259 OID 111112)
-- Name: sys_WhiteListEmail_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sys_WhiteListEmail_email_key" ON public."sys_WhiteListEmail" USING btree (email);


--
-- TOC entry 6055 (class 1259 OID 111209)
-- Name: unique_account_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_account_code ON public."acc_COA" USING btree (company_id, "accountCode");


--
-- TOC entry 5807 (class 1259 OID 111106)
-- Name: unique_addon_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_addon_code ON public."saas_AddonFeature" USING btree ("addonCode");


--
-- TOC entry 6094 (class 1259 OID 111228)
-- Name: unique_ap_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_ap_invoice_number ON public."apm_Invoice" USING btree (company_id, "invoiceNumber");


--
-- TOC entry 6102 (class 1259 OID 111232)
-- Name: unique_ap_payment_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_ap_payment_number ON public."apm_Payment" USING btree (company_id, "paymentNumber");


--
-- TOC entry 6058 (class 1259 OID 111210)
-- Name: unique_bank_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_bank_account ON public."acc_BankAccount" USING btree (company_id, "accountNumber");


--
-- TOC entry 5799 (class 1259 OID 111102)
-- Name: unique_billing_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_billing_number ON public."saas_SubscriptionBilling" USING btree ("billingNumber");


--
-- TOC entry 5960 (class 1259 OID 111158)
-- Name: unique_booking_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_booking_number ON public."wks_ServiceBooking" USING btree (company_id, "bookingNumber");


--
-- TOC entry 5886 (class 1259 OID 111134)
-- Name: unique_company_id_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_company_id_id ON public."imc_Product" USING btree (company_id, id);


--
-- TOC entry 5993 (class 1259 OID 111179)
-- Name: unique_complaint_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_complaint_number ON public."wks_CustomerComplaint" USING btree (company_id, "complaintNumber");


--
-- TOC entry 6009 (class 1259 OID 111187)
-- Name: unique_credit_note_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_credit_note_number ON public."arm_CreditNote" USING btree (company_id, "creditNoteNumber");


--
-- TOC entry 5922 (class 1259 OID 111142)
-- Name: unique_customer_mobile; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_customer_mobile ON public."cmf_Customer" USING btree (company_id, mobile1);


--
-- TOC entry 5911 (class 1259 OID 111139)
-- Name: unique_employee_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_employee_code ON public."cmf_Employee" USING btree (company_id, "employeeCode");


--
-- TOC entry 5869 (class 1259 OID 111131)
-- Name: unique_floor_id_shelf_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_floor_id_shelf_id ON public."imc_Shelf" USING btree (floor_id, id);


--
-- TOC entry 5872 (class 1259 OID 111132)
-- Name: unique_floor_id_shelf_id_row_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_floor_id_shelf_id_row_id ON public."imc_Row" USING btree (floor_id, shelf_id, id);


--
-- TOC entry 6071 (class 1259 OID 111217)
-- Name: unique_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_invoice_number ON public."arm_Invoice" USING btree (company_id, "invoiceNumber");


--
-- TOC entry 6118 (class 1259 OID 111240)
-- Name: unique_journal_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_journal_number ON public."acc_GLTrans" USING btree (company_id, "journalNumber");


--
-- TOC entry 5930 (class 1259 OID 111146)
-- Name: unique_license_plate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_license_plate ON public."cmf_CustomerVehicle" USING btree (company_id, "licensePlate");


--
-- TOC entry 5936 (class 1259 OID 111148)
-- Name: unique_mechanic_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_mechanic_employee ON public."cmf_Mechanic" USING btree (company_id, employee_id);


--
-- TOC entry 6041 (class 1259 OID 111205)
-- Name: unique_movement_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_movement_number ON public."inv_InternalMovement" USING btree (company_id, "movementNumber");


--
-- TOC entry 5862 (class 1259 OID 111130)
-- Name: unique_numbering; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_numbering ON public."sys_Numbering" USING btree (company_id, branch_id, id);


--
-- TOC entry 5966 (class 1259 OID 111162)
-- Name: unique_order_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_order_number ON public."wks_ServiceOrder" USING btree (company_id, "orderNumber");


--
-- TOC entry 6079 (class 1259 OID 111221)
-- Name: unique_payment_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_payment_number ON public."arm_Payment" USING btree (company_id, "paymentNumber");


--
-- TOC entry 5785 (class 1259 OID 111094)
-- Name: unique_plan_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_plan_code ON public."saas_SubscriptionPlan" USING btree ("planCode");


--
-- TOC entry 6023 (class 1259 OID 111195)
-- Name: unique_po_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_po_number ON public."prc_PurchaseOrder" USING btree (company_id, "poNumber");


--
-- TOC entry 6085 (class 1259 OID 111223)
-- Name: unique_receipt_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_receipt_number ON public."arm_CashReceipt" USING btree (company_id, "receiptNumber");


--
-- TOC entry 6032 (class 1259 OID 111200)
-- Name: unique_receive_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_receive_number ON public."prc_PurchaseReceive" USING btree (company_id, "receiveNumber");


--
-- TOC entry 5982 (class 1259 OID 111172)
-- Name: unique_reminder_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_reminder_number ON public."sys_Reminder" USING btree (company_id, "reminderNumber");


--
-- TOC entry 6110 (class 1259 OID 111236)
-- Name: unique_return_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_return_number ON public."prc_PurchaseReturn" USING btree (company_id, "returnNumber");


--
-- TOC entry 6001 (class 1259 OID 111183)
-- Name: unique_rework_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_rework_number ON public."wks_ServiceRework" USING btree (company_id, "reworkNumber");


--
-- TOC entry 5901 (class 1259 OID 111135)
-- Name: unique_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_sku ON public."imc_ProductVariant" USING btree (company_id, sku);


--
-- TOC entry 5791 (class 1259 OID 111098)
-- Name: unique_subscription_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_subscription_number ON public."saas_CompanySubscription" USING btree ("subscriptionNumber");


--
-- TOC entry 6017 (class 1259 OID 111191)
-- Name: unique_supplier_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_supplier_code ON public."prc_Supplier" USING btree (company_id, "supplierCode");


--
-- TOC entry 6062 (class 1259 OID 111212)
-- Name: unique_tax_scheme_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_tax_scheme_code ON public."cmf_TaxScheme" USING btree (company_id, "schemeCode");


--
-- TOC entry 5849 (class 1259 OID 111127)
-- Name: unique_userRole_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "unique_userRole_company" ON public."sys_UserCompanyRole" USING btree ("userRole_id", company_id);


--
-- TOC entry 5824 (class 1259 OID 111114)
-- Name: unique_user_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_user_employee ON public."sys_User" USING btree (company_id, employee_id);


--
-- TOC entry 5846 (class 1259 OID 111126)
-- Name: unique_user_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_user_role ON public."sys_UserRole" USING btree (user_id, role_id);


--
-- TOC entry 6231 (class 2606 OID 111773)
-- Name: acc_BankAccount acc_BankAccount_company_id_coa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_BankAccount"
    ADD CONSTRAINT "acc_BankAccount_company_id_coa_id_fkey" FOREIGN KEY (company_id, coa_id) REFERENCES public."acc_COA"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6230 (class 2606 OID 111768)
-- Name: acc_COA acc_COA_company_id_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_COA"
    ADD CONSTRAINT "acc_COA_company_id_parent_id_fkey" FOREIGN KEY (company_id, parent_id) REFERENCES public."acc_COA"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6273 (class 2606 OID 111988)
-- Name: acc_GLTransDetail acc_GLTransDetail_company_id_coa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTransDetail"
    ADD CONSTRAINT "acc_GLTransDetail_company_id_coa_id_fkey" FOREIGN KEY (company_id, coa_id) REFERENCES public."acc_COA"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6274 (class 2606 OID 111983)
-- Name: acc_GLTransDetail acc_GLTransDetail_company_id_glTrans_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTransDetail"
    ADD CONSTRAINT "acc_GLTransDetail_company_id_glTrans_id_fkey" FOREIGN KEY (company_id, "glTrans_id") REFERENCES public."acc_GLTrans"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6265 (class 2606 OID 111958)
-- Name: acc_GLTrans acc_GLTrans_company_id_apInvoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_apInvoice_id_fkey" FOREIGN KEY (company_id, "apInvoice_id") REFERENCES public."apm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6266 (class 2606 OID 111963)
-- Name: acc_GLTrans acc_GLTrans_company_id_apPayment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_apPayment_id_fkey" FOREIGN KEY (company_id, "apPayment_id") REFERENCES public."apm_Payment"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6267 (class 2606 OID 111953)
-- Name: acc_GLTrans acc_GLTrans_company_id_cashReceipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_cashReceipt_id_fkey" FOREIGN KEY (company_id, "cashReceipt_id") REFERENCES public."arm_CashReceipt"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6268 (class 2606 OID 111978)
-- Name: acc_GLTrans acc_GLTrans_company_id_creditNote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_creditNote_id_fkey" FOREIGN KEY (company_id, "creditNote_id") REFERENCES public."arm_CreditNote"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6269 (class 2606 OID 111943)
-- Name: acc_GLTrans acc_GLTrans_company_id_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_invoice_id_fkey" FOREIGN KEY (company_id, invoice_id) REFERENCES public."arm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6270 (class 2606 OID 111948)
-- Name: acc_GLTrans acc_GLTrans_company_id_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_payment_id_fkey" FOREIGN KEY (company_id, payment_id) REFERENCES public."arm_Payment"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6271 (class 2606 OID 111968)
-- Name: acc_GLTrans acc_GLTrans_company_id_purchaseOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_purchaseOrder_id_fkey" FOREIGN KEY (company_id, "purchaseOrder_id") REFERENCES public."prc_PurchaseOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6272 (class 2606 OID 111973)
-- Name: acc_GLTrans acc_GLTrans_company_id_purchaseReturn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."acc_GLTrans"
    ADD CONSTRAINT "acc_GLTrans_company_id_purchaseReturn_id_fkey" FOREIGN KEY (company_id, "purchaseReturn_id") REFERENCES public."prc_PurchaseReturn"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6251 (class 2606 OID 111873)
-- Name: apm_InvoiceDetail apm_InvoiceDetail_company_id_apInvoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_InvoiceDetail"
    ADD CONSTRAINT "apm_InvoiceDetail_company_id_apInvoice_id_fkey" FOREIGN KEY (company_id, "apInvoice_id") REFERENCES public."apm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6252 (class 2606 OID 111878)
-- Name: apm_InvoiceDetail apm_InvoiceDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_InvoiceDetail"
    ADD CONSTRAINT "apm_InvoiceDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6247 (class 2606 OID 111863)
-- Name: apm_Invoice apm_Invoice_company_id_purchaseOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Invoice"
    ADD CONSTRAINT "apm_Invoice_company_id_purchaseOrder_id_fkey" FOREIGN KEY (company_id, "purchaseOrder_id") REFERENCES public."prc_PurchaseOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6248 (class 2606 OID 111858)
-- Name: apm_Invoice apm_Invoice_company_id_purchaseReceive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Invoice"
    ADD CONSTRAINT "apm_Invoice_company_id_purchaseReceive_id_fkey" FOREIGN KEY (company_id, "purchaseReceive_id") REFERENCES public."prc_PurchaseReceive"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6249 (class 2606 OID 111853)
-- Name: apm_Invoice apm_Invoice_company_id_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Invoice"
    ADD CONSTRAINT "apm_Invoice_company_id_supplier_id_fkey" FOREIGN KEY (company_id, supplier_id) REFERENCES public."prc_Supplier"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6250 (class 2606 OID 111868)
-- Name: apm_Invoice apm_Invoice_company_id_taxScheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Invoice"
    ADD CONSTRAINT "apm_Invoice_company_id_taxScheme_id_fkey" FOREIGN KEY (company_id, "taxScheme_id") REFERENCES public."cmf_TaxScheme"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6257 (class 2606 OID 111903)
-- Name: apm_PaymentDetail apm_PaymentDetail_company_id_apPayment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_PaymentDetail"
    ADD CONSTRAINT "apm_PaymentDetail_company_id_apPayment_id_fkey" FOREIGN KEY (company_id, "apPayment_id") REFERENCES public."apm_Payment"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6258 (class 2606 OID 111908)
-- Name: apm_PaymentDetail apm_PaymentDetail_paymentMethod_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_PaymentDetail"
    ADD CONSTRAINT "apm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES public."cmf_PaymentMethod"(id) ON DELETE RESTRICT;


--
-- TOC entry 6253 (class 2606 OID 111883)
-- Name: apm_Payment apm_Payment_company_id_apInvoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Payment"
    ADD CONSTRAINT "apm_Payment_company_id_apInvoice_id_fkey" FOREIGN KEY (company_id, "apInvoice_id") REFERENCES public."apm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6254 (class 2606 OID 111898)
-- Name: apm_Payment apm_Payment_company_id_bankAccount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Payment"
    ADD CONSTRAINT "apm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY (company_id, "bankAccount_id") REFERENCES public."acc_BankAccount"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6255 (class 2606 OID 111888)
-- Name: apm_Payment apm_Payment_company_id_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Payment"
    ADD CONSTRAINT "apm_Payment_company_id_supplier_id_fkey" FOREIGN KEY (company_id, supplier_id) REFERENCES public."prc_Supplier"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6256 (class 2606 OID 111893)
-- Name: apm_Payment apm_Payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."apm_Payment"
    ADD CONSTRAINT "apm_Payment_id_fkey" FOREIGN KEY (id) REFERENCES public."cmf_PaymentMethod"(id) ON DELETE RESTRICT;


--
-- TOC entry 6246 (class 2606 OID 111848)
-- Name: arm_CashReceiptDetail arm_CashReceiptDetail_company_id_cashReceipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CashReceiptDetail"
    ADD CONSTRAINT "arm_CashReceiptDetail_company_id_cashReceipt_id_fkey" FOREIGN KEY (company_id, "cashReceipt_id") REFERENCES public."arm_CashReceipt"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6215 (class 2606 OID 111693)
-- Name: arm_CreditNoteDetail arm_CreditNoteDetail_company_id_creditNote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNoteDetail"
    ADD CONSTRAINT "arm_CreditNoteDetail_company_id_creditNote_id_fkey" FOREIGN KEY (company_id, "creditNote_id") REFERENCES public."arm_CreditNote"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6208 (class 2606 OID 111668)
-- Name: arm_CreditNote arm_CreditNote_company_id_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_complaint_id_fkey" FOREIGN KEY (company_id, complaint_id) REFERENCES public."wks_CustomerComplaint"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6209 (class 2606 OID 111678)
-- Name: arm_CreditNote arm_CreditNote_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6210 (class 2606 OID 111658)
-- Name: arm_CreditNote arm_CreditNote_company_id_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_invoice_id_fkey" FOREIGN KEY (company_id, invoice_id) REFERENCES public."arm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6211 (class 2606 OID 111688)
-- Name: arm_CreditNote arm_CreditNote_company_id_refundBankAccount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_refundBankAccount_id_fkey" FOREIGN KEY (company_id, "refundBankAccount_id") REFERENCES public."acc_BankAccount"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6212 (class 2606 OID 111663)
-- Name: arm_CreditNote arm_CreditNote_company_id_serviceOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_serviceOrder_id_fkey" FOREIGN KEY (company_id, "serviceOrder_id") REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6213 (class 2606 OID 111673)
-- Name: arm_CreditNote arm_CreditNote_company_id_serviceRework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_serviceRework_id_fkey" FOREIGN KEY (company_id, "serviceRework_id") REFERENCES public."wks_ServiceRework"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6214 (class 2606 OID 111683)
-- Name: arm_CreditNote arm_CreditNote_company_id_vehicle_customer_id_customerVehi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_CreditNote"
    ADD CONSTRAINT "arm_CreditNote_company_id_vehicle_customer_id_customerVehi_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6239 (class 2606 OID 111813)
-- Name: arm_InvoiceDetail arm_InvoiceDetail_company_id_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_InvoiceDetail"
    ADD CONSTRAINT "arm_InvoiceDetail_company_id_invoice_id_fkey" FOREIGN KEY (company_id, invoice_id) REFERENCES public."arm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6235 (class 2606 OID 111793)
-- Name: arm_Invoice arm_Invoice_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Invoice"
    ADD CONSTRAINT "arm_Invoice_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6236 (class 2606 OID 111803)
-- Name: arm_Invoice arm_Invoice_company_id_source_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Invoice"
    ADD CONSTRAINT "arm_Invoice_company_id_source_document_id_fkey" FOREIGN KEY (company_id, source_document_id) REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6237 (class 2606 OID 111808)
-- Name: arm_Invoice arm_Invoice_company_id_taxScheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Invoice"
    ADD CONSTRAINT "arm_Invoice_company_id_taxScheme_id_fkey" FOREIGN KEY (company_id, "taxScheme_id") REFERENCES public."cmf_TaxScheme"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6238 (class 2606 OID 111798)
-- Name: arm_Invoice arm_Invoice_company_id_vehicle_customer_id_customerVehicle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Invoice"
    ADD CONSTRAINT "arm_Invoice_company_id_vehicle_customer_id_customerVehicle_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6244 (class 2606 OID 111838)
-- Name: arm_PaymentDetail arm_PaymentDetail_company_id_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_PaymentDetail"
    ADD CONSTRAINT "arm_PaymentDetail_company_id_payment_id_fkey" FOREIGN KEY (company_id, payment_id) REFERENCES public."arm_Payment"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6245 (class 2606 OID 111843)
-- Name: arm_PaymentDetail arm_PaymentDetail_paymentMethod_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_PaymentDetail"
    ADD CONSTRAINT "arm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES public."cmf_PaymentMethod"(id) ON DELETE RESTRICT;


--
-- TOC entry 6240 (class 2606 OID 111833)
-- Name: arm_Payment arm_Payment_company_id_bankAccount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Payment"
    ADD CONSTRAINT "arm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY (company_id, "bankAccount_id") REFERENCES public."acc_BankAccount"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6241 (class 2606 OID 111823)
-- Name: arm_Payment arm_Payment_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Payment"
    ADD CONSTRAINT "arm_Payment_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6242 (class 2606 OID 111818)
-- Name: arm_Payment arm_Payment_company_id_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Payment"
    ADD CONSTRAINT "arm_Payment_company_id_invoice_id_fkey" FOREIGN KEY (company_id, invoice_id) REFERENCES public."arm_Invoice"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6243 (class 2606 OID 111828)
-- Name: arm_Payment arm_Payment_paymentMethod_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."arm_Payment"
    ADD CONSTRAINT "arm_Payment_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES public."cmf_PaymentMethod"(id) ON DELETE RESTRICT;


--
-- TOC entry 6170 (class 2606 OID 111468)
-- Name: cmf_CustomerContactPerson cmf_CustomerContactPerson_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerContactPerson"
    ADD CONSTRAINT "cmf_CustomerContactPerson_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6171 (class 2606 OID 111473)
-- Name: cmf_CustomerVehicle cmf_CustomerVehicle_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerVehicle"
    ADD CONSTRAINT "cmf_CustomerVehicle_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6172 (class 2606 OID 111478)
-- Name: cmf_CustomerVehicle cmf_CustomerVehicle_vehicleType_id_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerVehicle"
    ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", brand_id) REFERENCES public."wks_VehicleBrand"("vehicleType_id", id) ON DELETE RESTRICT;


--
-- TOC entry 6173 (class 2606 OID 111483)
-- Name: cmf_CustomerVehicle cmf_CustomerVehicle_vehicleType_id_brand_id_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_CustomerVehicle"
    ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_model_id_fkey" FOREIGN KEY ("vehicleType_id", brand_id, model_id) REFERENCES public."wks_VehicleModel"("vehicleType_id", brand_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6174 (class 2606 OID 111488)
-- Name: cmf_Mechanic cmf_Mechanic_company_id_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_Mechanic"
    ADD CONSTRAINT "cmf_Mechanic_company_id_employee_id_fkey" FOREIGN KEY (company_id, employee_id) REFERENCES public."cmf_Employee"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6233 (class 2606 OID 111788)
-- Name: cmf_TaxSchemeDetail cmf_TaxSchemeDetail_company_id_taxAccount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TaxSchemeDetail"
    ADD CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxAccount_id_fkey" FOREIGN KEY (company_id, "taxAccount_id") REFERENCES public."acc_COA"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6234 (class 2606 OID 111783)
-- Name: cmf_TaxSchemeDetail cmf_TaxSchemeDetail_company_id_taxScheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TaxSchemeDetail"
    ADD CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxScheme_id_fkey" FOREIGN KEY (company_id, "taxScheme_id") REFERENCES public."cmf_TaxScheme"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6232 (class 2606 OID 111778)
-- Name: cmf_TaxScheme cmf_TaxScheme_company_id_taxAccount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cmf_TaxScheme"
    ADD CONSTRAINT "cmf_TaxScheme_company_id_taxAccount_id_fkey" FOREIGN KEY (company_id, "taxAccount_id") REFERENCES public."acc_COA"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6153 (class 2606 OID 111383)
-- Name: imc_Category imc_Category_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Category"
    ADD CONSTRAINT "imc_Category_type_fkey" FOREIGN KEY (type) REFERENCES public."imc_CategoryType"(id) ON DELETE RESTRICT;


--
-- TOC entry 6149 (class 2606 OID 111363)
-- Name: imc_Floor imc_Floor_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Floor"
    ADD CONSTRAINT "imc_Floor_warehouse_id_fkey" FOREIGN KEY (warehouse_id) REFERENCES public."imc_Warehouse"(id) ON UPDATE CASCADE;


--
-- TOC entry 6160 (class 2606 OID 111418)
-- Name: imc_ProductImage imc_ProductImage_product_id_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductImage"
    ADD CONSTRAINT "imc_ProductImage_product_id_company_id_fkey" FOREIGN KEY (product_id, company_id) REFERENCES public."imc_Product"(id, company_id) ON DELETE RESTRICT;


--
-- TOC entry 6159 (class 2606 OID 111413)
-- Name: imc_ProductStock imc_ProductStock_id_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductStock"
    ADD CONSTRAINT "imc_ProductStock_id_company_id_fkey" FOREIGN KEY (id, company_id) REFERENCES public."imc_Product"(id, company_id) ON DELETE RESTRICT;


--
-- TOC entry 6167 (class 2606 OID 111453)
-- Name: imc_ProductVariantImage imc_ProductVariantImage_company_id_product_id_productVaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantImage"
    ADD CONSTRAINT "imc_ProductVariantImage_company_id_product_id_productVaria_fkey" FOREIGN KEY (company_id, product_id, "productVariant_id") REFERENCES public."imc_ProductVariant"(company_id, product_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6165 (class 2606 OID 111443)
-- Name: imc_ProductVariantOption imc_ProductVariantOption_company_id_product_id_productVari_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantOption"
    ADD CONSTRAINT "imc_ProductVariantOption_company_id_product_id_productVari_fkey" FOREIGN KEY (company_id, product_id, "productVariant_id") REFERENCES public."imc_ProductVariant"(company_id, product_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6166 (class 2606 OID 111448)
-- Name: imc_ProductVariantOption imc_ProductVariantOption_company_id_variantType_id_variant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantOption"
    ADD CONSTRAINT "imc_ProductVariantOption_company_id_variantType_id_variant_fkey" FOREIGN KEY (company_id, "variantType_id", "variantOption_id") REFERENCES public."imc_VariantOption"(company_id, "variantType_id", id) ON DELETE RESTRICT;


--
-- TOC entry 6162 (class 2606 OID 111428)
-- Name: imc_ProductVariantType imc_ProductVariantType_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantType"
    ADD CONSTRAINT "imc_ProductVariantType_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6163 (class 2606 OID 111433)
-- Name: imc_ProductVariantType imc_ProductVariantType_company_id_variantType_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariantType"
    ADD CONSTRAINT "imc_ProductVariantType_company_id_variantType_id_fkey" FOREIGN KEY (company_id, "variantType_id") REFERENCES public."imc_VariantType"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6164 (class 2606 OID 111438)
-- Name: imc_ProductVariant imc_ProductVariant_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_ProductVariant"
    ADD CONSTRAINT "imc_ProductVariant_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6155 (class 2606 OID 111408)
-- Name: imc_Product imc_Product_company_id_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Product"
    ADD CONSTRAINT "imc_Product_company_id_brand_id_fkey" FOREIGN KEY (company_id, brand_id) REFERENCES public."imc_Brand"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6156 (class 2606 OID 111393)
-- Name: imc_Product imc_Product_company_id_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Product"
    ADD CONSTRAINT "imc_Product_company_id_category_id_fkey" FOREIGN KEY (company_id, category_id) REFERENCES public."imc_Category"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6157 (class 2606 OID 111398)
-- Name: imc_Product imc_Product_company_id_category_id_subCategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Product"
    ADD CONSTRAINT "imc_Product_company_id_category_id_subCategory_id_fkey" FOREIGN KEY (company_id, category_id, "subCategory_id") REFERENCES public."imc_SubCategory"(company_id, category_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6158 (class 2606 OID 111403)
-- Name: imc_Product imc_Product_company_id_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Product"
    ADD CONSTRAINT "imc_Product_company_id_uom_id_fkey" FOREIGN KEY (company_id, uom_id) REFERENCES public."imc_Uom"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6151 (class 2606 OID 111373)
-- Name: imc_Row imc_Row_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Row"
    ADD CONSTRAINT "imc_Row_floor_id_fkey" FOREIGN KEY (floor_id) REFERENCES public."imc_Floor"(id) ON UPDATE CASCADE;


--
-- TOC entry 6152 (class 2606 OID 111378)
-- Name: imc_Row imc_Row_floor_id_shelf_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Row"
    ADD CONSTRAINT "imc_Row_floor_id_shelf_id_fkey" FOREIGN KEY (floor_id, shelf_id) REFERENCES public."imc_Shelf"(floor_id, id) ON UPDATE CASCADE;


--
-- TOC entry 6150 (class 2606 OID 111368)
-- Name: imc_Shelf imc_Shelf_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_Shelf"
    ADD CONSTRAINT "imc_Shelf_floor_id_fkey" FOREIGN KEY (floor_id) REFERENCES public."imc_Floor"(id) ON UPDATE CASCADE;


--
-- TOC entry 6154 (class 2606 OID 111388)
-- Name: imc_SubCategory imc_SubCategory_company_id_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_SubCategory"
    ADD CONSTRAINT "imc_SubCategory_company_id_category_id_fkey" FOREIGN KEY (company_id, category_id) REFERENCES public."imc_Category"(company_id, id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6161 (class 2606 OID 111423)
-- Name: imc_VariantOption imc_VariantOption_company_id_variantType_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."imc_VariantOption"
    ADD CONSTRAINT "imc_VariantOption_company_id_variantType_id_fkey" FOREIGN KEY (company_id, "variantType_id") REFERENCES public."imc_VariantType"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6228 (class 2606 OID 111758)
-- Name: inv_InternalMovementDetail inv_InternalMovementDetail_company_id_internalMovement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovementDetail"
    ADD CONSTRAINT "inv_InternalMovementDetail_company_id_internalMovement_id_fkey" FOREIGN KEY (company_id, "internalMovement_id") REFERENCES public."inv_InternalMovement"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6229 (class 2606 OID 111763)
-- Name: inv_InternalMovementDetail inv_InternalMovementDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovementDetail"
    ADD CONSTRAINT "inv_InternalMovementDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6226 (class 2606 OID 111753)
-- Name: inv_InternalMovement inv_InternalMovement_destWarehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovement"
    ADD CONSTRAINT "inv_InternalMovement_destWarehouse_id_fkey" FOREIGN KEY ("destWarehouse_id") REFERENCES public."imc_Warehouse"(id) ON DELETE SET NULL;


--
-- TOC entry 6227 (class 2606 OID 111748)
-- Name: inv_InternalMovement inv_InternalMovement_sourceWarehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."inv_InternalMovement"
    ADD CONSTRAINT "inv_InternalMovement_sourceWarehouse_id_fkey" FOREIGN KEY ("sourceWarehouse_id") REFERENCES public."imc_Warehouse"(id) ON DELETE SET NULL;


--
-- TOC entry 6218 (class 2606 OID 111713)
-- Name: prc_PurchaseOrderDetail prc_PurchaseOrderDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrderDetail"
    ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6219 (class 2606 OID 111708)
-- Name: prc_PurchaseOrderDetail prc_PurchaseOrderDetail_company_id_purchaseOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrderDetail"
    ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_purchaseOrder_id_fkey" FOREIGN KEY (company_id, "purchaseOrder_id") REFERENCES public."prc_PurchaseOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6216 (class 2606 OID 111698)
-- Name: prc_PurchaseOrder prc_PurchaseOrder_company_id_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrder"
    ADD CONSTRAINT "prc_PurchaseOrder_company_id_supplier_id_fkey" FOREIGN KEY (company_id, supplier_id) REFERENCES public."prc_Supplier"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6217 (class 2606 OID 111703)
-- Name: prc_PurchaseOrder prc_PurchaseOrder_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseOrder"
    ADD CONSTRAINT "prc_PurchaseOrder_warehouse_id_fkey" FOREIGN KEY (warehouse_id) REFERENCES public."imc_Warehouse"(id) ON DELETE SET NULL;


--
-- TOC entry 6223 (class 2606 OID 111743)
-- Name: prc_PurchaseReceiveDetail prc_PurchaseReceiveDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceiveDetail"
    ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6224 (class 2606 OID 111738)
-- Name: prc_PurchaseReceiveDetail prc_PurchaseReceiveDetail_company_id_purchaseOrderDetail_i_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceiveDetail"
    ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseOrderDetail_i_fkey" FOREIGN KEY (company_id, "purchaseOrderDetail_id") REFERENCES public."prc_PurchaseOrderDetail"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6225 (class 2606 OID 111733)
-- Name: prc_PurchaseReceiveDetail prc_PurchaseReceiveDetail_company_id_purchaseReceive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceiveDetail"
    ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseReceive_id_fkey" FOREIGN KEY (company_id, "purchaseReceive_id") REFERENCES public."prc_PurchaseReceive"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6220 (class 2606 OID 111718)
-- Name: prc_PurchaseReceive prc_PurchaseReceive_company_id_purchaseOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceive"
    ADD CONSTRAINT "prc_PurchaseReceive_company_id_purchaseOrder_id_fkey" FOREIGN KEY (company_id, "purchaseOrder_id") REFERENCES public."prc_PurchaseOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6221 (class 2606 OID 111723)
-- Name: prc_PurchaseReceive prc_PurchaseReceive_company_id_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceive"
    ADD CONSTRAINT "prc_PurchaseReceive_company_id_supplier_id_fkey" FOREIGN KEY (company_id, supplier_id) REFERENCES public."prc_Supplier"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6222 (class 2606 OID 111728)
-- Name: prc_PurchaseReceive prc_PurchaseReceive_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReceive"
    ADD CONSTRAINT "prc_PurchaseReceive_warehouse_id_fkey" FOREIGN KEY (warehouse_id) REFERENCES public."imc_Warehouse"(id) ON DELETE SET NULL;


--
-- TOC entry 6263 (class 2606 OID 111938)
-- Name: prc_PurchaseReturnDetail prc_PurchaseReturnDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturnDetail"
    ADD CONSTRAINT "prc_PurchaseReturnDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6264 (class 2606 OID 111933)
-- Name: prc_PurchaseReturnDetail prc_PurchaseReturnDetail_company_id_purchaseReturn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturnDetail"
    ADD CONSTRAINT "prc_PurchaseReturnDetail_company_id_purchaseReturn_id_fkey" FOREIGN KEY (company_id, "purchaseReturn_id") REFERENCES public."prc_PurchaseReturn"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6259 (class 2606 OID 111918)
-- Name: prc_PurchaseReturn prc_PurchaseReturn_company_id_purchaseOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturn"
    ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseOrder_id_fkey" FOREIGN KEY (company_id, "purchaseOrder_id") REFERENCES public."prc_PurchaseOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6260 (class 2606 OID 111913)
-- Name: prc_PurchaseReturn prc_PurchaseReturn_company_id_purchaseReceive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturn"
    ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseReceive_id_fkey" FOREIGN KEY (company_id, "purchaseReceive_id") REFERENCES public."prc_PurchaseReceive"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6261 (class 2606 OID 111923)
-- Name: prc_PurchaseReturn prc_PurchaseReturn_company_id_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturn"
    ADD CONSTRAINT "prc_PurchaseReturn_company_id_supplier_id_fkey" FOREIGN KEY (company_id, supplier_id) REFERENCES public."prc_Supplier"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6262 (class 2606 OID 111928)
-- Name: prc_PurchaseReturn prc_PurchaseReturn_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."prc_PurchaseReturn"
    ADD CONSTRAINT "prc_PurchaseReturn_warehouse_id_fkey" FOREIGN KEY (warehouse_id) REFERENCES public."imc_Warehouse"(id) ON DELETE SET NULL;


--
-- TOC entry 6133 (class 2606 OID 111288)
-- Name: saas_CompanyAddon saas_CompanyAddon_addon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanyAddon"
    ADD CONSTRAINT "saas_CompanyAddon_addon_id_fkey" FOREIGN KEY (addon_id) REFERENCES public."saas_AddonFeature"(id) ON DELETE RESTRICT;


--
-- TOC entry 6134 (class 2606 OID 111283)
-- Name: saas_CompanyAddon saas_CompanyAddon_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanyAddon"
    ADD CONSTRAINT "saas_CompanyAddon_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON DELETE RESTRICT;


--
-- TOC entry 6135 (class 2606 OID 111278)
-- Name: saas_CompanyAddon saas_CompanyAddon_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanyAddon"
    ADD CONSTRAINT "saas_CompanyAddon_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public."saas_CompanySubscription"(id) ON DELETE RESTRICT;


--
-- TOC entry 6126 (class 2606 OID 111243)
-- Name: saas_CompanySubscription saas_CompanySubscription_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanySubscription"
    ADD CONSTRAINT "saas_CompanySubscription_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON DELETE RESTRICT;


--
-- TOC entry 6127 (class 2606 OID 111248)
-- Name: saas_CompanySubscription saas_CompanySubscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_CompanySubscription"
    ADD CONSTRAINT "saas_CompanySubscription_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public."saas_SubscriptionPlan"(id) ON DELETE RESTRICT;


--
-- TOC entry 6128 (class 2606 OID 111253)
-- Name: saas_PlanFeature saas_PlanFeature_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_PlanFeature"
    ADD CONSTRAINT "saas_PlanFeature_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public."saas_SubscriptionPlan"(id) ON DELETE RESTRICT;


--
-- TOC entry 6129 (class 2606 OID 111263)
-- Name: saas_SubscriptionBilling saas_SubscriptionBilling_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_SubscriptionBilling"
    ADD CONSTRAINT "saas_SubscriptionBilling_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON DELETE RESTRICT;


--
-- TOC entry 6130 (class 2606 OID 111258)
-- Name: saas_SubscriptionBilling saas_SubscriptionBilling_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_SubscriptionBilling"
    ADD CONSTRAINT "saas_SubscriptionBilling_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public."saas_CompanySubscription"(id) ON DELETE RESTRICT;


--
-- TOC entry 6131 (class 2606 OID 111273)
-- Name: saas_UsageTracking saas_UsageTracking_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_UsageTracking"
    ADD CONSTRAINT "saas_UsageTracking_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON DELETE RESTRICT;


--
-- TOC entry 6132 (class 2606 OID 111268)
-- Name: saas_UsageTracking saas_UsageTracking_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."saas_UsageTracking"
    ADD CONSTRAINT "saas_UsageTracking_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public."saas_CompanySubscription"(id) ON DELETE RESTRICT;


--
-- TOC entry 6275 (class 2606 OID 128659)
-- Name: sys_Branch sys_Branch_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Branch"
    ADD CONSTRAINT "sys_Branch_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6137 (class 2606 OID 111303)
-- Name: sys_EmailVerification sys_EmailVerification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_EmailVerification"
    ADD CONSTRAINT "sys_EmailVerification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."sys_User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6146 (class 2606 OID 111348)
-- Name: sys_Menu_Permission sys_Menu_Permission_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Menu_Permission"
    ADD CONSTRAINT "sys_Menu_Permission_menu_id_fkey" FOREIGN KEY (menu_id) REFERENCES public."sys_Menu"(id) ON UPDATE CASCADE;


--
-- TOC entry 6147 (class 2606 OID 111353)
-- Name: sys_Menu_Permission sys_Menu_Permission_userCompanyRole_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Menu_Permission"
    ADD CONSTRAINT "sys_Menu_Permission_userCompanyRole_id_fkey" FOREIGN KEY ("userCompanyRole_id") REFERENCES public."sys_UserCompanyRole"(id) ON UPDATE CASCADE;


--
-- TOC entry 6145 (class 2606 OID 111343)
-- Name: sys_Menu sys_Menu_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Menu"
    ADD CONSTRAINT "sys_Menu_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."sys_Menu"(id) ON UPDATE CASCADE;


--
-- TOC entry 6148 (class 2606 OID 111358)
-- Name: sys_Numbering sys_Numbering_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Numbering"
    ADD CONSTRAINT "sys_Numbering_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public."sys_Module"(id) ON UPDATE CASCADE;


--
-- TOC entry 6139 (class 2606 OID 111313)
-- Name: sys_PasswordReset sys_PasswordReset_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_PasswordReset"
    ADD CONSTRAINT "sys_PasswordReset_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."sys_User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6196 (class 2606 OID 111598)
-- Name: sys_ReminderLog sys_ReminderLog_company_id_reminder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_ReminderLog"
    ADD CONSTRAINT "sys_ReminderLog_company_id_reminder_id_fkey" FOREIGN KEY (company_id, reminder_id) REFERENCES public."sys_Reminder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6194 (class 2606 OID 111588)
-- Name: sys_Reminder sys_Reminder_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Reminder"
    ADD CONSTRAINT "sys_Reminder_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6195 (class 2606 OID 111593)
-- Name: sys_Reminder sys_Reminder_company_id_parentReminder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Reminder"
    ADD CONSTRAINT "sys_Reminder_company_id_parentReminder_id_fkey" FOREIGN KEY (company_id, "parentReminder_id") REFERENCES public."sys_Reminder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6140 (class 2606 OID 111318)
-- Name: sys_Session sys_Session_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_Session"
    ADD CONSTRAINT "sys_Session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."sys_User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6138 (class 2606 OID 111308)
-- Name: sys_TwoFactorToken sys_TwoFactorToken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_TwoFactorToken"
    ADD CONSTRAINT "sys_TwoFactorToken_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."sys_User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6143 (class 2606 OID 111338)
-- Name: sys_UserCompanyRole sys_UserCompanyRole_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserCompanyRole"
    ADD CONSTRAINT "sys_UserCompanyRole_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."sys_Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6144 (class 2606 OID 111333)
-- Name: sys_UserCompanyRole sys_UserCompanyRole_userRole_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserCompanyRole"
    ADD CONSTRAINT "sys_UserCompanyRole_userRole_id_fkey" FOREIGN KEY ("userRole_id") REFERENCES public."sys_UserRole"(id) ON UPDATE CASCADE;


--
-- TOC entry 6141 (class 2606 OID 111323)
-- Name: sys_UserRole sys_UserRole_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserRole"
    ADD CONSTRAINT "sys_UserRole_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."sys_Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6142 (class 2606 OID 111328)
-- Name: sys_UserRole sys_UserRole_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_UserRole"
    ADD CONSTRAINT "sys_UserRole_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."sys_User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6136 (class 2606 OID 111298)
-- Name: sys_User sys_User_company_id_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sys_User"
    ADD CONSTRAINT "sys_User_company_id_employee_id_fkey" FOREIGN KEY (company_id, employee_id) REFERENCES public."cmf_Employee"(company_id, id) ON DELETE SET NULL;


--
-- TOC entry 6176 (class 2606 OID 111498)
-- Name: wks_BayBlock wks_BayBlock_company_id_bay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BayBlock"
    ADD CONSTRAINT "wks_BayBlock_company_id_bay_id_fkey" FOREIGN KEY (company_id, bay_id) REFERENCES public."wks_ServiceBay"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6177 (class 2606 OID 111503)
-- Name: wks_BookingSlot wks_BookingSlot_company_id_bay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_BookingSlot"
    ADD CONSTRAINT "wks_BookingSlot_company_id_bay_id_fkey" FOREIGN KEY (company_id, bay_id) REFERENCES public."wks_ServiceBay"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6200 (class 2606 OID 111618)
-- Name: wks_ComplaintLog wks_ComplaintLog_company_id_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ComplaintLog"
    ADD CONSTRAINT "wks_ComplaintLog_company_id_complaint_id_fkey" FOREIGN KEY (company_id, complaint_id) REFERENCES public."wks_CustomerComplaint"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6197 (class 2606 OID 111608)
-- Name: wks_CustomerComplaint wks_CustomerComplaint_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_CustomerComplaint"
    ADD CONSTRAINT "wks_CustomerComplaint_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6198 (class 2606 OID 111603)
-- Name: wks_CustomerComplaint wks_CustomerComplaint_company_id_serviceOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_CustomerComplaint"
    ADD CONSTRAINT "wks_CustomerComplaint_company_id_serviceOrder_id_fkey" FOREIGN KEY (company_id, "serviceOrder_id") REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6199 (class 2606 OID 111613)
-- Name: wks_CustomerComplaint wks_CustomerComplaint_company_id_vehicle_customer_id_custo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_CustomerComplaint"
    ADD CONSTRAINT "wks_CustomerComplaint_company_id_vehicle_customer_id_custo_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6175 (class 2606 OID 111493)
-- Name: wks_MechanicAvailability wks_MechanicAvailability_company_id_mechanic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_MechanicAvailability"
    ADD CONSTRAINT "wks_MechanicAvailability_company_id_mechanic_id_fkey" FOREIGN KEY (company_id, mechanic_id) REFERENCES public."cmf_Mechanic"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6178 (class 2606 OID 111523)
-- Name: wks_ServiceBooking wks_ServiceBooking_company_id_bay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "wks_ServiceBooking_company_id_bay_id_fkey" FOREIGN KEY (company_id, bay_id) REFERENCES public."wks_ServiceBay"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6179 (class 2606 OID 111513)
-- Name: wks_ServiceBooking wks_ServiceBooking_company_id_customer_id_customerVehicle__fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "wks_ServiceBooking_company_id_customer_id_customerVehicle__fkey" FOREIGN KEY (company_id, customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6180 (class 2606 OID 111508)
-- Name: wks_ServiceBooking wks_ServiceBooking_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "wks_ServiceBooking_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6181 (class 2606 OID 111518)
-- Name: wks_ServiceBooking wks_ServiceBooking_company_id_mechanic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "wks_ServiceBooking_company_id_mechanic_id_fkey" FOREIGN KEY (company_id, mechanic_id) REFERENCES public."cmf_Mechanic"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6182 (class 2606 OID 111528)
-- Name: wks_ServiceBooking wks_ServiceBooking_company_id_serviceType_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceBooking"
    ADD CONSTRAINT "wks_ServiceBooking_company_id_serviceType_id_fkey" FOREIGN KEY (company_id, "serviceType_id") REFERENCES public."wks_ServiceType"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6191 (class 2606 OID 111578)
-- Name: wks_ServiceHistory wks_ServiceHistory_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceHistory"
    ADD CONSTRAINT "wks_ServiceHistory_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6192 (class 2606 OID 111573)
-- Name: wks_ServiceHistory wks_ServiceHistory_company_id_serviceOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceHistory"
    ADD CONSTRAINT "wks_ServiceHistory_company_id_serviceOrder_id_fkey" FOREIGN KEY (company_id, "serviceOrder_id") REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6193 (class 2606 OID 111583)
-- Name: wks_ServiceHistory wks_ServiceHistory_company_id_vehicle_customer_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceHistory"
    ADD CONSTRAINT "wks_ServiceHistory_company_id_vehicle_customer_id_customer_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6187 (class 2606 OID 111563)
-- Name: wks_ServiceOrderDetail wks_ServiceOrderDetail_company_id_mechanic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrderDetail"
    ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_mechanic_id_fkey" FOREIGN KEY (company_id, mechanic_id) REFERENCES public."cmf_Mechanic"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6188 (class 2606 OID 111568)
-- Name: wks_ServiceOrderDetail wks_ServiceOrderDetail_company_id_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrderDetail"
    ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_product_id_fkey" FOREIGN KEY (company_id, product_id) REFERENCES public."imc_Product"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6189 (class 2606 OID 111553)
-- Name: wks_ServiceOrderDetail wks_ServiceOrderDetail_company_id_serviceOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrderDetail"
    ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceOrder_id_fkey" FOREIGN KEY (company_id, "serviceOrder_id") REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6190 (class 2606 OID 111558)
-- Name: wks_ServiceOrderDetail wks_ServiceOrderDetail_company_id_serviceType_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrderDetail"
    ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceType_id_fkey" FOREIGN KEY (company_id, "serviceType_id") REFERENCES public."wks_ServiceType"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6183 (class 2606 OID 111533)
-- Name: wks_ServiceOrder wks_ServiceOrder_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrder"
    ADD CONSTRAINT "wks_ServiceOrder_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6184 (class 2606 OID 111543)
-- Name: wks_ServiceOrder wks_ServiceOrder_company_id_mechanic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrder"
    ADD CONSTRAINT "wks_ServiceOrder_company_id_mechanic_id_fkey" FOREIGN KEY (company_id, mechanic_id) REFERENCES public."cmf_Mechanic"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6185 (class 2606 OID 111548)
-- Name: wks_ServiceOrder wks_ServiceOrder_company_id_serviceBay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrder"
    ADD CONSTRAINT "wks_ServiceOrder_company_id_serviceBay_id_fkey" FOREIGN KEY (company_id, "serviceBay_id") REFERENCES public."wks_ServiceBay"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6186 (class 2606 OID 111538)
-- Name: wks_ServiceOrder wks_ServiceOrder_company_id_vehicle_customer_id_customerVe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceOrder"
    ADD CONSTRAINT "wks_ServiceOrder_company_id_vehicle_customer_id_customerVe_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6207 (class 2606 OID 111653)
-- Name: wks_ServiceReworkItem wks_ServiceReworkItem_company_id_serviceRework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceReworkItem"
    ADD CONSTRAINT "wks_ServiceReworkItem_company_id_serviceRework_id_fkey" FOREIGN KEY (company_id, "serviceRework_id") REFERENCES public."wks_ServiceRework"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6201 (class 2606 OID 111628)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_complaint_id_fkey" FOREIGN KEY (company_id, complaint_id) REFERENCES public."wks_CustomerComplaint"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6202 (class 2606 OID 111633)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_customer_id_fkey" FOREIGN KEY (company_id, customer_id) REFERENCES public."cmf_Customer"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6203 (class 2606 OID 111643)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_mechanic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_mechanic_id_fkey" FOREIGN KEY (company_id, mechanic_id) REFERENCES public."cmf_Mechanic"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6204 (class 2606 OID 111623)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_originalServiceOrder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_originalServiceOrder_id_fkey" FOREIGN KEY (company_id, "originalServiceOrder_id") REFERENCES public."wks_ServiceOrder"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6205 (class 2606 OID 111648)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_serviceBay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_serviceBay_id_fkey" FOREIGN KEY (company_id, "serviceBay_id") REFERENCES public."wks_ServiceBay"(company_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6206 (class 2606 OID 111638)
-- Name: wks_ServiceRework wks_ServiceRework_company_id_vehicle_customer_id_customerV_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_ServiceRework"
    ADD CONSTRAINT "wks_ServiceRework_company_id_vehicle_customer_id_customerV_fkey" FOREIGN KEY (company_id, vehicle_customer_id, "customerVehicle_id") REFERENCES public."cmf_CustomerVehicle"(company_id, customer_id, id) ON DELETE RESTRICT;


--
-- TOC entry 6168 (class 2606 OID 111458)
-- Name: wks_VehicleBrand wks_VehicleBrand_vehicleType_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_VehicleBrand"
    ADD CONSTRAINT "wks_VehicleBrand_vehicleType_id_fkey" FOREIGN KEY ("vehicleType_id") REFERENCES public."wks_VehicleType"(id) ON DELETE RESTRICT;


--
-- TOC entry 6169 (class 2606 OID 111463)
-- Name: wks_VehicleModel wks_VehicleModel_vehicleType_id_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."wks_VehicleModel"
    ADD CONSTRAINT "wks_VehicleModel_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", brand_id) REFERENCES public."wks_VehicleBrand"("vehicleType_id", id) ON DELETE RESTRICT;


-- Completed on 2025-11-03 08:24:09

--
-- PostgreSQL database dump complete
--

\unrestrict FYSM9MbheKGMVYyEEHgXPsqJHBlwTUkO0i6dWSnyG1d9XHZvmYeqjUYo7KOtWF1

