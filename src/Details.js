import "./Details.css";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState, useEffect, version } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const customStyle = {
	background: "#FFFFFF",
	fontSize: "1rem",
	padding: "0rem",
	borderRadius: "4px",
	lineHeight: "1.3",
	width: "90%",
};

async function get_example_flow(fileNum) {
	const formData = new FormData();
	formData.append("fileNum", fileNum);

	await axios
		.post("http://pwnable.co.kr:42599/get_example_flow/", formData, {
			//.post("get_example_flow", formData, {
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
	const [buttonPressed, setButtonPressed] = useState(0);
	const safe = [[12], [], [], [], []];
	const unsafe = [
		[
			[9, 10, 11, 13],
			[9, 10, 11],
		],
		[
			[70, 78, 82],
			[70, 78, 82],
		],
		[[9], [9]],
		[[11], [12]],
		[
			[61, 64],
			[61, 64],
		],
	];
	const url = "dependency/dependencies" + example + ".png";
	const flowSource = ["app.config", "request.files['f'].filename"];
	const flowSink = [
		"request.files['f'].filename",
		"media::filename",
		"secure_filename()",
		"media::sec_filename",
		"os.path.join()",
		"media::path",
		"request.files['f'].save()",
	];
	const flowSanitizers = ["secure_filename()"];

	const changeColor = () => {
		if (buttonPressed === 0) {
			setButtonPressed(1);
		} else {
			setButtonPressed(0);
		}
	};

	useEffect(() => {
		get_example_flow(example);
		fetchPythonCode(example)
			.then((code) => setPythonCode(code))
			.catch((error) => console.error("Dd", error));
	}, [example]);

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
			<div className="row-box">
				<div className="content-detail">
					<div className="column-box-detail">
						<div className="content-title">
							Original Code of "Example {example}"
						</div>
						<div className="content-box-code">
							<SyntaxHighlighter
								wrapLines={true}
								language="python"
								showLineNumbers={true}
								lineProps={(lineNumber) => {
									let style = { display: "block" };
									if (
										safe[example - 1].includes(lineNumber)
									) {
										console.log(
											"lineNumber : ",
											lineNumber
										);
										style.backgroundColor = "#B9FFB9";
									} else if (
										unsafe[example - 1][
											buttonPressed
										].includes(lineNumber)
									) {
										style.backgroundColor = "#FFC4C4";
									}
									return { style };
								}}
								customStyle={customStyle}
								style={docco}
							>
								{pythonCode}
							</SyntaxHighlighter>
						</div>
					</div>
					<div className="column-box">
						<div className="content-title">Dependency Tree</div>
						<div className="content-box">
							<img
								className="dependency-tree"
								src={url}
								alt="dependency_tree"
							/>
						</div>
						<div className="content-title">Data</div>
						<div className="content-box">
							<div className="vulnerability-title">
								Source
								<div className="vulnerability-content">
									{flowSource.map((item, index) => (
										<div key={index}>{item}</div>
									))}
								</div>
							</div>
							<div className="vulnerability-title">
								Sink
								<div className="vulnerability-content">
									{flowSink.map((item, index) => (
										<div key={index}>{item}</div>
									))}
								</div>
							</div>

							<div className="vulnerability-title">
								Sanitizer
								<div className="vulnerability-content">
									{flowSanitizers.map((item, index) => (
										<div key={index}>
											{item}

											<button
												onClick={changeColor}
												className="sanButton"
											>
												{buttonPressed === 0
													? "OFF"
													: "ON"}
											</button>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<br />
				<br />
			</div>
		</div>
	);
}

export default Details;
