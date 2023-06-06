import "./Dependency.css";
import { useState, useEffect, version } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

async function get_dependency(fileName, setDependency) {
	const formData = new FormData();
	formData.append("fileName", fileName);
	var dependency = [];
	await axios
		//.post("http://pwnable.co.kr:42599/dependency", formData, {
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

async function send_vurnerability(fileName, module_name, module_version) {
	const formData = new FormData();

	formData.append("fileName", fileName);
	formData.append("module_name", module_name);
	formData.append("module_version", module_version);

	await axios
		//.post("http://pwnable.co.kr:42599/vurnerability/", formData, {
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

			var result = res.data.vulns;
			console.log(result);

			//map data

			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
}

function Dependency(props) {
	// show dependency
	const fileName = useLocation().state?.fileName;
	const [dependency, setDependency] = useState([]);
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
		for (var i = 0; i < formData.length; i++) {
			if (i == formData.length - 1)
				version_List += dependency[i] + "==" + formData[i] + '"';
			else version_List += dependency[i] + "==" + formData[i] + "\\";
			send_vurnerability(fileName, dependency[i], formData[i]);
		}
		send_version(fileName, version_List, setImg);
		setImg("http://pwnable.co.kr/dependencies.png");
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			get_dependency(fileName, setDependency);
		}, 1000);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className="dependency">
			<div className="dependency-title">
				<h2>Dependency</h2>
			</div>
			<div className="dependency-content">
				{dependency.map((item, index) => (
					<div className="dependency-item" key={index}>
						<div className="dependency-item-name">
							{item} : &nbsp;
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
			<div>{img && <img src={img} alt="Image" />}</div>
		</div>
	);
}

export default Dependency;
