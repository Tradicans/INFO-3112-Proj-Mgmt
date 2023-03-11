const queryFunction = async (queryString) => {
	let myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	try {
		let query = JSON.stringify({
			query: queryString,
		});
		console.log(query);
		let response = await fetch("http://localhost:5000/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: query,
		});
		let json = await response.json();
		return json;
	} catch {}
};
export default queryFunction;
