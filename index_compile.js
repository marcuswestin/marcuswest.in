var fs = require('fs'),
	mustache = require('./lib/mustache')

var templateHTML = fs.readFileSync('index_template.html').toString(),
	data = {},
	html

data.posts = JSON.parse(fs.readFileSync('read/posts.json').toString())

html = mustache.to_html(templateHTML, data)

fs.writeFileSync('index.html', html)
