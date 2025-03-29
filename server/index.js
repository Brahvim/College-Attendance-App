import os from "node:os";
import fs from "node:fs";

import express from "express";
import mariadb from "mariadb";

//#region Statics.
const s_branches = new Set(["cs", "ee"]);
const s_branchToRollSection = {
	"cs": "005",
	"ee": "004",
};

const s_secrets = JSON.parse(fs.readFileSync("./secrets.json"));
const s_port = 8080;
const s_app = express();
const s_pathFront = ".";
const s_pool = mariadb.createPool({
	port: 3306,
	host: "127.0.0.1",
	connectionLimit: 50,
	idleTimeout: 1_000,
	user: s_secrets.username,
	database: "leaves_app_db",
	password: s_secrets.password,
});
const s_pathAttendance = "./attendance";
//#endregion

s_app.use(express.static(s_pathFront)); // Serve those pages FIRST!
s_app.use(express.json()); // THEN parse the backend stuff. PERFORMANCE!!!

s_app.get("/submit", (p_request, p_response) => {

	// WE TIME FIRST!:
	const date = new Date();
	const day = date.getDate();
	const year = date.getFullYear();

	const query = p_request.query;
	// Will put this into a daily-set timer, *maybe*, so even a broken CMOS battery lasts a day.

	// Data-data-da:
	let { branch: queryBranch, roll: queryRoll } = query;
	queryBranch = queryBranch.toLowerCase();


	if (!s_branches.has(queryBranch)) {

		p_response.status(400).send("Yo' branch, kid >:|");
		return;

	}

	const branchRollSection = s_branchToRollSection[queryBranch];
	switch (queryRoll.length) {

		case 4: { queryRoll = "2203" + branchRollSection + queryRoll; } break;
		case 3: { queryRoll = "2203" + branchRollSection + "0" + queryRoll; } break;
		case 2: { queryRoll = "2203" + branchRollSection + "00" + queryRoll; } break;
		case 1: { queryRoll = "2203" + branchRollSection + "000" + queryRoll; } break;

		case (4 + 3 + 4): {
		} break;

		default: {

			p_response.status(400).send("Yo' roll numba', kid >:|");
			return;

		} break;

	}

	queryRoll = new Number(queryRoll);

	const reasonsArr = [
		query["reasonIll"],
		query["reasonFam"],
		query["reasonEvt"]
	];

	let reasonsBits = 0;
	for (let i = 0; i < reasonsArr.length; ++i) {

		if (reasonsArr[i]) {

			reasonsBits |= (1 << i);

		}

	}

	s_pool.getConnection()
		.then((p_conn) => {


			p_conn.query(
				`INSERT INTO leaves2025 (day, roll, reasons) 
				VALUES (?, ?, ?)
				ON DUPLICATE KEY UPDATE reasons = ?;`,
				[day, queryRoll, reasonsBits, reasonsBits]
			)
				.then(() => {

					p_response.status(200).send("Done :D!");

				})
				.catch((p_error) => {

					console.error(p_error);
					p_response.status(500).send("DB failed to record ya' :|");

				})
				.finally(() => p_conn.release());

		})
		.catch((p_error) => {

			console.error(p_error);
			p_response.status(500).send("DB busy :|");

		});

});

s_app.listen(s_port, () => console.log(`App is on [ http://localhost:${s_port} ].`));
