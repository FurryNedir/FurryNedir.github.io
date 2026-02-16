	var furryStats = {};
			var totalStats = {};
			var firstLoad = true;

			window.addEventListener('load', function() {
				document.querySelectorAll(".furrydata").forEach(function(el) {
					el.classList.add("unloadedData");
					el.dataset.varname = el.innerHTML;
					el.innerHTML = "<img class='loadingDataGIF' src='img/loadingdata.gif'>";
				});

				document.querySelectorAll(".totaldata").forEach(function(el) {
					el.classList.add("unloadedData");
					el.dataset.varname = el.innerHTML;
					el.innerHTML = "<img class='loadingDataGIF' src='img/loadingdata.gif'>";
				});

				setTimeout(fetchData, 500);
			});

			function fetchData() {
				fetch("https://www.whatarefurries.com/getData.php")
					.then(function(response) {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						return response.text();
					})
					.then(function(data) {
						var rows = data.split("\n");
						for (var r = 0; r < rows.length; r++) {
							var parts = rows[r].split(",");
							if (parts.length < 2) continue;

							var key = parts[0];
							if (key == "Furry count" || key == "Response count") {
								totalStats[key] = parts[1].trim();
								furryStats[key] = parts[1].trim();
							} else {
								totalStats[key] = parts[2] ? parts[2].trim() : "";
								furryStats[key] = parts[3] ? parts[3].trim() : "";
							}
						}
						putDataIntoPage();
					})
					.catch(function(error) {
						console.error("Error fetching data:", error);
					});
			}

			function putDataIntoPage() {
				document.querySelectorAll(".furrydata").forEach(function(el) {
					var key = el.dataset.varname;
					if (furryStats[key] !== undefined) {
						el.innerHTML = furryStats[key];
						el.classList.remove("unloadedData");
						el.classList.add("loadedData");
					}
				});

				document.querySelectorAll(".totaldata").forEach(function(el) {
					var key = el.dataset.varname;
					if (totalStats[key] !== undefined) {
						el.innerHTML = totalStats[key];
						el.classList.remove("unloadedData");
						el.classList.add("loadedData");
					}
				});

				document.querySelectorAll(".unloadedBarGraphBar").forEach(function(el) {
					var key = el.innerHTML;
					var valStr = furryStats[key];
					
					if (valStr) {
						var val = parseFloat(valStr);
						el.style.width = (35 * val) + "%";
						el.innerHTML = "";
					}
					
					el.classList.remove("unloadedBarGraphBar");
				});

				var littleFurrySex = document.getElementById("littleFurry_sex");
				if (littleFurrySex) littleFurrySex.innerHTML = "";
				
				document.querySelectorAll(".sexAnswerFurryBox").forEach(function(el) {
					el.innerHTML = "";
				});

				function getNum(key) {
					var val = furryStats[key];
					return val ? parseFloat(val) : 0;
				}

				var yesVal = getNum("sex: yes");
				var canBeVal = getNum("sex: can be");

				function generateImages(count, logicCallback) {
					var fragments = {}; 

					for (var f = 0; f < count; f++) {
						var a = logicCallback(f);
						var containerId = "sexAnswer" + a;

						if (!fragments[containerId]) {
							fragments[containerId] = document.createDocumentFragment();
						}

						var img = document.createElement("img");
						img.className = "littleFurry";
						var imgNum = Math.round(Math.random() * 100) % 10;
						img.src = "img/littlefurries/" + imgNum + ".png";
						img.style.opacity = 0.5 + Math.random() * 0.5;

						fragments[containerId].appendChild(img);
					}

					for (var id in fragments) {
						var container = document.getElementById(id);
						if (container) {
							container.appendChild(fragments[id]);
						}
					}
				}

				generateImages(150, function(f) {
					if (f + 1 < 1.5 * yesVal) {
						return 0;
					} else if (f < 1.5 * (yesVal + canBeVal)) {
						return 1;
					} else {
						return 2;
					}
				});

				generateImages(150, function(f) {
					if (f + 1 < 10.1 * yesVal) {
						return 3;
					} else if (f < 1.3 * (yesVal + canBeVal)) {
						return 4;
					} else {
						return 5;
					}
				});

				if (firstLoad) {
					firstLoad = false;
					setInterval(fetchData, 120000);
				}
	}