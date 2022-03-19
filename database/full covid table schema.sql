CREATE TABLE "full_covid_table" (
	"country_id" VARCHAR(255)   NOT NULL,
    "country_name" VARCHAR(255)   NOT NULL,
    "continent_name" VARCHAR(255),
    "population" BIGINT   NOT NULL,
    "date" VARCHAR(255)   NOT NULL,
    "confirmed" INT   NOT NULL,
    "deaths" INT   NOT NULL,
    "recovered" INT   NOT NULL,
    "active" INT   NOT NULL,
    "new_cases" INT   NOT NULL,
    "new_deaths" INT   NOT NULL,
    "new_recovered" INT   NOT NULL,
	"vaccinated_per_hundred" INT   NOT NULL,
    "fully_vaccinated_per_hundred" INT   NOT NULL,
    "boosted_per_hundred" INT   NOT NULL,
    "not_fully_vaccinated_per_hundred" INT   NOT NULL
);

SELECT * FROM full_covid_table