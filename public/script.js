var deleteLinkClick
var postLinkClick

$(function() {
	function newPreviewTemplate(link) {
		var template = "<div class='col-sm-6 col-md-4'><div class='thumbnail'>"
		template += "<img src='" + link.image + "' alt='" + link.title + "'>"
		template += "<div class='caption'><h3>" + link.title + "</h3><p>"
		template += "</p>" + link.description + "<p>"
		template += "<p><a href='" + link.url + "' class='btn btn-default' role='button'>Link</a> "
		template += "<button class='btn btn-danger' id='link-delete-" + link._id + "' onclick='deleteLinkClick(\"" + link._id + "\")' role='button'>Delete</button></p></div></div></div>"

		return template
	}

	function postLink() {
		var url = $("#new-link").val()

		if (url && url.length) {
			$.post("/links?link=" + url)
				.done(function(results) {
					$("#new-link").val("")
					getLinks()
				})
				.fail(function(err) {
					$("#new-link").val("")
					console.log(err)
				})
		}
	}

	function getLinks() {
		$.get("/links")
			.done(function(results) {
				if (results && results.length) {
					$("#links").html(results.map(function(item) {
						return newPreviewTemplate(item)
					}).join(""))
				} else {
					$("#links").html("<p>No links</p>")
				}
			})
			.fail(function(err) {
				$("#links").html("<p>No links</p>")
				console.log(err)
			})
	}


	function deleteLink(id) {
		if (id && id.length) {
			$.ajax({
					url: "/links/" + id,
					type: "DELETE"
				})
				.done(function(results) {
					getLinks()
				})
				.fail(function(err) {
					console.log(err)
				})
		}
	}

	getLinks()

	deleteLinkClick = deleteLink
	postLinkClick = postLink
})
