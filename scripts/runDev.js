var watch = require('watch')
var exec = require('child_process').exec
var baseDir = __dirname+'/..'
var srcDir = __dirname+'/../src'

watch.watchTree(srcDir, { ignoreDotFiles:true }, function(f, curr, prev) {
	if (typeof f == "object" && prev === null && curr === null) {
		onChange('Setup')
	} else if (prev === null) {
		onChange('New file', f)
	} else if (curr.nlink === 0) {
		onChange('File removed', f)
	} else {
		onChange('File changed', f)
	}
})

function onChange(event, file) {
	console.log(event.cyan, file ? file : '')
	exec('make', { cwd:baseDir }, function(err, stdout, stderr) {
		if (err) { console.log("Error:".red, err) }
		if (stderr) { console.log("Stderr:".red, stderr) }
		// if (stdout) { console.log("Stdout:".cyan, stdout) }
		console.log(event.green, 'done'.green)
	})
}

;(function colorizeNode(){
	var colors = { red:31, green:32, blue:34, yellow:33, pink:35, cyan:36, black:30, white:37 }
	var colorResetNum = 39
	var styles = { underline:[4,24], inverse:[7,27] }
	for (var colorName in colors) {
		addPrototypeProperty(colorName, colors[colorName], colorResetNum)
	}
	for (var styleName in styles) {
		addPrototypeProperty(styleName, styles[styleName][0], styles[styleName][1])
	}
	function getCode(num) { return '\033['+num+'m' }
	function addPrototypeProperty(name, startNum, resetNum) {
		Object.defineProperty(String.prototype, name, {
			get: function() {
				return getCode(startNum) + this + getCode(resetNum)
			}
		})
	}
}())
