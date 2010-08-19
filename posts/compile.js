if (__dirname != 'posts') { process.chdir('posts') }

var fs = require('fs'),
	sys = require('sys'),
	Showdown = require('../write/showdown'),
	funSyntaxHighlighter = require('../lib/funSyntaxHighlighter')

function p(o) { sys.puts(JSON.stringify(o)) }
function puts(o) { sys.puts(o) }

var posts = fs.readdirSync('./'),
	markdownConverter = new Showdown.converter(),
	postsInfo = []

fs.renameSync('../read/', '/tmp/marcuswest.in-compile-'+new Date().getTime())  // Dump previous compilation
fs.mkdirSync('../read', 0755)

for (var i=0, postID; postID = posts[i]; i++) {
	if (!fs.statSync('./' + postID).isDirectory()) { continue }
	var postInfo = JSON.parse(fs.readFileSync('./' + postID + '/info.json')),
		postMarkdow = fs.readFileSync('./' + postID + '/post.md'),
		templateHTML = fs.readFileSync('./template.html'),
		bodyHTML = markdownConverter.makeHtml(postMarkdow),
		html
	
	postInfo.id = postID
	postInfo.title = postMarkdow.split("\n")[0]
	
	html = templateHTML
		.replace('#TITLE#', postInfo.title)
		.replace('#DATE#', '<span class="date">' + postInfo.date + '</span>')
		.replace('#BODY#', bodyHTML)
		.replace('#POST_ID#', '"'+postInfo.id+'"')
	
	html = syntaxHighlight(html)
	
	fs.mkdirSync('../read/' + postInfo.id + '/', 0755)
	fs.writeFileSync('../read/' + postInfo.id + '/index.html', html)

	postsInfo.push(postInfo)
}

postsInfo.sort(function(a,b){ return a.date < b.date ? -1 : 1 })
fs.writeFileSync('../read/posts.json', JSON.stringify(postsInfo))

function syntaxHighlight(html) {
	var lines = html.split('\n'),
		newLines = [],
		inCode = false,
		startCode = /<code>/g,
		endCode = /<\/code>/g
	
	for (var i=0; i < lines.length; i++) {
		var line = lines[i],
			starts = line.match(startCode),
			ends = line.match(endCode)
		
		if ((starts && starts.length) > (ends && ends.length)) {
			inCode = true
		}
		if ((ends && ends.length) > (starts && starts.length)) {
			inCode = false
		}
		
		if (inCode) {
			line = funSyntaxHighlighter.highlightLine(line)
		}
		
		newLines.push(line)
	}
	
	return newLines.join('\n')
}