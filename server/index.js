import os from "node:os";
import fs from "node:fs";
import path from "node:path";

import express from "express";
import mariadb from "mariadb";

import secrets from "../secrets.json" with { type: json };

const s_port = 8080;
const s_app = express();
const s_pathFront = ".";
const s_pool = mariadb.createPool({
	host: "localhost",
	database: "leaves",
	connectionLimit: 25,
	user: secrets.username,
	password: secrets.password,
});
const s_pathAttendance = "./attendance";

s_app.use(express.static(s_pathFront)); // Serve those pages FIRST!
s_app.use(express.json()); // THEN parse the backend stuff. PERFORMANCE!!!

s_app.get("/submit", (p_request, p_response) => {

	// WE TIME FIRST!:
	const date = new Date();
	const query = p_request.query;

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	// Will put this into a daily-set timer, *maybe*, so even a broken CMOS battery lasts a day.

	// Data-data-da:
	let strReasons = "";
	const { branch, roll } = query;
	const { reasonIll, reasonFam, reasonEvt } = query;

	[
		reasonIll && "ill",
		reasonFam && "fam",
		reasonEvt && "evt"
	]
		.filter((p_element) => { if (p_element) return p_element; })
		.forEach((p_element) => {
			strReasons += p_element
			strReasons += ","
		});

	console.log(strReasons);

	const fpath = path.join(
		s_pathAttendance,
		"" + year,
		"" + 1 + month,
		"" + day,
		"" + branch,
		"" + roll + ".csv"
	);

	if (strReasons) {

		fs.mkdirSync(path.dirname(fpath), { recursive: true });
		fs.writeFile(fpath, strReasons, (p_error) => {

			if (p_error) {

				p_response.status(500).send("That server is 💫 DIZZY! 💫");

			}

			p_response.status(200).send("Done LOL.");

		});

	} else {

		p_response.status(200).send("Done LOL.");

	}

});

s_app.listen(s_port, () => console.log(`App is on [ http://localhost:${s_port} ].`));
