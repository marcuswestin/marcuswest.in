var fs = require('fs')

var templateHTML = fs.readFileSync('index_template.html'),
	posts = JSON.parse(fs.readFileSync('read/posts.json')),
	html

var postsHTML = posts.map(function(post) {
	return ''
		+	'<div class="post">'
		+		'<a class="post" href="read/'+post.id+'/">' + post.title + '</a>\n'
		+		'<div class="date">' + post.date + '</div>'
		+	'</div>'
}).join('<br />')

html = templateHTML
	.replace('#POSTS#', postsHTML)

fs.writeFileSync('index.html', html)
