import "./Dependency.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

async function get_dependency(fileName, setDependency) {
	const formData = new FormData();
	formData.append("fileName", fileName);
	var dependency = [];
	await axios
		//.post("http://pwnable.co.kr:42599/dependency/", formData, {
		.post("dependency", formData, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			dependency = res.data.dependency;
			setDependency(dependency);
			console.log("dependency1 : ", dependency);
		})
		.catch((err) => {
			console.log(err);
		});

	console.log("dependency2 : ", dependency);
}

async function send_version(fileName, versionList, setFunc) {
	const formData = new FormData();

	formData.append("fileName", fileName);
	formData.append("versionList", versionList);
	await axios
		//.post("http://pwnable.co.kr:42599/version/", formData, {
		.post("version", formData, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			// save json file
			var rawUrl = res.data.res;
			var url = rawUrl.substring(15, rawUrl.length - 4);
			console.log(url);
			setFunc(url);
		})
		.catch((err) => {
			console.log(err);
		});
}

async function send_vurnerability(
	fileName,
	module_name,
	module_version,
	setFunc
) {
	const formData = new FormData();

	formData.append("fileName", fileName);
	formData.append("module_name", module_name);
	formData.append("module_version", module_version);

	await axios
		//.post("http://pwnable.co.kr:42599/vurnerability", formData, {
		.post("vulnerability", formData, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			// save json file as class
			var result = res.data.res;
			// string to json
			const obj = JSON.parse(result);
			console.log(obj.vulns);
		})
		.catch((err) => {
			console.log(err);
		});
}

function Dependency(props) {
	// show dependency
	const fileName = useLocation().state?.fileName;
	const [dependency, setDependency] = useState([]);
	const [vulnerability, setVulnerability] = useState([]);
	const [formData, setFormData] = useState([]);
	const [img, setImg] = useState([]);

	const handleInputChange = (index, event) => {
		const values = [...formData];
		values[index] = event.target.value;
		setFormData(values);
	};

	const submit = (e) => {
		e.preventDefault();
		console.log(formData);
		var version_List = '"';
		var url = "http://pwnable.co.kr/dependencies.png";
		for (var i = 0; i < formData.length; i++) {
			if (i == formData.length - 1)
				version_List += dependency[i] + "==" + formData[i] + '"';
			else version_List += dependency[i] + "==" + formData[i] + "\\";
			send_vurnerability(
				fileName,
				dependency[i],
				formData[i],
				setVulnerability
			);
			console.log("vulnerability : ", vulnerability);
		}
		send_version(fileName, version_List, setImg);
		setImg(url);
		/*
		const fileTitle = "dependency.png";

		const link = document.createElement("a");
		link.href = url;
		link.download = fileTitle;
		link.click();
		*/
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			get_dependency(fileName, setDependency);
		}, 1000);
		return () => clearTimeout(timeout);
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
			<div className="dependency-content">
				<div className="dependency-title">
					<h2>Dependency</h2>
				</div>
				<div className="dependency-content">
					{dependency.map((item, index) => (
						<div className="dependency-item" key={index}>
							<div className="dependency-item-name">
								{item} &nbsp;
							</div>
							<input
								type="text"
								value={formData[index] || ""}
								onChange={(event) =>
									handleInputChange(index, event)
								}
							/>
						</div>
					))}

					<button className="file-uploader-button" onClick={submit}>
						Submit
					</button>
				</div>
				<div className="table">
					<div className="table-title">
						<h2>Vulnerability Table</h2>
						<div className="table-content">
							<div className="table-content-title">
								<h3>ID</h3>
								<div className="table-content-item">
									analytics
								</div>
							</div>
						</div>
						<div className="table-content">
							<div className="table-content-title">
								<h3>Vulnerability</h3>
								<div className="table-content-item">
									analytics
								</div>
								<div className="table-content-item">
									severity
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					id : OSV-2020-744, summary : Heap-double-free in
					<br />
					mrb_default_allocf details : OSS-Fuzz report:
					<br />
					https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=23801\n\n```
					<br />
					Crash type: Heap-double-free\nCrash
					<br />
					state:\nmrb_default_allocf\nmrb_free\nobj_free\n``` modified
					: 2022-04-13T03:04:39.780694Z
					<br />
					published : 2020-07-04T00:00:01.948828Z
					<br />
					references : type: REPORT,
					url:https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=23801
					<br />
					affected : package: name: mruby, ecosystem: OSS-Fuzz, purl:
					pkg:generic/mruby ranges: type: GIT, repo:
					https://github.com/mruby/mruby, events: introduced:
					9cdf439db52b66447b4e37c61179d54fad6c8f33 fixed:
					97319697c8f9f6ff27b32589947e1918e3015503 versions: 2.1.2
					2.1.2-rc 2.1.2-rc ecosystem_specific: severity: HIGH
					<br />
					database_specific: source:
					https://github.com/google/oss-fuzz-vulns/blob/main/vulns/mruby/OSV-2020-744.yaml
					<br />
					schema_version: 1.4.0
				</div>
				<div>
					{img && (
						<img src={img} alt="Image" className="image-style" />
					)}
				</div>
			</div>
		</div>
	);
}

export default Dependency;
