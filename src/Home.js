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

	return (
		<div className="home">
			<div className="home-header">
				<div className="home-header-title">OSVCAT</div>
				<h4 className="home-header-desc">
					Open Source Vulnerability Chaining Analyze Tools
				</h4>
			</div>
			<div>
				<div
					className={`file-uploader ${hover ? "hover" : ""}`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<div className="file-uploader-text">
						<h2>Drag the file here!</h2>
						{file && (
							<>
								<h3>File details</h3>
								<p>Name: {fileName}</p>
								<p>Size: {file.size} bytes</p>
								<p>Type: {file.type}</p>
							</>
						)}
					</div>
				</div>

				{file && (
					<div>
						<Link to="/dependency" state={{ fileName: fileName }}>
							<button
								className="file-uploader-button"
								onClick={() => {}}
							>
								Dependency & Vulnerability Analysis
							</button>
						</Link>
					</div>
				)}
				<Link to="/details" state={{ fileName: fileName }}>
					<button className="file-uploader-button" onClick={() => {}}>
						Open Source Vulnerability Flow Analysis
					</button>
				</Link>
			</div>
			<div className="home-footer">
				<h4>Capstone Team Aurora</h4>
			</div>
		</div>
	);
}

export default Home;
