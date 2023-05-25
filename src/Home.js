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

		setFile(file);
		setFileName(file.name);
		file_send(ip, file);

		// localStorage.setItem("file", file);
		// localStorage.setItem("fileName", fileName);
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
		<div className="Home">
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
							Dependency Analysis
						</button>
					</Link>
					<Link to="/vulnerable">
						<button
							className="file-uploader-button"
							onClick={() => {
								file_send(ip, file);
							}}
						>
							Vulnerability Analysis
						</button>
					</Link>
					<Link to="/details">
						<button
							className="file-uploader-button"
							onClick={() => {
								file_send(ip, file);
							}}
						>
							Details
						</button>
					</Link>
				</div>
			)}
		</div>
	);
}

export default Home;
