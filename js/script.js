// document.addEventListener("DOMContentLoaded", foo);
$(function() {
	console.log('DOM is loaded');

	// document.querySelector("#navbarToggle").addEventListener("blur", foo);
	$("#navbarToggle").blur(function(event) {
		var width = window.innerWidth;

		if (width < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});


(function(global) {

	var allCategoriesSourcesURL = "http://davids-restaurant.herokuapp.com/categories.json";
	var menuItemsSourcesURL = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";

	var categoriesTitleURL = "snippets/categories-title-snippet.html";
	var singleCategoryURL = "snippets/category-snippet.html";
	var homeURL = "snippets/home-snippet.html";

	var menuItemsTitleURL = "snippets/menu-items-title.html";
	var singleMenuItemURL = "snippets/menu-item.html";

	var dc = {};

	var insertHtml = function(selector, html) {
		var element = document.querySelector(selector);
		element.innerHTML = html;
	}

	var showLoading = function(selector) {
		var loader = "<div class='text-center'>" +
		"<img src='images/ajax-loader.gif'></img>" +
		"</div>";

		insertHtml(selector, loader);
	}

	var insertProperty = function(string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}

	var loadContent = function(selector, url) {
		showLoading(selector);
		ajaxUtils.sendGetRequest(url, function(response) {
			insertHtml(selector, response.responseText);
		},
		false);
	}

	document.addEventListener("DOMContentLoaded", function() {
		loadContent("#main-content", homeURL);
	});

	dc.loadMenuCategories = function() {
		showLoading("#main-content");
		setMenuButtonActive();
		ajaxUtils.sendGetRequest(allCategoriesSourcesURL, buidAndShowCategoriesHTML, true);
	}

	dc.loadMenuItems = function(categoryShort) {
		showLoading("#main-content");
		setMenuButtonActive();
		ajaxUtils.sendGetRequest(menuItemsSourcesURL + categoryShort, buidAndShowMenuItemsHTML, true);
	}

	var buidAndShowMenuItemsHTML = function(menuItems) {
		ajaxUtils.sendGetRequest(menuItemsTitleURL, 
			function(menuItemsTitleHTML) {

				ajaxUtils.sendGetRequest(singleMenuItemURL,
					function(singleMenuItemHtml) {
						var mainContent = buildMenuItemsView(menuItems, menuItemsTitleHTML.responseText, singleMenuItemHtml.responseText);
						insertHtml("#main-content", mainContent);
					});
			});
	}

	var setMenuButtonActive = function() {

		var navHomeButton = document.getElementById("navHomeButton");
		navHomeButton.className = navHomeButton.className.replace(new RegExp("active", "g"), "");

		var navMenuButton = document.getElementById("navMenuButton");
		
		if (navMenuButton.className.indexOf("active") == -1) {
			navMenuButton.className += " active";
		}
	}

	var buidAndShowCategoriesHTML = function(allCategories) {
		ajaxUtils.sendGetRequest(categoriesTitleURL, 
			function(categoriesTitleHtml) {

				ajaxUtils.sendGetRequest(singleCategoryURL,
					function(singleCategoryHtml) {
						var mainContent = buildCategoriesView(allCategories, categoriesTitleHtml.responseText, singleCategoryHtml.responseText);
						insertHtml("#main-content", mainContent);
					});
			});
	}

	var buildCategoriesView = function(allCategories, categoriesTitleHtml, singleCategoryHtml) {

		var finalHtml = categoriesTitleHtml +
		"<section class='row'>";

		for (var i = 0; i < allCategories.length; i++) {
			var html = singleCategoryHtml;

			var name = allCategories[i].name;
			var short_name = allCategories[i].short_name;

			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);

			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}

	var buildMenuItemsView = function(menuItems, menuItemsTitleHTML, singleMenuItemHtml) {

		var title = menuItemsTitleHTML;

		title = insertProperty(title, "name", menuItems.category.name)
		title = insertProperty(title, "special_instructions", menuItems.category.special_instructions)

		var finalHtml = title +
		"<section class='row'>";

		var categoryShortName = menuItems.category.short_name;
		for (var i = 0; i < menuItems.menu_items.length; i++) {
			var html = singleMenuItemHtml;
			var item = menuItems.menu_items[i];

			html = insertProperty(html, "category_name", categoryShortName);
			html = insertProperty(html, "short_name", item.short_name);
			html = insertProperty(html, "name", item.name);
			html = insertProperty(html, "description", item.description);
			html = insertProperty(html, "price_small", item.price_small);
			html = insertProperty(html, "price_large", item.price_large);

			if (i % 2 != 0) {
				html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}

	global.$dc = dc;
})(window);