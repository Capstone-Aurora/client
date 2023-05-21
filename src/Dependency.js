import "./Dependency.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function get_dependency(fileName) {
	axios
		.post("/get_dependency", {
			fileName: fileName,
		})
		.then((res) => {
			console.log(res.data);
			console.log(fileName);
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});
}
function Dependency(props) {
	// show dependency
	const [dependency, setDependency] = useState([]);
	const [fileName, setFilename] = useState(localStorage.getItem("fileName"));

	useEffect(() => {
		setFilename(localStorage.getItem("fileName"));
		console.log("AAAA");
		console.log(fileName);
		setDependency(get_dependency(fileName));
	}, []);

	return (
		<div className="dependency">
			<div className="dependency-title">Dependency</div>
			<div className="dependency-content">
				{
					dependency
					/* {dependency.map((item) => (
					<div className="dependency-item">
						<div className="dependency-item-name">
							name : {item.name}
						</div>
						<div className="dependency-item-version">
							{item.version}
						</div>
					</div>
				))} */
				}
			</div>
		</div>
	);
}

export default Dependency;
