if (__dirname != 'posts') { process.chdir('posts') }

var fs = require('fs'),
	sys = require('sys'),
	Showdown = require('../write/showdown'),
	funSyntaxHighlighter = require('../lib/funSyntaxHighlighter'),
	mustache = require('../lib/mustache')

require('./date') // date.js modifies the Date prototype

function p(o) { sys.puts(JSON.stringify(o)) }
function puts(o) { sys.puts(o) }

var posts = fs.readdirSync('./'),
	markdownConverter = new Showdown.converter(),
	postsInfo = []

fs.renameSync('../read/', '/tmp/marcuswest.in-compile-'+new Date().getTime())  // Dump previous compilation
fs.mkdirSync('../read', 0755)

for (var i=0, postID; postID = posts[i]; i++) {
	if (!fs.statSync('./' + postID).isDirectory()) { continue }
	var postInfo = JSON.parse(fs.readFileSync('./' + postID + '/info.json').toString()),
		postMarkdow = fs.readFileSync('./' + postID + '/post.md').toString(),
		templateHTML = fs.readFileSync('./template.html').toString(),
		view = {},
		html

	view.body = markdownConverter.makeHtml(postMarkdow)
	view.id = postInfo.id = postID
	view.title = postInfo.title = postMarkdow.split("\n")[0]
	view.date = postInfo.date
	
	html = mustache.to_html(templateHTML, view)
	html = syntaxHighlight(html)
	
	fs.mkdirSync('../read/' + postInfo.id + '/', 0755)
	fs.writeFileSync('../read/' + postInfo.id + '/index.html', html)

	postsInfo.push(postInfo)
}

postsInfo.sort(function(a,b){ return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1 })
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