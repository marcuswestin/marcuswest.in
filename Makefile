.PHONY: deps
all: index posts

.PHONY: push
push: index
	git push origin master
	curl http://marcuswest.in/pull/index.php

.PHONY: index
index: posts
	node index_compile.js

lib/less:
	git clone https://github.com/cloudhead/less.js.git lib/less
	cd lib/less; git checkout a2807288008587b95c6c #(dist) build 1.0.36

.PHONY: posts
posts:
	node posts/compile.js

.PHONY: update-store.js
update-store.js:
	curl https://raw.github.com/marcuswestin/store.js/master/store.js > lib/store.js

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt

