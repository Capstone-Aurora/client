import "./Dependency.css";
import { useState, useEffect, version } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

async function get_dependency(fileName, setDependency) {
	const formData = new FormData();
	formData.append("fileName", fileName);
	var dependency = [];
	await axios
		.post("dependency", formData, {
			headers: {
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

async function send_version(fileName, versionList) {
	const formData = new FormData();
	formData.append("fileName", fileName);
	formData.append("versionList", versionList);
	await axios
		.post("version", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			console.log("send_version : ", res.data);
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
		}
		send_version(fileName, version_List);
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
					// input
					<div className="dependency-item" key={index}>
						{item} : &nbsp;
						<input
							type="text"
							value={formData[index] || ""}
							onChange={(event) =>
								handleInputChange(index, event)
							}
						/>
					</div>
				))}
				<br />
				<button onClick={submit}>Submit</button>
			</div>
		</div>
	);
}

export default Dependency;
