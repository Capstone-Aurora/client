import "./Details.css";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import pythonStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState, useEffect, version } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

async function get_example_flow(fileNum) {
	const formData = new FormData();
	formData.append("fileNum", fileNum);

	await axios
		//.post("http://pwnable.co.kr:42599/get_example_flow/", formData, {
		.post("get_example_flow", formData, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			var result = res.data;
			console.log("result : ", result.fileName, result.source_code);
		})
		.catch((err) => {
			console.log(err);
		});
}

const fetchPythonCode = async (example) => {
	const response = await fetch("example/example" + example + ".py");
	console.log("response1 : ", response);
	const code = await response.text();
	return code;
};

function Details(props) {
	const example = useLocation().state?.example;
	const [pythonCode, setPythonCode] = useState("");

	const customStyle = {
		background: "#FFFFFF",
		fontSize: "1rem",
		padding: "0rem",
		borderRadius: "4px",
		lineHeight: "1.3",
		width: "90%",
	};

	const keywordStyle = {
		color: "#B30000",
		fontWeight: "bold",
	};

	const stringStyle = {
		color: "green",
	};

	useEffect(() => {
		get_example_flow(example);
		fetchPythonCode(example)
			.then((code) => setPythonCode(code))
			.catch((error) => console.error("Dd", error));
	}, []);

	return (
		<div>
			<div className="fix-header-page">
				<button className="home-button" onClick={() => {}}>
					<Link to="/">
						<img src="bug.png" alt="bug" width="60" height="60" />
					</Link>
				</button>
				<h4>Aurora</h4>
			</div>
			<div className="content-detail">
				<div className="column-box">
					<div className="content-title">
						Code of "Example {example}"
					</div>
					<div className="content-box">
						<SyntaxHighlighter
							language="python"
							customStyle={customStyle}
							keywords={["if", "else", "elif", "import"]}
							keywordsStyle={keywordStyle}
							stringStyle={stringStyle}
							style={pythonStyle}
						>
							{pythonCode}
						</SyntaxHighlighter>
					</div>
				</div>
				<div className="column-box">
					<div className="content-title">Dependency Check</div>
					<div className="content-box">File Name</div>
					<div className="content-title">Vulnerability Flow</div>
					<div className="content-box">File Name</div>
				</div>
			</div>
		</div>
	);
}

export default Details;
