import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Dependency from "./Dependency";
import Vulnerable from "./Vulnerable";
import Details from "./Details";
import Error from "./Error";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/dependency" element={<Dependency />} />
					<Route path="/details" element={<Details />} />
					<Route path="/vulnerable" element={<Vulnerable />} />
					<Route
						path="*"
						element={
							<Error errno={404} errdsc={"There is no page."} />
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

