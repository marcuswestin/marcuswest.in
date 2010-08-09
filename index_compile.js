var fs = require('fs')

var templateHTML = fs.readFileSync('index_template.html'),
	posts = JSON.parse(fs.readFileSync('read/posts.json')),
	postsHTML = '',
	html

for (var i=0, post; post = posts[i]; i++) {
	postsHTML += posts.map(function() {
		return ''
			+	'<div class="post">'
			+		'<a class="post" href="read/'+post.id+'/">' + post.title + '</a>\n'
			+		'<div class="date">' + post.date + '</div>'
			+	'</div>'
	})
}

html = templateHTML
	.replace('#POSTS#', postsHTML)

fs.writeFileSync('index.html', html)
