document.addEventListener("DOMContentLoaded", () => {

	const eltInputRoll = document.getElementById("roll-input");
	const eltRadioCs = document.getElementById("branch-selector-cs");
	const eltRadioEe = document.getElementById("branch-selector-ee");

	// These are only rough checks.
	// You HAVE TO keep a table in-DB to know which rolls actually exist in the college!

	eltRadioCs.onclick = () => {

		eltInputRoll.setAttribute("min", 0);
		eltInputRoll.setAttribute("max", 22030059999);

	};

	eltRadioEe.onclick = () => {

		eltInputRoll.setAttribute("min", 0);
		eltInputRoll.setAttribute("max", 22030049999);

	};

});
