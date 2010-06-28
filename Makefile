.PHONY: deps
all: lib/less.js lib/store.js

lib/less.js:
	curl http://github.com/cloudhead/less.js/raw/master/dist/less-1.0.23.min.js > lib/less.js

lib/store.js:
	curl http://github.com/marcuswestin/store.js/raw/a3ef7eebc3d7177c69d7440c1c1035c33e12a4f7/store.js > lib/store.js

.PHONY: push
push:
	git push origin master
	curl http://marcuswest.in/pull/index.php

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt
