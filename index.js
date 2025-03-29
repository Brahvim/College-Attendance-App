const g_onMobile = !!navigator.userAgent.toLowerCase().includes("mobile");

document.addEventListener("DOMContentLoaded", () => {

	// #region Selections.
	const eltRadioCs = document.getElementById("branch-selector-cs");
	const eltRadioEe = document.getElementById("branch-selector-ee");
	const eltInputRoll = document.getElementById("roll-input");

	const eltCheckIll = document.getElementById("reasonIllBox");
	const eltCheckFam = document.getElementById("reasonFamBox");
	const eltCheckEvt = document.getElementById("reasonEvtBox");

	const eltChecks = [eltCheckIll, eltCheckFam, eltCheckEvt];
	// #endregion

	// // Bad idea, really!
	// if (g_onMobile) {
	//
	// 	eltChecks.forEach((p_element) => {
	//
	// 		p_element.onpointerleave = p_element.click;
	//
	// 	});
	//
	// }

	// These are only rough checks.
	// You HAVE TO keep a table in-DB to know which rolls actually exist in the college!

	eltInputRoll.addEventListener("input", () => {

		eltInputRoll.classList.add("changed");
		setTimeout(() => eltInputRoll.classList.remove("changed"), 500);

	});

	eltRadioCs.addEventListener("click", () => {

		eltInputRoll.setAttribute("min", 0);
		eltInputRoll.setAttribute("max", 22030059999);

	});

	eltRadioEe.addEventListener("click", () => {

		eltInputRoll.setAttribute("min", 0);
		eltInputRoll.setAttribute("max", 22030049999);

	});

});
