// import { cleanHTML } from "./sanitizer.js";

/*!
 * Sanitize an HTML string
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String}          str   The HTML string to sanitize
 * @param  {Boolean}         nodes If true, returns HTML nodes instead of a string
 * @return {String|NodeList}       The sanitized string or nodes
 */
function cleanHTML(str, nodes) {
	/**
	 * Convert the string to an HTML document
	 * @return {Node} An HTML document
	 */
	function stringToHTML() {
		let parser = new DOMParser();
		let doc = parser.parseFromString(str, "text/html");
		return doc.body || document.createElement("body");
	}

	/**
	 * Remove <script> elements
	 * @param  {Node} html The HTML
	 */
	function removeScripts(html) {
		let scripts = html.querySelectorAll("script");
		for (let script of scripts) {
			script.remove();
		}
	}

	/**
	 * Check if the attribute is potentially dangerous
	 * @param  {String}  name  The attribute name
	 * @param  {String}  value The attribute value
	 * @return {Boolean}       If true, the attribute is potentially dangerous
	 */
	function isPossiblyDangerous(name, value) {
		let val = value.replace(/\s+/g, "").toLowerCase();
		if (["src", "href", "xlink:href"].includes(name)) {
			if (val.includes("javascript:") || val.includes("data:text/html")) return true;
		}
		if (name.startsWith("on")) return true;
	}

	/**
	 * Remove potentially dangerous attributes from an element
	 * @param  {Node} elem The element
	 */
	function removeAttributes(elem) {
		// Loop through each attribute
		// If it's dangerous, remove it
		let atts = elem.attributes;
		for (let { name, value } of atts) {
			if (!isPossiblyDangerous(name, value)) continue;
			elem.removeAttribute(name);
		}
	}

	/**
	 * Remove dangerous stuff from the HTML document's nodes
	 * @param  {Node} html The HTML document
	 */
	function clean(html) {
		let nodes = html.children;
		for (let node of nodes) {
			removeAttributes(node);
			clean(node);
		}
	}

	// Convert the string to HTML
	let html = stringToHTML();

	// Sanitize it
	removeScripts(html);
	clean(html);

	// If the user wants HTML nodes back, return them
	// Otherwise, pass a sanitized string back
	return nodes ? html.childNodes : html.innerHTML;
}

function doesHttpOnlyCookieExist(cookieName) {
	var d = new Date();
	d.setTime(d.getTime() + 1000);
	var expires = "expires=" + d.toUTCString();

	document.cookie = cookieName + "=new_value;path=/;" + expires;
	return document.cookie.indexOf(cookieName + "=") == -1;
}

// When user scrolls down the page, change scroll indicator
window.onscroll = function () {
	var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	var scrolled = (winScroll / height) * 100;
	document.getElementById("myBar").style.width = scrolled + "%";
};

window.onload = function () {
	let sidenav = document.querySelector(".sidenav").cloneNode(true);
	document.querySelector("#mobileNavigation").appendChild(sidenav);
};

$(document).ready(function () {
	let currentUser = localStorage.getItem("currentUser");

	if (doesHttpOnlyCookieExist("sessionid") && currentUser) {
		createUserDropdown(JSON.parse(currentUser));
		return;
	}

	fetch("/api/users/c")
		.then((response) => response.json())
		.then((data) => {
			if (data.username !== "") {
				//if (doesHttpOnlyCookieExist("sessionid")) {
				localStorage.setItem("currentUser", JSON.stringify(data));
				createUserDropdown(data);
				//}
			} else {
				localStorage.removeItem("currentUser");
			}
		})
		.catch((err) => {
			console.log("You are not connected to the api!");
		});
});

function createUserDropdown(data) {
	const container = document.querySelector("div#navbarNav");
	const navbarNavs = container.querySelectorAll("ul.navbar-nav");
	const unauthNav = navbarNavs[1];
	const signUp = document.querySelector("#user-sign-up");
	const login = document.querySelector("#user-login");

	let htmlStr = `<li class="nav-item dropdown align-self-center fadeIn">
  <a class="nav-link dropdown-toggle" href="#" id="user-menu" role="button" data-toggle="dropdown" aria-expanded="false" >
    <i class="fas fa-user user-ind pr-1"></i> ${data.username}
  </a>
  <div class="dropdown-menu  user-dropdown" aria-labelledby="user-menu">
    <a class="dropdown-item" href="/users/${data.id}" >My Projects</a>
    <a class="dropdown-item" href="/users/${data.id}/classes" >My Classrooms</a>
		<a class="dropdown-item" href="/users/${data.id}/workbooks" >My Workbooks</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="/accounts/logout/" >Not you? (LOGOUT)</a>
  </div>
  </li>`;

	signUp.hidden = true;
	login.hidden = true;
	unauthNav.prepend(...cleanHTML(htmlStr, true));
}
