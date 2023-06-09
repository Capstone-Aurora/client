import "./Error.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Error(props) {
	return (
		<div className="errors">
			<strong>{props.errno}</strong>
			<p>{props.errdsc}</p>
		</div>
	);
}

export default Error;
