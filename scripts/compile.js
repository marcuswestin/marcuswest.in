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
	if (err) { throw err }
	compileIndex(posts, function(err) {
		if (err) { throw err }
		console.log("Done!")
	})
})

function compileIndex(posts, callback) {
	var template = fs.readFileSync('src/mainTemplate.html').toString()
	var partial = fs.readFileSync('src/landingTemplate.html').toString()
	var indexHtml = mustache.to_html(template.replace('#_REPLACE_MAIN_CONTENT_', partial), { posts:posts })
	
	fs.writeFileSync('index.html', indexHtml)

	stylus.render(fs.readFileSync('src/index.styl').toString(), function(err, css) {
		if (err) { return callback(err) }
		fs.writeFileSync('index.css', css)
	})
}

function compileRead(callback) {
	function p(o) { util.puts(JSON.stringify(o)) }
	function puts(o) { util.puts(o) }
	
	var markdownConverter = new Showdown.converter()
	var dstDir = './on/'
	
	exec('rm -rf '+dstDir, function(err) {
		if (err) { return callback(err) }
		fs.mkdirSync(dstDir, 0755)
		
		var postIds = _.filter(fs.readdirSync('src/on'), function(postId) {
			return fs.statSync('src/on/' + postId).isDirectory()
		})
		
		var postInfos = _.map(postIds, function(postId) {
			var postInfo = JSON.parse(fs.readFileSync('src/on/'+postId + '/info.json').toString())
			postInfo.id = postId
			return postInfo
		})
		postInfos.sort(function(a, b) {
			return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
		})
		
		var posts = _.map(postInfos, function(postInfo, i) {
			var postMarkdow = fs.readFileSync('src/on/'+postInfo.id + '/post.md').toString()
			return {
				body: markdownConverter.makeHtml(postMarkdow),
				id: postInfo.id,
				count: postInfos.length - i,
				title: postMarkdow.split("\n")[0],
				date: postInfo.date
			}
		})
		
		var templateHTML = fs.readFileSync('src/on/postTemplate.html').toString()
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
			exec('cp -f src/on/'+post.id+'/*.jpg '+dstDir+post.id, onImagesCopied)
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
