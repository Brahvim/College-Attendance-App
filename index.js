const g_onMobile = !!navigator.userAgent.toLowerCase().includes("mobile");

document.addEventListener("DOMContentLoaded", () => {

	const eltRadioCs = document.getElementById("branch-selector-cs");
	const eltRadioEe = document.getElementById("branch-selector-ee");
	const eltInputRoll = document.getElementById("roll-input");
	const eltPreNotif = document.getElementById("notif");
	const eltForm = document.getElementById("form");

	// These are only rough checks.
	// You HAVE TO keep a table in-DB to know which rolls actually exist in the college!

	eltInputRoll.addEventListener("input", () => {

		eltInputRoll.classList.add("changed");
		setTimeout(() => eltInputRoll.classList.remove("changed"), 500);

	});

	eltRadioCs.addEventListener("click", () => {

		eltInputRoll.setAttribute("min", 1);
		eltInputRoll.setAttribute("max", 22030059999);

	});

	eltRadioEe.addEventListener("click", () => {

		eltInputRoll.setAttribute("min", 1);
		eltInputRoll.setAttribute("max", 22030049999);

	});

	eltForm.addEventListener("submit", (p_event) => {

		p_event.preventDefault();

		const formData = new FormData(eltForm);
		const query = new URLSearchParams({

			roll: formData.get("roll"),
			branch: formData.get("branch"),

		});

		["reasonIll", "reasonFam", "reasonEvt"].forEach((p_key) => {

			if (formData.get(p_key)) {

				query.append(p_key, 1);

			}

		});

		// Left for debugging. Hahaha!
		const queryStr = query.toString();

		fetch(`/submit?${queryStr}`)
			.then(() => {

				eltPreNotif.textContent = "Done! :D"
				eltPreNotif.style.background = "#ffcc00";
				setTimeout(() => {

					eltPreNotif.classList.add("changed");
					setTimeout(() => eltPreNotif.classList.remove("changed"), 1500);

				}, 0);

			})
			.catch(() => {

				eltPreNotif.textContent = "Failed :/"
				eltPreNotif.style.background = "red";
				setTimeout(() => {

					eltPreNotif.classList.add("changed");
					setTimeout(() => eltPreNotif.classList.remove("changed"), 1500);

				}, 0);

			});

	});

});
