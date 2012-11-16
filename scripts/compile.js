var fs = require('fs')
var mustache = require('mustache')
var stylus = require('stylus')
var util = require('util')
var _ = require('underscore')
var Showdown = require('../write/showdown')
// var funSyntaxHighlighter = require('../lib/funSyntaxHighlighter')
var mustache = require('mustache')
var exec = require('child_process').exec
require('./date') // date.js modifies the Date prototype

compileRead(function(err, posts) {
	if (err) { throw err.stack }
	compileDrawings(function(err) {
		if (err) { throw err.stack }
		compileIndex(posts, function(err) {
			if (err) { throw err.stack }
			console.log("Done!")
		})
	})
})

function compileIndex(posts, callback) {
	var template = fs.readFileSync('src/mainTemplate.html').toString()
	var partial = fs.readFileSync('src/essays/essayPartial.html').toString()
	var indexHtml = mustache.to_html(template.replace('#_REPLACE_MAIN_CONTENT_', partial), { posts:posts })
	fs.writeFileSync('index.html', indexHtml)

	stylus.render(fs.readFileSync('src/index.styl').toString(), function(err, css) {
		if (err) { return callback(err) }
		fs.writeFileSync('index.css', css)
	})
}

function compileDrawings(callback) {
	function getDrawings(category) {
		exec('mkdir -p drawings/'+category)
		var drawingPaths = _.filter(fs.readdirSync('src/drawings/'+category), function(fileName) {
			if (fileName[0] == '.') { return false }
			var ext = fileName.split('.').pop()
			switch(ext) {
				case 'jpg':
				case 'jpeg':
				case 'png':
					return true
				default:
					return false
			}
		})
		return _.map(drawingPaths, function(fileName) {
			return { category:category, large:category+'/'+fileName, thumb:category+'/'+fileName.replace('.jpg', '-thumb.jpg') }
		})
	}

	var drawings = getDrawings('Hands').concat(getDrawings('Highschool'))

	var template = fs.readFileSync('src/mainTemplate.html').toString()
	var partial = fs.readFileSync('src/drawings/drawingPartial.html').toString()
	var indexHtml = mustache.to_html(template.replace('#_REPLACE_MAIN_CONTENT_', partial), { drawings:drawings })
	fs.writeFileSync('drawings/index.html', indexHtml)

	callback()
}

function compileRead(callback) {
	function p(o) { util.puts(JSON.stringify(o)) }
	function puts(o) { util.puts(o) }
	
	var markdownConverter = new Showdown.converter()
	var dstDir = './essays/'
	
	exec('rm -rf '+dstDir, function(err) {
		if (err) { return callback(err) }
		fs.mkdirSync(dstDir, 0755)
		
		var postIds = _.filter(fs.readdirSync('src/essays'), function(postId) {
			return fs.statSync('src/essays/' + postId).isDirectory()
		})
		
		var postInfos = _.map(postIds, function(postId) {
			var postInfo = JSON.parse(fs.readFileSync('src/essays/'+postId + '/info.json').toString())
			postInfo.id = postId
			return postInfo
		})
		postInfos.sort(function(a, b) {
			return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
		})
		
		var posts = _.map(postInfos, function(postInfo, i) {
			var postMarkdow = fs.readFileSync('src/essays/'+postInfo.id + '/post.md').toString()
			return {
				body: markdownConverter.makeHtml(postMarkdow),
				id: postInfo.id,
				count: postInfos.length - i,
				title: postMarkdow.split("\n")[0],
				date: postInfo.date
			}
		})
		
		var templateHTML = fs.readFileSync('src/essays/essayTemplate.html').toString()
		_.each(posts, function(post) {
			var html = mustache.to_html(templateHTML, post)
			// html = syntaxHighlight(html)

			fs.mkdirSync(dstDir + post.id + '/', 0755)
			fs.writeFileSync(dstDir + post.id + '/index.html', html)
		})
		
		fs.writeFileSync(dstDir+'posts.json', JSON.stringify(_.map(posts, function(post) {
			return { id:post.id, title:post.title, date:post.date }
		})))
		
		var onImagesCopied = _.after(posts.length, function() {
			callback(null, posts)
		})
		_.each(posts, function(post) {
			exec('cp -f src/essays/'+post.id+'/*.jpg '+dstDir+post.id, onImagesCopied)
		})
	})
}

function syntaxHighlight(html) {
	var lines = html.split('\n')
	var newLines = []
	var inCode = false
	var startCode = /<code>/g
	var endCode = /<\/code>/g

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
