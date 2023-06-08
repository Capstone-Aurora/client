import "./Home.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function file_send(ip, file) {
	const formData = new FormData();
	formData.append("file", file);

	axios
		.post("file_send", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				ip: ip,
			},
		})
		.then((result) => {
			console.log("file_send result", result.data);
		});
}

function Home() {
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState();
	const [ip, setIP] = useState("");
	const [hover, setHover] = useState(false);

	const handleDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		console.log(file);

		setFile(file);
		setFileName(file.name);
		file_send(ip, file);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setHover(true);
	};

	const handleDragLeave = () => {
		setHover(false);
	};

	const getData = async () => {
		const res = await axios.get("https://geolocation-db.com/json/");
		setIP(res.data.IPv4);
	};

	useEffect(() => {
		getData();
		console.log(ip);
	}, []);

	const example_list = ["1", "2", "3", "4", "5"];
	const example_desc_list = [
		"파일 업로드를 처리하는 코드",
		"특정 폴더 내에서 입력으로 요청받은 파일을 렌더링해서 보여주는 코드",
		"입력을 받아 시스템 명령을 수행하는 코드",
		"사용자 입력을 템플릿에 삽입해 렌더링하는 코드",
		"사용자로부터 받은 데이터에 따라 쿠키에 생성하고 검증하며, 입력 데이터를 pickle로 인코딩/디코딩하는 코드",
	];
	const example_flow = ["2", "3", "4", "5", "6"];

	return (
		<div>
			<div className="fix-header">
				<div className="home-header-title">
					<img src="bug.png" alt="bug" width="40" height="40" />
					&nbsp;OSVCAT&nbsp;
				</div>
				<br />
				<div className="home-header-desc">
					Open Source Vulnerability
				</div>
				<div className="home-header-desc">Chaining Analyze Tools</div>
				<br />
				<br />
				<img src="korea.png" alt="korea" width="50" />
				<div className="home-footer">Capstone Team Aurora</div>
				<br />
			</div>
			<div className="content">
				<div className="content-title">Code Analysis</div>
				<div className="content-box">
					<div className="content-desc">
						Code Dependencies & Vulnerability Analysis
					</div>
					<div
						className={`file-uploader ${hover ? "hover" : ""}`}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						<div>
							{file ? (
								<>
									<h3>File details</h3>
									<p>Name: {fileName}</p>
									<p>Size: {file.size} bytes</p>
									<p>Type: {file.type}</p>
								</>
							) : (
								<h2>Drag the file here!</h2>
							)}
						</div>
					</div>
				</div>
				{file && (
					<button className="file-uploader-button" onClick={() => {}}>
						<Link to="/dependency" state={{ fileName: fileName }}>
							Dependency & Vulnerability Analysis (Click)
						</Link>
					</button>
				)}
				<div className="content-title">
					Example Code Vulnerability Flow
				</div>
				{example_list.map((example) => (
					<button className="file-uploader-button" onClick={() => {}}>
						<Link
							to="/details"
							state={{ example: example }}
							className="content_example"
						>
							<h3>Code Analysis Example {example}</h3>
							Description : {example_desc_list[example - 1]}
							<div className="flow">
								Number Of Flow : {example_flow[example - 1]}
							</div>
						</Link>
					</button>
				))}
			</div>
		</div>
	);
}

export default Home;
