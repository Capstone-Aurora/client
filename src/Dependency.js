import "./Dependency.css";
import { useState, useEffect, CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

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

async function send_version(fileName, versionList) {
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
		.then((res) => {})
		.catch((err) => {
			console.log(err);
		});
}

async function send_vurnerability(
	fileName,
	module_name,
	module_version,
	vulnerabilityList,
	idx,
	dependency_vuln,
	setVulnerabilityList,
	setDependency_vuln
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
			var vul = res.data.res;
			//console.log("show vulnerability : ", vul);
			if (vul.length !== 0) {
				var result = JSON.parse(vul).vulns;
				console.log("vulnerability : ", result);
				if (result !== undefined) {
					dependency_vuln[idx] = true;
					vulnerabilityList[idx] = result;
				} else {
					dependency_vuln[idx] = false;
					vulnerabilityList[idx] = result;
				}
				setVulnerabilityList(vulnerabilityList);
				setDependency_vuln(dependency_vuln);
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function Dependency(props) {
	const fileName = useLocation().state?.fileName;
	const [dependency, setDependency] = useState([]);
	const [vulnerability, setVulnerability] = useState([]);
	const [formData, setFormData] = useState([]);
	const [imageUrl, setImageUrl] = useState("");
	const [vulnerabilityList, setVulnerabilityList] = useState([]);
	const [dependency_vuln, setDependency_vuln] = useState([]);

	const handleInputChange = (index, event) => {
		const values = [...formData];
		values[index] = event.target.value;
		setFormData(values);
	};

	useEffect(() => {}, [vulnerability]);

	const submit = (e) => {
		e.preventDefault();
		console.log("formData : ", formData);
		setImageUrl("");
		var version_List = '"';
		var tmp1 = [],
			tmp2 = [];
		for (var i = 0; i < formData.length; i++) {
			tmp1.push({});
			tmp2.push(false);
		}
		setVulnerabilityList(tmp1);
		setDependency_vuln(tmp2);
		console.log("CHC", vulnerabilityList);
		for (var i = 0; i < formData.length; i++) {
			if (i === formData.length - 1)
				version_List += dependency[i] + "==" + formData[i] + '"';
			else version_List += dependency[i] + "==" + formData[i] + "\\";
			send_vurnerability(
				fileName,
				dependency[i],
				formData[i],
				vulnerabilityList,
				i,
				dependency_vuln,
				setVulnerabilityList,
				setDependency_vuln
			);
		}
		console.log("dependency_vuln : ", dependency_vuln);
		console.log(
			"dependency_vuln[0][1][2][3]: ",
			dependency_vuln[0],
			dependency_vuln[1],
			dependency_vuln[2],
			dependency_vuln[3]
		);
		console.log("vulnerabilityList : ", vulnerabilityList);
		send_version(fileName, version_List);
		return false;
	};
	/**
	 * 0.7.0
	 * 2022.12.7
	 * 1.15.1
	 * 2.1.2rc
	 */
	useEffect(() => {
		const timeout = setTimeout(() => {
			get_dependency(fileName, setDependency);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [imageUrl]);

	useEffect(() => {
		console.log("dependency_vuln : ", dependency_vuln);
		console.log("vulnerabilityList : ", vulnerabilityList);
	}, [dependency_vuln, vulnerabilityList]);
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
					Dependency & Vulnerability
				</div>
				<div className="content-title">
					Dependency Version & Vulnerability
				</div>
				<form className="content-box" onSubmit={submit}>
					{dependency.map((item, index) => (
						<div className="dependency-item" key={index}>
							<div className="dependency-item-name">
								{item} &nbsp;
							</div>
							<input
								className="text-form"
								type="text"
								value={formData[index] || ""}
								onChange={(event) =>
									handleInputChange(index, event)
								}
								autoComplete="on"
							/>
							{dependency_vuln.length > 0 ? (
								<div
									className={
										dependency_vuln[index]
											? "dependency-item-vuln-unsafe"
											: "dependency-item-vuln-safe"
									}
								>
									{dependency_vuln[index] ? "Unsafe" : "Safe"}
								</div>
							) : (
								<div></div>
							)}
						</div>
					))}

					<button type="submit" className="file-uploader-button">
						Submit
					</button>
				</form>
				<div className="content-title">Dependency Diagram</div>
				<div className="content-box">
					<div className="image-style">
						{dependency_vuln.length == 0 ? (
							<ClipLoader
								color="#FF0000"
								loading="true"
								size={50}
								aria-label="Loading Spinner"
								data-testid="loader"
							/>
						) : (
							<img
								src={"http://pwnable.co.kr/dependencies.png"}
								alt="인터넷 이미지"
							/>
						)}
					</div>
				</div>
				<div className="content-title">Vulnerability Detail</div>
				<div className="content-box">
					{vulnerabilityList.length === 0 ||
					dependency_vuln.length === 0 ? (
						<div className="dependency-item">Press Button</div>
					) : (
						dependency.map((item, index) => (
							<div className="dependency-item" key={index}>
								<div className="dependency-item-name">
									{vulnerabilityList[index] == undefined ? (
										<div></div>
									) : (
										<div className="dependency-item-name">
											{item} &nbsp;
										</div>
									)}
								</div>
								<div className="dependency-item-vuln">
									{vulnerabilityList[index] == undefined ||
									vulnerabilityList[index].length == 0 ? (
										<div></div>
									) : (
										vulnerabilityList[index] &&
										vulnerabilityList[index].map(
											(item, index) => (
												<div
													key={index}
													className="dependency-item-vuln"
												>
													<div className="dependency-item-vuln-title">
														Id
														<div className="dependency-item-vuln-detail">
															{item.id}
														</div>
													</div>
													<div className="dependency-item-vuln-title">
														Summary
														<div className="dependency-item-vuln-detail">
															{item.summary}
														</div>
													</div>
													<div className="dependency-item-vuln-title">
														Details
														<div className="dependency-item-vuln-detail">
															{item.details}
														</div>
													</div>
													<div className="dependency-item-vuln-title">
														Modified
														<div className="dependency-item-vuln-detail">
															{item.modified}
														</div>
													</div>
													<div className="dependency-item-vuln-title">
														Published
														<div className="dependency-item-vuln-detail">
															{item.published}
														</div>
													</div>
												</div>
											)
										)
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default Dependency;
