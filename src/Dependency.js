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
			var result = res.data.res;
			setFunc(result);
		})
		.catch((err) => {
			console.log(err);
		});
}

function Dependency(props) {
	const fileName = useLocation().state?.fileName;
	const [dependency, setDependency] = useState([]);
	const [dependency_vuln, setDependency_vuln] = useState([]);
	const [vulnerability, setVulnerability] = useState([]);
	const [vulnerabilityList, setVulnerabilityList] = useState([]);

	const [formData, setFormData] = useState([]);
	const [imageUrl, setImageUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (index, event) => {
		const values = [...formData];
		values[index] = event.target.value;
		setFormData(values);
	};

	const submit = (e) => {
		e.preventDefault();
		console.log("formData : ", formData);
		setImageUrl("");
		var version_List = '"';
		setDependency_vuln([]);
		setVulnerabilityList([]);
		for (var i = 0; i < formData.length; i++) {
			if (i === formData.length - 1)
				version_List += dependency[i] + "==" + formData[i] + '"';
			else version_List += dependency[i] + "==" + formData[i] + "\\";
			send_vurnerability(
				fileName,
				dependency[i],
				formData[i],
				setVulnerability
			);

			new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("show vulnerability : ", vulnerability);
			if (vulnerability != []) {
				var result = JSON.parse(vulnerability).vulns;
				console.log("vulnerability : ", result);
				if (result == null) {
					setDependency_vuln((dependency_vuln) => [
						...dependency_vuln,
						true,
					]);
				} else {
					setDependency_vuln((dependency_vuln) => [
						...dependency_vuln,
						false,
					]);
				}

				setVulnerabilityList((vulnerabilityList) => [
					...vulnerabilityList,
					result,
				]);
			}
		}
		console.log("dependency_vuln : ", dependency_vuln);
		console.log("vulnerabilityList : ", vulnerabilityList);
		send_version(fileName, version_List);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			get_dependency(fileName, setDependency);
			//let intervalId;
			// const fetchImage = async () => {
			// 	setIsLoading(true);
			// 	// try {
			// 	// 	const response = await axios.get(
			// 	// 		"http://pwnable.co.kr/dependencies.png"
			// 	// 	);
			// 	// 	setImageUrl("http://pwnable.co.kr/dependencies.png");
			// 	// 	console.log(response.data.url);
			// 	// } catch (error) {
			// 	// 	console.log(error);
			// 	// }
			// 	//setImageUrl("http://pwnable.co.kr/dependencies.png");
			// 	setIsLoading(false);
			// };

			// if (imageUrl === "") {
			// 	intervalId = setInterval(fetchImage, 1000);
			// }

			// return () => {
			// 	clearInterval(intervalId);
			// };
		}, 1000);
		return () => clearTimeout(timeout);
	}, [imageUrl]);

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
				<div className="content-box">
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
							/>
							{dependency_vuln && dependency_vuln[index] ? (
								<div className="dependency-item-vuln-safe">
									Safe
								</div>
							) : (
								<div className="dependency-item-vuln-unsafe">
									Unsafe
								</div>
							)}{" "}
						</div>
					))}

					<button className="file-uploader-button" onClick={submit}>
						Submit
					</button>
				</div>
				<div className="content-title">Dependency Diagram</div>
				<div className="content-box">
					<div className="image-style">
						{isLoading ? (
							<ClipLoader
								color="#FF0000"
								loading="true"
								size={150}
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
					{/* {dependency_vuln.length === 0 ? (
						<div className="dependency-item">No Vulnerability</div>
					) : (
						dependency.map((item, index) => (
							<div className="dependency-item" key={index}>
								<div className="dependency-item-name">
									{item} &nbsp;
									<div className="vulnerability-item">
										{
										// {vulnerabilityList[index] == null
										// 	? "aa"
										// 	: vulnerabilityList[index].map(
										// 			(item, index) => (
										// 				<div
										// 					className="vulnerability-item-name"
										// 					key={index}
										// 				>
										// 					{}
										// 				</div>
										// 			)
										// 	  )} 
											  }
									</div>
								</div>
							</div>
						))
					)} */}
					<div className="vulnerability-detail">No Vulnerability</div>
				</div>
			</div>
		</div>
	);
}

export default Dependency;
