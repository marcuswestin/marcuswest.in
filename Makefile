.PHONY: deps
all: lib/less.js lib/store.js index

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

lib/less.js:
	curl http://github.com/cloudhead/less.js/raw/master/dist/less-1.0.23.min.js > lib/less.js

lib/store.js:
	curl http://github.com/marcuswestin/store.js/raw/master/store.js > lib/store.js

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt
