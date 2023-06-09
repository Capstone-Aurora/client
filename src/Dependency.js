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
		.post("http://pwnable.co.kr:42599/dependency/", formData, {
			//.post("dependency", formData, {
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
	// await axios
	// 	.post("http://pwnable.co.kr:42599/version/", formData, {
	// 		//.post("version", formData, {
	// 		headers: {
	// 			"Access-Control-Allow-Origin": "*",
	// 			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	// 			"Access-Control-Allow-Headers": "Content-Type",
	// 			"Content-Type": "multipart/form-data",
	// 		},
	// 	})
	// 	.then((res) => {})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
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
		.post("http://pwnable.co.kr:42599/vulnerability/", formData, {
			//.post("vulnerability", formData, {
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
	const [vulnerabilityList, setVulnerabilityList] = useState([{}]);
	const [dependency_vuln, setDependency_vuln] = useState([]);
	const [isFetching, setIsFetching] = useState(false);

	const handleInputChange = (index, event) => {
		const values = [...formData];
		values[index] = event.target.value;
		setFormData(values);
	};

	useEffect(() => {}, [vulnerability, dependency_vuln, vulnerabilityList]);

	const submit = (e) => {
		e.preventDefault();
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
		console.log("vulnerabilityList : ", vulnerabilityList);
		send_version(fileName, version_List);
		return false;
	};
	const fetchImage = async () => {
		const response = await fetch("http://pwnable.co.kr/dependencies.png");
		if (response.ok) {
			setIsFetching(false);
			setImageUrl(response.url);
		}
	};
	useEffect(() => {
		const timeout = setTimeout(() => {
			get_dependency(fileName, setDependency);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [fileName]);

	useEffect(() => {
		let intervalId;

		if (isFetching) {
			intervalId = setInterval(() => {
				fetchImage();
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [isFetching]);

	return (
		<div>
			<div className="fix-header-page">
				<button
					className="home-button"
					onClick={() => {
						setIsFetching(true);
					}}
				>
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
					{vulnerabilityList.length === 0 ||
					dependency_vuln.length === 0 ? (
						<h4>Press Button</h4>
					) : (
						// <div className="image-style">
						// 	{imageUrl == "" ? (
						// 		<ClipLoader
						// 			color="#FF0000"
						// 			loading="true"
						// 			size={50}
						// 			aria-label="Loading Spinner"
						// 			data-testid="loader"
						// 		/>
						// 	) : (
						// 		<img
						// 			src={
						// 				"http://pwnable.co.kr/dependencies.png"
						// 			}
						// 			alt="인터넷 이미지"
						// 		/>
						// 	)}
						// </div>
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
									src={
										"http://pwnable.co.kr/dependencies.png"
									}
									alt="인터넷 이미지"
								/>
							)}
						</div>
					)}
				</div>
				<div className="content-title">Vulnerability Detail</div>
				<div className="content-box">
					{vulnerabilityList.length === 0 ||
					dependency_vuln.length === 0 ? (
						<h4>Press Button</h4>
					) : (
						dependency.map((item, index) => (
							<div>
								{index > 0 &&
									vulnerabilityList[index] != undefined && (
										<div className="line" />
									)}
								<div className="dependency-item" key={index}>
									<div className="dependency-item-name">
										{vulnerabilityList[index] !=
											undefined && (
											<div className="dependency-item-name">
												{item} &nbsp;
											</div>
										)}
									</div>
									<div className="dependency-item-vuln">
										{dependency_vuln[index] === true &&
											vulnerabilityList[index].map(
												(item, index) => (
													<div
														key={index}
														className="dependency-item-vuln"
													>
														{index > 0 && (
															<div className="line" />
														)}
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
														<div className="dependency-item-vuln-title">
															References
															{item.references.map(
																(i, index) => (
																	<div>
																		<div
																			className="dependency-item-vuln-detail"
																			key={
																				index
																			}
																		>
																			<div className="dependency-item-vuln-detail-title">
																				{
																					item
																						.references[
																						index
																					]
																						.type
																				}
																			</div>
																			<Link
																				to={
																					item
																						.references[
																						index
																					]
																						.url
																				}
																			>
																				{
																					item
																						.references[
																						index
																					]
																						.url
																				}
																			</Link>
																		</div>
																	</div>
																)
															)}
														</div>
														<div className="dependency-item-vuln-title">
															Affected
															<div className="dependency-item-vuln-detail">
																<div className="dependency-item-vuln-detail-title">
																	database_specific
																	:
																</div>

																<Link
																	to={
																		item
																			.affected[0]
																			.database_specific
																			.source
																	}
																>
																	{
																		item
																			.affected[0]
																			.database_specific
																			.source
																	}
																</Link>
															</div>
															<div className="dependency-item-vuln-title">
																Schema Version
																<div className="dependency-item-vuln-detail">
																	{
																		item.schema_version
																	}
																</div>
															</div>
														</div>
													</div>
												)
											)}
									</div>
								</div>
							</div>
						))
					)}
				</div>
				<br />
				<br />
			</div>
		</div>
	);
}

export default Dependency;
