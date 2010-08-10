.PHONY: deps
all: index

.PHONY: push
push: index
	git push origin master
	curl http://marcuswest.in/pull/index.php

.PHONY: index
index: posts
	node index_compile.js

.PHONY: posts
posts:
	node posts/compile.js

.PHONY: update-store.js
update-store.js:
	curl http://github.com/marcuswestin/store.js/raw/master/store.js > lib/store.js

.PHONY: update-syntaxHighligther.js
update-funSyntaxHighligther.js:
	curl http://github.com/marcuswestin/fun/raw/master/syntaxHighlighter.js > lib/funSyntaxHighligther.js

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt
