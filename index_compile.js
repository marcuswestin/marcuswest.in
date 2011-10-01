var fs = require('fs'),
	mustache = require('mustache'),
	less = require('./lib/less/lib/less')

var templateHTML = fs.readFileSync('index_template.html').toString(),
	data = {},
	html

data.posts = JSON.parse(fs.readFileSync('read/posts.json').toString())
fs.writeFileSync('index.html', mustache.to_html(templateHTML, data))

less.render(fs.readFileSync('index.less').toString(), function(e, css) {
	if (e) { throw e }
	fs.writeFileSync('index.css', css)
})
