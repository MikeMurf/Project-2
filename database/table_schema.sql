CREATE TABLE "country_codes" (
    "country_id" VARCHAR(255)   NOT NULL,
    "country_name" VARCHAR(255)   NOT NULL,
    "continent_name" VARCHAR(255),
    CONSTRAINT "pk_country_codes" PRIMARY KEY (
        "country_id"
     )
);

CREATE TABLE "covid_cases" (
    "country_id" VARCHAR(255)   NOT NULL,
    "date" VARCHAR(255)   NOT NULL,
    "confirmed" INT   NOT NULL,
    "deaths" INT   NOT NULL,
    "recovered" INT   NOT NULL,
    "active" INT   NOT NULL,
    "new_cases" INT   NOT NULL,
    "new_deaths" INT   NOT NULL,
    "new_recovered" INT   NOT NULL
);

CREATE TABLE "population" (
    "country_id" VARCHAR(255)   NOT NULL,
    "population" BIGINT   NOT NULL
);

CREATE TABLE "vaccinations" (
    "country_id" VARCHAR(255)   NOT NULL,
    "date" VARCHAR(255)   NOT NULL,
    "vaccinated_per_hundred" INT   NOT NULL,
    "fully_vaccinated_per_hundred" INT   NOT NULL,
    "boosted_per_hundred" INT   NOT NULL,
    "not_fully_vaccinated_per_hundred" INT   NOT NULL
);

ALTER TABLE "covid_cases" ADD CONSTRAINT "fk_covid_cases_country_id" FOREIGN KEY("country_id")
REFERENCES "country_codes" ("country_id");

ALTER TABLE "population" ADD CONSTRAINT "fk_population_country_id" FOREIGN KEY("country_id")
REFERENCES "country_codes" ("country_id");

ALTER TABLE "vaccinations" ADD CONSTRAINT "fk_vaccinations_country_id" FOREIGN KEY("country_id")
REFERENCES "country_codes" ("country_id");

