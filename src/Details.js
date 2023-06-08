import "./Details.css";
import { useState, useEffect, version } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

async function get_example_flow(fileNum) {
	const formData = new FormData();
	formData.append("fileNum", fileNum);

	await axios
		//.post("http://pwnable.co.kr:42599/get_example_flow/", formData, {
		.post("get_example_flow", formData, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			var result = res.data;
			console.log("result : ", result.fileName, result.source_code);
		})
		.catch((err) => {
			console.log(err);
		});
}

function Details(props) {
	// props.example
	const example = useLocation().state?.example;

	const setExample = (e) => {
		e.preventDefault();
		get_example_flow(e.target.innerText);
	};

	return (
		<div className="details">
			example list {example}
			<div className="details-header">
				<h1>Details</h1>
			</div>
			<div className="details-body">
				<h2>File Name</h2>
			</div>
		</div>
	);
}

export default Details;
